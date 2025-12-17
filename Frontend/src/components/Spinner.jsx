/**
 * 🏝️ SILICON VALLEY LUXURY SPINNER
 * Clean, minimal iOS-style loading indicator
 * Uses iOS Blue (#007AFF) as accent
 */
function Spinner({ scale = 1, size = "md", variant = "default" }) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const sizeClass = sizes[size] || sizes.md;

  // Pulsing Radar variant - Premium effect
  if (variant === "radar") {
    return (
      <div className={`relative ${sizeClass}`} style={{ transform: `scale(${scale})` }}>
        {/* Outer pulsing rings */}
        <div className="absolute inset-0 rounded-full bg-[#007AFF]/20 animate-ping" />
        <div className="absolute inset-1 rounded-full bg-[#007AFF]/30 animate-ping" style={{ animationDelay: "0.2s" }} />
        {/* Core dot */}
        <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-[#007AFF] shadow-lg shadow-[#007AFF]/50" />
      </div>
    );
  }

  // Default: iOS-style spinning indicator
  return (
    <div
      className={`${sizeClass} relative`}
      style={{ transform: `scale(${scale})` }}
    >
      {/* Clean spinning ring */}
      <svg className="animate-spin" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#007AFF" />
            <stop offset="50%" stopColor="#5AC8FA" />
            <stop offset="100%" stopColor="#007AFF" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          className="text-black/10 dark:text-white/10"
        />
        {/* Spinner arc */}
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="url(#spinnerGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="45 100"
          className="drop-shadow-[0_0_6px_rgba(0,122,255,0.4)]"
        />
      </svg>
    </div>
  );
}

export default Spinner;
