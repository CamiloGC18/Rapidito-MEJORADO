import { useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Home, Clock } from "lucide-react";
import { springConfig } from "../styles/designSystem";

/**
 * 🏝️ SILICON VALLEY LUXURY - FLOATING SEARCH BAR
 * The Main Island - iOS Apple Maps Inspired
 * 
 * Design DNA:
 * - ISLAND ARCHITECTURE: mx-4, mb-6, never touch edges
 * - GLASSMORPHISM: bg-white/80 backdrop-blur-xl
 * - RADIUS: rounded-3xl (24px) for panels
 * - Z-INDEX: z-20 (Panel layer)
 * - SPRING PHYSICS: Entry with floatUp animation
 */
function FloatingSearchBar({ 
  onClick, 
  isCollapsed = true,
  onHomeClick,
  onRecentClick,
  recentLocations = []
}) {
  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...springConfig.panel, delay: 0.15 }}
      className="fixed bottom-6 left-4 right-4 z-20 flex justify-center"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <motion.div
        whileTap={{ scale: 0.98 }}
        transition={springConfig.button}
        onClick={onClick}
        className="w-full max-w-lg cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label="Buscar destino"
        onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      >
        {/* Main Search Container - Glass Island */}
        <div 
          className="rounded-3xl overflow-hidden shadow-island dark:shadow-island-dark"
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.20)'
          }}
        >
          {/* Search Input Area */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-3">
              {/* Search Icon - Subtle background */}
              <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
                <Search className="w-5 h-5 text-[#8E8E93]" />
              </div>
              
              {/* Placeholder Text - Brutalist Typography */}
              <div className="flex-1">
                <p className="text-[17px] font-semibold text-black dark:text-white">
                  ¿A dónde vas?
                </p>
                <p className="text-[13px] text-[#8E8E93]">
                  Encuentra tu próximo destino
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-5 h-px bg-black/10 dark:bg-white/10" />

          {/* Quick Actions */}
          <div className="px-5 py-3 flex items-center gap-6">
            {/* Home Quick Action */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onHomeClick?.();
              }}
              className="flex items-center gap-2 text-black dark:text-white transition-colors group"
              aria-label="Ir a casa"
            >
              <div className="w-8 h-8 rounded-full bg-[#007AFF]/10 group-hover:bg-[#007AFF]/20 flex items-center justify-center transition-colors">
                <Home className="w-4 h-4 text-[#007AFF]" />
              </div>
              <span className="text-[13px] font-medium">Casa</span>
            </motion.button>

            {/* Divider */}
            <div className="w-px h-6 bg-black/10 dark:bg-white/10" />

            {/* Recent Quick Action */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onRecentClick?.();
              }}
              className="flex items-center gap-2 text-black dark:text-white transition-colors group"
              aria-label="Ver recientes"
            >
              <div className="w-8 h-8 rounded-full bg-[#FF9500]/10 group-hover:bg-[#FF9500]/20 flex items-center justify-center transition-colors">
                <Clock className="w-4 h-4 text-[#FF9500]" />
              </div>
              <span className="text-[13px] font-medium">Recientes</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default FloatingSearchBar;
