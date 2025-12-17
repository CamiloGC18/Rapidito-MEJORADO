import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { springConfig } from "../styles/designSystem";

/**
 * 🏝️ SILICON VALLEY LUXURY ALERT
 * Ultra-Premium Modal with Glassmorphism
 * 
 * Design DNA:
 * - GLASS PANEL: bg-white/90 backdrop-blur-xl
 * - ISLAND RADIUS: rounded-3xl (24px)
 * - iOS COLORS: #34C759 success, #FF3B30 failure
 * - SPRING PHYSICS: damping: 25, stiffness: 300
 * - BRUTALIST BUTTON: Pure black, rounded-full
 */
export const Alert = ({ heading, text, isVisible, onClose, type }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Icon mapping with premium lucide-react icons
  const iconMap = {
    success: CheckCircle2,
    failure: XCircle,
  };

  // Color schemes - Silicon Valley Luxury (iOS System Colors)
  const colorSchemes = {
    success: {
      icon: "text-[#34C759]",
      iconBg: "bg-[#34C759]/15",
      border: "border-[#34C759]/20",
      button: "bg-black dark:bg-white text-white dark:text-black",
      accent: "#34C759",
    },
    failure: {
      icon: "text-[#FF3B30]",
      iconBg: "bg-[#FF3B30]/15",
      border: "border-[#FF3B30]/20",
      button: "bg-black dark:bg-white text-white dark:text-black",
      accent: "#FF3B30",
    },
  };

  const Icon = iconMap[type] || AlertCircle;
  const colors = colorSchemes[type] || colorSchemes.failure;

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? {} : { opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <motion.div
            initial={prefersReducedMotion ? {} : { scale: 0.95, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? {} : { scale: 0.98, opacity: 0, y: 20 }}
            transition={springConfig.panel}
            className={`
              w-full max-w-md rounded-3xl overflow-hidden shadow-island-xl border
              mx-4 ${colors.border}
            `}
            style={{
              background: 'rgba(255, 255, 255, 0.90)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
            }}
          >
            {/* Subtle top accent line */}
            <div 
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-60"
              style={{ color: type === 'success' ? '#10b981' : '#ef4444' }}
            />

            {/* Header with Icon */}
            <div className="pt-8 pb-4 px-6 flex flex-col items-center">
              {/* Icon Badge */}
              <motion.div
                initial={prefersReducedMotion ? {} : { scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 300,
                  delay: 0.1,
                }}
                className={`
                  w-20 h-20 rounded-full flex items-center justify-center mb-5
                  ${colors.iconBg}
                  ring-4 ring-white/50 dark:ring-black/20
                `}
              >
                <Icon className={`w-10 h-10 ${colors.icon}`} strokeWidth={2.5} />
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2"
              >
                {heading}
              </motion.h1>

              {/* Message */}
              <motion.p
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="text-base text-gray-600 dark:text-gray-300 text-center leading-relaxed px-2"
                style={{ textWrap: 'balance' }}
              >
                {text}
              </motion.p>
            </div>

            {/* Close Button - Premium Gradient */}
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="px-6 pb-6"
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                transition={springConfig.button}
                onClick={onClose}
                className={`
                  w-full py-4 rounded-full font-semibold text-[17px]
                  shadow-island
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] focus-visible:ring-offset-2
                  ${colors.button}
                `}
              >
                Entendido
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};