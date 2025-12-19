import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";
import { springConfig } from "../../styles/designSystem";

/**
 * Silicon Valley Luxury BottomSheet Component
 * 
 * Features:
 * - Slide from bottom with spring physics
 * - Liquid glass effect with backdrop blur
 * - Swipe to dismiss with natural gesture physics
 * - Handle bar pill indicator for dragging
 * - Minimal close button (X) in corner
 * - Backdrop blur when sheet is open
 */
function BottomSheet({ 
  isOpen, 
  onClose, 
  children, 
  title,
  height = "auto",
  showCloseButton = true,
  glass = true,
  className
}) {
  // Helper to determine height styling
  const getHeightStyle = () => {
    if (height === 'auto') return {};
    if (height === 'full') return { height: '90vh' };
    return { height };
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Premium Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            onClick={onClose}
          />
          
          {/* Liquid Glass Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={springConfig.panel}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 120 || velocity.y > 500) {
                onClose();
              }
            }}
            className={cn(
              // Base positioning
              "fixed bottom-0 left-0 right-0 z-50",
              
              // Maximum height and scrolling
              "max-h-[90vh] overflow-y-auto pb-safe",
              
              // iOS-style top rounded corners
              "rounded-t-[32px]",
              
              // Glassmorphism effect
              glass 
                ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-white/20 dark:border-white/10" 
                : "bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800",
              
              // Premium shadow
              "shadow-island",
              
              className
            )}
            style={getHeightStyle()}
          >
            {/* Handle Bar Indicator */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-9 h-1 bg-black/20 dark:bg-white/20 rounded-full" />
            </div>

            {/* Header */}
            {(title || showCloseButton) && (
              <div className={cn(
                "flex items-center justify-between px-6 py-4",
                title && "border-b border-zinc-200 dark:border-white/10"
              )}>
                {title && (
                  <h2 className="text-[22px] font-semibold text-black dark:text-white">
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className={cn(
                      "p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors",
                      !title && "absolute right-4 top-4 z-10",
                      title && "ml-auto"
                    )}
                  >
                    <X size={20} className="text-black dark:text-white" strokeWidth={2.5} />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BottomSheet;
