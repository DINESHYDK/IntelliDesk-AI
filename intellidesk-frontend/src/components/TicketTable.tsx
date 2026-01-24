// ============================================================================
// IntelliDesk AI - Ticket Table Component
// Deep Dark Mode Design with Pagination
// ============================================================================

"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
	AlertTriangle,
	Clock,
	Eye,
	Search,
	Filter,
	ArrowUpDown,
	Sparkles,
	ChevronUp,
	ChevronDown,
	Mail,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { Ticket, TicketPriority } from "@/types/ticket";
import { cn } from "@/lib/utils";
import { ReviewPanel } from "./ReviewPanel";
import { usePagination } from "@/components/hooks/use-pagination";
import { Button } from "@/components/ui/button";

interface TicketTableProps {
	tickets: Ticket[];
	isLoading?: boolean;
}

type SortField = "priority" | "created_at" | "status";
type SortDirection = "asc" | "desc";

export function TicketTable({ tickets, isLoading = false }: TicketTableProps) {
	const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
	const [sortField, setSortField] = useState<SortField>("created_at");
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
	const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "all">(
		"all",
	);
	const [searchQuery, setSearchQuery] = useState("");

	// Pagination State
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 8; // Increased density

	// Reset pagination when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [priorityFilter, searchQuery, sortField, sortDirection]);

	// Sort and filter tickets
	const processedTickets = useMemo(() => {
		let result = [...tickets];

		if (priorityFilter !== "all") {
			result = result.filter((t) => t.priority === priorityFilter);
		}

		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(t) =>
					t.subject.toLowerCase().includes(query) ||
					t.sender_email.toLowerCase().includes(query) ||
					(t.category && t.category.toLowerCase().includes(query)),
			);
		}

		result.sort((a, b) => {
			let comparison = 0;
			switch (sortField) {
				case "priority":
					const priorityOrder = { P1: 1, P2: 2, P3: 3, P4: 4 };
					comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
					break;
				case "created_at":
					comparison =
						new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
					break;
				case "status":
					const statusOrder = { New: 1, Open: 2, Resolved: 3, Closed: 4 };
					comparison = statusOrder[a.status] - statusOrder[b.status];
					break;
			}
			return sortDirection === "asc" ? comparison : -comparison;
		});

		return result;
	}, [tickets, sortField, sortDirection, priorityFilter, searchQuery]);

	const totalPages = Math.ceil(processedTickets.length / itemsPerPage);

	const displayedTickets = processedTickets.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortField(field);
			setSortDirection("asc"); // Default to ascending for priority? Or desc for Time.
			// Usually time desc.
			if (field === "created_at") setSortDirection("desc");
		}
	};

	// Helper for priority badge styles
	const getPriorityStyle = (p: string) => {
		switch (p) {
			case "P1":
				return "bg-red-500/10 text-red-500 border-red-500/20";
			case "P2":
				return "bg-orange-500/10 text-orange-500 border-orange-500/20";
			case "P3":
				return "bg-blue-500/10 text-blue-500 border-blue-500/20";
			default:
				return "bg-slate-500/10 text-slate-500 border-slate-500/20";
		}
	};

	const formatTimestamp = (iso: string) => {
		try {
			return new Date(iso).toLocaleString([], {
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});
		} catch (e) {
			return iso;
		}
	};

	// Loading skeleton
	if (isLoading) {
		return (
			<div className="p-6 bg-card rounded-xl space-y-3">
				{[1, 2, 3, 4, 5].map((i) => (
					<div
						key={i}
						className="h-16 rounded-lg bg-muted border border-border animate-pulse"
					/>
				))}
			</div>
		);
	}

	return (
		<>
			<div className="bg-card rounded-xl border border-border overflow-hidden">
				{/* Filters & Search Bar */}
				<div className="p-6 border-b border-border">
					<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
						{/* Search */}
						<div className="relative flex-1 max-w-md w-full group">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
							<input
								type="text"
								placeholder="Search tickets by subject, customer, or ID..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className={cn(
									"w-full pl-12 pr-4 h-10 rounded-xl border-2",
									"bg-muted/30 border-transparent hover:border-muted-foreground/20",
									"focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10",
									"text-foreground placeholder:text-muted-foreground/70",
									"transition-all duration-300 text-sm font-medium",
									"shadow-sm outline-none",
								)}
							/>
						</div>

						{/* Priority Filter */}
						<div className="flex items-center gap-2">
							<Filter className="w-4 h-4 text-muted-foreground" />
							{(["all", "P1", "P2", "P3", "P4"] as const).map((p) => (
								<button
									key={p}
									onClick={() => setPriorityFilter(p)}
									className={cn(
										"h-8 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center border",
										priorityFilter === p
											? "bg-primary text-primary-foreground border-primary"
											: "bg-muted/50 text-muted-foreground hover:bg-muted border-transparent",
									)}
								>
									{p === "all" ? "All" : p}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Table Header */}
				<div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 bg-muted/30 border-b border-border">
					<div
						className="col-span-1 flex items-center gap-1 cursor-pointer text-xs font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
						onClick={() => handleSort("priority")}
					>
						Priority
						{sortField === "priority" &&
							(sortDirection === "asc" ? (
								<ChevronUp className="w-3 h-3" />
							) : (
								<ChevronDown className="w-3 h-3" />
							))}
					</div>
					<div className="col-span-5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
						Subject / Sender
					</div>
					<div className="col-span-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
						Category
					</div>
					<div
						className="col-span-2 flex items-center gap-1 cursor-pointer text-xs font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
						onClick={() => handleSort("status")}
					>
						Status
						{sortField === "status" &&
							(sortDirection === "asc" ? (
								<ChevronUp className="w-3 h-3" />
							) : (
								<ChevronDown className="w-3 h-3" />
							))}
					</div>
					<div
						className="col-span-2 flex items-center gap-1 cursor-pointer text-xs font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors text-right"
						onClick={() => handleSort("created_at")}
					>
						Received
						{sortField === "created_at" &&
							(sortDirection === "asc" ? (
								<ChevronUp className="w-3 h-3" />
							) : (
								<ChevronDown className="w-3 h-3" />
							))}
					</div>
				</div>

				{/* Ticket Rows */}
				<div className="divide-y divide-border">
					{processedTickets.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-20 w-full">
							<Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
							<h3 className="text-lg font-medium text-foreground">
								No tickets found
							</h3>
							<p className="text-muted-foreground">
								Try adjusting your filters
							</p>
						</div>
					) : (
						displayedTickets.map((ticket) => {
							const pStyle = getPriorityStyle(ticket.priority);

							return (
								<div
									key={ticket.ticket_id}
									onClick={() => setSelectedTicket(ticket)}
									className={cn(
										"bg-card hover:bg-muted/50 transition-all duration-200 cursor-pointer group",
										ticket.priority === "P1" &&
											ticket.status !== "Resolved" &&
											"border-l-2 border-l-destructive bg-destructive/5",
									)}
								>
									{/* Desktop Row */}
									<div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-4 items-center">
										{/* Priority */}
										<div className="col-span-1">
											<div
												className={cn(
													"inline-flex items-center justify-center w-8 h-8 rounded-lg border text-xs font-bold",
													pStyle,
												)}
											>
												{ticket.priority}
											</div>
										</div>

										{/* Subject & Sender */}
										<div className="col-span-5 min-w-0">
											<div className="flex items-center gap-2 mb-1">
												<h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
													{ticket.subject}
												</h3>
												{ticket.status === "Open" &&
													ticket.tone?.toLowerCase().includes("urgent") && (
														<span
															className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"
															title="Response received - Action needed"
														/>
													)}
											</div>
											<div className="flex items-center gap-2 text-xs text-muted-foreground">
												<span className="truncate max-w-[200px]">
													{ticket.sender_email}
												</span>
												{ticket.customer_domain && (
													<>
														<span className="text-muted-foreground/60"></span>
														<span className="truncate">
															{ticket.customer_domain}
														</span>
													</>
												)}
											</div>
										</div>

										{/* Category */}
										<div className="col-span-2">
											<div
												className={cn(
													"inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-secondary/50 border-secondary",
												)}
											>
												<span>{ticket.category}</span>
											</div>
										</div>

										{/* Status */}
										<div className="col-span-2">
											<span
												className={cn(
													"text-xs font-medium px-2 py-1 rounded inline-block",
													ticket.status === "New"
														? "text-blue-500 bg-blue-500/10"
														: ticket.status === "Open"
															? "text-orange-500 bg-orange-500/10"
															: ticket.status === "Resolved"
																? "text-green-500 bg-green-500/10"
																: "text-slate-500 bg-slate-500/10",
												)}
											>
												{ticket.status}
											</span>
											{ticket.confidence_score > 0.8 &&
												ticket.status === "New" && (
													<div className="text-[10px] text-green-600 mt-1 flex items-center gap-1">
														<Sparkles className="w-3 h-3" /> AI Ready
													</div>
												)}
										</div>

										{/* Time */}
										<div className="col-span-2 text-right">
											<div className="text-xs font-medium text-foreground">
												{formatTimestamp(ticket.created_at)}
											</div>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>

				{/* Pagination Controls */}
				{totalPages > 1 && (
					<div className="flex items-center justify-between p-4 border-t border-border bg-muted/10">
						<p className="text-xs text-muted-foreground">
							Showing {Math.min(displayedTickets.length, tickets.length)} of{" "}
							{tickets.length} tickets
						</p>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
								disabled={currentPage === 1}
								className="h-8 w-8 p-0"
							>
								<ChevronLeft className="w-4 h-4" />
							</Button>
							<span className="text-xs font-medium px-2">
								Page {currentPage} of {totalPages}
							</span>
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									setCurrentPage((p) => Math.min(totalPages, p + 1))
								}
								disabled={currentPage === totalPages}
								className="h-8 w-8 p-0"
							>
								<ChevronRight className="w-4 h-4" />
							</Button>
						</div>
					</div>
				)}
			</div>

			{/* Review Panel Overlay */}
			{selectedTicket && (
				<ReviewPanel
					ticket={selectedTicket}
					onClose={() => setSelectedTicket(null)}
				/>
			)}
		</>
	);
}
