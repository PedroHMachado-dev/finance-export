import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { formatCurrency } from "../../utils/formatters";
import { CalendarDays, CreditCard, Landmark, ArrowRight, Zap } from "lucide-react";

// Tooltip Customizado no Hover Garantido
const CustomWeeklyTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const accountVal = data.accountExpense || 0;
    const cardVal = data.cardExpense || 0;
    const totalVal = data.totalExpense || 0;

    return (
      <div className="bg-slate-900/95 dark:bg-slate-950/95 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md min-w-[190px] text-xs space-y-2 pointer-events-none z-50 animate-in fade-in zoom-in-95 duration-100">
        <div className="font-bold text-slate-200 border-b border-slate-700/80 pb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-indigo-400">
            <CalendarDays className="w-3.5 h-3.5" />
            {data.dayName}
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-mono">Consolidado</span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-rose-400">
            <span className="flex items-center gap-1">
              <Landmark className="w-3 h-3 text-rose-500" />
              Conta / Pix:
            </span>
            <span className="font-bold">{formatCurrency(accountVal)}</span>
          </div>

          <div className="flex items-center justify-between text-purple-300">
            <span className="flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-purple-400" />
              Cartão de Crédito:
            </span>
            <span className="font-bold">{formatCurrency(cardVal)}</span>
          </div>

          <div className="flex items-center justify-between font-extrabold text-white pt-1 border-t border-slate-700/60">
            <span>Total no Dia:</span>
            <span className="text-indigo-300">{formatCurrency(totalVal)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const RANGE_OPTIONS = [
  { key: 1, label: "1 mês" },
  { key: 3, label: "3 meses" },
];

export function WeeklyLineChart({ data = [], onDayClick, rangeMonths, onRangeChange }) {
  const [activeMetric, setActiveMetric] = React.useState("totalExpense");

  const totals = React.useMemo(() => {
    return {
      accountExpense: data.reduce((acc, curr) => acc + (curr.accountExpense || 0), 0),
      cardExpense: data.reduce((acc, curr) => acc + (curr.cardExpense || 0), 0),
      totalExpense: data.reduce((acc, curr) => acc + (curr.totalExpense || 0), 0),
    };
  }, [data]);

  // Encontra o dia com mais gastos
  const highestDay = React.useMemo(() => {
    if (!data || data.length === 0) return null;
    return [...data].sort((a, b) => (b.totalExpense || 0) - (a.totalExpense || 0))[0];
  }, [data]);

  const metricConfig = {
    accountExpense: { label: "Conta / Pix", color: "#EF4444" },
    cardExpense: { label: "Cartão", color: "#8B5CF6" },
    totalExpense: { label: "Total Geral", color: "#6366F1" },
  };

  return (
    <Card className="overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row items-stretch justify-between border-b border-slate-100 dark:border-slate-800 p-0">
        <div className="flex flex-1 flex-col justify-center gap-2 px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <CardTitle>Controle Semanal (Dias da Semana)</CardTitle>
            </div>
            <CardDescription className="mt-1">
              Distribuição de gastos de Segunda a Domingo. Clique em um dia para ver as movimentações.
            </CardDescription>
          </div>

          {onRangeChange && (
            <div className="inline-flex self-start rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
              {RANGE_OPTIONS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onRangeChange(key)}
                  className={`px-3 py-1.5 text-[11px] font-bold transition-colors ${
                    rangeMonths === key
                      ? "bg-indigo-500 text-white"
                      : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Abas Alternáveis */}
        <div className="flex border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 divide-x divide-slate-200 dark:divide-slate-800">
          {[
            { key: "accountExpense", label: "Conta / Pix", color: "#EF4444" },
            { key: "cardExpense", label: "Cartão", color: "#8B5CF6" },
            { key: "totalExpense", label: "Total", color: "#6366F1" },
          ].map(({ key, label, color }) => {
            const isActive = activeMetric === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveMetric(key)}
                className={`flex flex-col justify-center px-4 sm:px-5 py-3 text-left transition-all ${
                  isActive
                    ? "bg-slate-100 dark:bg-slate-800 font-bold border-b-2"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50 opacity-70"
                }`}
                style={{
                  borderBottomColor: isActive ? color : "transparent",
                }}
              >
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {label}
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                  {formatCurrency(totals[key])}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="px-3 pt-6 sm:px-6">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ left: -15, right: 15, top: 10, bottom: 0 }}
              onClick={(chartState) => {
                const payload = chartState?.activePayload?.[0]?.payload;
                if (payload && onDayClick) onDayClick(payload);
              }}
              className={onDayClick ? "cursor-pointer" : ""}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} />
              <XAxis
                dataKey="dayName"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(val) => `R$${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
              />

              {/* Tooltip Interativo no Hover */}
              <Tooltip
                content={<CustomWeeklyTooltip />}
                cursor={{ stroke: '#6366f1', strokeWidth: 1.5, strokeDasharray: '4 4' }}
              />

              <Line
                dataKey={activeMetric}
                name={metricConfig[activeMetric]?.label || "Gasto"}
                type="monotone"
                stroke={metricConfig[activeMetric]?.color || "#6366F1"}
                strokeWidth={3}
                dot={{ r: 5, fill: metricConfig[activeMetric]?.color, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 7, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {highestDay && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Dia com maior concentração de gastos: <strong>{highestDay.dayName}</strong> ({formatCurrency(highestDay.totalExpense)})
            </span>
            <span className="hidden sm:inline text-slate-400">Baseado no extrato e faturas</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
