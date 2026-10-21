import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outlined" | "panel";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const variantClasses = {
  default:
    "bg-[var(--color-surface-container-lowest)] border border-[var(--color-hairline-border)]",
  elevated: "bg-[var(--color-surface-container-lowest)] shadow-lg border-none",
  outlined: "bg-transparent border-2 border-[var(--color-border-strong)]",
  panel: "bg-[var(--color-surface-panel)] border border-[var(--color-border-subtle)]",
};

const paddingClasses = {
  none: "",
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-5 lg:p-6",
  lg: "p-6 sm:p-8 lg:p-10",
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, variant = "default", padding = "md", hover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg transition-all duration-200",
          variantClasses[variant],
          paddingClasses[padding],
          hover &&
            "hover:shadow-xl hover:border-[var(--color-primary)] hover:-translate-y-0.5 cursor-pointer",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Card.displayName = "Card";

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  divider?: boolean;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, action, divider = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-start justify-between gap-4 mb-4",
          divider && "pb-3 border-b border-[var(--color-hairline-border)]",
          className,
        )}
        {...props}
      >
        <div className="flex-1 min-w-0">{children}</div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    );
  },
);
CardHeader.displayName = "CardHeader";

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  subtitle?: React.ReactNode;
}

export const CardTitle = ({ children, className, subtitle }: CardTitleProps) => (
  <div className={cn("space-y-1", className)}>
    <h3 className="font-headline-sm text-headline-sm text-[var(--color-on-surface)] font-semibold tracking-tight">
      {children}
    </h3>
    {subtitle && (
      <p className="font-body-sm text-body-sm text-[var(--color-on-surface-muted)]">{subtitle}</p>
    )}
  </div>
);

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
    </div>
  ),
);
CardContent.displayName = "CardContent";

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, divider = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-end gap-2 mt-4",
        divider && "pt-3 border-t border-[var(--color-hairline-border)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
CardFooter.displayName = "CardFooter";
