import React from 'react';

export interface ChokurLogoProps {
  variant?: 'symbol' | 'horizontal' | 'stacked' | 'monochrome-dark' | 'monochrome-light';
  size?: number | string;
  className?: string;
  showSubtitle?: boolean;
  accentColor?: string;
  onClick?: () => void;
}

export const ChokurLogo: React.FC<ChokurLogoProps> = ({
  variant = 'horizontal',
  size,
  className = '',
  showSubtitle = true,
  accentColor = '#C2410C',
  onClick,
}) => {
  const isClickable = Boolean(onClick);

  // Symbol Only: 32x32 on 4px grid
  if (variant === 'symbol') {
    const defaultSize = size || 28;
    return (
      <svg
        viewBox="0 0 32 32"
        width={defaultSize}
        height={defaultSize}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block shrink-0 ${isClickable ? 'cursor-pointer' : ''} ${className}`}
        onClick={onClick}
        aria-label="Chokur System Symbol"
        role="img"
      >
        <title>Chokur System Symbol</title>
        {/* Vertical Spine */}
        <rect x="4" y="4" width="4" height="24" fill="#111111" />
        {/* Top Ledger Rule */}
        <rect x="8" y="4" width="20" height="4" fill="#111111" />
        {/* Middle Ledger Rule */}
        <rect x="8" y="14" width="13" height="4" fill="#111111" />
        {/* Accent Foundation Rule */}
        <rect x="8" y="24" width="8" height="4" fill={accentColor} />
      </svg>
    );
  }

  // Stacked Logo (Symbol centered on top of Wordmark)
  if (variant === 'stacked') {
    const defaultWidth = size || 80;
    return (
      <div
        className={`inline-flex flex-col items-center justify-center text-center select-none ${
          isClickable ? 'cursor-pointer' : ''
        } ${className}`}
        onClick={onClick}
        role={isClickable ? 'button' : 'img'}
        aria-label="Chokur System"
      >
        <svg
          viewBox="0 0 32 32"
          width={Number(defaultWidth) * 0.45 || 36}
          height={Number(defaultWidth) * 0.45 || 36}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-1"
        >
          <rect x="4" y="4" width="4" height="24" fill="#111111" />
          <rect x="8" y="4" width="20" height="4" fill="#111111" />
          <rect x="8" y="14" width="13" height="4" fill="#111111" />
          <rect x="8" y="24" width="8" height="4" fill={accentColor} />
        </svg>
        <span className="font-sans font-black tracking-widest text-xs text-[#111111] leading-none uppercase">
          CHOKUR
        </span>
        {showSubtitle && (
          <span className="font-mono text-[9px] tracking-wider text-[#5C5850] uppercase mt-0.5">
            SYSTEM
          </span>
        )}
      </div>
    );
  }

  // Monochrome Dark (for print & B/W xerox)
  if (variant === 'monochrome-dark') {
    const defaultHeight = size || 28;
    return (
      <div
        className={`inline-flex items-center gap-2.5 select-none ${
          isClickable ? 'cursor-pointer' : ''
        } ${className}`}
        onClick={onClick}
      >
        <svg
          viewBox="0 0 32 32"
          height={defaultHeight}
          width={defaultHeight}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <rect x="4" y="4" width="4" height="24" fill="#111111" />
          <rect x="8" y="4" width="20" height="4" fill="#111111" />
          <rect x="8" y="14" width="13" height="4" fill="#111111" />
          <rect x="8" y="24" width="8" height="4" fill="#111111" />
        </svg>
        <div className="flex flex-col text-left">
          <div className="flex items-baseline gap-1.5 leading-none">
            <span className="font-sans font-black text-sm tracking-wider text-[#111111]">
              CHOKUR
            </span>
            <span className="font-mono text-[9px] font-bold tracking-widest text-[#111111]">
              SYSTEM
            </span>
          </div>
          {showSubtitle && (
            <span className="font-sans text-[8px] font-medium tracking-tight text-[#5C5850] uppercase mt-0.5">
              Academic Ledger
            </span>
          )}
        </div>
      </div>
    );
  }

  // Monochrome Light (for dark / reversed contexts)
  if (variant === 'monochrome-light') {
    const defaultHeight = size || 28;
    return (
      <div
        className={`inline-flex items-center gap-2.5 select-none ${
          isClickable ? 'cursor-pointer' : ''
        } ${className}`}
        onClick={onClick}
      >
        <svg
          viewBox="0 0 32 32"
          height={defaultHeight}
          width={defaultHeight}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <rect x="4" y="4" width="4" height="24" fill="#F6F1E7" />
          <rect x="8" y="4" width="20" height="4" fill="#F6F1E7" />
          <rect x="8" y="14" width="13" height="4" fill="#F6F1E7" />
          <rect x="8" y="24" width="8" height="4" fill="#F6F1E7" />
        </svg>
        <div className="flex flex-col text-left">
          <div className="flex items-baseline gap-1.5 leading-none">
            <span className="font-sans font-black text-sm tracking-wider text-[#F6F1E7]">
              CHOKUR
            </span>
            <span className="font-mono text-[9px] font-bold tracking-widest text-[#DDD6C7]">
              SYSTEM
            </span>
          </div>
          {showSubtitle && (
            <span className="font-sans text-[8px] font-medium tracking-tight text-[#9A958A] uppercase mt-0.5">
              Academic Ledger
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default: Horizontal Logo (Symbol + CHOKUR SYSTEM + Subtitle)
  const defaultHeight = size || 30;
  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${
        isClickable ? 'cursor-pointer group' : ''
      } ${className}`}
      onClick={onClick}
      role={isClickable ? 'button' : 'img'}
      aria-label="Chokur System - Marks to Insight"
    >
      <svg
        viewBox="0 0 32 32"
        height={defaultHeight}
        width={defaultHeight}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-150 group-hover:scale-105"
      >
        {/* Left Spine */}
        <rect x="4" y="4" width="4" height="24" fill="#111111" />
        {/* Top Ledger Bar */}
        <rect x="8" y="4" width="20" height="4" fill="#111111" />
        {/* Middle Ledger Bar */}
        <rect x="8" y="14" width="13" height="4" fill="#111111" />
        {/* Accent Foundation Ledger Bar */}
        <rect x="8" y="24" width="8" height="4" fill={accentColor} />
      </svg>
      <div className="flex flex-col text-left">
        <div className="flex items-baseline gap-1.5 leading-none">
          <span className="font-sans font-black text-sm tracking-widest text-[#111111]">
            CHOKUR
          </span>
          <span className="font-mono text-[9px] font-bold tracking-widest text-[#5C5850]">
            SYSTEM
          </span>
        </div>
        {showSubtitle && (
          <span className="font-sans text-[8.5px] font-semibold tracking-wider text-[#9A958A] uppercase mt-0.5">
            Marks to Insight
          </span>
        )}
      </div>
    </div>
  );
};
