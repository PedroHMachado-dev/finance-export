import React from 'react';
import { Target, CheckCircle2, Pencil, Trash2, PiggyBank, Plus } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

function GoalCard({ goal, totalSaved, onEdit, onDelete }) {
  const target = Number(goal.targetAmount || 0);
  const progress = target > 0 ? Math.min(100, (totalSaved / target) * 100) : 0;
  const isComplete = progress >= 100;
  const remaining = Math.max(0, target - totalSaved);

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`p-2 rounded-xl shrink-0 ${isComplete ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'}`}>
            {isComplete ? <CheckCircle2 className="w-4 h-4" /> : <Target className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{goal.name}</h4>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Alvo: {formatCurrency(target)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onEdit(goal)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300 transition-colors"
            aria-label={`Editar meta ${goal.name}`}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(goal)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:hover:text-rose-300 transition-colors"
            aria-label={`Excluir meta ${goal.name}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div>
        <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-emerald-500' : 'bg-indigo-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span className="font-bold text-slate-700 dark:text-slate-300">{progress.toFixed(0)}%</span>
          <span className="text-slate-500 dark:text-slate-400">
            {isComplete ? 'Meta atingida' : `Faltam ${formatCurrency(remaining)}`}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function GoalsPanel({ goals = [], totalSaved = 0, loading, onAdd, onEdit, onDelete }) {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/60 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Total Guardado nas Caixinhas
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-300 mt-0.5">
              {formatCurrency(totalSaved)}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nova Meta
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-slate-400">Carregando metas...</div>
      ) : goals.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <Target className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
          <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Você ainda não tem metas cadastradas.</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Clique em "Nova Meta" para começar a acompanhar seu progresso.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} totalSaved={totalSaved} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
