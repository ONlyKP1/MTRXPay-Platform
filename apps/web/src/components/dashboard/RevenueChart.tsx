import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface RevenueDataPoint {
  label: string;
  amount: number;
}

interface RevenueChartProps {
  data: RevenueDataPoint[];
  formatCurrency: (amount: number) => string;
}

function CustomTooltip({
  active,
  payload,
  formatCurrency,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  formatCurrency: (amount: number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'var(--hp-bg-card, #0a1628)',
        border: '1px solid var(--hp-gold, #D4AF37)',
        borderRadius: 8,
        padding: '8px 14px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}
    >
      <span
        style={{
          color: 'var(--hp-gold, #D4AF37)',
          fontWeight: 700,
          fontSize: '0.85rem',
        }}
      >
        {formatCurrency(payload[0].value)}
      </span>
    </div>
  );
}

export function RevenueChart({ data, formatCurrency }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <ComposedChart data={data} margin={{ top: 10, right: 4, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.06)"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fill: 'var(--hp-text-muted, #888)', fontSize: 11, fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--hp-text-muted, #888)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) =>
            v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
          }
        />
        <Tooltip
          content={<CustomTooltip formatCurrency={formatCurrency} />}
          cursor={{ fill: 'rgba(212,175,55,0.06)' }}
        />
        <Area
          type="monotone"
          dataKey="amount"
          fill="url(#goldGradient)"
          stroke="#D4AF37"
          strokeWidth={2}
        />
        <Bar
          dataKey="amount"
          fill="rgba(212,175,55,0.25)"
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
