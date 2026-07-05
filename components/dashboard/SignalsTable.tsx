"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { MOTION_EASE_OUT } from "@/lib/easing";
import { FOCUS_RING_INSET } from "@/lib/focusRing";

const SIGNALS = [
  { name: "Revenue anomaly detected", source: "Finance", confidence: 94, status: "Resolved" as const },
  { name: "Churn risk spike", source: "Customer", confidence: 88, status: "Monitoring" as const },
  { name: "Supply delay pattern", source: "Operations", confidence: 91, status: "Resolved" as const },
  { name: "Pricing drift", source: "Finance", confidence: 76, status: "Investigating" as const },
  { name: "Engagement dip", source: "Product", confidence: 82, status: "Monitoring" as const },
  { name: "Duplicate lead records", source: "Sales", confidence: 97, status: "Resolved" as const },
];

const STATUS_TONE = {
  Resolved: "positive",
  Monitoring: "warning",
  Investigating: "neutral",
} as const;

export const STATUS_OPTIONS = [
  "All statuses",
  "Resolved",
  "Monitoring",
  "Investigating",
] as const;

type SortKey = "name" | "confidence";

export function SignalsTable({
  search,
  statusFilter,
}: {
  search: string;
  statusFilter: (typeof STATUS_OPTIONS)[number];
}) {
  const [sortKey, setSortKey] = useState<SortKey>("confidence");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = SIGNALS.filter((s) => {
      const matchesStatus = statusFilter === "All statuses" || s.status === statusFilter;
      const matchesQuery =
        query.length === 0 ||
        s.name.toLowerCase().includes(query) ||
        s.source.toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
    const dir = sortDir === "asc" ? 1 : -1;
    return filtered.sort((a, b) =>
      sortKey === "name"
        ? a.name.localeCompare(b.name) * dir
        : (a.confidence - b.confidence) * dir,
    );
  }, [search, statusFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const arrow = (key: SortKey) => (sortKey === key ? (sortDir === "asc" ? "↑" : "↓") : "");
  const ariaSort = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? "ascending" : "descending") : "none";

  return (
    <div className="overflow-x-auto rounded-xl border border-border-subtle">
      <table className="w-full min-w-140 text-left text-sm">
        <thead>
          <tr className="border-b border-border-subtle text-xs text-text-muted">
            <th className="p-0 font-medium" aria-sort={ariaSort("name")}>
              <button
                type="button"
                onClick={() => toggleSort("name")}
                className={`w-full select-none px-4 py-3 text-left hover:text-text-secondary ${FOCUS_RING_INSET}`}
              >
                Signal {arrow("name")}
              </button>
            </th>
            <th className="px-4 py-3 font-medium">Source</th>
            <th className="p-0 font-medium" aria-sort={ariaSort("confidence")}>
              <button
                type="button"
                onClick={() => toggleSort("confidence")}
                className={`w-full select-none px-4 py-3 text-left hover:text-text-secondary ${FOCUS_RING_INSET}`}
              >
                Confidence {arrow("confidence")}
              </button>
            </th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {rows.map((signal) => (
              <motion.tr
                key={signal.name}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: MOTION_EASE_OUT }}
                className="border-b border-border-subtle last:border-b-0 hover:bg-surface-2"
              >
                <td className="px-4 py-3 text-text-primary">{signal.name}</td>
                <td className="px-4 py-3 text-text-secondary">{signal.source}</td>
                <td className="px-4 py-3 text-text-secondary">{signal.confidence}%</td>
                <td className="px-4 py-3">
                  <Badge tone={STATUS_TONE[signal.status]}>{signal.status}</Badge>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-text-muted">
                No signals match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
