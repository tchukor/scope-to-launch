import React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "success";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  asChild?: boolean;
  /** Adornment rendered before or after the label. */
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const variantClasses = {
  primary: `
    bg-[var(--color-primary)] text-[var(--color-on-primary)]
    hover:bg-[var(--color-primary-hover)]
    active:bg-[var(--color-primary-hover)]
    focus-visible:ring-[var(--color-primary)]
    shadow-sm
  `,
  secondary: `
    bg-[var(--color-secondary)] text-[var(--color-on-secondary)]
    hover:bg-[var(--color-secondary-hover)]
    active:bg-[var(--color-secondary-hover)]
    focus-visible:ring-[var(--color-secondary)]
    shadow-sm
  `,
  outline: `
    border-2 border-[var(--color-border-strong)] bg-transparent
    text-[var(--color-on-surface)]
    hover:bg-[var(--color-surface-container-high)]
    active:bg-[var(--color-surface-container-high)]
    focus-visible:ring-[var(--color-border-strong)]
  `,
  ghost: `
    bg-transparent text-[var(--color-on-surface-variant)]
    hover:bg-[var(--color-surface-container)]
    active:bg-[var(--color-surface-container)]
    focus-visible:ring-[var(--color-border-strong)]
  `,
  destructive: `
    bg-[var(--color-error)] text-[var(--color-on-error)]
    hover:bg-[var(--color-error-hover)]
    active:bg-[var(--color-error-hover)]
    focus-visible:ring-[var(--color-error)]
    shadow-sm
  `,
  success: `
    bg-[var(--color-success)] text-[var(--color-on-success)]
    hover:bg-[var(--color-success-hover)]
    active:bg-[var(--color-success-hover)]
    focus-visible:ring-[var(--color-success)]
    shadow-sm
  `,
};

const sizeClasses = {
  sm: "h-9 px-3 text-xs font-medium gap-1.5",
  md: "h-10 px-4 text-sm font-medium gap-2",
  lg: "h-12 px-6 text-base font-semibold gap-2.5",
  icon: "h-10 w-10",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      asChild = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "active:scale-[0.98]",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          className,
        )}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && iconPosition === "left" && icon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className={cn("truncate", loading && "opacity-0")}>{children}</span>
        {!loading && iconPosition === "right" && icon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  "aria-label": string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { className, variant = "ghost", size = "md", "aria-label": ariaLabel, children, ...props },
    ref,
  ) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn("p-0 aspect-square", className)}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </Button>
    );
  },
);
IconButton.displayName = "IconButton";
