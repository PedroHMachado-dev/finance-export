import * as React from "react";
import { Tooltip, Legend } from "recharts";
import { cn } from "./Card";

export function ChartContainer({ config, className, children }) {
  // Converte configurações de cores para variáveis de estilo CSS
  const styleVariables = React.useMemo(() => {
    const vars = {};
    if (config) {
      Object.entries(config).forEach(([key, conf]) => {
        if (conf.color) {
          vars[`--color-${key}`] = conf.color;
        }
      });
    }
    return vars;
  }, [config]);

  return (
    <div
      style={styleVariables}
      className={cn("w-full text-xs [&_.recharts-cartesian-axis-tick_text]:fill-slate-500", className)}
    >
      {children}
    </div>
  );
}

export function ChartTooltip({ content, cursor = false, ...props }) {
  return <Tooltip cursor={cursor} content={content} {...props} />;
}

export function ChartTooltipContent({ active, payload, label, labelFormatter, indicator = "dot", className, nameKey }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const formattedLabel = labelFormatter ? labelFormatter(label) : label;

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-700 bg-slate-900/95 px-3 py-2 text-xs text-white shadow-xl backdrop-blur-md min-w-[140px] space-y-1.5",
        className
      )}
    >
      {formattedLabel && (
        <div className="font-semibold text-slate-200 border-b border-slate-700/80 pb-1">
          {formattedLabel}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((item, index) => {
          const color = item.color || item.payload?.fill || "#10B981";
          const name = item.name || item.dataKey;
          const formattedValue = typeof item.value === "number"
            ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.value)
            : item.value;

          return (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-slate-300">
                {indicator === "dot" && (
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                )}
                <span>{name}:</span>
              </div>
              <span className="font-bold text-white">{formattedValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ChartLegend({ content, ...props }) {
  return <Legend content={content} {...props} />;
}

export function ChartLegendContent({ payload }) {
  if (!payload || !payload.length) return null;

  return (
    <div className="flex items-center justify-end gap-4 pt-3 text-xs text-slate-600">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}
