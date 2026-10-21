import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info" | "neutral" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: React.ReactNode;
  dot?: boolean;
}

// Internal type allowing undefined for spread compatibility
type BadgePropsInternal = BadgeProps & { variant?: BadgeProps["variant"] | undefined };

const variantClasses = {
  default: "bg-[var(--color-primary-light)] text-[var(--color-on-primary-container)] border-none",
  success: "bg-[var(--color-success-light)] text-[var(--color-on-success-container)] border-none",
  warning: "bg-[var(--color-tertiary-light)] text-[var(--color-on-tertiary-container)] border-none",
  error: "bg-[var(--color-error-light)] text-[var(--color-on-error-container)] border-none",
  info: "bg-[var(--color-info-light)] text-[var(--color-on-info-container)] border-none",
  neutral:
    "bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] border-none",
  outline:
    "bg-transparent text-[var(--color-on-surface-variant)] border border-[var(--color-border-strong)]",
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-[10px] font-label-caps gap-1",
  md: "px-2.5 py-1 text-xs font-medium gap-1.5",
  lg: "px-3 py-1.5 text-sm font-semibold gap-2",
};

export const Badge = ({
  children,
  variant = "default",
  size = "md",
  className,
  icon,
  dot = false,
}: BadgePropsInternal) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-full border-none",
        "transition-colors duration-200",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full flex-shrink-0",
            variant === "success" && "bg-[var(--color-success)]",
            variant === "warning" && "bg-[var(--color-tertiary)]",
            variant === "error" && "bg-[var(--color-error)]",
            variant === "info" && "bg-[var(--color-info)]",
            variant === "default" && "bg-[var(--color-primary)]",
            variant === "neutral" && "bg-[var(--color-on-surface-muted)]",
            variant === "outline" && "bg-current",
          )}
        />
      )}
      {icon && (
        <span className="flex-shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="truncate">{children}</span>
    </span>
  );
};

interface StatusBadgeProps {
  status: "qualified" | "unqualified" | "pending" | "active" | "inactive" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

const statusConfig: Record<
  StatusBadgeProps["status"],
  { label: string; variant: BadgeProps["variant"]; icon: string }
> = {
  qualified: { label: "Qualified", variant: "success", icon: "verified" },
  unqualified: { label: "Below Cutoff", variant: "error", icon: "block" },
  pending: { label: "Pending", variant: "warning", icon: "hourglass_empty" },
  active: { label: "Active", variant: "success", icon: "check_circle" },
  inactive: { label: "Inactive", variant: "neutral", icon: "pause_circle" },
  warning: { label: "Warning", variant: "warning", icon: "warning" },
  error: { label: "Error", variant: "error", icon: "error" },
};

export const StatusBadge = ({
  status,
  size = "md",
  showIcon = true,
  className,
}: StatusBadgeProps) => {
  const config = statusConfig[status];
  return (
    <Badge
      variant={config.variant}
      size={size}
      className={className}
      icon={
        showIcon ? (
          <span className="material-symbols-outlined text-[12px]">{config.icon}</span>
        ) : undefined
      }
      dot={!showIcon}
    >
      {config.label}
    </Badge>
  );
};

// Internal type for StatusBadge to satisfy exactOptionalPropertyTypes when spreading
type StatusBadgePropsInternal = StatusBadgeProps & {
  variant?: BadgeProps["variant"] | undefined;
  icon?: React.ReactNode | undefined;
  dot?: boolean | undefined;
};

export const GradeBadge = ({
  grade,
  size = "md",
  className,
}: {
  grade: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) => {
  const g = grade.trim().toUpperCase();

  let variant: BadgeProps["variant"] = "default";

  if (g === "A" || g === "A-" || g === "B+") variant = "default";
  else if (g === "B" || g === "B-" || g === "C+") variant = "outline";
  else if (g === "C" || g === "C-" || g === "D+") variant = "warning";
  else variant = "error";

  return (
    <Badge
      variant={variant}
      size={size}
      className={cn("font-tabular-sm font-bold min-w-[28px] text-center", className)}
    >
      {grade}
    </Badge>
  );
};
