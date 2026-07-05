"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  Activity,
  Calendar,
  ChevronDown,
  Database,
  Filter,
  LayoutGrid,
  Loader2,
  Plus,
  Search,
  Settings,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import {
  IntelligenceOutputChart,
  SignalMixChart,
  Sparkline,
} from "@/components/dashboard/charts";
import { SignalsTable, STATUS_OPTIONS } from "@/components/dashboard/SignalsTable";
import { DURATION, MOTION_EASE_OUT } from "@/lib/easing";
import { FOCUS_RING, FOCUS_RING_INSET } from "@/lib/focusRing";

const NAV_ITEMS = [
  { label: "Overview", icon: LayoutGrid },
  { label: "Signals", icon: Activity },
  { label: "Data sources", icon: Database },
  { label: "Automations", icon: Zap },
  { label: "Governance", icon: Shield },
  { label: "Settings", icon: Settings },
];

const KPIS = [
  {
    label: "Records ingested",
    value: "4.28M",
    trend: "+12.4%",
    color: "#5b8cff",
    data: [8, 10, 9, 12, 14, 13, 16, 18, 17, 20],
  },
  {
    label: "Insights generated",
    value: "1,284",
    trend: "+8.1%",
    color: "#34d399",
    data: [4, 5, 5, 6, 7, 6, 8, 9, 9, 10],
  },
  {
    label: "Model confidence",
    value: "94.2%",
    trend: "+1.3%",
    color: "#a78bfa",
    data: [88, 89, 90, 89, 91, 92, 91, 93, 94, 94],
  },
];

const TABS = ["Overview", "Reports", "Automations"] as const;

const DATE_RANGES = ["Last 7 days", "Last 30 days", "Last 90 days"] as const;

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: MOTION_EASE_OUT },
  },
};

let reportIdCounter = 0;

export function DashboardPreview() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Overview");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_OPTIONS)[number]>("All statuses");
  const [dateRange, setDateRange] =
    useState<(typeof DATE_RANGES)[number]>("Last 30 days");
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [hiddenInsights, setHiddenInsights] = useState(false);
  const [hiddenSignals, setHiddenSignals] = useState(false);
  const generatingTimeouts = useRef(new Set<ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const timeouts = generatingTimeouts.current;
    return () => {
      timeouts.forEach((id) => clearTimeout(id));
    };
  }, []);

  function handleNewReport() {
    const id = `report-${++reportIdCounter}`;
    const name = `Intelligence Snapshot · ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
    setReports((prev) => [
      { id, name, date: "Just now", status: "Generating" },
      ...prev,
    ]);
    setActiveTab("Reports");

    const timeoutId = setTimeout(() => {
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "Draft" } : r)),
      );
      generatingTimeouts.current.delete(timeoutId);
    }, 1800);
    generatingTimeouts.current.add(timeoutId);
  }

  function selectTab(tab: (typeof TABS)[number]) {
    setActiveTab(tab);
    if (tab === "Overview" || tab === "Automations") setActiveNav(tab);
  }

  return (
    <section
      id="dashboard"
      className="mx-auto w-full min-w-0 max-w-6xl px-6 py-24 sm:py-32"
    >
      <div className="mb-12 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-3xl font-semibold text-text-primary">
            Intelligence dashboard
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent">
            <Sparkles className="h-3 w-3 animate-pulse" strokeWidth={2} />
            AI analyzing live
          </span>
        </div>
        <p className="max-w-2xl text-text-secondary">
          The product surface — fully interactive. Switch tabs, filter by status
          or range, sort the table, toggle automations.
        </p>
      </div>

      <div className="flex flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface lg:flex-row">
        <aside className="flex min-w-0 flex-col gap-6 border-b border-border-subtle p-4 lg:w-56 lg:shrink-0 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2 px-2">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="8" stroke="var(--accent)" strokeWidth="1.5" />
              <circle cx="9" cy="9" r="2.5" fill="var(--accent)" />
            </svg>
            <span className="text-sm font-semibold text-text-primary">Xai</span>
          </div>

          <nav className="flex min-w-0 flex-row gap-1 overflow-x-auto lg:flex-col">
            {NAV_ITEMS.map((item) => {
              const isActive = item.label === activeNav;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setActiveNav(item.label);
                    if (item.label === "Overview" || item.label === "Automations") {
                      setActiveTab(item.label);
                    }
                  }}
                  className={`flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? "bg-surface-2 text-text-primary"
                      : "text-text-secondary hover:text-text-primary"
                  } ${FOCUS_RING}`}
                >
                  <item.icon className="h-4 w-4" strokeWidth={1.75} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto flex items-center gap-3 border-t border-border-subtle pt-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/12 text-xs font-medium text-accent">
              AK
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm text-text-primary">Amara Kwan</p>
              <p className="truncate text-xs text-text-muted">VP, Data Strategy</p>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1 p-6">
          <div className="mb-6 flex flex-col gap-4 border-b border-border-subtle pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                Intelligence Overview
              </h3>
              <p className="text-xs text-text-muted">
                Workspace / Acme Corp · {dateRange}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search sources..."
                  className={`w-40 rounded-md border border-border-subtle bg-surface-2 py-1.5 pl-8 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-accent/50 focus:outline-none sm:w-48 ${FOCUS_RING}`}
                />
              </div>
              <DateRangeDropdown value={dateRange} onChange={setDateRange} />
              <StatusFilterDropdown value={statusFilter} onChange={setStatusFilter} />
              <Button
                variant="primary"
                onClick={handleNewReport}
                className="inline-flex shrink-0 items-center gap-1.5 !px-3 !py-1.5 !text-xs"
              >
                <Plus className="h-3.5 w-3.5" /> New report
              </Button>
            </div>
          </div>

          <div className="mb-6 flex items-center gap-6 border-b border-border-subtle">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => selectTab(tab)}
                className={`relative rounded-sm pb-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "text-text-primary"
                    : "text-text-secondary hover:text-text-primary"
                } ${FOCUS_RING}`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="dashboard-tab-underline"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-accent"
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "Overview" && (
              <motion.div
                key="overview"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                exit={{ opacity: 0, transition: { duration: DURATION.fast, ease: MOTION_EASE_OUT } }}
              >
                <motion.div
                  variants={itemVariants}
                  className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
                >
                  {KPIS.map((kpi) => (
                    <div
                      key={kpi.label}
                      className="rounded-xl border border-border-subtle bg-surface-2 p-4 transition-colors hover:border-accent/30"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <p className="text-xs text-text-muted">{kpi.label}</p>
                        <span className="text-[11px] font-medium text-emerald-400">
                          {kpi.trend}
                        </span>
                      </div>
                      <p className="text-xl font-semibold text-text-primary">
                        {kpi.value}
                      </p>
                      <Sparkline data={kpi.data} color={kpi.color} />
                    </div>
                  ))}
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3"
                >
                  <div className="h-72 rounded-xl border border-border-subtle bg-surface-2 p-4 transition-colors hover:border-accent/30 lg:col-span-2">
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          Intelligence output
                        </p>
                        <p className="text-xs text-text-muted">
                          Insights generated per day · {dateRange}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-text-secondary">
                        <button
                          type="button"
                          onClick={() => setHiddenInsights((v) => !v)}
                          className={`flex items-center gap-1 rounded-sm transition-opacity duration-150 ${FOCUS_RING_INSET} ${
                            hiddenInsights ? "opacity-40" : "opacity-100"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[#5b8cff]" />
                          Insights
                        </button>
                        <button
                          type="button"
                          onClick={() => setHiddenSignals((v) => !v)}
                          className={`flex items-center gap-1 rounded-sm transition-opacity duration-150 ${FOCUS_RING_INSET} ${
                            hiddenSignals ? "opacity-40" : "opacity-100"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[#34d399]" />
                          Signals
                        </button>
                      </div>
                    </div>
                    <div className="h-52">
                      <IntelligenceOutputChart
                        hideInsights={hiddenInsights}
                        hideSignals={hiddenSignals}
                      />
                    </div>
                  </div>
                  <div className="rounded-xl border border-border-subtle bg-surface-2 p-4 transition-colors hover:border-accent/30">
                    <p className="mb-1 text-sm font-medium text-text-primary">
                      Signal mix
                    </p>
                    <p className="mb-3 text-xs text-text-muted">By source type</p>
                    <SignalMixChart />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <SignalsTable search={search} statusFilter={statusFilter} />
                </motion.div>
              </motion.div>
            )}

            {activeTab === "Reports" && (
              <ReportsPanel key="reports" reports={reports} />
            )}
            {activeTab === "Automations" && <AutomationsPanel key="automations" />}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function FilterDropdown<T extends string>({
  icon: Icon,
  value,
  options,
  onChange,
}: {
  icon: typeof Filter;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex shrink-0 items-center gap-1.5 rounded-md border border-border-subtle bg-surface-2 px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary ${FOCUS_RING}`}
      >
        <Icon className="h-3.5 w-3.5" />
        {value}
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
      )}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: MOTION_EASE_OUT }}
            className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-md border border-border-subtle bg-surface-2 shadow-lg"
          >
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-2 text-left text-xs hover:bg-surface ${
                  value === opt ? "text-accent" : "text-text-secondary"
                } ${FOCUS_RING_INSET}`}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusFilterDropdown({
  value,
  onChange,
}: {
  value: (typeof STATUS_OPTIONS)[number];
  onChange: (value: (typeof STATUS_OPTIONS)[number]) => void;
}) {
  return (
    <FilterDropdown icon={Filter} value={value} options={STATUS_OPTIONS} onChange={onChange} />
  );
}

function DateRangeDropdown({
  value,
  onChange,
}: {
  value: (typeof DATE_RANGES)[number];
  onChange: (value: (typeof DATE_RANGES)[number]) => void;
}) {
  return (
    <FilterDropdown icon={Calendar} value={value} options={DATE_RANGES} onChange={onChange} />
  );
}

type ReportStatus = "Ready" | "Draft" | "Generating";
interface ReportItem {
  id: string;
  name: string;
  date: string;
  status: ReportStatus;
}

const INITIAL_REPORTS: ReportItem[] = [
  { id: "r1", name: "Q2 Intelligence Summary", date: "Jun 28, 2026", status: "Ready" },
  { id: "r2", name: "Signal Accuracy Audit", date: "Jun 21, 2026", status: "Ready" },
  { id: "r3", name: "Automation Impact Review", date: "Jun 14, 2026", status: "Draft" },
];

function ReportsPanel({ reports }: { reports: ReportItem[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: MOTION_EASE_OUT }}
      className="divide-y divide-border-subtle rounded-xl border border-border-subtle"
    >
      <AnimatePresence initial={false}>
        {reports.map((report) => (
          <motion.div
            key={report.id}
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: DURATION.fast, ease: MOTION_EASE_OUT }}
            className="flex items-center justify-between gap-4 overflow-hidden px-4 py-3 hover:bg-surface-2"
          >
            <div>
              <p className="text-sm text-text-primary">{report.name}</p>
              <p className="text-xs text-text-muted">{report.date}</p>
            </div>
            {report.status === "Generating" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                <Loader2 className="h-3 w-3 animate-spin" />
                Generating
              </span>
            ) : (
              <Badge tone={report.status === "Ready" ? "positive" : "neutral"}>
                {report.status}
              </Badge>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

const INITIAL_AUTOMATIONS = [
  {
    name: "Auto-resolve low-risk signals",
    description: "Automatically close signals under 60% confidence.",
    enabled: true,
    lastRun: "2m ago",
  },
  {
    name: "Weekly digest email",
    description: "Send a summary report every Monday.",
    enabled: true,
    lastRun: "18m ago",
  },
  {
    name: "Slack alerts for critical signals",
    description: "Notify #data-alerts when confidence exceeds 90%.",
    enabled: false,
    lastRun: "1d ago",
  },
];

type Automation = (typeof INITIAL_AUTOMATIONS)[number];

function AutomationsPanel() {
  const [automations, setAutomations] = useState<Automation[]>(INITIAL_AUTOMATIONS);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: MOTION_EASE_OUT }}
      className="divide-y divide-border-subtle rounded-xl border border-border-subtle"
    >
      {automations.map((automation, i) => (
        <AutomationRow
          key={automation.name}
          automation={automation}
          onToggle={(checked) =>
            setAutomations((prev) =>
              prev.map((a, idx) => (idx === i ? { ...a, enabled: checked } : a)),
            )
          }
        />
      ))}
    </motion.div>
  );
}

function AutomationRow({
  automation,
  onToggle,
}: {
  automation: Automation;
  onToggle: (checked: boolean) => void;
}) {
  const [activating, setActivating] = useState(false);
  const [justActivated, setJustActivated] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleChange(checked: boolean) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (checked) {
      setActivating(true);
      timeoutRef.current = setTimeout(() => {
        setActivating(false);
        setJustActivated(true);
      }, 900);
    } else {
      setActivating(false);
      setJustActivated(false);
    }
    onToggle(checked);
  }

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm text-text-primary">{automation.name}</p>
        <p className="text-xs text-text-muted">{automation.description}</p>
        <AnimatePresence mode="wait">
          {automation.enabled ? (
            activating ? (
              <motion.div
                key="activating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.fast, ease: MOTION_EASE_OUT }}
                className="mt-1.5 flex items-center gap-1.5 text-[11px]"
              >
                <Loader2 className="h-3 w-3 animate-spin text-accent" />
                <span className="text-accent">Activating…</span>
              </motion.div>
            ) : (
              <motion.div
                key="running"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.fast, ease: MOTION_EASE_OUT }}
                className="mt-1.5 flex items-center gap-1.5 text-[11px]"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-emerald-400">Running</span>
                <span className="text-text-muted">
                  · triggered {justActivated ? "just now" : automation.lastRun}
                </span>
              </motion.div>
            )
          ) : (
            <motion.div
              key="paused"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DURATION.fast, ease: MOTION_EASE_OUT }}
              className="mt-1.5 flex items-center gap-1.5 text-[11px]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-text-muted" />
              <span className="text-text-muted">Paused</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Switch checked={automation.enabled} onChange={handleChange} />
    </div>
  );
}
