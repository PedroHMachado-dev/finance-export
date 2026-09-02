import React, { useState, useEffect, useCallback } from 'react';
import SummaryCards from './components/SummaryCards';
import FilterBar from './components/FilterBar';
import TransactionTable from './components/TransactionTable';
import FileUploadModal from './components/FileUploadModal';
import TransactionModal from './components/TransactionModal';
import { MonthlyAreaChart } from './components/charts/MonthlyAreaChart';
import { WeeklyLineChart } from './components/charts/WeeklyLineChart';
import { SavingsTrendChart } from './components/charts/SavingsTrendChart';
import Sidebar from './components/Sidebar';
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
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  ScrollText,
  Sparkles,
  Wrench,
  ShieldCheck,
  X,
  CalendarRange,
} from 'lucide-react';
import { formatCurrency } from './utils/formatters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/Select';

const DEFAULT_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#A855F7',
  '#64748B', '#06B6D4'
];

function DayMovementsDialog({ details, onClose }) {
  if (!details) return null;

  const formattedDate = details.date.split('-').reverse().join('/');
  const income = details.transactions
    .filter((transaction) => transaction.type === 'RECEITA')
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);
  const expense = details.transactions
    .filter((transaction) => transaction.type === 'DESPESA')
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 backdrop-blur-[2px] p-4 animate-in fade-in duration-200"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Movimentações de ${formattedDate}`}
        className="w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-3xl border border-slate-700 bg-slate-950 text-white shadow-2xl animate-in zoom-in-75 duration-300"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-800 p-2.5 text-slate-300">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black">{formattedDate}</h3>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Movimentações do dia</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 text-slate-400 transition-colors hover:border-slate-500 hover:bg-slate-800 hover:text-white"
            aria-label="Fechar detalhes das movimentações"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 border-b border-slate-800 p-4 sm:px-6">
          <div className="rounded-2xl border border-emerald-900/60 bg-emerald-950/30 p-3">
            <span className="flex items-center gap-1 text-xs text-emerald-400"><ArrowUpRight className="h-4 w-4" /> Receitas</span>
            <strong className="mt-1 block text-emerald-300">+{formatCurrency(income)}</strong>
          </div>
          <div className="rounded-2xl border border-rose-900/60 bg-rose-950/30 p-3">
            <span className="flex items-center gap-1 text-xs text-rose-400"><ArrowDownRight className="h-4 w-4" /> Despesas</span>
            <strong className="mt-1 block text-rose-300">-{formatCurrency(expense)}</strong>
          </div>
        </div>

        <div className="max-h-[48vh] overflow-y-auto p-4 sm:px-6">
          {details.loading ? (
            <div className="py-12 text-center text-sm text-slate-400">Carregando movimentações...</div>
          ) : details.transactions.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">Nenhuma movimentação encontrada neste dia.</div>
          ) : (
            <div className="space-y-2">
              {details.transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-slate-100">{transaction.description}</div>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: transaction.categoryColor || '#64748b' }} />
                      <span>{transaction.categoryName || 'Sem categoria'}</span>
                    </div>
                  </div>
                  <strong className={`shrink-0 text-sm ${transaction.type === 'RECEITA' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {transaction.type === 'RECEITA' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GlobalPeriodFilter({ value, onChange }) {
  const labels = {
    ALL: 'Todo o período',
    '2026-07': 'Julho / 2026',
    '2026-06': 'Junho / 2026',
    '2026-05': 'Maio / 2026',
  };

  return (
    <div className="flex min-w-[190px] items-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
        <CalendarRange className="h-4 w-4" />
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 flex-1 border-0 bg-transparent px-2 shadow-none dark:bg-transparent" ariaLabel="Filtrar painel por período">
          <SelectValue placeholder={labels[value]} />
        </SelectTrigger>
        <SelectContent className="min-w-[170px]">
          <SelectItem value="ALL">Todo o período</SelectItem>
          <SelectItem value="2026-07">Julho / 2026</SelectItem>
          <SelectItem value="2026-06">Junho / 2026</SelectItem>
          <SelectItem value="2026-05">Maio / 2026</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function MainContent() {
  // Navegação: 'overview' | 'cards' | 'savings' | 'transactions'
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem('finance_sidebar_collapsed') === 'true');

  // Filtros
  const [selectedPeriod, setSelectedPeriod] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  // Dados
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [dayDetails, setDayDetails] = useState(null);
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
      const dashboardParams = selectedCategoryId
        ? { ...queryParams, categoryId: selectedCategoryId }
        : queryParams;

      const year = selectedPeriod !== 'ALL' ? parseInt(selectedPeriod.split('-')[0], 10) : 2026;

      const [
        summaryRes,
        catRes,
        dailyRes,
        weeklyRes,
        savingsRes,
        txRes,
      ] = await Promise.all([
        financeApi.getSummary(dashboardParams),
        financeApi.getByCategory('DESPESA', queryParams),
        financeApi.getDailyExpenses(dashboardParams),
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
  }, [getDateRange, selectedPeriod, selectedType, searchTerm, currentPage, selectedCategoryId]);

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

  const selectedCategory = React.useMemo(
    () => categoryData.find((category) => category.categoryId === selectedCategoryId) || null,
    [categoryData, selectedCategoryId]
  );

  const toggleCategory = (categoryId) => {
    setSelectedCategoryId((current) => current === categoryId ? null : categoryId);
  };

  const openDayMovements = async (date) => {
    setDayDetails({ date, transactions: [], loading: true });
    try {
      const response = await financeApi.getTransactions({
        startDate: date,
        endDate: date,
        page: 0,
        size: 200,
        sortBy: 'id',
        direction: 'desc',
      });
      const transactionsForChart = (response.content || []).filter((transaction) =>
        transaction.type === 'RECEITA' ||
        (!/RDB|INVESTIMENTO|CAIXINHA/i.test(transaction.categoryName || transaction.description || '') &&
          (!selectedCategoryId || transaction.categoryId === selectedCategoryId))
      );
      setDayDetails({ date, transactions: transactionsForChart, loading: false });
    } catch (error) {
      console.error('Erro ao carregar movimentações do dia:', error);
      setDayDetails({ date, transactions: [], loading: false });
    }
  };

  // Itens da barra flutuante Dock (React Bits)
  const navigationItems = [
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
      icon: <ScrollText size={20} />,
      label: 'Changelog',
      onClick: () => setActiveTab('changelog'),
      active: activeTab === 'changelog',
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

  const changeSidebarState = (collapsed) => {
    setSidebarCollapsed(collapsed);
    localStorage.setItem('finance_sidebar_collapsed', String(collapsed));
  };

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Sidebar items={navigationItems} collapsed={sidebarCollapsed} onCollapsedChange={changeSidebarState} />
      <div className={`flex min-h-screen min-w-0 flex-col transition-[padding] duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
      {/* Conteúdo Centralizado e Minimalista */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* ========================================================= */}
        {/* ABA 1: VISÃO GERAL */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_auto]">
              <SummaryCards summary={summary} loading={loading} />
              <GlobalPeriodFilter
                value={selectedPeriod}
                onChange={(period) => {
                  setSelectedPeriod(period);
                  setCurrentPage(0);
                }}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] gap-4 xl:gap-6 items-stretch">
              <div className="min-w-0">
                <MonthlyAreaChart
                  data={dailyExpenses}
                  selectedCategoryName={selectedCategory?.categoryName}
                  onDayClick={openDayMovements}
                />
              </div>

              {categoryData.length > 0 && (
              <div className="bg-white dark:bg-slate-900 p-4 xl:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Despesas por Categoria
                  </div>
                  {selectedCategory && (
                    <button type="button" onClick={() => setSelectedCategoryId(null)} className="text-xs font-medium text-emerald-500 hover:text-emerald-400">
                      Limpar: {selectedCategory.categoryName}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 items-center flex-1 min-h-0">
                  <div className="h-[clamp(16rem,32vh,26rem)]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius="46%"
                          outerRadius="86%"
                          paddingAngle={3}
                          dataKey="totalAmount"
                          nameKey="categoryName"
                          onClick={(entry) => toggleCategory(entry.categoryId ?? entry.payload?.categoryId)}
                          className="cursor-pointer outline-none"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.categoryColor || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                              opacity={!selectedCategoryId || selectedCategoryId === entry.categoryId ? 1 : 0.25}
                              stroke={selectedCategoryId === entry.categoryId ? '#ffffff' : 'transparent'}
                              strokeWidth={selectedCategoryId === entry.categoryId ? 3 : 0}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2 max-h-[clamp(14rem,30vh,24rem)] overflow-y-auto pr-1">
                    {categoryData.slice(0, 5).map((cat, idx) => (
                      <div
                        key={idx}
                        onClick={() => toggleCategory(cat.categoryId)}
                        className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition-opacity ${selectedCategoryId === cat.categoryId ? 'bg-slate-100 dark:bg-slate-700 border-emerald-500/60' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'} ${selectedCategoryId && selectedCategoryId !== cat.categoryId ? 'opacity-40' : ''}`}
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

        {activeTab === 'changelog' && (
          <div className="animate-in fade-in duration-300">
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200/80 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 px-6 py-8 dark:border-slate-800 dark:from-emerald-950/40 dark:via-slate-900 dark:to-cyan-950/30 sm:px-10">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400"><Sparkles className="h-4 w-4" /> Release notes</div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">FinanceExport v0.2.0</h1>
                      <span className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Versão provisória</span>
                    </div>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">Atualização focada em análise financeira interativa, navegação mais eficiente e melhor aproveitamento do espaço.</p>
                  </div>
                  <time className="shrink-0 text-sm font-semibold text-slate-500 dark:text-slate-400">2 de setembro de 2026</time>
                </div>
              </div>

              <div className="grid gap-8 px-6 py-8 sm:px-10 lg:grid-cols-[180px_1fr]">
                <div><span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"><Sparkles className="h-4 w-4" /> Adicionado</span></div>
                <ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-slate-600 marker:text-emerald-500 dark:text-slate-300">
                  <li>Sidebar responsiva, minimizável e com navegação móvel.</li>
                  <li>Filtro interativo por categoria integrado aos gráficos e indicadores.</li>
                  <li>Detalhamento das movimentações ao clicar em uma data do gráfico.</li>
                </ul>

                <div><span className="inline-flex items-center gap-2 rounded-xl bg-cyan-50 px-3 py-2 text-sm font-bold text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300"><Wrench className="h-4 w-4" /> Melhorado</span></div>
                <ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-slate-600 marker:text-cyan-500 dark:text-slate-300">
                  <li>Layout e gráficos responsivos para aproveitar monitores maiores.</li>
                  <li>Comparativo principal simplificado para receitas versus despesas.</li>
                  <li>Gráfico por categoria posicionado ao lado do fluxo financeiro.</li>
                  <li>Alternância consistente entre temas claro e escuro.</li>
                </ul>

                <div><span className="inline-flex items-center gap-2 rounded-xl bg-violet-50 px-3 py-2 text-sm font-bold text-violet-700 dark:bg-violet-950/40 dark:text-violet-300"><ShieldCheck className="h-4 w-4" /> Regras</span></div>
                <ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-slate-600 marker:text-violet-500 dark:text-slate-300">
                  <li>Investimentos, RDB e caixinhas não são contabilizados como despesas.</li>
                  <li>Importações permanecem protegidas contra lançamentos duplicados.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-slate-500 dark:text-slate-400 sm:flex-row lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
          <p>
            <span className="font-bold text-slate-700 dark:text-slate-200">FinanceExport</span>
            {' '}· © {new Date().getFullYear()}
          </p>
          <button type="button" onClick={() => setActiveTab('changelog')} className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-bold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-900/60">v0.2.0</button>
          </div>
        </div>
      </footer>

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

      <DayMovementsDialog details={dayDetails} onClose={() => setDayDetails(null)} />
      </div>
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
