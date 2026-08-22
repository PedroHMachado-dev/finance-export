import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import {
  PieChart as PieIcon,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { MonthlyAreaChart } from './charts/MonthlyAreaChart';
import { WeeklyLineChart } from './charts/WeeklyLineChart';
import { SavingsTrendChart } from './charts/SavingsTrendChart';
import { formatCurrency } from '../utils/formatters';

const DEFAULT_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#A855F7',
  '#64748B', '#06B6D4'
];

export default function ChartsSection({
  categoryData = [],
  dailyExpenses = [],
  weeklyExpenses = [],
  savingsTrend = [],
  selectedPeriod = '2026-07',
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'categories'

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
          <div className="font-semibold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.categoryColor || '#10B981' }} />
            {data.categoryName}
          </div>
          <div>Valor: <span className="font-bold">{formatCurrency(data.totalAmount)}</span></div>
          <div>Participação: <span className="font-bold">{data.percentage.toFixed(1)}%</span></div>
          <div>Lançamentos: <span className="font-bold">{data.count}</span></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Abas Superiores de Visualização de Gráficos */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-base font-bold text-slate-900">Análise Visual & Gráficos</h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
            <Sparkles className="w-3 h-3 mr-1" /> 3 Gráficos Ativos
          </span>
        </div>

        <div className="flex items-center p-1 bg-slate-200/60 rounded-xl">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Painel 3 Gráficos
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'categories'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Categorias & Detalhes
          </button>
        </div>
      </div>

      {activeTab === 'all' ? (
        <div className="space-y-6">
          {/* Gráfico 1: Controle Mensal (Área Interativa com Seletor) */}
          <MonthlyAreaChart
            data={dailyExpenses}
            selectedPeriod={selectedPeriod}
          />

          {/* Grid com Gráficos 2 e 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico 2: Controle Semanal */}
            <WeeklyLineChart data={weeklyExpenses} />

            {/* Gráfico 3: Comparativo Dinheiro Guardado */}
            <SavingsTrendChart data={savingsTrend} />
          </div>
        </div>
      ) : (
        /* Aba de Categorias e Distribuição */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                <PieIcon className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Distribuição por Categoria</h4>
            </div>

            {categoryData.length > 0 ? (
              <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="totalAmount"
                      nameKey="categoryName"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.categoryColor || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
                Nenhum dado de categoria no período.
              </div>
            )}
          </div>

          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <h4 className="font-bold text-slate-900 text-base mb-4">Resumo das Categorias</h4>
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {categoryData.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center space-x-2 truncate">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.categoryColor || DEFAULT_COLORS[idx % DEFAULT_COLORS.length] }}
                    />
                    <span className="text-slate-800 font-semibold truncate">{cat.categoryName}</span>
                  </div>
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <span className="font-bold text-slate-900">{formatCurrency(cat.totalAmount)}</span>
                    <span className="text-slate-400 font-medium">({cat.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
