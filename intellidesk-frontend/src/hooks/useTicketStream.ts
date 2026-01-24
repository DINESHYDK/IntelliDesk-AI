import { useState, useEffect, useCallback, useRef } from 'react';
import { Ticket, DashboardStats } from '@/types/ticket';
import { supabase } from '@/lib/supabase';

interface UseTicketStreamReturn {
  tickets: Ticket[];
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastUpdated: Date | null;
  isUsingMockData: boolean;
}

export function useTicketStream(): UseTicketStreamReturn {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    queue_depth: 0,
    critical_issues: 0,
    avg_confidence: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const isMounted = useRef<boolean>(true);

  const calculateStats = (currentTickets: Ticket[]): DashboardStats => {
    // Queue Depth: 'New' + 'Open'
    const activeTickets = currentTickets.filter(t => t.status === 'New' || t.status === 'Open');
    // Critical Issues: P1 tickets
    const criticals = currentTickets.filter(t => t.priority === 'P1' && t.status !== 'Resolved' && t.status !== 'Closed').length;
    // Avg Confidence
    const totalConfidence = currentTickets.reduce((acc, t) => acc + (t.confidence_score || 0), 0);
    // confidence_score is float 0.0-1.0 in DB, but UI might expect percentage?
    // prompt says "Avg Confidence (Average of confidence_score)".
    // TicketTable used "ticket.ai_analysis.confidence" which was 0-100.
    // DB has 0.0-1.0. I should convert to percentage for UI consistency if needed.
    // Let's assume 0.0-1.0 and multiply by 100 for display if needed.
    // The previous code had `confidence: 94`. So I'll convert to percentage here.
    const avgConfidence = currentTickets.length > 0 ? Math.round((totalConfidence / currentTickets.length) * 100) : 0;

    return {
      queue_depth: activeTickets.length,
      critical_issues: criticals,
      avg_confidence: avgConfidence, // stored as 0-100
    };
  };

  const fetchData = useCallback(async (): Promise<void> => {
    if (!isMounted.current) return;

    try {
      setError(null);
      
      // Fetch active tickets (exclude closed if strictly following "Incoming queue" rule, but prompt says "hide status='Closed' tickets from the main 'Incoming' queue but allow them to be searchable")
      // I'll fetch everything for now and filter in the UI or fetch everything except closed if the list is huge.
      // prompt: "backend automatically closes duplicates... frontend should hide status='Closed' tickets from the main 'Incoming' queue"
      // I'll fetch all to allow search, or just fetch non-closed. "allow them to be searchable" suggests I should have them.
      // I'll fetch all.
      const { data, error: supabaseError } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;

      if (isMounted.current && data) {
        // Map Supabase data to Ticket interface
        // Need to ensure types match. Supabase returns strings/numbers.
        const mappedTickets = data as Ticket[];
        setTickets(mappedTickets);
        setStats(calculateStats(mappedTickets));
        setLastUpdated(new Date());
      }
    } catch (err) {
      if (isMounted.current) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tickets';
        setError(errorMessage);
        console.error('[Ticketing] Fetch error:', err);
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchData();

    // Poll every 5 seconds
    const intervalId = setInterval(fetchData, 5000);

    return () => {
      isMounted.current = false;
      clearInterval(intervalId);
    };
  }, [fetchData]);

  // Compatibility return
  return { 
    tickets,
    stats,
    loading, 
    error, 
    refresh: fetchData, 
    lastUpdated,
    isUsingMockData: false
  };
}

export function usePollingStatus() {
  const [nextPollIn, setNextPollIn] = useState<number>(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setNextPollIn((prev) => {
        if (prev <= 1) return 5;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { nextPollIn };
}
