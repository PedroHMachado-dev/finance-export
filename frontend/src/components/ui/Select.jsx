import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "./Card";

export function Select({ value, onValueChange, children }) {
  const [open, setOpen] = React.useState(false);
  const selectRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className="relative inline-block text-left">
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: () => setOpen(!open),
            value,
          });
        }
        if (child.type === SelectContent && open) {
          return React.cloneElement(child, {
            onSelect: (val) => {
              onValueChange(val);
              setOpen(false);
            },
            selectedValue: value,
          });
        }
        return null;
      })}
    </div>
  );
}

export function SelectTrigger({ className, children, onClick, value, ariaLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "flex h-9 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800",
        className
      )}
    >
      {children}
      <ChevronDown className="h-3.5 w-3.5 opacity-50 ml-2" />
    </button>
  );
}

export function SelectValue({ placeholder, value }) {
  return <span>{placeholder || value}</span>;
}

export function SelectContent({ className, children, onSelect, selectedValue }) {
  return (
    <div
      className={cn(
        "absolute right-0 z-50 mt-1 min-w-[9rem] overflow-hidden rounded-xl border border-slate-200 bg-white p-1 text-slate-950 shadow-lg animate-in fade-in zoom-in-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100",
        className
      )}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        return React.cloneElement(child, {
          onSelect,
          isSelected: child.props.value === selectedValue,
        });
      })}
    </div>
  );
}

export function SelectItem({ className, children, value, onSelect, isSelected }) {
  return (
    <div
      onClick={() => onSelect(value)}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-lg px-2.5 py-1.5 text-xs font-medium outline-none transition-colors hover:bg-slate-100 dark:hover:bg-slate-800",
        isSelected && "bg-emerald-50 text-emerald-700 font-semibold dark:bg-emerald-950/60 dark:text-emerald-400",
        className
      )}
    >
      {children}
    </div>
  );
}
