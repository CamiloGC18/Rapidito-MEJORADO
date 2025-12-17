import { useMemo } from "react";
import { motion } from "framer-motion";
import { Menu, Star } from "lucide-react";
import { springConfig, colors } from "../styles/designSystem";

/**
 * 🏝️ SILICON VALLEY LUXURY - FLOATING HEADER
 * User Pill Island - Native iOS Maps Inspired
 * 
 * Design DNA:
 * - ISLAND ARCHITECTURE: mx-4, never touch edges
 * - GLASSMORPHISM: bg-white/80 backdrop-blur-xl
 * - PILL SHAPE: rounded-full
 * - Z-INDEX: z-20 (Panel layer)
 * - SPRING PHYSICS: Entry animation with damping: 25
 */
function FloatingHeader({ 
  user = {}, 
  onMenuClick, 
  isOnline = true 
}) {
  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Get user initials
  const userInitials = useMemo(() => {
    const first = user?.fullname?.firstname?.[0] || '';
    const last = user?.fullname?.lastname?.[0] || '';
    return (first + last).toUpperCase() || 'U';
  }, [user]);

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={springConfig.panel}
      className="fixed top-4 left-4 right-auto z-20"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      {/* Glass Island Container */}
      <motion.div 
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 rounded-full shadow-island dark:shadow-island-dark"
        style={{
          background: 'rgba(255, 255, 255, 0.80)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.20)',
          height: '48px',
          paddingLeft: '4px',
          paddingRight: '4px'
        }}
      >
        {/* Menu Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          transition={springConfig.button}
          onClick={onMenuClick}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5 text-black dark:text-white" />
        </motion.button>

        {/* Divider */}
        <div className="w-px h-6 bg-black/10 dark:bg-white/10" />

        {/* User Avatar with Status */}
        <div className="relative">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user?.fullname?.firstname || 'Usuario'}
              className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-white/20 shadow-sm"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold text-sm shadow-sm">
              {userInitials}
            </div>
          )}
          
          {/* Online Status Indicator - iOS Green */}
          {isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#34C759] rounded-full border-2 border-white dark:border-black shadow-sm" />
          )}
        </div>

        {/* User Info & Rating */}
        <div className="pr-3 flex items-center gap-2">
          <div className="hidden sm:block">
            <p className="text-[15px] font-semibold text-black dark:text-white leading-tight">
              {user?.fullname?.firstname || 'Hola'}
            </p>
          </div>
          
          {/* Rating Badge - Minimal */}
          {user?.rating && (
            <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
              <Star className="w-3 h-3 text-[#FF9500] fill-[#FF9500]" />
              <span className="text-[11px] font-semibold text-black dark:text-white tracking-wide">
                {typeof user.rating === 'number' 
                  ? user.rating.toFixed(1) 
                  : user.rating?.average?.toFixed(1) || '5.0'}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default FloatingHeader;
