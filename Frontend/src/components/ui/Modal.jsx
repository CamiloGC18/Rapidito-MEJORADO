import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "../../utils/cn";
import { springConfig } from "../../styles/designSystem";

/**
 * Silicon Valley Luxury Modal Component
 * 
 * Features:
 * - Liquid glass backdrop with strong blur
 * - Spring physics animations for natural movement
 * - Centered modal with premium shadow system
 * - Minimal close button (X) in corner
 * - Escape key to close for accessibility
 * - Click outside to dismiss
 */
function Modal({ 
  isOpen, 
  onClose, 
  children, 
  title,
  showCloseButton = true,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
  glass = true,
}) {
  // Handle ESC key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Modal sizes
  const sizeClasses = {
    sm: "max-w-md w-[90%]",
    md: "max-w-lg w-[90%]",
    lg: "max-w-2xl w-[90%]",
    xl: "max-w-4xl w-[90%]",
    full: "max-w-[1100px] w-[95%]",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Premium Backdrop with Strong Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-lg"
            onClick={closeOnOverlayClick ? onClose : undefined}
            aria-hidden="true"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={springConfig.panel}
              className={cn(
                // Base styling
                "w-full pointer-events-auto",
                "max-h-[90vh] overflow-y-auto",
                
                // Rounded corners
                "rounded-3xl overflow-hidden",
                
                // Glassmorphism effect
                glass 
                  ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/20 dark:border-white/10" 
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800",
                
                // Premium shadow
                "shadow-island",
                
                // Size variations
                sizeClasses[size],
                
                className
              )}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? "modal-title" : undefined}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className={cn(
                  "flex items-center justify-between px-6 py-5",
                  title && "border-b border-zinc-200 dark:border-white/10"
                )}>
                  {title && (
                    <h2 
                      id="modal-title"
                      className="text-[22px] font-semibold text-black dark:text-white"
                    >
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
                      aria-label="Close modal"
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
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default Modal;
