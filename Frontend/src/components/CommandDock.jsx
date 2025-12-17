import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Map, 
  User, 
  Settings,
  MessageSquare,
  Bell,
  History,
  Plus,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../contexts/NotificationContext";
import { springConfig } from "../styles/designSystem";

/**
 * 🏝️ SILICON VALLEY LUXURY - COMMAND DOCK
 * Floating Island Navigation - Dynamic Island Inspired
 * 
 * Design DNA:
 * - ISLAND ARCHITECTURE: Floating, never touch edges (mx-4, mb-4)
 * - GLASSMORPHISM: bg-white/80 light, bg-black/80 dark
 * - PILL SHAPE: rounded-[32px] for main dock
 * - Z-INDEX: z-50 (Highest layer)
 * - SPRING PHYSICS: type: spring, damping: 25, stiffness: 300
 * - iOS COLORS: Accent blue #007AFF
 */

// Silicon Valley Luxury Color System
const COLORS = {
  // Light Mode
  light: {
    bg: 'rgba(255, 255, 255, 0.85)',
    surface: 'rgba(0, 0, 0, 0.05)',
    surfaceHover: 'rgba(0, 0, 0, 0.08)',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: 'rgba(0, 0, 0, 0.08)',
    accent: '#007AFF',
    accentGlow: 'rgba(0, 122, 255, 0.20)',
  },
  // Dark Mode
  dark: {
    bg: 'rgba(0, 0, 0, 0.85)',
    surface: 'rgba(255, 255, 255, 0.08)',
    surfaceHover: 'rgba(255, 255, 255, 0.12)',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: 'rgba(255, 255, 255, 0.10)',
    accent: '#007AFF',
    accentGlow: 'rgba(0, 122, 255, 0.30)',
  },
};

// Haptic feedback
const triggerHaptic = (intensity = 'light') => {
  if (navigator.vibrate) {
    const patterns = { light: [5], medium: [10], heavy: [15] };
    navigator.vibrate(patterns[intensity]);
  }
};

// Main navigation items
const mainNavItems = [
  { id: 'home', icon: Home, label: 'Inicio' },
  { id: 'map', icon: Map, label: 'Mapa' },
  { id: 'messages', icon: MessageSquare, label: 'Mensajes', badge: 3 },
  { id: 'profile', icon: User, label: 'Perfil' },
];

// Quick action items (expandable menu)
const quickActions = [
  { id: 'history', icon: History, label: 'Historial' },
  { id: 'notifications', icon: Bell, label: 'Notificaciones' },
  { id: 'settings', icon: Settings, label: 'Ajustes' },
];

function CommandDock({ 
  activeTab = 'home', 
  onTabChange,
  onQuickAction,
  hideLabels = false,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();
  
  // Obtener datos de notificaciones del contexto
  const { unreadCount, toggleNotificationCenter } = useNotifications();

  // Check for reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  const handleTabChange = (tabId) => {
    triggerHaptic('medium');
    onTabChange?.(tabId);
  };

  const handleQuickAction = (actionId) => {
    triggerHaptic('heavy');
    
    // Manejo especial para acciones específicas
    if (actionId === 'notifications') {
      toggleNotificationCenter();
    } else if (actionId === 'settings') {
      navigate('/settings');
    } else if (actionId === 'history') {
      const isUser = localStorage.getItem("userType") === "user";
      navigate(isUser ? "/user/rides" : "/captain/rides");
    } else {
      // Para otras acciones personalizadas
      onQuickAction?.(actionId);
    }
    
    setIsExpanded(false);
  };

  const toggleExpanded = () => {
    triggerHaptic(isExpanded ? 'light' : 'heavy');
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Expanded Quick Actions Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleExpanded}
              className="absolute inset-0"
              style={{ background: 'rgba(0, 0, 0, 0.6)' }}
            />

            {/* Quick Actions Menu - Glass Island */}
            <div className="absolute bottom-32 left-0 right-0 flex justify-center px-4">
              <motion.div
                initial={prefersReducedMotion ? {} : { scale: 0.9, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={prefersReducedMotion ? {} : { scale: 0.9, y: 30, opacity: 0 }}
                transition={springConfig.panel}
                className="rounded-3xl p-4 mx-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.90)',
                  backdropFilter: 'blur(40px) saturate(200%)',
                  WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                  border: '1px solid rgba(255, 255, 255, 0.20)',
                  boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.06)',
                  maxWidth: '320px',
                }}
              >
                {/* Quick Actions Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {quickActions.map((action, index) => (
                    <QuickActionButton
                      key={action.id}
                      action={action}
                      onClick={() => handleQuickAction(action.id)}
                      delay={index * 0.05}
                      prefersReducedMotion={prefersReducedMotion}
                      unreadCount={unreadCount}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Command Dock - Glass Island */}
      <motion.div
        initial={prefersReducedMotion ? {} : { y: 100, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={springConfig.panel}
        className="fixed bottom-4 left-4 right-4 z-50 flex justify-center"
        style={{
          paddingBottom: 'max(0px, env(safe-area-inset-bottom))',
        }}
      >
        <div
          className="rounded-[32px] px-4 py-3 flex items-center gap-1 shadow-island dark:shadow-island-dark"
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.20)',
          }}
        >
          {/* Main Navigation Items */}
          {mainNavItems.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              isActive={activeTab === item.id}
              isHovered={hoveredItem === item.id}
              onClick={() => handleTabChange(item.id)}
              onHoverStart={() => setHoveredItem(item.id)}
              onHoverEnd={() => setHoveredItem(null)}
              hideLabel={hideLabels}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}

          {/* Divider */}
          <div 
            className="w-px h-8 mx-1 bg-black/10 dark:bg-white/10"
          />

          {/* Expand Button (Plus/X) */}
          <motion.button
            whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
            onTapStart={() => triggerHaptic('medium')}
            onClick={toggleExpanded}
            className="relative w-11 h-11 rounded-full flex items-center justify-center"
            style={{
              background: isExpanded ? '#007AFF' : 'rgba(0, 0, 0, 0.05)',
              boxShadow: isExpanded 
                ? '0 4px 16px rgba(0, 122, 255, 0.40)'
                : 'none',
            }}
          >
            <AnimatePresence mode="wait">
              {isExpanded ? (
                <motion.div
                  key="close"
                  initial={prefersReducedMotion ? {} : { rotate: -90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  exit={prefersReducedMotion ? {} : { rotate: 90, scale: 0 }}
                  transition={springConfig.button}
                >
                  <X size={18} className="text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="plus"
                  initial={prefersReducedMotion ? {} : { rotate: 90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  exit={prefersReducedMotion ? {} : { rotate: -90, scale: 0 }}
                  transition={springConfig.button}
                >
                  <Plus size={18} className="text-[#8E8E93]" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pulse indicator when not expanded */}
            {!isExpanded && (
              <motion.div
                className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#007AFF]"
                style={{ 
                  boxShadow: '0 0 8px rgba(0, 122, 255, 0.60)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}

/**
 * NavButton - Individual navigation button - Silicon Valley Luxury
 */
function NavButton({ 
  item, 
  isActive, 
  isHovered,
  onClick, 
  onHoverStart,
  onHoverEnd,
  hideLabel,
  prefersReducedMotion,
}) {
  const Icon = item.icon;

  return (
    <motion.button
      whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onTapStart={() => triggerHaptic('light')}
      onClick={onClick}
      className="relative flex flex-col items-center justify-center gap-0.5 min-w-[52px] py-2 px-2 rounded-2xl transition-colors"
      style={{
        background: isActive 
          ? 'rgba(0, 122, 255, 0.10)' 
          : isHovered 
          ? 'rgba(0, 0, 0, 0.05)' 
          : 'transparent',
      }}
    >
      {/* Icon Container */}
      <div className="relative">
        <Icon 
          size={22} 
          strokeWidth={isActive ? 2.5 : 2}
          style={{ 
            color: isActive ? '#007AFF' : '#8E8E93'
          }} 
        />
        
        {/* Badge for notifications/messages */}
        {item.badge && (
          <motion.div
            initial={prefersReducedMotion ? {} : { scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-1 bg-[#FF3B30]"
            style={{
              boxShadow: '0 2px 6px rgba(255, 59, 48, 0.50)',
            }}
          >
            <span className="text-[9px] font-bold text-white">
              {item.badge > 9 ? '9+' : item.badge}
            </span>
          </motion.div>
        )}
      </div>

      {/* Label (optional) - Tiny uppercase */}
      {!hideLabel && (
        <motion.span
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] font-semibold tracking-wide"
          style={{ 
            color: isActive ? '#007AFF' : '#8E8E93'
          }}
        >
          {item.label}
        </motion.span>
      )}

      {/* Active indicator dot */}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#007AFF]"
          transition={springConfig.button}
        />
      )}
    </motion.button>
  );
}

/**
 * QuickActionButton - Button in expanded menu - Silicon Valley Luxury
 */
function QuickActionButton({ action, onClick, delay, prefersReducedMotion, unreadCount }) {
  const Icon = action.icon;
  
  // Determinar si debe mostrar un badge y cuántos elementos
  const showBadge = action.id === 'notifications' && unreadCount > 0;
  const badgeCount = unreadCount;

  return (
    <motion.button
      initial={prefersReducedMotion ? {} : { scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={prefersReducedMotion ? {} : { scale: 0, opacity: 0 }}
      transition={{ ...springConfig.panel, delay }}
      whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
      onTapStart={() => triggerHaptic('medium')}
      onClick={onClick}
      className="relative flex flex-col items-center justify-center gap-2 py-4 rounded-2xl bg-black/5 dark:bg-white/10"
    >
      {/* Icon */}
      <div 
        className="w-11 h-11 rounded-full flex items-center justify-center bg-white dark:bg-white/10 shadow-sm"
      >
        <Icon size={20} className="text-[#8E8E93]" />
      </div>

      {/* Label - Tiny uppercase tracked */}
      <span className="text-[10px] font-semibold tracking-wider uppercase text-[#8E8E93] px-2 text-center">
        {action.label}
      </span>

      {/* Badge */}
      {showBadge && (
        <motion.div
          initial={prefersReducedMotion ? {} : { scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 bg-[#FF3B30]"
          style={{
            boxShadow: '0 2px 6px rgba(255, 59, 48, 0.50)',
          }}
        >
          <span className="text-[9px] font-bold text-white">
            {badgeCount > 9 ? '9+' : badgeCount}
          </span>
        </motion.div>
      )}
    </motion.button>
  );
}

export default CommandDock;
