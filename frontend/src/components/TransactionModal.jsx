import React, { useState, useEffect } from 'react';
import { X, Check, DollarSign, Calendar, Tag, FileText, Loader2 } from 'lucide-react';
import { financeApi } from '../api/client';

export default function TransactionModal({
  isOpen,
  onClose,
  onSaveSuccess,
  editingTransaction,
  categories = [],
}) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    type: 'DESPESA',
    description: '',
    categoryId: '',
    notes: '',
    source: 'Manual',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        date: editingTransaction.date || '',
        amount: editingTransaction.amount || '',
        type: editingTransaction.type || 'DESPESA',
        description: editingTransaction.description || '',
        categoryId: editingTransaction.categoryId || '',
        notes: editingTransaction.notes || '',
        source: editingTransaction.source || 'Manual',
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        type: 'DESPESA',
        description: '',
        categoryId: categories.length > 0 ? categories[0].id : '',
        notes: '',
        source: 'Manual',
      });
    }
  }, [editingTransaction, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      setError("A descrição é obrigatória.");
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError("Informe um valor válido maior que zero.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        categoryId: formData.categoryId ? parseInt(formData.categoryId, 10) : null,
      };

      if (editingTransaction?.id) {
        await financeApi.updateTransaction(editingTransaction.id, payload);
      } else {
        await financeApi.createTransaction(payload);
      }

      if (onSaveSuccess) onSaveSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erro ao salvar transação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingTransaction ? "Editar Transação" : "Nova Transação"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Preencha os dados do lançamento financeiro</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Tipo (Receita / Despesa) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'DESPESA' })}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                formData.type === 'DESPESA'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
              }`}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'RECEITA' })}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                formData.type === 'RECEITA'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
              }`}
            >
              Receita
            </button>
          </div>

          {/* Valor */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Valor (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">R$</span>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0,00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-10 pr-4 py-2 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Descrição
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Supermercado, Salário, Internet"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Data e Categoria */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Data
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Categoria
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Selecione</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Observações (Opcional)
            </label>
            <input
              type="text"
              placeholder="Anotação adicional..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800 font-medium">
              {error}
            </p>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-5 py-2 text-xs font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Check className="w-4 h-4 mr-1.5" />}
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
