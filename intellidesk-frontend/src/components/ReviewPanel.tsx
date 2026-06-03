// ============================================================================
// SEARCH: REVIEW_PANEL_V2
// IntelliDesk AI - Mission Control Review Interface
// Dark Mode, 3-Column Grid for High-Speed Support
// ============================================================================

"use client";

import React, { useState } from "react";
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
	MoreHorizontal,
	Mail,
	Zap,
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

export function ReviewPanel({ ticket, onClose, onResolve }: ReviewPanelProps) {
	const [isProcessing, setIsProcessing] = useState(false);
	const [draft, setDraft] = useState(
		ticket.ai_draft_response || "Writing draft...",
	);

	// Mocking extended data that isn't in DB yet
	const mockCustomerData = {
		ltv: "?2.4 Cr",
		ticketCount: 23,
		tier: "Gold Tier",
		accountManager: "Priya Reddy",
	};

	const sentimentColor = {
		Positive: "text-green-400 border-green-400/30 bg-green-400/10",
		Neutral: "text-blue-400 border-blue-400/30 bg-blue-400/10",
		Negative: "text-red-400 border-red-400/30 bg-red-400/10",
		Frustrated: "text-red-500 border-red-500/30 bg-red-500/10",
		Urgent: "text-orange-500 border-orange-500/30 bg-orange-500/10",
	};

	const handleApprove = async () => {
		setIsProcessing(true);
		try {
			// Resolve email address (checking both fields due to potential schema mismatch)
			const emailAddress = ticket.sender_email || (ticket as any).customer_email || "";

			// Trigger n8n Webhook
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
				.update({ 
					status: "Resolved",
					ai_draft_response: draft 
				})
				.eq("ticket_id", ticket.ticket_id);

			if (error) throw error;
			if (onResolve) onResolve();
			onClose();
		} catch (err) {
			console.error("Error approving ticket:", err);
			// Revert optimistic update handling would go here in full prod
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
			{/* Main Workspace Container */}
			<div className="w-full h-full bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
				{/* Top Navbar */}
				<div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/50">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
							<Brain className="w-5 h-5 text-white" />
						</div>
						<span className="font-bold text-lg tracking-tight">
							Mission Control
						</span>
						<span className="px-2 py-0.5 rounded textxs bg-slate-800 text-slate-400 border border-slate-700">
							{ticket.ticket_id}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="icon"
							onClick={onClose}
							className="text-slate-400 hover:text-white hover:bg-slate-800"
						>
							<X className="w-5 h-5" />
						</Button>
					</div>
				</div>

				{/* 3-Column Grid Layout */}
				<div className="flex-1 grid grid-cols-12 min-h-0">
					{/* COLUMN 1: Ticket Context (Span 4) */}
					<div className="col-span-12 lg:col-span-4 border-r border-slate-800 flex flex-col bg-slate-925 relative">
						<div className="flex-1 overflow-y-auto p-6 space-y-6">
							{/* Badges Row */}
							<div className="flex flex-wrap gap-2">
								{ticket.priority === "P1" && (
									<>
										<span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5">
											<AlertTriangle className="w-3 h-3" />
											CRITICAL P1
										</span>
										<span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-950 text-red-500 border border-red-900 border-dashed animate-pulse">
											SLA BREACHED
										</span>
									</>
								)}
								{ticket.priority !== "P1" && (
									<span
										className={cn(
											"px-2.5 py-1 rounded-md text-xs font-medium border",
											ticket.priority === "P2"
												? "bg-orange-500/10 text-orange-400 border-orange-500/20"
												: "bg-blue-500/10 text-blue-400 border-blue-500/20",
										)}
									>
										{ticket.priority} Priority
									</span>
								)}
							</div>

							{/* Subject */}
							<h1 className="text-xl font-bold text-white leading-snug">
								{ticket.subject}
							</h1>

							{/* Sender Profile */}
							<div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
								<div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
									{ticket.sender_email
										? ticket.sender_email.substring(0, 2).toUpperCase()
										: "CN"}
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex justify-between items-start">
										<h3 className="text-sm font-semibold text-slate-200 truncate">
											{ticket.sender_email || "Unknown User"}
										</h3>
										<span className="text-[10px] text-slate-500">
											{formatDistanceToNow(new Date(ticket.created_at), {
												addSuffix: true,
											})}
										</span>
									</div>
									<p className="text-xs text-slate-400 truncate">
										{ticket.sender_email || "no-email@domain.com"}
									</p>
									<div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500 pt-2 border-t border-slate-800">
										<Mail className="w-3 h-3" />
										<span>via Email Source</span>
										<span className="w-1 h-1 rounded-full bg-slate-700" />
										<span>
											{ticket.sender_email
												? ticket.sender_email.split("@")[1]
												: "domain.com"}
										</span>
									</div>
								</div>
							</div>

							{/* Message Body */}
							<div className="space-y-2">
								<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
									Description
								</label>
								<div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
									{ticket.description}
								</div>
							</div>
						</div>

						{/* Interact Bar */}
						<div className="p-4 border-t border-slate-800 bg-slate-950">
							<Button
								variant="outline"
								className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
							>
								<History className="w-4 h-4 mr-2" /> View Conversation History
							</Button>
						</div>
					</div>

					{/* COLUMN 2: AI Workspace (Span 5) */}
					<div className="col-span-12 lg:col-span-5 border-r border-slate-800 flex flex-col bg-slate-950">
						{/* Workspace Header */}
						<div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/40">
							<div className="flex items-center gap-2">
								<Sparkles className="w-4 h-4 text-emerald-400" />
								<span className="text-sm font-bold text-slate-200">
									AI Response Generated
								</span>
								<span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
									94% Match
								</span>
							</div>
							<div className="flex gap-1">
								<Button
									size="icon"
									variant="ghost"
									className="h-8 w-8 text-slate-400 hover:text-white"
								>
									<ThumbsUp className="w-4 h-4" />
								</Button>
								<Button
									size="icon"
									variant="ghost"
									className="h-8 w-8 text-slate-400 hover:text-white"
								>
									<ThumbsDown className="w-4 h-4" />
								</Button>
							</div>
						</div>

						{/* Tags Row */}
						<div className="px-6 py-4 flex flex-wrap gap-2 border-b border-slate-800/50">
							{/* Category Badge */}
							<span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
								{ticket.category || "Support"}
							</span>

							{/* Status Badge */}
							<span className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
								{ticket.status}
							</span>

							{/* Tone/Sentiment Badge */}
							{ticket.tone && (
								<span
									className={cn(
										"px-2.5 py-1 rounded-md text-xs font-medium border flex items-center gap-1.5",
										sentimentColor[
											ticket.tone as keyof typeof sentimentColor
										] || sentimentColor.Neutral,
									)}
								>
									{ticket.tone === "Frustrated"
										? ""
										: ticket.tone === "Urgent"
											? ""
											: ""}
									{ticket.tone}
								</span>
							)}
						</div>

						{/* Draft Editor */}
						<div className="flex-1 overflow-y-auto p-6">
							<div className="space-y-2 h-full flex flex-col">
								<textarea
									value={draft}
									onChange={(e) => setDraft(e.target.value)}
									className="flex-1 w-full bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-sm text-slate-300 leading-relaxed focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none font-mono"
								/>
							</div>
						</div>

						{/* Action Footer */}
						<div className="p-4 border-t border-slate-800 bg-slate-925 flex justify-between items-center gap-4">
							<div className="space-y-1">
								<p className="text-[10px] text-slate-500">
									Suggested Resources
								</p>
								<div className="flex gap-2">
									<a
										href="#"
										className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
									>
										<ExternalLink className="w-3 h-3" /> Gateway Troubleshooting
									</a>
								</div>
							</div>
							<div className="flex gap-3">
								<Button
									variant="ghost"
									onClick={onClose}
									className="text-slate-400 hover:text-white"
								>
									Discard
								</Button>
								<Button
									onClick={handleApprove}
									disabled={isProcessing}
									className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 min-w-[140px]"
								>
									{isProcessing ? (
										<div className="flex items-center gap-2">
											<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
											<span>Sending...</span>
										</div>
									) : (
										<div className="flex items-center gap-2">
											<Send className="w-4 h-4" />
											<span>Approve & Send</span>
										</div>
									)}
								</Button>
							</div>
						</div>
					</div>

					{/* COLUMN 3: Customer 360 (Span 3) */}
					<div className="col-span-12 lg:col-span-3 bg-slate-950 flex flex-col">
						<div className="h-14 border-b border-slate-800 flex items-center px-6 bg-slate-950/50">
							<span className="font-semibold text-sm text-slate-200">
								Customer 360
							</span>
						</div>

						<div className="p-6 space-y-6 overflow-y-auto">
							{/* Entity Card */}
							<div className="text-center space-y-3 pb-6 border-b border-slate-800">
								<div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-yellow-600 to-yellow-400/20 border-2 border-yellow-500/30 flex items-center justify-center">
									<Building2 className="w-8 h-8 text-yellow-500" />
								</div>
								<div>
									<h2 className="text-lg font-bold text-white">
										{ticket.sender_email
											? ticket.sender_email.split("@")[1].split(".")[0].charAt(0).toUpperCase() + ticket.sender_email.split("@")[1].split(".")[0].slice(1) + " Corp"
											: "Acme Inc"}
									</h2>
									<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-bold border border-yellow-500/20 mt-1">
										<Sparkles className="w-3 h-3" /> {mockCustomerData.tier}
									</span>
								</div>
							</div>

							{/* Stats Grid */}
							<div className="grid grid-cols-2 gap-3">
								<div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
									<p className="text-[10px] text-slate-500 uppercase font-semibold">
										Lifetime Value
									</p>
									<p className="text-lg font-bold text-emerald-400 mt-1">
										{mockCustomerData.ltv}
									</p>
								</div>
								<div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
									<p className="text-[10px] text-slate-500 uppercase font-semibold">
										Tickets
									</p>
									<p className="text-lg font-bold text-slate-200 mt-1">
										{mockCustomerData.ticketCount}
									</p>
								</div>
							</div>

							{/* Account Manager */}
							<div className="pt-2">
								<label className="text-xs font-semibold text-slate-500 uppercase mb-3 block">
									Account Manager
								</label>
								<div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800/50">
									<div className="w-8 h-8 rounded-full bg-pink-600/20 text-pink-500 flex items-center justify-center border border-pink-600/20">
										<User className="w-4 h-4" />
									</div>
									<div>
										<p className="text-sm font-medium text-slate-300">
											{mockCustomerData.accountManager}
										</p>
										<p className="text-[10px] text-slate-500">
											Dedicated Support
										</p>
									</div>
								</div>
							</div>

							{/* Security/Insights */}
							<div className="pt-2">
								<label className="text-xs font-semibold text-slate-500 uppercase mb-3 block">
									Insights
								</label>
								<div className="space-y-2">
									<div className="flex items-center gap-2 text-xs text-slate-400">
										<Clock className="w-3 h-3" />
										<span>
											Avg Response:{" "}
											<span className="text-slate-200">2h 15m</span>
										</span>
									</div>
									<div className="flex items-center gap-2 text-xs text-slate-400">
										<Receipt className="w-3 h-3" />
										<span>
											Contract: <span className="text-green-400">Active</span>
										</span>
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
