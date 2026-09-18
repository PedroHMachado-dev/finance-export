import * as React from "react";
import { TrendingUp, TrendingDown, PiggyBank, Target, ShieldCheck } from "lucide-react";
import { CartesianGrid, Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { formatCurrency } from "../../utils/formatters";

// Tooltip Customizado no Hover Garantido
const CustomSavingsTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const savedVal = data.savedThisMonth || 0;
    const prevVal = data.savedPreviousMonth || 0;
    const cumVal = data.cumulativeTotal || 0;
    const growth = data.growthPercentage || 0;

    return (
      <div className="bg-slate-900/95 dark:bg-slate-950/95 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md min-w-[210px] text-xs space-y-2 pointer-events-none z-50 animate-in fade-in zoom-in-95 duration-100">
        <div className="font-bold text-slate-200 border-b border-slate-700/80 pb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <PiggyBank className="w-3.5 h-3.5" />
            {data.monthLabel}
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-mono">Caixinhas</span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-emerald-300">
            <span>Aporte no Mês:</span>
            <span className="font-bold">{formatCurrency(savedVal)}</span>
          </div>

          <div className="flex items-center justify-between text-emerald-500">
            <span>Guardado nas Caixinhas:</span>
            <span className="font-bold">{formatCurrency(cumVal)}</span>
          </div>

          {prevVal > 0 && (
            <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-700/60 text-[11px]">
              <span>Mês Anterior:</span>
              <span>{formatCurrency(prevVal)}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1 border-t border-slate-700/60 font-semibold">
            <span>Variação:</span>
            <span className={growth >= 0 ? "text-emerald-400" : "text-rose-400"}>
              {growth >= 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function SavingsTrendChart({ data = [], compact = false }) {
  const activeMonths = data.filter((d) => d.savedThisMonth > 0);
  const currentMonthData = activeMonths.length > 0 ? activeMonths[activeMonths.length - 1] : null;
  const growth = currentMonthData ? currentMonthData.growthPercentage : 0;
  const isPositiveGrowth = growth >= 0;

  const totalSavedYear = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + (curr.savedThisMonth || 0), 0);
  }, [data]);

  // No modo compacto (ao lado do gráfico semanal), mostra só os meses com movimentação
  // mais recentes, para não espremer as barras nem prejudicar o gráfico vizinho.
  const chartData = React.useMemo(() => {
    if (!compact) return data;
    const relevant = data.filter((d) => (d.savedThisMonth || 0) > 0 || (d.cumulativeTotal || 0) > 0);
    return relevant.slice(-6);
  }, [data, compact]);

  return (
    <Card className="overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm h-full flex flex-col">
      <CardHeader className={`flex flex-col gap-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 ${compact ? 'py-3 px-4' : 'py-4 px-6 sm:flex-row sm:items-center sm:justify-between'}`}>
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <PiggyBank className="w-4 h-4" />
            </div>
            <CardTitle>Caixinhas</CardTitle>
          </div>
          {!compact && (
            <CardDescription className="mt-1">
              Compare o quanto você guardou em cada mês com o total já acumulado nas caixinhas.
            </CardDescription>
          )}
        </div>

        <div className={compact ? '' : 'text-right'}>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Total Guardado</span>
          <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalSavedYear)}
          </span>
        </div>
      </CardHeader>

      <CardContent className={compact ? 'px-2 pt-4' : 'px-3 pt-6 sm:px-6'}>
        <div className={compact ? 'h-[240px] w-full' : 'h-[280px] w-full'}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ left: -15, right: 15, top: 10, bottom: 0 }}
              barGap={4}
              barCategoryGap={compact ? '20%' : '28%'}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} />
              <XAxis
                dataKey="monthLabel"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(value) => {
                  if (!value) return "";
                  return value.split("/")[0].slice(0, 3);
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(val) => `R$${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
              />

              {/* Tooltip Interativo no Hover */}
              <Tooltip
                content={<CustomSavingsTooltip />}
                cursor={{ fill: '#10B981', fillOpacity: 0.08 }}
              />

              <Bar
                dataKey="savedThisMonth"
                name="Guardado no Mês"
                fill="#6EE7B7"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="cumulativeTotal"
                name="Total nas Caixinhas"
                fill="#047857"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

      {!compact && (
        <CardFooter className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 py-3.5 px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2 text-xs">
            <div className="flex items-center gap-2 font-semibold">
              {isPositiveGrowth ? (
                <span className="inline-flex items-center text-emerald-700 bg-emerald-100/80 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-300/60 dark:border-emerald-800">
                  <TrendingUp className="h-3.5 w-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
                  Variação de +{growth.toFixed(1)}% este mês
                </span>
              ) : (
                <span className="inline-flex items-center text-rose-700 bg-rose-100/80 dark:bg-rose-950 dark:text-rose-300 px-2.5 py-1 rounded-lg border border-rose-300/60 dark:border-rose-800">
                  <TrendingDown className="h-3.5 w-3.5 mr-1 text-rose-600 dark:text-rose-400" />
                  Variação de {growth.toFixed(1)}% este mês
                </span>
              )}
              <span className="text-slate-600 dark:text-slate-300 font-normal">
                {currentMonthData ? `Último aporte em ${currentMonthData.monthLabel}: ${formatCurrency(currentMonthData.savedThisMonth)}` : "Aguardando extrato de investimentos"}
              </span>
            </div>

            <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Contabiliza Aplicações RDB, Caixinhas e Poupança</span>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
