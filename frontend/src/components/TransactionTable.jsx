import React from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CreditCard,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Building2,
  Layers,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function TransactionTable({
  transactions = [],
  categories = [],
  totalElements = 0,
  totalPages = 1,
  currentPage = 0,
  onPageChange,
  onEdit,
  onDelete,
  onQuickCategoryChange,
  loading = false,
}) {
  if (loading && transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 text-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-3" />
        <p className="text-xs">Carregando transações...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 text-center text-slate-400">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Layers className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">Nenhuma transação encontrada</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Tente alterar o período ou importe um novo arquivo CSV de extrato ou fatura.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-4 sm:px-6">Data</th>
              <th className="py-3.5 px-4 sm:px-6">Descrição</th>
              <th className="py-3.5 px-4 sm:px-6">Origem</th>
              <th className="py-3.5 px-4 sm:px-6">Categoria</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Valor</th>
              <th className="py-3.5 px-4 sm:px-6 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {transactions.map((tx) => {
              const isIncome = tx.type === 'RECEITA';
              const isCard = tx.source === 'Cartão de Crédito';

              return (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Data */}
                  <td className="py-3 px-4 sm:px-6 whitespace-nowrap text-slate-600 dark:text-slate-300 font-medium">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(tx.date)}</span>
                    </div>
                  </td>

                  {/* Descrição */}
                  <td className="py-3 px-4 sm:px-6 max-w-xs sm:max-w-md">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 truncate" title={tx.description}>
                      {tx.description}
                    </div>
                    {tx.notes && (
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                        {tx.notes}
                      </div>
                    )}
                  </td>

                  {/* Origem */}
                  <td className="py-3 px-4 sm:px-6 whitespace-nowrap">
                    {isCard ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
                        <CreditCard className="w-3 h-3 mr-1" /> Fatura Cartão
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                        <Building2 className="w-3 h-3 mr-1" /> Conta / Pix
                      </span>
                    )}
                  </td>

                  {/* Categoria com dropdown rápido */}
                  <td className="py-3 px-4 sm:px-6 whitespace-nowrap">
                    <select
                      value={tx.categoryId || ''}
                      onChange={(e) => onQuickCategoryChange(tx.id, e.target.value)}
                      className="text-xs font-semibold py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="">Sem Categoria</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Valor */}
                  <td className="py-3 px-4 sm:px-6 whitespace-nowrap text-right font-bold">
                    <span
                      className={`inline-flex items-center space-x-1 ${
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowUpRight className="w-3.5 h-3.5 inline mr-0.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 inline mr-0.5" />
                      )}
                      <span>{isIncome ? '+' : '-'}{formatCurrency(tx.amount)}</span>
                    </span>
                  </td>

                  {/* Ações */}
                  <td className="py-3 px-4 sm:px-6 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button
                        onClick={() => onEdit(tx)}
                        title="Editar lançamento"
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(tx.id)}
                        title="Excluir lançamento"
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Mostrando página <span className="font-bold text-slate-900 dark:text-white">{currentPage + 1}</span> de <span className="font-bold">{totalPages}</span> ({totalElements} lançamentos)
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
