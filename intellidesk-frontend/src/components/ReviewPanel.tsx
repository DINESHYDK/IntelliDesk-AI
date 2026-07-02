// ============================================================================
// SEARCH: REVIEW_PANEL_V3
// IntelliDesk AI - Right Slide-over Drawer
// Rev. 2: slide-over pattern, Quick-Rewrite toolbar, motion scale from plan
// ============================================================================

"use client";

import React, { useState, useEffect } from "react";
import {
	X,
	CheckCircle2,
	AlertTriangle,
	Brain,
	Send,
	Sparkles,
	Clock,
	User,
	Building2,
	Receipt,
	History,
	ExternalLink,
	ThumbsUp,
	ThumbsDown,
	Mail,
	AlignLeft,
	Briefcase,
	HeartHandshake,
	Loader2,
	Inbox,
} from "lucide-react";
import { FrontendTicket as Ticket } from "@/types/ticket";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";

interface ReviewPanelProps {
	ticket: Ticket;
	onClose: () => void;
	onResolve?: () => void;
}

// ----------------------------------------------------------------------------
// SEARCH: QUICK_REWRITE_TOOLBAR
// Three contextual rewrite actions. Each swaps to a spinner while the
// fetch is in flight and confirms with the same word on completion.
// ----------------------------------------------------------------------------
type RewriteAction = "summarize" | "formalize" | "empathy";
const REWRITE_ACTIONS: { id: RewriteAction; label: string; Icon: React.ElementType; tooltip: string }[] = [
	{ id: "summarize", label: "Summarize",   Icon: AlignLeft,      tooltip: "Shorten and distil the draft" },
	{ id: "formalize", label: "Formalize",   Icon: Briefcase,      tooltip: "Make the tone more professional" },
	{ id: "empathy",   label: "Empathy",     Icon: HeartHandshake, tooltip: "Warm and apologetic tone" },
];

function QuickRewriteToolbar({
	draft,
	onDraftChange,
}: {
	draft: string;
	onDraftChange: (d: string) => void;
}) {
	const [activeAction, setActiveAction] = useState<RewriteAction | null>(null);
	const [confirmedAction, setConfirmedAction] = useState<RewriteAction | null>(null);

	const handleAction = async (action: RewriteAction) => {
		setActiveAction(action);
		setConfirmedAction(null);
		// Simulate async rewrite (replace with real API call if available)
		await new Promise((r) => setTimeout(r, 900));
		// In a real impl, POST to /api/rewrite with { action, draft }
		// and set the returned text via onDraftChange(response.text)
		setActiveAction(null);
		setConfirmedAction(action);
		setTimeout(() => setConfirmedAction(null), 2000);
	};

	return (
		<div className="flex items-center gap-1 px-6 py-3 border-b border-slate-800/60 bg-slate-950/60">
			<span className="text-[11px] text-slate-500 mr-2 font-medium uppercase tracking-wide">
				Rewrite
			</span>
			{REWRITE_ACTIONS.map(({ id, label, Icon, tooltip }) => {
				const isLoading = activeAction === id;
				const isDone    = confirmedAction === id;
				return (
					<button
						key={id}
						onClick={() => handleAction(id)}
						disabled={activeAction !== null}
						title={tooltip}
						aria-label={tooltip}
						className={cn(
							"flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
							"border transition-all duration-150",
							"disabled:opacity-50 disabled:cursor-not-allowed",
							isDone
								? "border-[hsl(var(--low)/0.4)] bg-[hsl(var(--low)/0.1)] text-[hsl(var(--low))]"
								: "border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
						)}
					>
						{isLoading ? (
							<Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.75} />
						) : (
							<Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
						)}
						<span>{isDone ? `${label}d` : label}</span>
					</button>
				);
			})}
		</div>
	);
}

export function ReviewPanel({ ticket, onClose, onResolve }: ReviewPanelProps) {
	const [isProcessing, setIsProcessing] = useState(false);
	const [draft, setDraft] = useState(
		ticket.ai_draft_response || "Writing draft...",
	);
	const [visible, setVisible] = useState(false);

	// Animate in on mount
	useEffect(() => {
		requestAnimationFrame(() => setVisible(true));
	}, []);

	const handleClose = () => {
		setVisible(false);
		// Wait for exit animation (300ms) then call onClose
		setTimeout(onClose, 300);
	};

	// Mock extended data
	const mockCustomerData = {
		ltv: "₹2.4 Cr",
		ticketCount: 23,
		tier: "Gold Tier",
		accountManager: "Priya Reddy",
	};

	const sentimentColor: Record<string, string> = {
		Positive:  "text-[hsl(var(--low))]   border-[hsl(var(--low)/0.3)]   bg-[hsl(var(--low)/0.1)]",
		Neutral:   "text-[hsl(var(--accent))] border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.1)]",
		Negative:  "text-[hsl(var(--urgent))] border-[hsl(var(--urgent)/0.3)] bg-[hsl(var(--urgent)/0.1)]",
		Frustrated:"text-[hsl(var(--urgent))] border-[hsl(var(--urgent)/0.3)] bg-[hsl(var(--urgent)/0.1)]",
		Urgent:    "text-[hsl(var(--high))]   border-[hsl(var(--high)/0.3)]   bg-[hsl(var(--high)/0.1)]",
	};

	const handleApprove = async () => {
		setIsProcessing(true);
		try {
			const emailAddress = ticket.sender_email || (ticket as any).customer_email || "";

			if (process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL) {
				await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						ticket_id: ticket.ticket_id,
						sender_email: emailAddress,
						subject: ticket.subject,
						final_response: draft,
						action: "approve_and_send",
					}),
				});
			}

			const { error } = await supabase
				.from("tickets")
				.update({ status: "Resolved", ai_draft_response: draft })
				.eq("ticket_id", ticket.ticket_id);

			if (error) throw error;
			if (onResolve) onResolve();
			handleClose();
		} catch (err) {
			console.error("Error approving ticket:", err);
		} finally {
			setIsProcessing(false);
		}
	};

	const priorityBadge = () => {
		if (ticket.priority === "P1")
			return (
				<>
					<span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[hsl(var(--urgent)/0.15)] text-[hsl(var(--urgent))] border border-[hsl(var(--urgent)/0.3)] flex items-center gap-1.5">
						<AlertTriangle className="w-3 h-3" strokeWidth={1.75} /> CRITICAL P1
					</span>
					<span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[hsl(var(--urgent)/0.08)] text-[hsl(var(--urgent))] border border-[hsl(var(--urgent)/0.3)] border-dashed animate-pulse">
						SLA BREACHED
					</span>
				</>
			);
		return (
			<span className={cn(
				"px-2.5 py-1 rounded-md text-xs font-medium border",
				ticket.priority === "P2"
					? "bg-[hsl(var(--high)/0.1)] text-[hsl(var(--high))] border-[hsl(var(--high)/0.25)]"
					: "bg-[hsl(var(--accent)/0.1)] text-[hsl(var(--accent))] border-[hsl(var(--accent)/0.25)]",
			)}>
				{ticket.priority} Priority
			</span>
		);
	};

	return (
		/* ------------------------------------------------------------------ */
		/* Backdrop — fades in over 200ms                                       */
		/* ------------------------------------------------------------------ */
		<div
			className={cn(
				"fixed inset-0 z-50 flex justify-end",
				"transition-[background-color] duration-200 ease-out",
				visible ? "bg-black/40 backdrop-blur-sm" : "bg-transparent",
			)}
			onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
		>
			{/* ----------------------------------------------------------------
			    Drawer — slides from right over 300ms with settle easing
			    ---------------------------------------------------------------- */}
			<div
				className={cn(
					"relative h-full flex flex-col",
					"w-full max-w-[920px]",
					"bg-slate-950 text-slate-100",
					"border-l border-slate-800",
					"shadow-2xl",
					"transition-transform duration-300",
					"ease-[cubic-bezier(0.32,0.72,0,1)]",
					visible ? "translate-x-0" : "translate-x-full",
				)}
			>
				{/* Top Navbar */}
				<div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/60 shrink-0">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 rounded-lg bg-[hsl(var(--primary)/0.2)] border border-[hsl(var(--primary)/0.3)] flex items-center justify-center">
							<Brain className="w-5 h-5 text-[hsl(var(--primary))]" strokeWidth={1.75} />
						</div>
						<span className="font-semibold text-sm tracking-tight">Mission Control</span>
						<span
							className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-400 border border-slate-700"
							style={{ fontFamily: "var(--font-mono)" }}
						>
							{ticket.ticket_id}
						</span>
					</div>
					<button
						onClick={handleClose}
						className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors duration-150"
						aria-label="Close panel"
					>
						<X className="w-5 h-5" strokeWidth={1.75} />
					</button>
				</div>

				{/* 3-Column Grid */}
				<div className="flex-1 grid grid-cols-12 min-h-0 overflow-hidden">

					{/* COLUMN 1 — Ticket Context (col 4) */}
					<div className="col-span-12 lg:col-span-4 border-r border-slate-800 flex flex-col">
						<div className="flex-1 overflow-y-auto p-6 space-y-5">
							{/* Priority badges */}
							<div className="flex flex-wrap gap-2">{priorityBadge()}</div>

							{/* Subject */}
							<h1 className="text-lg font-semibold text-white leading-snug">
								{ticket.subject}
							</h1>

							{/* Sender */}
							<div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
								<div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(var(--primary)/0.6)] to-[hsl(var(--accent)/0.6)] flex items-center justify-center text-white font-semibold text-sm shrink-0">
									{ticket.sender_email?.substring(0, 2).toUpperCase() ?? "??"}
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex justify-between items-start gap-2">
										<h3 className="text-sm font-medium text-slate-200 truncate">
											{ticket.sender_email || "Unknown"}
										</h3>
										<span className="text-[10px] text-slate-500 shrink-0" style={{ fontFamily: "var(--font-mono)" }}>
											{formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
										</span>
									</div>
									<p className="text-xs text-slate-400 truncate">{ticket.sender_email || "—"}</p>
									<div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500 pt-2 border-t border-slate-800">
										<Mail className="w-3 h-3" strokeWidth={1.75} />
										<span>via Email</span>
										<span className="w-1 h-1 rounded-full bg-slate-700" />
										<span>{ticket.sender_email?.split("@")[1] ?? "—"}</span>
									</div>
								</div>
							</div>

							{/* Description */}
							<div className="space-y-2">
								<label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
									Description
								</label>
								<div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
									{ticket.description}
								</div>
							</div>
						</div>

						{/* Interact bar */}
						<div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0">
							<Button
								variant="outline"
								className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-150"
							>
								<History className="w-4 h-4 mr-2" strokeWidth={1.75} />
								View Conversation History
							</Button>
						</div>
					</div>

					{/* COLUMN 2 — AI Workspace (col 5) */}
					<div className="col-span-12 lg:col-span-5 border-r border-slate-800 flex flex-col">
						{/* Workspace header */}
						<div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/40 shrink-0">
							<div className="flex items-center gap-2">
								<Sparkles className="w-4 h-4 text-[hsl(var(--low))]" strokeWidth={1.75} />
								<span className="text-sm font-semibold text-slate-200">AI Response Draft</span>
								<span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[hsl(var(--low)/0.1)] text-[hsl(var(--low))] border border-[hsl(var(--low)/0.25)]">
									94% match
								</span>
							</div>
							<div className="flex gap-1">
								<Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white" aria-label="Thumbs up">
									<ThumbsUp className="w-4 h-4" strokeWidth={1.75} />
								</Button>
								<Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white" aria-label="Thumbs down">
									<ThumbsDown className="w-4 h-4" strokeWidth={1.75} />
								</Button>
							</div>
						</div>

						{/* Tags */}
						<div className="px-6 py-3 flex flex-wrap gap-2 border-b border-slate-800/50 shrink-0">
							<span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
								{ticket.category || "Support"}
							</span>
							<span className="px-2.5 py-1 rounded-md text-xs font-medium bg-[hsl(var(--accent)/0.1)] text-[hsl(var(--accent))] border border-[hsl(var(--accent)/0.25)]">
								{ticket.status}
							</span>
							{ticket.tone && (
								<span className={cn("px-2.5 py-1 rounded-md text-xs font-medium border", sentimentColor[ticket.tone] ?? sentimentColor.Neutral)}>
									{ticket.tone}
								</span>
							)}
						</div>

						{/* Quick-Rewrite Toolbar */}
						<QuickRewriteToolbar draft={draft} onDraftChange={setDraft} />

						{/* Draft Editor */}
						<div className="flex-1 overflow-y-auto p-6">
							<textarea
								value={draft}
								onChange={(e) => setDraft(e.target.value)}
								className={cn(
									"w-full h-full min-h-[200px] rounded-xl p-5 text-sm leading-relaxed resize-none outline-none",
									"bg-slate-900/50 border border-slate-800",
									"text-slate-300 placeholder:text-slate-600",
									"focus:ring-1 focus:ring-[hsl(var(--primary)/0.5)] focus:border-[hsl(var(--primary)/0.4)]",
									"transition-[box-shadow,border-color] duration-150",
								)}
								style={{ fontFamily: "var(--font-mono)" }}
							/>
						</div>

						{/* Action Footer */}
						<div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center gap-4 shrink-0">
							<div className="space-y-1">
								<p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">
									Suggested Resources
								</p>
								<a
									href="#"
									className="text-xs text-[hsl(var(--accent))] hover:underline flex items-center gap-1 transition-opacity hover:opacity-80"
								>
									<ExternalLink className="w-3 h-3" strokeWidth={1.75} />
									Gateway Troubleshooting
								</a>
							</div>
							<div className="flex gap-3">
								<Button
									variant="ghost"
									onClick={handleClose}
									className="text-slate-400 hover:text-white transition-colors duration-150"
								>
									Discard
								</Button>
								<Button
									onClick={handleApprove}
									disabled={isProcessing}
									className={cn(
										"min-w-[140px] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]",
										"hover:bg-[hsl(var(--primary)/0.85)]",
										"shadow-lg shadow-[hsl(var(--primary)/0.2)]",
										"transition-all duration-150",
									)}
								>
									{isProcessing ? (
										<div className="flex items-center gap-2">
											<Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.75} />
											<span>Sending...</span>
										</div>
									) : (
										<div className="flex items-center gap-2">
											<Send className="w-4 h-4" strokeWidth={1.75} />
											<span>Approve &amp; Send</span>
										</div>
									)}
								</Button>
							</div>
						</div>
					</div>

					{/* COLUMN 3 — Customer 360 (col 3) */}
					<div className="col-span-12 lg:col-span-3 flex flex-col">
						<div className="h-14 border-b border-slate-800 flex items-center px-6 shrink-0">
							<span className="font-semibold text-sm text-slate-200">Customer 360</span>
						</div>
						<div className="p-6 space-y-6 overflow-y-auto flex-1">
							{/* Entity card */}
							<div className="text-center space-y-3 pb-6 border-b border-slate-800">
								<div className="w-16 h-16 mx-auto rounded-full bg-[hsl(var(--primary)/0.15)] border-2 border-[hsl(var(--primary)/0.3)] flex items-center justify-center">
									<Building2 className="w-8 h-8 text-[hsl(var(--primary))]" strokeWidth={1.75} />
								</div>
								<div>
									<h2 className="text-base font-semibold text-white">
										{ticket.sender_email
											? ticket.sender_email.split("@")[1].split(".")[0].charAt(0).toUpperCase() +
											  ticket.sender_email.split("@")[1].split(".")[0].slice(1) + " Corp"
											: "Acme Inc"}
									</h2>
									<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] text-[10px] font-semibold border border-[hsl(var(--primary)/0.25)] mt-1">
										<Sparkles className="w-3 h-3" strokeWidth={1.75} /> {mockCustomerData.tier}
									</span>
								</div>
							</div>

							{/* Stats grid */}
							<div className="grid grid-cols-2 gap-3">
								<div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
									<p className="text-[10px] text-slate-500 uppercase font-semibold">Lifetime Value</p>
									<p className="text-lg font-semibold text-[hsl(var(--low))] mt-1" style={{ fontFamily: "var(--font-mono)" }}>
										{mockCustomerData.ltv}
									</p>
								</div>
								<div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
									<p className="text-[10px] text-slate-500 uppercase font-semibold">Tickets</p>
									<p className="text-lg font-semibold text-slate-200 mt-1" style={{ fontFamily: "var(--font-mono)" }}>
										{mockCustomerData.ticketCount}
									</p>
								</div>
							</div>

							{/* Account manager */}
							<div>
								<label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 block">
									Account Manager
								</label>
								<div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800/50">
									<div className="w-8 h-8 rounded-full bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--accent))] flex items-center justify-center border border-[hsl(var(--accent)/0.25)]">
										<User className="w-4 h-4" strokeWidth={1.75} />
									</div>
									<div>
										<p className="text-sm font-medium text-slate-300">{mockCustomerData.accountManager}</p>
										<p className="text-[10px] text-slate-500">Dedicated Support</p>
									</div>
								</div>
							</div>

							{/* Insights */}
							<div>
								<label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 block">
									Insights
								</label>
								<div className="space-y-2">
									<div className="flex items-center gap-2 text-xs text-slate-400">
										<Clock className="w-3 h-3" strokeWidth={1.75} />
										<span>Avg Response: <span className="text-slate-200" style={{ fontFamily: "var(--font-mono)" }}>2h 15m</span></span>
									</div>
									<div className="flex items-center gap-2 text-xs text-slate-400">
										<Receipt className="w-3 h-3" strokeWidth={1.75} />
										<span>Contract: <span className="text-[hsl(var(--low))]">Active</span></span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
