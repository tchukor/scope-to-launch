import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { X } from "lucide-react";

interface SheetProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: "left" | "right" | "bottom";
  className?: string;
}

export const Sheet = ({
  children,
  open,
  onOpenChange,
  side = "right",
  className,
}: SheetProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  const sideClasses = {
    left: "left-0",
    right: "right-0",
    bottom: "bottom-0 left-0 right-0",
  };

  const animationClasses = {
    left: "translate-x-[-100%] data-[state=open]:translate-x-0",
    right: "translate-x-[100%] data-[state=open]:translate-x-0",
    bottom: "translate-y-full data-[state=open]:translate-y-0",
  };

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div
        ref={contentRef}
        className={cn(
          "fixed z-50 flex flex-col bg-[var(--color-surface-container-lowest)] shadow-xl",
          "data-[state=open]:animate-slide-in",
          sideClasses[side],
          animationClasses[side],
          side === "bottom"
            ? "w-full max-h-[85vh] rounded-t-2xl border-t border-[var(--color-hairline-border)]"
            : "h-full max-w-[400px] w-full border-l border-[var(--color-hairline-border)]",
          className
        )}
        data-state={open ? "open" : "closed"}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-hairline-border)]">
          <h2 className="font-headline-sm text-headline-sm text-[var(--color-on-surface)]">Filters</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-muted)]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </>
  );
};

interface SheetTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const SheetTrigger = React.forwardRef<HTMLButtonElement, SheetTriggerProps>(
  ({ children, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className="inline-flex items-center justify-center gap-2"
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
SheetTrigger.displayName = "SheetTrigger";