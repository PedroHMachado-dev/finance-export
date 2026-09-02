import React from 'react';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function SummaryCards({ summary, loading }) {
  if (loading && !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-slate-200 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  const balance = summary ? summary.currentBalance : 0;
  const income = summary ? summary.totalIncome : 0;
  const expense = summary ? summary.totalExpense : 0;
  const isPositive = balance >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Saldo Líquido */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Saldo Líquido</div>
        <div className={`text-xl font-black mt-1 ${isPositive ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'}`}>
          {formatCurrency(balance)}
        </div>
      </div>

      {/* Receitas */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Entradas (Receitas)</div>
        <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
          +{formatCurrency(income)}
        </div>
      </div>

      {/* Despesas */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Saídas (Despesas)</div>
        <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1">
          -{formatCurrency(expense)}
        </div>
      </div>
    </div>
  );
}
