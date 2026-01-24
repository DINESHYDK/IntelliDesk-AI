// ============================================================================
// SEARCH: REVIEW_PANEL
// IntelliDesk AI - Review Panel
// Split-screen view for reviewing tickets with AI insights
// ============================================================================

'use client';

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle,
  AlertCircle,
  Brain,
  Send,
  Sparkles,
  RefreshCcw
} from 'lucide-react';
import { Ticket } from '@/types/ticket';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface ReviewPanelProps {
  ticket: Ticket;
  onClose: () => void;
  onResolve?: () => void; // Callback to refresh list
}

export function ReviewPanel({ ticket, onClose, onResolve }: ReviewPanelProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [draft, setDraft] = useState(ticket.ai_draft_response || '');

  // Optimistic UI approach: Update immediately
  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      // 1. Update Supabase
      const { error } = await supabase
        .from('tickets')
        .update({ status: 'Resolved' })
        .eq('ticket_id', ticket.ticket_id);

      if (error) throw error;

      // 2. Trigger webhook (optional/fire-and-forget or await)
      if (process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL) {
        fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
             ticket_id: ticket.ticket_id,
             action: 'approve_response',
             response_body: draft,
             original_sender: ticket.sender_email
          }),
        }).catch(err => console.error('Webhook trigger failed', err));
      }

      onClose();
      if (onResolve) onResolve();

    } catch (err) {
      console.error('Failed to resolve ticket:', err);
      // Ideally show toast error
    } finally {
      setIsProcessing(false);
    }
  };

  const getToneColor = (tone: string) => {
    const t = tone.toLowerCase();
    if (t.includes('angry') || t.includes('urgent')) return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (t.includes('happy')) return 'text-green-500 bg-green-500/10 border-green-500/20';
    return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
  };

  const getConfidenceColor = (score: number) => {
    // Score is 0.0 - 1.0 (some mocks might use 0-100, schema says 0.0-1.0)
    // If score > 1, assume percentage
    const normalized = score > 1 ? score / 100 : score;
    if (normalized > 0.9) return 'text-green-500';
    if (normalized > 0.75) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-6xl h-[85vh] bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className={cn('px-2.5 py-1 rounded text-xs font-bold border', 
              ticket.priority === 'P1' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
              ticket.priority === 'P2' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
              'bg-blue-500/10 text-blue-500 border-blue-500/20'
            )}>
              {ticket.priority}
            </div>
            <h2 className="text-lg font-semibold text-foreground truncate max-w-md">
              {ticket.subject}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content - Split Screen */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Left Pane: Context */}
          <div className="flex-1 border-b lg:border-b-0 lg:border-r border-border flex flex-col bg-background/50">
            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-6">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Sender Details</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {ticket.sender_email[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{ticket.sender_email}</div>
                    <div className="text-xs text-muted-foreground">{new Date(ticket.created_at).toLocaleString()}</div>
                    {ticket.customer_domain && (
                      <div className="text-xs text-primary mt-0.5">{ticket.customer_domain}</div>
                    )}
                  </div>
                  <div className="ml-auto">
                    <span className={cn('px-2 py-1 rounded text-xs font-medium', 
                      ticket.status === 'Resolved' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                    )}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Message Body</h3>
                <div className="p-4 rounded-lg bg-muted/50 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                  {ticket.description}
                </div>
              </div>
            </div>
          </div>

          {/* Right Pane: AI Brain */}
          <div className="flex-1 flex flex-col bg-[hsl(var(--card))]">
            {/* Diagnosis Box */}
            <div className="p-6 border-b border-border bg-[hsl(var(--primary)/0.03)]">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                  <Brain className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground mb-1">AI Diagnosis</h3>
                  <div className="flex items-center gap-3 text-sm">
                    <span className={cn('px-2 py-0.5 rounded border text-xs font-medium', getToneColor(ticket.tone))}>
                      {ticket.tone}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className={cn('font-bold', getConfidenceColor(ticket.confidence_score))}>
                      {Math.round(ticket.confidence_score > 1 ? ticket.confidence_score : ticket.confidence_score * 100)}% Confidence
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-background border border-border p-3 rounded-lg relative">
                <Sparkles className="w-3 h-3 text-indigo-500 absolute top-3 left-3" />
                <p className="pl-6 text-sm text-muted-foreground italic">
                  "{ticket.reasoning}"
                </p>
              </div>
            </div>

            {/* Draft Editor */}
            <div className="flex-1 flex flex-col p-6 min-h-0">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Draft Response</span>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full">AI Generated</span>
              </h3>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="flex-1 w-full bg-background border border-input rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-ring text-sm leading-relaxed"
                placeholder="Write your response here..."
              />
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-border bg-muted/20 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Review carefully before approving.
              </span>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleApprove} 
                  disabled={isProcessing || ticket.status === 'Resolved'}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCcw className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Approve & Send
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
