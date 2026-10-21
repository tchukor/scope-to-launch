import React from "react";
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    label?: string;
    positive?: boolean;
  };
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "success" | "warning" | "error" | "info";
  className?: string;
}

const sizeClasses = {
  sm: "gap-2 p-3",
  md: "gap-3 p-4 sm:p-5",
  lg: "gap-4 p-5 sm:p-6 lg:p-8",
};

const valueSizeClasses = {
  sm: "text-xl font-display-stat",
  md: "text-2xl sm:text-3xl font-display-stat",
  lg: "text-3xl sm:text-4xl lg:text-5xl font-display-stat",
};

const labelSizeClasses = {
  sm: "text-[10px] font-label-caps",
  md: "text-xs font-label-caps",
  lg: "text-sm font-label-caps",
};

const variantColors = {
  default: "text-[var(--color-on-surface)]",
  primary: "text-[var(--color-primary)]",
  success: "text-[var(--color-success)]",
  warning: "text-[var(--color-tertiary)]",
  error: "text-[var(--color-error)]",
  info: "text-[var(--color-info)]",
};

export const StatTile = ({
  label,
  value,
  trend,
  icon,
  size = "md",
  variant = "default",
  className,
}: StatTileProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-start",
        "bg-[var(--color-surface-container-low)] border border-[var(--color-hairline-border)] rounded-lg",
        sizeClasses[size],
        className
      )}
    >
      <div className="flex items-baseline justify-between w-full gap-2">
        <div className="flex-1 min-w-0">
          <span
            className={cn(
              "block uppercase tracking-wider text-[var(--color-on-surface-muted)]",
              labelSizeClasses[size]
            )}
          >
            {label}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span
              className={cn(
                "font-bold tabular-nums leading-none",
                valueSizeClasses[size],
                variantColors[variant]
              )}
            >
              {value}
            </span>
            {icon && <span className="text-[var(--color-on-surface-muted)] shrink-0">{icon}</span>}
          </div>
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold shrink-0",
              trend.positive !== false
                ? "bg-[var(--color-success-light)] text-[var(--color-on-success-container)]"
                : "bg-[var(--color-error-light)] text-[var(--color-on-error-container)]"
            )}
          >
            {trend.positive !== false ? (
              <span className="material-symbols-outlined text-[12px]">trending_up</span>
            ) : (
              <span className="material-symbols-outlined text-[12px]">trending_down</span>
            )}
            <span>{trend.value >= 0 ? "+" : ""}{trend.value.toFixed(1)}%</span>
            {trend.label && <span className="text-[10px] opacity-80">{trend.label}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

interface StatTileGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
  gap?: "sm" | "md" | "lg";
}

const gridColumns = {
  2: "grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-4",
};

const gapClasses = {
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
};

export const StatTileGrid = ({ children, columns = 4, className, gap = "md" }: StatTileGridProps) => (
  <div
    className={cn(
      "grid",
      gridColumns[columns],
      gapClasses[gap],
      className
    )}
  >
    {children}
  </div>
);