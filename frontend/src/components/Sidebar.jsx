import React, { useState } from 'react';
import { Menu, Moon, PanelLeftClose, PanelLeftOpen, Sun, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar({ items, collapsed, onCollapsedChange }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const renderItem = (item, index) => (
    <button
      key={index}
      type="button"
      onClick={() => {
        item.onClick();
        setMobileOpen(false);
      }}
      title={collapsed ? item.label : undefined}
      className={`group relative grid w-full grid-cols-[32px_minmax(0,1fr)] items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-left transition-colors ${item.active ? 'bg-emerald-500/15 text-emerald-500' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white'}`}
    >
      <span className="flex w-8 shrink-0 items-center justify-center">{item.icon}</span>
      {!collapsed && <span className="truncate text-sm font-semibold">{item.label}</span>}
      {item.active && <span className="absolute left-0 h-6 w-1 rounded-r-full bg-emerald-500" />}
    </button>
  );

  const content = (
    <>
      <div className="flex flex-col gap-2 border-b border-slate-200/80 p-3 dark:border-slate-800">
        <button
          type="button"
          onClick={() => onCollapsedChange(!collapsed)}
          className="hidden h-9 w-full grid-cols-[32px_minmax(0,1fr)] items-center gap-3 overflow-hidden rounded-xl px-3 text-slate-500 transition-colors hover:bg-slate-100 hover:text-emerald-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-emerald-400 lg:grid"
          aria-label={collapsed ? 'Expandir menu' : 'Minimizar menu'}
        >
          <span className="flex w-8 items-center justify-center">{collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}</span>
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          className="grid h-9 w-full grid-cols-[32px_minmax(0,1fr)] items-center gap-3 overflow-hidden rounded-xl px-3 text-left text-slate-500 transition-colors hover:bg-slate-100 hover:text-amber-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-amber-400"
          aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
        >
          <span className="flex w-8 items-center justify-center">{isDark ? <Sun size={20} /> : <Moon size={20} />}</span>
          {!collapsed && <span className="text-sm font-semibold">{isDark ? 'Tema claro' : 'Tema escuro'}</span>}
        </button>
        <button type="button" onClick={() => setMobileOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden" aria-label="Fechar menu"><X size={18} /></button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.slice(0, 5).map(renderItem)}
        <div className="my-3 border-t border-slate-200/80 dark:border-slate-800" />
        {items.slice(5).map(renderItem)}
      </nav>

    </>
  );

  return (
    <>
      <button type="button" onClick={() => setMobileOpen(true)} className="fixed left-4 top-4 z-50 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:text-white lg:hidden" aria-label="Abrir menu"><Menu size={20} /></button>
      {mobileOpen && <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-[60] flex flex-col border-r border-slate-200/80 bg-white/95 shadow-xl backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950/95 lg:z-40 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${collapsed ? 'w-20' : 'w-72'}`}>
        {content}
      </aside>
    </>
  );
}
