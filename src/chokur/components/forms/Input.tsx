import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** Shorthand for `leftIcon`. */
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      icon,
      fullWidth = true,
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const leadingIcon = leftIcon ?? icon;
    const inputId = id || React.useId();
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId = hint ? `${inputId}-hint` : undefined;

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "font-label-caps text-[11px] uppercase tracking-wider text-[var(--color-on-surface-muted)]",
              required && "after:content-['*'] after:text-[var(--color-error)] after:ml-1"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leadingIcon && (
            <div className="absolute left-3 text-[var(--color-on-surface-muted)] pointer-events-none flex-shrink-0" aria-hidden="true">
              {leadingIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={cn(errorId, hintId)}
            className={cn(
              "w-full bg-[var(--color-surface-container-lowest)] border rounded-lg",
              "text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-disabled)]",
              "transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--color-surface-container)]",
              "hover:border-[var(--color-border-strong)]",
              leadingIcon && "pl-10",
              rightIcon && "pr-10",
              error
                ? "border-[var(--color-error)] focus-visible:ring-[var(--color-error)]"
                : "border-[var(--color-hairline-border)]",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-[var(--color-on-surface-muted)] pointer-events-none flex-shrink-0" aria-hidden="true">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-[11px] font-medium text-[var(--color-error)] flex items-center gap-1" role="alert">
            <span className="material-symbols-outlined text-[13px]">error</span>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-[11px] text-[var(--color-on-surface-muted)]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      hint,
      fullWidth = true,
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const textareaId = id || React.useId();
    const errorId = error ? `${textareaId}-error` : undefined;
    const hintId = hint ? `${textareaId}-hint` : undefined;

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              "font-label-caps text-[11px] uppercase tracking-wider text-[var(--color-on-surface-muted)]",
              required && "after:content-['*'] after:text-[var(--color-error)] after:ml-1"
            )}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={cn(errorId, hintId)}
          className={cn(
            "w-full bg-[var(--color-surface-container-lowest)] border rounded-lg resize-y min-h-[100px] p-3",
            "text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-disabled)]",
            "transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--color-surface-container)]",
            "hover:border-[var(--color-border-strong)]",
            error
              ? "border-[var(--color-error)] focus-visible:ring-[var(--color-error)]"
              : "border-[var(--color-hairline-border)]",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-[11px] font-medium text-[var(--color-error)] flex items-center gap-1" role="alert">
            <span className="material-symbols-outlined text-[13px]">error</span>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-[11px] text-[var(--color-on-surface-muted)]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  /** Rendered as a disabled first option when the value is empty. */
  placeholder?: string;
  /** Option data. Omit when passing `<option>` children instead. */
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  /** Convenience alias for `onChange`, called with the selected value. */
  onValueChange?: (value: string) => void;
  /** Icon displayed before the select (inside the wrapper). */
  leftIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      hint,
      placeholder,
      options,
      onValueChange,
      fullWidth = true,
      id,
      disabled,
      required,
      children,
      onChange,
      ...props
    },
    ref
  ) => {
    const selectId = id || React.useId();
    const errorId = error ? `${selectId}-error` : undefined;
    const hintId = hint ? `${selectId}-hint` : undefined;

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              "font-label-caps text-[11px] uppercase tracking-wider text-[var(--color-on-surface-muted)]",
              required && "after:content-['*'] after:text-[var(--color-error)] after:ml-1"
            )}
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={cn(errorId, hintId)}
          className={cn(
            "w-full bg-[var(--color-surface-container-lowest)] border rounded-lg py-2.5 pl-3 pr-10 appearance-none",
            "text-[var(--color-on-surface)]",
            "transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--color-surface-container)]",
            "hover:border-[var(--color-border-strong)]",
            error
              ? "border-[var(--color-error)] focus-visible:ring-[var(--color-error)]"
              : "border-[var(--color-hairline-border)]",
            className
          )}
          onChange={(e) => {
            onChange?.(e);
            onValueChange?.(e.target.value);
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && (
          <p id={errorId} className="text-[11px] font-medium text-[var(--color-error)] flex items-center gap-1" role="alert">
            <span className="material-symbols-outlined text-[13px]">error</span>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-[11px] text-[var(--color-on-surface-muted)]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";