// ============================================================================
// SEARCH: DATA_HOOK
// IntelliDesk AI - Custom Hook for Data Fetching
// Polls n8n webhook every 30 seconds with fallback to mock data
// ============================================================================

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GlobalState } from '@/types';
import { MOCK_DASHBOARD_DATA, API_CONFIG } from '@/lib/dummy-data';

/**
 * Hook return type with loading, error, and refresh capabilities
 */
interface UseTicketStreamReturn {
  data: GlobalState | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastUpdated: Date | null;
  isUsingMockData: boolean;
}

/**
 * SEARCH: USE_TICKET_STREAM
 * Custom React Hook for fetching dashboard data
 * 
 * Features:
 * - Polls n8n endpoint every 30 seconds
 * - Falls back to mock data if API unavailable
 * - Provides manual refresh capability
 * - Tracks last update time
 * 
 * @returns {UseTicketStreamReturn} Data, loading state, error, and utilities
 */
export function useTicketStream(): UseTicketStreamReturn {
  // State for data, loading, and error
  const [data, setData] = useState<GlobalState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState<boolean>(false);

  // Ref to track if component is mounted (cleanup)
  const isMounted = useRef<boolean>(true);
  
  // Ref for interval ID
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * SEARCH: FETCH_DATA
   * Fetches data from n8n webhook or falls back to mock data
   */
  const fetchData = useCallback(async (): Promise<void> => {
    // Don't update state if component unmounted
    if (!isMounted.current) return;

    try {
      setLoading(true);
      setError(null);

      // SEARCH: API_FETCH
      // Attempt to fetch from real API endpoint
      const response = await fetch(API_CONFIG.ENDPOINT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add cache control for fresh data
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const apiData: GlobalState = await response.json();

      if (isMounted.current) {
        setData(apiData);
        setIsUsingMockData(false);
        setLastUpdated(new Date());
        setError(null);
      }
    } catch (err) {
      // SEARCH: FALLBACK_LOGIC
      // If API fails and fallback is enabled, use mock data
      if (API_CONFIG.USE_MOCK_FALLBACK && isMounted.current) {
        console.warn('[IntelliDesk] API unavailable, using mock data:', err);
        setData(MOCK_DASHBOARD_DATA);
        setIsUsingMockData(true);
        setLastUpdated(new Date());
        setError(null); // Clear error since we have fallback data
      } else if (isMounted.current) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
        setError(errorMessage);
        console.error('[IntelliDesk] Data fetch error:', err);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  /**
   * SEARCH: MANUAL_REFRESH
   * Allows manual refresh of data
   */
  const refresh = useCallback(async (): Promise<void> => {
    await fetchData();
  }, [fetchData]);

  /**
   * SEARCH: POLLING_EFFECT
   * Sets up polling interval on mount
   */
  useEffect(() => {
    isMounted.current = true;

    // Initial fetch
    fetchData();

    // Set up polling interval
    intervalRef.current = setInterval(() => {
      fetchData();
    }, API_CONFIG.POLL_INTERVAL);

    // Cleanup on unmount
    return () => {
      isMounted.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
    lastUpdated,
    isUsingMockData,
  };
}

/**
 * SEARCH: USE_POLLING_STATUS
 * Simple hook to track polling status for UI feedback
 */
export function usePollingStatus() {
  const [nextPollIn, setNextPollIn] = useState<number>(API_CONFIG.POLL_INTERVAL / 1000);

  useEffect(() => {
    const interval = setInterval(() => {
      setNextPollIn((prev) => {
        if (prev <= 1) return API_CONFIG.POLL_INTERVAL / 1000;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { nextPollIn };
}
