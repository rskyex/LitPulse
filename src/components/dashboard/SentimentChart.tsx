"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import type { SentimentPoint } from "@/lib/types";

interface Props {
  data: SentimentPoint[];
  height?: number;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: SentimentPoint }> }) {
  if (!active || !payload?.[0]) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-parchment-dark bg-white px-3 py-2 shadow-md">
      <p className="text-xs text-ink-muted">Chapter {point.chapter}</p>
      <p className="text-sm font-medium">
        Sentiment:{" "}
        <span
          className={
            point.sentiment > 0.2
              ? "text-sentiment-positive"
              : point.sentiment < -0.2
              ? "text-sentiment-negative"
              : "text-sentiment-neutral"
          }
        >
          {point.sentiment > 0 ? "+" : ""}
          {point.sentiment.toFixed(2)}
        </span>
      </p>
      {point.label && (
        <p className="mt-1 text-xs font-medium text-accent">{point.label}</p>
      )}
    </div>
  );
}

export default function SentimentChart({ data, height = 280 }: Props) {
  return (
    <div className="rounded-xl border border-parchment-dark bg-white p-5">
      <h3 className="mb-4 font-serif text-lg font-semibold">Emotional Arc</h3>
      <p className="mb-4 text-xs text-ink-muted">
        How the emotional tone shifts across the narrative — hover for key moments
      </p>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
          <defs>
            <linearGradient id="sentimentFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.05} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
          <XAxis
            dataKey="chapter"
            tick={{ fontSize: 11, fill: "#78716c" }}
            axisLine={{ stroke: "#d6d3d1" }}
            label={{ value: "Chapter", position: "bottom", offset: -5, fontSize: 11, fill: "#78716c" }}
          />
          <YAxis
            domain={[-1, 1]}
            ticks={[-1, -0.5, 0, 0.5, 1]}
            tick={{ fontSize: 11, fill: "#78716c" }}
            axisLine={{ stroke: "#d6d3d1" }}
          />
          <ReferenceLine y={0} stroke="#a8a29e" strokeDasharray="4 4" />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="sentiment"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill="url(#sentimentFill)"
            dot={(props: Record<string, unknown>) => {
              const point = props.payload as SentimentPoint;
              if (!point?.label) return <circle key={`dot-${props.index}`} cx={0} cy={0} r={0} />;
              return (
                <circle
                  key={`dot-${props.index}`}
                  cx={props.cx as number}
                  cy={props.cy as number}
                  r={5}
                  fill="#6366f1"
                  stroke="#fff"
                  strokeWidth={2}
                />
              );
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
