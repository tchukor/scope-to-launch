import React from "react";

export const LoadingState: React.FC<{ message?: string; size?: "sm" | "md" | "lg" }> = ({ 
  message = "Loading...", size = "md" 
}) => {
  const sizes = { sm: "w-6 h-6", md: "w-8 h-8", lg: "w-12 h-12" };
  return (
    <div className="flex min-h-[120px] items-center justify-center bg-[#FEF9EF] text-[#111111]">
      <div className="text-center space-y-3">
        <div className={`${sizes[size]} border-2 border-[#C2410C] border-t-transparent rounded-full animate-spin mx-auto`} />
        <p className="text-sm text-[#5F5E5E]">{message}</p>
      </div>
    </div>
  );
};

export const EmptyState: React.FC<{ 
  title: string; description?: string; action?: React.ReactNode; icon?: string; className?: string;
}> = ({ title, description, action, icon = "inbox", className = "" }) => (
  <div className={`flex min-h-[200px] items-center justify-center bg-[#FEF9EF] text-[#111111] p-6 ${className}`}>
    <div className="text-center space-y-4 max-w-md">
      <div className="w-16 h-16 rounded-full bg-[#F2EDE3] flex items-center justify-center mx-auto">
        <span className="material-symbols-outlined text-[28px] text-[#5F5E5E]">{icon}</span>
      </div>
      <h3 className="font-headline-sm text-[#111111]">{title}</h3>
      {description && <p className="text-sm text-[#5F5E5E]">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  </div>
);

export const ErrorState: React.FC<{ 
  title?: string; message: string; onRetry?: () => void; onGoBack?: () => void; className?: string;
}> = ({ title = "Something went wrong", message, onRetry, onGoBack, className = "" }) => (
  <div className={`flex min-h-[200px] items-center justify-center bg-[#FEF9EF] text-[#111111] p-6 ${className}`}>
    <div className="text-center space-y-4 max-w-md">
      <div className="w-16 h-16 rounded-full bg-[#FDE8E8] flex items-center justify-center mx-auto">
        <span className="material-symbols-outlined text-[28px] text-[#C2410C]">error</span>
      </div>
      <h3 className="font-headline-sm text-[#111111]">{title}</h3>
      <p className="text-sm text-[#5F5E5E]">{message}</p>
      <div className="flex items-center justify-center gap-2">
        {onRetry && <button onClick={onRetry} className="px-4 py-2 bg-[#C2410C] text-white rounded font-medium text-sm hover:opacity-90">Try Again</button>}
        {onGoBack && <button onClick={onGoBack} className="px-4 py-2 border border-[#DDD6C7] bg-white text-[#111111] rounded font-medium text-sm hover:bg-[#F2EDE3]">Go Back</button>}
      </div>
    </div>
  </div>
);

export const UnauthorizedState: React.FC<{ role: string; onGoHome: () => void; className?: string; }> = ({ role, onGoHome, className = "" }) => (
  <div className={`flex min-h-screen items-center justify-center bg-[#FEF9EF] text-[#111111] p-4 ${className}`}>
    <div className="max-w-md w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded-lg p-6 text-center shadow-sm">
      <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
        <span className="material-symbols-outlined text-[24px]">lock</span>
      </div>
      <h2 className="font-headline-md text-lg font-bold text-[#111111]">Access Restricted</h2>
      <p className="text-sm text-[#5F5E5E] mt-2 leading-relaxed">This section is restricted for the <strong>{role}</strong> role.</p>
      <button type="button" onClick={onGoHome} className="mt-5 px-4 py-2 bg-[#C2410C] text-white rounded font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer">Return to {role === "Parent" ? "Parent Portal" : "Overview"}</button>
    </div>
  </div>
);
