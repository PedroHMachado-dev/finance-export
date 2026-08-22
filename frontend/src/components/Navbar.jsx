import React from 'react';
import { Wallet2, Sparkles, Sun, Moon, UploadCloud, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({
  selectedPeriod,
  onPeriodChange,
  onOpenUpload,
  onOpenNewTransaction,
}) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo Minimalista */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center text-white shadow-sm">
            <Wallet2 className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
            Finance<span className="text-emerald-500">Export</span>
          </span>
        </div>

        {/* Controles do Cabeçalho */}
        <div className="flex items-center space-x-2">
          {/* Seletor de Período Compacto */}
          <select
            value={selectedPeriod}
            onChange={(e) => onPeriodChange(e.target.value)}
            className="text-xs font-bold py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL">Todo o Período</option>
            <option value="2026-07">Julho / 2026</option>
            <option value="2026-06">Junho / 2026</option>
            <option value="2026-05">Maio / 2026</option>
          </select>

          {/* Alternador de Tema */}
          <button
            onClick={toggleTheme}
            aria-label="Alternar tema"
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>
      </div>
    </header>
  );
}
