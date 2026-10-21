import React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  children: React.ReactNode;
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  variant?: "default" | "underline" | "pills";
  orientation?: "horizontal" | "vertical";
}

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
  variant: TabsProps["variant"];
  orientation: TabsProps["orientation"];
} | null>(null);

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within Tabs");
  }
  return context;
}

export const Tabs = ({
  children,
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  variant = "default",
  orientation = "horizontal",
}: TabsProps) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const controlled = controlledValue !== undefined;
  const value = controlled ? controlledValue : uncontrolledValue;

  const handleValueChange = React.useCallback((newValue: string) => {
    if (!controlled) setUncontrolledValue(newValue);
    onValueChange?.(newValue);
  }, [controlled, onValueChange]);

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange, variant, orientation }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabsList = ({ children, className }: TabsListProps) => {
  const { orientation, variant } = useTabsContext();

  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      className={cn(
        "flex items-center gap-1",
        orientation === "vertical" && "flex-col",
        variant === "default" && "bg-[var(--color-surface-container)] p-1 rounded-lg",
        variant === "pills" && "gap-2",
        className
      )}
    >
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, children, className, disabled = false, icon }, ref) => {
    const { value: currentValue, onValueChange, variant, orientation } = useTabsContext();
    const isActive = currentValue === value;

    const baseClasses = `
      flex items-center justify-center gap-1.5
      font-medium text-sm
      rounded-md
      transition-all duration-200
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      min-h-[44px]
    `;

    const variantClasses = {
      default: `
        text-[var(--color-on-surface-muted)]
        hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)]
        data-[state=active]:bg-[var(--color-surface-container-lowest)] data-[state=active]:text-[var(--color-on-surface)] data-[state=active]:shadow-sm
      `,
      underline: `
        text-[var(--color-on-surface-muted)]
        hover:text-[var(--color-on-surface)]
        data-[state=active]:text-[var(--color-primary)] data-[state=active]:border-b-2 data-[state=active]:border-[var(--color-primary)] data-[state=active]:bg-transparent
        px-3 py-2
      `,
      pills: `
        text-[var(--color-on-surface-muted)]
        hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)]
        data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-[var(--color-on-primary)] data-[state=active]:shadow-sm
        px-4 py-2
      `,
    };

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        aria-controls={`tabs-${value}-panel`}
        id={`tabs-${value}-trigger`}
        tabIndex={isActive ? 0 : -1}
        onClick={() => !disabled && onValueChange(value)}
        disabled={disabled}
        className={cn(baseClasses, variantClasses[variant ?? "default"], orientation === "vertical" && "w-full justify-start px-3", className)}
        data-state={isActive ? "active" : "inactive"}
      >
        {icon && <span className="flex-shrink-0" aria-hidden="true">{icon}</span>}
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  forceMount?: boolean;
}

export const TabsContent = ({ value, children, className, forceMount = false }: TabsContentProps) => {
  const { value: currentValue } = useTabsContext();
  const isActive = currentValue === value;

  if (!forceMount && !isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`tabs-${value}-panel`}
      aria-labelledby={`tabs-${value}-trigger`}
      className={cn(
        "mt-4 animate-fade-in",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2",
        className
      )}
      hidden={!isActive}
      tabIndex={0}
    >
      {children}
    </div>
  );
};