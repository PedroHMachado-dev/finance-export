import React from 'react';
import { Search, Calendar, Filter } from 'lucide-react';

export default function FilterBar({
  selectedPeriod,
  onPeriodChange,
  selectedType,
  onTypeChange,
  searchTerm,
  onSearchChange,
  totalResults = 0,
}) {
  const periods = [
    { value: 'ALL', label: 'Todo o Período' },
    { value: '2026-09', label: 'Setembro / 2026' },
    { value: '2026-08', label: 'Agosto / 2026' },
    { value: '2026-07', label: 'Julho / 2026' },
    { value: '2026-06', label: 'Junho / 2026' },
    { value: '2026-05', label: 'Maio / 2026' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors duration-200">
      {/* Busca */}
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar estabelecimento, Pix..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
        />
      </div>

      {/* Filtros de Tipo e Período */}
      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
        {/* Seletor de Tipo */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
          <button
            onClick={() => onTypeChange('ALL')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              selectedType === 'ALL'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => onTypeChange('RECEITA')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              selectedType === 'RECEITA'
                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-emerald-600 dark:text-slate-400'
            }`}
          >
            Receitas
          </button>
          <button
            onClick={() => onTypeChange('DESPESA')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              selectedType === 'DESPESA'
                ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 shadow-sm'
                : 'text-slate-500 hover:text-rose-600 dark:text-slate-400'
            }`}
          >
            Despesas
          </button>
        </div>

        {/* Seletor de Período */}
        <div className="flex items-center space-x-1.5 pl-2">
          <Calendar className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          <select
            value={selectedPeriod}
            onChange={(e) => onPeriodChange(e.target.value)}
            className="text-xs font-bold py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {periods.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
