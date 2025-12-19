import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { cn } from "../../utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { springConfig } from "../../styles/designSystem";

/**
 * Silicon Valley Luxury Message Notification Banner
 * Premium notification that slides down from top with spring physics
 * Features liquid glass design and floating aesthetics
 */
function MessageNotificationBanner({ 
  senderName = "Usuario",
  message = "",
  show = false,
  onClose = () => {},
  onTap = () => {}
}) {
  // Auto-dismiss timer duration
  const autoDismissTime = 4500;

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, autoDismissTime);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-x-0 top-0 z-[400] pointer-events-none p-4">
          {/* Container with max-width for larger screens */}
          <div className="mx-auto max-w-md">
            {/* Luxury Notification Banner */}
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={springConfig.panel}
              onClick={onTap}
              className={cn(
                "w-full pointer-events-auto cursor-pointer",
                "rounded-2xl overflow-hidden shadow-island"
              )}
            >
              {/* Glassmorphism background */}
              <div className="relative bg-black/70 dark:bg-black/80 backdrop-blur-xl p-4 flex items-center gap-3 border border-white/10">
                {/* Message Icon with pulsing animation */}
                <div className="flex-shrink-0 relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ios-blue to-ios-blue/70 flex items-center justify-center shadow-lg">
                    <MessageCircle size={22} className="text-white" />
                  </div>
                  <motion.div 
                    className="absolute inset-0 rounded-full border-2 border-ios-blue/30"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2.5,
                      ease: "easeInOut" 
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-base mb-0.5 drop-shadow-sm">
                    Mensaje de {senderName}
                  </h3>
                  <p className="text-sm text-white/80 truncate drop-shadow-sm">
                    {message || "Toca para abrir el chat"}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center transition-all hover:bg-white/20 active:scale-95"
                  aria-label="Cerrar"
                >
                  <X size={16} className="text-white" strokeWidth={2.5} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default MessageNotificationBanner;
