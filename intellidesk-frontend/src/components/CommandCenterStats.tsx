// ============================================================================
// SEARCH: COMMAND_CENTER_STATS
// IntelliDesk AI - Command Center Stats Row
// High-density AI Intelligence & Ticket Distribution Summary
// ============================================================================

"use client";

import React, { useMemo } from "react";
import {
	Activity,
	Sparkles,
	Clock,
	CheckCircle2,
	Loader2,
	PieChart,
} from "lucide-react";
import { FrontendTicket as Ticket, TicketPriority } from "@/types/ticket";
import { cn } from "@/lib/utils";

interface CommandCenterStatsProps {
	tickets: Ticket[];
	isLoading?: boolean;
}

// Mini progress bar component
function MiniProgress({
	value,
	max,
	color,
}: {
	value: number;
	max: number;
	color: string;
}) {
	const percentage = max > 0 ? (value / max) * 100 : 0;
	return (
		<div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
			<div
				className={cn("h-full rounded-full transition-all duration-500", color)}
				style={{ width: `${percentage}%` }}
			/>
		</div>
	);
}

// Animated pulse dot
function PulseDot({ color }: { color: string }) {
	return (
		<span className="relative flex h-2 w-2">
			<span
				className={cn(
					"animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
					color,
				)}
			></span>
			<span
				className={cn("relative inline-flex rounded-full h-2 w-2", color)}
			></span>
		</span>
	);
}

export function CommandCenterStats({
	tickets,
	isLoading = false,
}: CommandCenterStatsProps) {
	// Calculate all metrics
	const metrics = useMemo(() => {
		// Priority counts
		const priorityCounts: Record<TicketPriority, number> = {
			P1: 0,
			P2: 0,
			P3: 0,
			P4: 0,
		};
		// Category counts (Top 3)
		const categoryCounts: Record<string, number> = {};
		// Status counts
		const statusCounts = { pending: 0, resolved: 0 };
		// SLA metrics (Mock logic: P1 > 2 hours old = breached, P2 > 8 hours = breached)
		const slaMetrics = { nearBreach: 0, breached: 0 };
		// AI confidence
		let totalConfidence = 0;

		const now = new Date().getTime();

		tickets.forEach((ticket) => {
			// Priority
			if (priorityCounts[ticket.priority] !== undefined) {
				priorityCounts[ticket.priority]++;
			}

			// Category
			const cat = ticket.category || "Unclassified";
			categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

			// Status
			if (ticket.status === "Resolved" || ticket.status === "Closed") {
				statusCounts.resolved++;
			} else {
				statusCounts.pending++;
			}

			// SLA Logic (Simple heuristic based on created_at)
			const createdTime = new Date(ticket.created_at).getTime();
			const ageHours = (now - createdTime) / (1000 * 60 * 60);

			// Define limits
			const limits = { P1: 1, P2: 4, P3: 24, P4: 48 };
			const limit = limits[ticket.priority] || 24;

			if (ticket.status === "New" || ticket.status === "Open") {
				if (ageHours > limit) {
					slaMetrics.breached++;
				} else if (ageHours > limit * 0.8) {
					slaMetrics.nearBreach++;
				}
			}

			// AI Confidence
			totalConfidence += ticket.confidence_score || 0;
		});

		const avgConfidence =
			tickets.length > 0
				? Math.round((totalConfidence / tickets.length) * 100)
				: 0;
		const totalTickets = tickets.length;

		// Process categories for display
		const sortedCategories = Object.entries(categoryCounts)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 3);

		return {
			priorityCounts,
			sortedCategories,
			statusCounts,
			slaMetrics,
			avgConfidence,
			totalTickets,
		};
	}, [tickets]);

	// Loading skeleton
	if (isLoading) {
		return (
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
				{[1, 2, 3, 4, 5].map((i) => (
					<div
						key={i}
						className="h-36 rounded-xl bg-card border border-border animate-shimmer"
					/>
				))}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 animate-fade-in">
			{/* 1. Priority Pulse Card */}
			<div className="col-span-1 p-6 rounded-xl bg-card border border-border backdrop-blur-sm hover:border-ring transition-all">
				<div className="flex items-center gap-2 mb-4">
					<Activity className="w-4 h-4 text-primary" />
					<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						Priority Pulse
					</span>
				</div>
				<div className="grid grid-cols-4 gap-2">
					{/* P1 */}
					<div className="text-center">
						<div className="w-full aspect-square rounded-lg bg-[hsl(var(--destructive)/0.1)] border border-[hsl(var(--destructive)/0.2)] flex items-center justify-center mb-1.5">
							<span className="text-xl font-bold text-destructive">
								{metrics.priorityCounts.P1}
							</span>
						</div>
						<span className="text-[11px] font-semibold text-destructive">P1</span>
					</div>
					{/* P2 */}
					<div className="text-center">
						<div className="w-full aspect-square rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-1.5">
							<span className="text-xl font-bold text-orange-500">
								{metrics.priorityCounts.P2}
							</span>
						</div>
						<span className="text-[11px] font-semibold text-orange-500">P2</span>
					</div>
					{/* P3 */}
					<div className="text-center">
						<div className="w-full aspect-square rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-1.5">
							<span className="text-xl font-bold text-blue-500">
								{metrics.priorityCounts.P3}
							</span>
						</div>
						<span className="text-[11px] font-semibold text-blue-500">P3</span>
					</div>
					{/* P4 */}
					<div className="text-center">
						<div className="w-full aspect-square rounded-lg bg-slate-500/10 border border-slate-500/20 flex items-center justify-center mb-1.5">
							<span className="text-xl font-bold text-slate-500">
								{metrics.priorityCounts.P4}
							</span>
						</div>
						<span className="text-[11px] font-semibold text-slate-500">P4</span>
					</div>
				</div>
			</div>

			{/* 2. Category Mix Card */}
			<div className="col-span-1 p-6 rounded-xl bg-card border border-border backdrop-blur-sm hover:border-ring transition-all">
				<div className="flex items-center gap-2 mb-4">
					<PieChart className="w-4 h-4 text-primary" />
					<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						Top Categories
					</span>
				</div>
				<div className="space-y-3">
					{metrics.sortedCategories.map(([cat, count], idx) => (
						<div key={cat} className="flex items-center gap-2">
							<span className="w-20 text-xs font-medium truncate" title={cat}>
								{cat}
							</span>
							<div className="flex-1">
								<MiniProgress
									value={count}
									max={metrics.totalTickets}
									color={
										idx === 0
											? "bg-primary"
											: idx === 1
												? "bg-primary/70"
												: "bg-primary/40"
									}
								/>
							</div>
							<span className="w-6 text-xs font-bold text-right">{count}</span>
						</div>
					))}
					{metrics.sortedCategories.length === 0 && (
						<div className="text-xs text-muted-foreground text-center py-5">
							No data available
						</div>
					)}
				</div>
			</div>

			{/* 3. Resolution Progress Card */}
			<div className="col-span-1 p-6 rounded-xl bg-card border border-border backdrop-blur-sm hover:border-ring transition-all">
				<div className="flex items-center gap-2 mb-4">
					<CheckCircle2 className="w-4 h-4 text-green-500" />
					<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						Resolution
					</span>
				</div>
				<div className="flex items-center justify-between mb-3">
					{/* Pending */}
					<div className="text-center flex-1">
						<div className="text-warning mb-1.5">
							<span className="text-3xl font-bold">
								{metrics.statusCounts.pending}
							</span>
						</div>
						<span className="text-xs text-muted-foreground uppercase tracking-wide">
							Pending
						</span>
					</div>
					{/* Divider */}
					<div className="h-12 w-px bg-border" />
					{/* Resolved */}
					<div className="text-center flex-1">
						<div className="text-success mb-1.5">
							<span className="text-3xl font-bold">
								{metrics.statusCounts.resolved}
							</span>
						</div>
						<span className="text-xs text-muted-foreground uppercase tracking-wide">
							Resolved
						</span>
					</div>
				</div>
			</div>

			{/* 4. AI Accuracy Card */}
			<div className="col-span-1 p-6 rounded-xl bg-card border border-border backdrop-blur-sm hover:border-ring transition-all">
				<div className="flex items-center gap-2 mb-4">
					<Sparkles className="w-4 h-4 text-accent" />
					<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						AI Accuracy
					</span>
				</div>
				<div className="flex items-center gap-4">
					{/* Circular progress */}
					<div className="relative">
						<svg className="w-16 h-16 -rotate-90">
							<circle
								cx="32"
								cy="32"
								r="26"
								stroke="currentColor"
								strokeWidth="4"
								fill="none"
								className="text-muted"
							/>
							<circle
								cx="32"
								cy="32"
								r="26"
								stroke="currentColor"
								strokeWidth="4"
								fill="none"
								strokeDasharray={`${metrics.avgConfidence * 1.63} 163`}
								className={cn(
									"transition-all duration-1000",
									metrics.avgConfidence >= 80
										? "text-purple-500"
										: "text-purple-300",
								)}
							/>
						</svg>
						<span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
							{metrics.avgConfidence}%
						</span>
					</div>
					<div>
						<p
							className={cn(
								"text-sm font-semibold",
								metrics.avgConfidence >= 80
									? "text-purple-500"
									: "text-purple-300",
							)}
						>
							{metrics.avgConfidence >= 90
								? "Excellent"
								: metrics.avgConfidence >= 80
									? "Good"
									: "Needs Review"}
						</p>
						<p className="text-xs text-muted-foreground mt-0.5">Avg. Confidence</p>
					</div>
				</div>
			</div>

			{/* 5. SLA Alert Zone Card */}
			<div
				className={cn(
					"col-span-2 md:col-span-1 p-6 rounded-xl backdrop-blur-sm transition-all",
					metrics.slaMetrics.breached > 0
						? "bg-destructive/10 border border-destructive/40 hover:border-destructive"
						: "bg-card border border-border hover:border-ring",
				)}
			>
				<div className="flex items-center gap-2 mb-4">
					<Clock className="w-4 h-4 text-destructive" />
					<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						SLA Alert Zone
					</span>
					{metrics.slaMetrics.breached > 0 && (
						<PulseDot color="bg-destructive" />
					)}
				</div>
				<div className="grid grid-cols-2 gap-3">
					<div className="text-center">
						<span className="text-3xl font-bold text-destructive">
							{metrics.slaMetrics.breached}
						</span>
						<p className="text-xs font-medium text-destructive mt-1">Breached</p>
					</div>
					<div className="text-center">
						<span className="text-3xl font-bold text-orange-500">
							{metrics.slaMetrics.nearBreach}
						</span>
						<p className="text-xs font-medium text-orange-500 mt-1">At Risk</p>
					</div>
				</div>
			</div>
		</div>
	);
}
