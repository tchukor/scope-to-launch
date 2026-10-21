import React from "react";
import { cn } from "@/lib/utils";

interface DataTableProps {
  children: React.ReactNode;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
  caption?: string;
}

export const DataTable = ({
  children,
  className,
  striped = true,
  hoverable = true,
  compact = false,
  stickyHeader = true,
  caption,
}: DataTableProps) => (
  <div
    className={cn(
      "overflow-x-auto border border-[var(--color-hairline-border)] rounded-lg bg-[var(--color-surface-container-lowest)]",
      className,
    )}
  >
    <table className="w-full border-collapse" role="grid">
      {caption && <caption className="sr-only">{caption}</caption>}
      <thead className={cn(stickyHeader && "sticky top-0 z-10")}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === TableHeader) {
            return React.cloneElement(child, {
              compact,
              sticky: stickyHeader,
            } as any);
          }
          return child;
        })}
      </thead>
      <tbody
        className={cn(
          "divide-y divide-[var(--color-hairline-border)]",
          striped && "even:bg-[var(--color-surface-container-low)]",
        )}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && (child.type === TableRow || child.type === "tr")) {
            return React.cloneElement(child, {
              compact,
              hoverable,
            } as any);
          }
          return child;
        })}
      </tbody>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === TableFooter) {
          return React.cloneElement(child, { compact } as any);
        }
        return null;
      })}
    </table>
  </div>
);

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
  sticky?: boolean;
}

export const TableHeader = ({
  children,
  className,
  compact = false,
  sticky = true,
}: TableHeaderProps) => (
  <tr
    className={cn(
      "bg-[var(--color-surface-container-low)] border-b-2 border-[var(--color-border-strong)]",
      sticky && "sticky top-0 z-10",
      className,
    )}
  >
    {React.Children.map(children, (child) => {
      if (React.isValidElement(child) && (child.type === TableHead || child.type === "th")) {
        return React.cloneElement(child, { compact } as any);
      }
      return child;
    })}
  </tr>
);

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
  children: React.ReactNode;
  className?: string;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  compact?: boolean;
  onClick?: () => void;
  sortDirection?: "ascending" | "descending" | "none";
}

export const TableHead = ({
  children,
  className,
  width,
  align = "left",
  sortable = false,
  compact = false,
  onClick,
  sortDirection = "none",
  scope = "col",
  style,
  ...props
}: TableHeadProps) => (
  <th
    scope={scope}
    style={{ width, ...style }}
    className={cn(
      "font-label-caps text-[11px] uppercase tracking-wider text-[var(--color-on-surface-muted)]",
      "border-r border-[var(--color-hairline-border)]",
      align === "center" && "text-center",
      align === "right" && "text-right",
      sortable &&
        "cursor-pointer select-none hover:bg-[var(--color-surface-container)] transition-colors",
      compact ? "px-2 py-2" : "px-3 py-2.5",
      className,
    )}
    onClick={onClick}
    aria-sort={sortDirection !== "none" ? sortDirection : undefined}
    {...props}
  >
    <div className="flex items-center justify-center gap-1">
      {children}
      {sortable && sortDirection !== "none" && (
        <span className="material-symbols-outlined text-[12px] text-[var(--color-primary)]">
          {sortDirection === "ascending" ? "arrow_upward" : "arrow_downward"}
        </span>
      )}
    </div>
  </th>
);

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
  hoverable?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export const TableRow = ({
  children,
  className,
  compact = false,
  hoverable = true,
  selected = false,
  onClick,
  ...props
}: TableRowProps) => (
  <tr
    className={cn(
      "transition-colors duration-150",
      hoverable && !onClick && "hover:bg-[var(--color-surface-container-low)]",
      onClick && "cursor-pointer hover:bg-[var(--color-surface-container)]",
      selected && "bg-[var(--color-primary-light)]",
      compact ? "" : "",
      className,
    )}
    onClick={onClick}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={
      onClick
        ? (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onClick();
            }
          }
        : undefined
    }
    {...props}
  >
    {React.Children.map(children, (child) => {
      if (React.isValidElement(child) && (child.type === TableCell || child.type === "td")) {
        return React.cloneElement(child, { compact } as any);
      }
      return child;
    })}
  </tr>
);

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
  compact?: boolean;
  fontVariant?: "default" | "tabular" | "mono";
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  color?: "default" | "muted" | "primary" | "success" | "warning" | "error";
  nowrap?: boolean;
}

export const TableCell = ({
  children,
  className,
  align = "left",
  compact = false,
  fontVariant = "default",
  fontWeight = "normal",
  color = "default",
  nowrap = false,
  ...props
}: TableCellProps) => {
  const fontClasses = {
    default: "font-body-sm",
    tabular: "font-tabular-sm tabular-nums",
    mono: "font-mono",
  };

  const weightClasses = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const colorClasses = {
    default: "text-[var(--color-on-surface)]",
    muted: "text-[var(--color-on-surface-muted)]",
    primary: "text-[var(--color-primary)]",
    success: "text-[var(--color-success)]",
    warning: "text-[var(--color-tertiary)]",
    error: "text-[var(--color-error)]",
  };

  return (
    <td
      className={cn(
        "border-r border-[var(--color-hairline-border)]",
        align === "center" && "text-center",
        align === "right" && "text-right",
        nowrap && "whitespace-nowrap",
        fontClasses[fontVariant],
        weightClasses[fontWeight],
        colorClasses[color],
        compact ? "px-2 py-1.5" : "px-3 py-2",
        className,
      )}
      {...props}
    >
      {children}
    </td>
  );
};

interface TableFooterProps {
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export const TableFooter = ({ children, className, compact = false }: TableFooterProps) => (
  <tfoot className="bg-[var(--color-surface-container-low)] border-t-2 border-[var(--color-border-strong)]">
    <tr>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && (child.type === TableCell || child.type === "td")) {
          return React.cloneElement(child, { compact, fontWeight: "semibold" } as any);
        }
        return child;
      })}
    </tr>
  </tfoot>
);

interface TableActionCellProps {
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export const TableActionCell = ({ children, className, compact = false }: TableActionCellProps) => (
  <td
    className={cn(
      "flex items-center justify-end gap-1.5",
      "border-r border-[var(--color-hairline-border)]",
      compact ? "px-2 py-1.5" : "px-3 py-2",
      className,
    )}
  >
    {children}
  </td>
);
