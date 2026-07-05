"use client";

import { useId, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { FOCUS_RING_INSET } from "@/lib/focusRing";

const DATA_1 = "#5b8cff";
const DATA_2 = "#34d399";
const DATA_3 = "#a78bfa";
const DATA_4 = "#f59e0b";
const BORDER_SUBTLE = "#232327";
const TEXT_MUTED = "#6b6b70";

interface ChartTooltipPayloadItem {
  dataKey?: string;
  name?: string;
  value?: number;
  color?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  label?: string;
  payload?: ChartTooltipPayloadItem[];
}

function ChartTooltip({ active, label, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border-subtle bg-surface-2 px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 text-text-muted">{label}</p>
      {payload.map((item) => (
        <p key={item.dataKey} style={{ color: item.color }}>
          {item.name}: {item.value}
        </p>
      ))}
    </div>
  );
}

export function Sparkline({ data, color }: { data: number[]; color: string }) {
  const gradientId = useId();
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={chartData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#${gradientId})`}
          isAnimationActive
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

const OUTPUT_DATA = [
  { date: "Jun 1", insights: 220, signals: 140 },
  { date: "Jun 8", insights: 265, signals: 175 },
  { date: "Jun 15", insights: 250, signals: 190 },
  { date: "Jun 22", insights: 340, signals: 215 },
  { date: "Jun 30", insights: 430, signals: 260 },
];

export function IntelligenceOutputChart({
  hideInsights = false,
  hideSignals = false,
}: {
  hideInsights?: boolean;
  hideSignals?: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={OUTPUT_DATA} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="insightsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={DATA_1} stopOpacity={0.35} />
            <stop offset="100%" stopColor={DATA_1} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="signalsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={DATA_2} stopOpacity={0.3} />
            <stop offset="100%" stopColor={DATA_2} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={BORDER_SUBTLE} vertical={false} />
        <XAxis
          dataKey="date"
          stroke={TEXT_MUTED}
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<ChartTooltip />} />
        <Area
          type="monotone"
          dataKey="insights"
          name="Insights"
          stroke={DATA_1}
          strokeWidth={2}
          fill="url(#insightsFill)"
          isAnimationActive
          hide={hideInsights}
        />
        <Area
          type="monotone"
          dataKey="signals"
          name="Signals"
          stroke={DATA_2}
          strokeWidth={2}
          fill="url(#signalsFill)"
          isAnimationActive
          hide={hideSignals}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

const SIGNAL_MIX = [
  { name: "Structured", value: 42, color: DATA_1 },
  { name: "Streams", value: 28, color: DATA_2 },
  { name: "Text", value: 18, color: DATA_3 },
  { name: "Other", value: 12, color: DATA_4 },
];

export function SignalMixChart() {
  const [active, setActive] = useState<number | null>(null);
  const activeEntry = active !== null ? SIGNAL_MIX[active] : null;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-36 w-36">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<ChartTooltip />} />
            <Pie
              data={SIGNAL_MIX}
              dataKey="value"
              nameKey="name"
              innerRadius="72%"
              outerRadius="100%"
              paddingAngle={3}
              stroke="none"
              isAnimationActive
              onMouseEnter={(_, index) => setActive(index)}
              onMouseLeave={() => setActive(null)}
            >
              {SIGNAL_MIX.map((entry, i) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                  fillOpacity={active === null || active === i ? 1 : 0.3}
                  className="cursor-pointer transition-opacity duration-150"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold text-text-primary">
            {activeEntry ? `${activeEntry.value}%` : "6"}
          </span>
          <span className="text-[10px] text-text-muted">
            {activeEntry ? activeEntry.name : "sources"}
          </span>
        </div>
      </div>
      <ul className="w-full space-y-1.5 text-xs">
        {SIGNAL_MIX.map((entry, i) => (
          <li key={entry.name}>
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className={`flex w-full items-center justify-between rounded-sm py-0.5 transition-opacity duration-150 ${FOCUS_RING_INSET} ${
                active === null || active === i ? "opacity-100" : "opacity-40"
              }`}
            >
              <span className="flex items-center gap-2 text-text-secondary">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}
              </span>
              <span className="text-text-primary">{entry.value}%</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
