"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TipProps {
  active?: boolean;
  payload?: { payload: { note: string; share: number } }[];
}

function GoldTooltip({ active, payload }: TipProps) {
  if (!active || !payload?.length) return null;
  const { note, share } = payload[0].payload;
  return (
    <div className="border border-gold bg-noir px-4 py-3 shadow-[0_0_20px_rgba(212,175,55,0.25)]">
      <div className="text-[10px] uppercase tracking-[0.35em] text-gold">{note}</div>
      <div className="font-serif text-xl text-ivory">{share}% of profiles</div>
    </div>
  );
}

export default function SensoryChart({
  data,
}: {
  data: { note: string; share: number }[];
}) {
  return (
    <div className="h-[340px] w-full sm:h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 36, right: 8, bottom: 8, left: -12 }}
          barCategoryGap="28%"
        >
          <defs>
            <linearGradient id="goldBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f0d77a" />
              <stop offset="100%" stopColor="#b8932a" />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke="rgba(212,175,55,0.12)"
          />
          <XAxis
            dataKey="note"
            tickLine={false}
            axisLine={{ stroke: "rgba(212,175,55,0.55)" }}
            tick={{
              fill: "#cfcac0",
              fontSize: 11,
              letterSpacing: "0.3em",
            }}
            tickFormatter={(v: string) => v.toUpperCase()}
            dy={10}
          />
          <YAxis
            domain={[0, 60]}
            ticks={[0, 15, 30, 45, 60]}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#7d7a72", fontSize: 11 }}
          />
          <Tooltip
            cursor={{ fill: "rgba(212,175,55,0.06)" }}
            content={<GoldTooltip />}
          />
          <Bar
            dataKey="share"
            fill="url(#goldBar)"
            maxBarSize={110}
            radius={0}
            activeBar={{ fill: "#f0d77a" }}
            animationDuration={900}
          >
            <LabelList
              dataKey="share"
              position="top"
              offset={12}
              formatter={(v) => `${v}%`}
              style={{
                fill: "#f5f3ee",
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: 22,
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
