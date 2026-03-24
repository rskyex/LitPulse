"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import type { Theme } from "@/lib/types";

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: Theme }> }) {
  if (!active || !payload?.[0]) return null;
  const theme = payload[0].payload;
  return (
    <div className="rounded-lg border border-parchment-dark bg-white px-3 py-2 shadow-md">
      <p className="text-sm font-medium">{theme.name}</p>
      <p className="text-xs text-ink-muted">Prominence: {theme.frequency}%</p>
      <p className="mt-1 text-xs text-ink-muted">
        Keywords: {theme.keywords.join(", ")}
      </p>
    </div>
  );
}

export default function ThemeCloud({ themes }: { themes: Theme[] }) {
  return (
    <div className="rounded-xl border border-parchment-dark bg-white p-5">
      <h3 className="mb-4 font-serif text-lg font-semibold">Themes & Motifs</h3>
      <p className="mb-4 text-xs text-ink-muted">
        Recurring themes by prominence in the text
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={themes}
          layout="vertical"
          margin={{ top: 0, right: 10, bottom: 0, left: 0 }}
        >
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tick={{ fontSize: 12, fill: "#44403c" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
          <Bar dataKey="frequency" radius={[0, 6, 6, 0]} barSize={20}>
            {themes.map((theme, i) => (
              <Cell key={i} fill={theme.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
