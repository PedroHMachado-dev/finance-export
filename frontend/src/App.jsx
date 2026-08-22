import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import SummaryCards from './components/SummaryCards';
import FilterBar from './components/FilterBar';
import TransactionTable from './components/TransactionTable';
import FileUploadModal from './components/FileUploadModal';
import TransactionModal from './components/TransactionModal';
import { MonthlyAreaChart } from './components/charts/MonthlyAreaChart';
import { WeeklyLineChart } from './components/charts/WeeklyLineChart';
import { SavingsTrendChart } from './components/charts/SavingsTrendChart';
import Dock from './components/Dock/Dock';
import { ThemeProvider } from './context/ThemeContext';
import { financeApi } from './api/client';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import {
  LayoutDashboard,
  CreditCard,
  PiggyBank,
  FileSpreadsheet,
  Plus,
  UploadCloud,
  PieChart as PieIcon,
} from 'lucide-react';
import { formatCurrency } from './utils/formatters';

const DEFAULT_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#A855F7',
  '#64748B', '#06B6D4'
];

function MainContent() {
  // Navegação: 'overview' | 'cards' | 'savings' | 'transactions'
  const [activeTab, setActiveTab] = useState('overview');

  // Filtros
  const [selectedPeriod, setSelectedPeriod] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  // Dados
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [dailyExpenses, setDailyExpenses] = useState([]);
  const [weeklyExpenses, setWeeklyExpenses] = useState([]);
  const [savingsTrend, setSavingsTrend] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modais e Loading
  const [loading, setLoading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const getDateRange = useCallback(() => {
    if (!selectedPeriod || selectedPeriod === 'ALL') {
      return { startDate: null, endDate: null };
    }
    const [yearStr, monthStr] = selectedPeriod.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const lastDay = new Date(year, month, 0).getDate();
    return {
      startDate: `${yearStr}-${monthStr}-01`,
      endDate: `${yearStr}-${monthStr}-${String(lastDay).padStart(2, '0')}`,
    };
  }, [selectedPeriod]);

  const loadCategories = async () => {
    try {
      const data = await financeApi.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    }
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    const { startDate, endDate } = getDateRange();

    try {
      const queryParams = {};
      if (startDate) queryParams.startDate = startDate;
      if (endDate) queryParams.endDate = endDate;

      const year = selectedPeriod !== 'ALL' ? parseInt(selectedPeriod.split('-')[0], 10) : 2026;

      const [
        summaryRes,
        catRes,
        dailyRes,
        weeklyRes,
        savingsRes,
        txRes,
      ] = await Promise.all([
        financeApi.getSummary(queryParams),
        financeApi.getByCategory('DESPESA', queryParams),
        financeApi.getDailyExpenses(queryParams),
        financeApi.getWeeklyExpenses(queryParams),
        financeApi.getSavingsTrend(year),
        financeApi.getTransactions({
          page: currentPage,
          size: 10,
          sortBy: 'date',
          direction: 'desc',
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
          ...(selectedType !== 'ALL' && { type: selectedType }),
          ...(searchTerm.trim() && { search: searchTerm.trim() }),
        }),
      ]);

      setSummary(summaryRes);
      setCategoryData(catRes || []);
      setDailyExpenses(dailyRes || []);
      setWeeklyExpenses(weeklyRes || []);
      setSavingsTrend(savingsRes || []);
      setTransactions(txRes.content || []);
      setTotalElements(txRes.totalElements || 0);
      setTotalPages(txRes.totalPages || 1);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }, [getDateRange, selectedPeriod, selectedType, searchTerm, currentPage]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Totais
  const totalSavedYear = React.useMemo(() => {
    return savingsTrend.reduce((acc, curr) => acc + (curr.savedThisMonth || 0), 0);
  }, [savingsTrend]);

  const totalCardSpent = React.useMemo(() => {
    return dailyExpenses.reduce((acc, curr) => acc + (curr.cardExpense || 0), 0);
  }, [dailyExpenses]);

  const totalAccountSpent = React.useMemo(() => {
    return dailyExpenses.reduce((acc, curr) => acc + (curr.accountExpense || 0), 0);
  }, [dailyExpenses]);

  // Itens da barra flutuante Dock (React Bits)
  const dockItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: 'Visão Geral',
      onClick: () => setActiveTab('overview'),
      active: activeTab === 'overview',
    },
    {
      icon: <CreditCard size={20} />,
      label: 'Cartão & Conta',
      onClick: () => setActiveTab('cards'),
      active: activeTab === 'cards',
    },
    {
      icon: <PiggyBank size={20} />,
      label: 'Caixinhas',
      onClick: () => setActiveTab('savings'),
      active: activeTab === 'savings',
    },
    {
      icon: <FileSpreadsheet size={20} />,
      label: 'Extrato',
      onClick: () => setActiveTab('transactions'),
      active: activeTab === 'transactions',
    },
    {
      icon: <Plus size={20} className="text-emerald-500 font-bold" />,
      label: 'Nova Transação',
      onClick: () => {
        setEditingTransaction(null);
        setIsTransactionModalOpen(true);
      },
    },
    {
      icon: <UploadCloud size={20} className="text-blue-500" />,
      label: 'Importar CSV',
      onClick: () => setIsUploadModalOpen(true),
    },
  ];

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 dark:bg-slate-950/95 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
          <div className="font-semibold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.categoryColor || '#10B981' }} />
            {data.categoryName}
          </div>
          <div>Valor: <span className="font-bold">{formatCurrency(data.totalAmount)}</span></div>
          <div>Participação: <span className="font-bold">{data.percentage.toFixed(1)}%</span></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col pb-28 transition-colors duration-200">
      {/* Header Minimalista */}
      <Navbar
        selectedPeriod={selectedPeriod}
        onPeriodChange={(val) => {
          setSelectedPeriod(val);
          setCurrentPage(0);
        }}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenNewTransaction={() => {
          setEditingTransaction(null);
          setIsTransactionModalOpen(true);
        }}
      />

      {/* Conteúdo Centralizado e Minimalista */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* ========================================================= */}
        {/* ABA 1: VISÃO GERAL */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* 3 Métricas Rápidas */}
            <SummaryCards summary={summary} loading={loading} />

            {/* Gráfico 1: Controle Mensal (Gastos Diários) */}
            <MonthlyAreaChart data={dailyExpenses} />

            {/* Donut de Categorias Minimalista */}
            {categoryData.length > 0 && (
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Despesas por Categoria
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Top categorias</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-5 h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
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

                  <div className="md:col-span-7 space-y-2 max-h-48 overflow-y-auto pr-1">
                    {categoryData.slice(0, 5).map((cat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: cat.categoryColor || DEFAULT_COLORS[idx % DEFAULT_COLORS.length] }}
                          />
                          <span className="font-semibold truncate">{cat.categoryName}</span>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span className="font-bold">{formatCurrency(cat.totalAmount)}</span>
                          <span className="text-slate-400">({cat.percentage.toFixed(0)}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* ABA 2: CARTÃO VS CONTA */}
        {/* ========================================================= */}
        {activeTab === 'cards' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* 2 Métricas Comparativas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200/80 dark:border-purple-900/60 shadow-sm">
                <div className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  Fatura do Cartão de Crédito
                </div>
                <div className="text-2xl font-black text-purple-600 dark:text-purple-300 mt-1">
                  {formatCurrency(totalCardSpent)}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/60 shadow-sm">
                <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                  Gastos em Conta / Pix
                </div>
                <div className="text-2xl font-black text-rose-600 dark:text-rose-300 mt-1">
                  {formatCurrency(totalAccountSpent)}
                </div>
              </div>
            </div>

            {/* Gráfico 2: Controle Semanal */}
            <WeeklyLineChart data={weeklyExpenses} />
          </div>
        )}

        {/* ========================================================= */}
        {/* ABA 3: CAIXINHAS */}
        {/* ========================================================= */}
        {activeTab === 'savings' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Métrica de Dinheiro Guardado */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/60 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Total Guardado no Ano (Caixinhas / RDB)
                </div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-300 mt-1">
                  {formatCurrency(totalSavedYear)}
                </div>
              </div>
              <span className="text-xs text-slate-400">Patrimônio acumulado</span>
            </div>

            {/* Gráfico 3: Comparativo Dinheiro Guardado */}
            <SavingsTrendChart data={savingsTrend} />
          </div>
        )}

        {/* ========================================================= */}
        {/* ABA 4: EXTRATO & LANÇAMENTOS */}
        {/* ========================================================= */}
        {activeTab === 'transactions' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <FilterBar
              selectedPeriod={selectedPeriod}
              onPeriodChange={(val) => {
                setSelectedPeriod(val);
                setCurrentPage(0);
              }}
              selectedType={selectedType}
              onTypeChange={(val) => {
                setSelectedType(val);
                setCurrentPage(0);
              }}
              searchTerm={searchTerm}
              onSearchChange={(val) => {
                setSearchTerm(val);
                setCurrentPage(0);
              }}
              totalResults={totalElements}
            />

            <TransactionTable
              transactions={transactions}
              categories={categories}
              totalElements={totalElements}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onEdit={(tx) => {
                setEditingTransaction(tx);
                setIsTransactionModalOpen(true);
              }}
              onDelete={async (id) => {
                if (window.confirm("Deseja excluir este lançamento?")) {
                  await financeApi.deleteTransaction(id);
                  loadData();
                }
              }}
              onQuickCategoryChange={async (txId, catId) => {
                await financeApi.updateTransaction(txId, {
                  categoryId: parseInt(catId, 10),
                });
                loadData();
              }}
              loading={loading}
            />
          </div>
        )}
      </main>

      {/* Dock de Navegação Flutuante do React Bits */}
      <Dock
        items={dockItems}
        panelHeight={54}
        baseItemSize={40}
        magnification={56}
        distance={140}
      />

      {/* Modais */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={() => {
          loadCategories();
          loadData();
        }}
      />

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSaveSuccess={loadData}
        editingTransaction={editingTransaction}
        categories={categories}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
}
