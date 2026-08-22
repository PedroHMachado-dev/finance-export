import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { formatCurrency } from "../../utils/formatters";
import { Calendar, CreditCard, Landmark, ArrowUpRight, ArrowDownRight } from "lucide-react";

// Tooltip Customizado no Hover com Receitas e Despesas
const CustomAreaTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const dateFormatted = data.date ? data.date.split("-").reverse().join("/") : label;
    const accountVal = data.accountExpense || 0;
    const cardVal = data.cardExpense || 0;
    const totalVal = data.totalExpense || 0;
    const incomeVal = data.income || 0;

    return (
      <div className="bg-slate-900/95 dark:bg-slate-950/95 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md min-w-[200px] text-xs space-y-2 pointer-events-none z-50 animate-in fade-in zoom-in-95 duration-100">
        <div className="font-bold text-slate-200 border-b border-slate-700/80 pb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {dateFormatted}
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-mono">Movimentação</span>
        </div>

        <div className="space-y-1.5">
          {/* Receitas em Verde */}
          <div className="flex items-center justify-between text-emerald-400">
            <span className="flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              Receita:
            </span>
            <span className="font-bold">{formatCurrency(incomeVal)}</span>
          </div>

          {/* Despesas da Conta / Pix */}
          <div className="flex items-center justify-between text-rose-400">
            <span className="flex items-center gap-1">
              <Landmark className="w-3 h-3 text-rose-500" />
              Conta / Pix:
            </span>
            <span className="font-bold">{formatCurrency(accountVal)}</span>
          </div>

          {/* Gastos de Cartão */}
          <div className="flex items-center justify-between text-purple-300">
            <span className="flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-purple-400" />
              Cartão:
            </span>
            <span className="font-bold">{formatCurrency(cardVal)}</span>
          </div>

          {/* Total de Saídas no Dia */}
          <div className="flex items-center justify-between font-extrabold text-white pt-1 border-t border-slate-700/60">
            <span>Total Saídas:</span>
            <span className="text-rose-300">-{formatCurrency(totalVal)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function MonthlyAreaChart({ data = [] }) {
  const [timeRange, setTimeRange] = React.useState("all");

  const filteredData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    if (timeRange === "all") return data;

    const daysCount = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    return data.slice(-daysCount);
  }, [data, timeRange]);

  const totals = React.useMemo(() => {
    const totalExp = filteredData.reduce((acc, curr) => acc + (curr.totalExpense || 0), 0);
    const accountExp = filteredData.reduce((acc, curr) => acc + (curr.accountExpense || 0), 0);
    const cardExp = filteredData.reduce((acc, curr) => acc + (curr.cardExpense || 0), 0);
    const totalInc = filteredData.reduce((acc, curr) => acc + (curr.income || 0), 0);
    return { totalExp, accountExp, cardExp, totalInc };
  }, [filteredData]);

  return (
    <Card className="overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 py-4 px-6 bg-slate-50/50 dark:bg-slate-900/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <CardTitle>Gráfico 1: Controle Mensal (Fluxo Diário)</CardTitle>
          </div>
          <CardDescription className="mt-1">
            Visualização comparativa de <strong className="text-emerald-600 dark:text-emerald-400">Receitas</strong> vs <strong className="text-rose-500">Conta/Pix</strong> e <strong className="text-purple-500">Cartão de Crédito</strong>.
          </CardDescription>
        </div>

        {/* Seletor de Período */}
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[175px] text-xs">
            <SelectValue
              placeholder={
                timeRange === "all"
                  ? "Todo o Período"
                  : timeRange === "7d"
                  ? "Últimos 7 dias"
                  : timeRange === "30d"
                  ? "Últimos 30 dias"
                  : "Últimos 90 dias"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todo o Período</SelectItem>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-3 pt-6 sm:px-6">
        <div className="h-[290px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <defs>
                {/* Gradiente Verde para Receita */}
                <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                </linearGradient>
                {/* Gradiente Vermelho para Débitos da Conta */}
                <linearGradient id="fillAccount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.02} />
                </linearGradient>
                {/* Gradiente Roxo para Cartão */}
                <linearGradient id="fillCard" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={20}
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(value) => {
                  if (!value) return "";
                  const parts = String(value).split("-");
                  return parts.length === 3 ? `${parts[2]}/${parts[1]}` : value;
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
                content={<CustomAreaTooltip />}
                cursor={{ stroke: '#10B981', strokeWidth: 1.5, strokeDasharray: '4 4' }}
              />

              {/* Área 1: Receitas (Verde) */}
              <Area
                dataKey="income"
                name="Receitas"
                type="monotone"
                fill="url(#fillIncome)"
                stroke="#10B981"
                strokeWidth={2.5}
              />

              {/* Área 2: Conta / Pix (Vermelho) */}
              <Area
                dataKey="accountExpense"
                name="Conta / Pix"
                type="monotone"
                fill="url(#fillAccount)"
                stroke="#EF4444"
                strokeWidth={2}
                stackId="expense"
              />

              {/* Área 3: Cartão de Crédito (Roxo) */}
              <Area
                dataKey="cardExpense"
                name="Cartão de Crédito"
                type="monotone"
                fill="url(#fillCard)"
                stroke="#8B5CF6"
                strokeWidth={2}
                stackId="expense"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Rodapé Explicativo e Legenda com Valores */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
          {/* Receitas */}
          <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
            <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Receitas no Período:</span>
              <strong className="text-slate-900 dark:text-emerald-300 font-bold">+{formatCurrency(totals.totalInc)}</strong>
            </div>
          </div>

          {/* Conta / Pix */}
          <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
            <span className="w-3 h-3 rounded-full bg-rose-500 flex-shrink-0" />
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Conta / Pix:</span>
              <strong className="text-slate-900 dark:text-rose-300 font-bold">-{formatCurrency(totals.accountExp)}</strong>
            </div>
          </div>

          {/* Cartão de Crédito */}
          <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
            <span className="w-3 h-3 rounded-full bg-purple-500 flex-shrink-0" />
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Cartão de Crédito:</span>
              <strong className="text-slate-900 dark:text-purple-300 font-bold">-{formatCurrency(totals.cardExp)}</strong>
            </div>
          </div>

          {/* Total Saídas */}
          <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="w-3 h-3 rounded-full bg-slate-900 dark:bg-white flex-shrink-0" />
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Total de Saídas:</span>
              <strong className="text-slate-900 dark:text-white font-bold">-{formatCurrency(totals.totalExp)}</strong>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
