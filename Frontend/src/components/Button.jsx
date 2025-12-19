import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Spinner from "./Spinner";

/**
 * 🌟 RAPIDITO BRUTAL LUXURY BUTTON SYSTEM
 * Linear.app x Tesla x Apple - Floating island architecture
 * 
 * Design Philosophy:
 * - ALL BUTTONS ARE FLOATING ISLANDS: glassmorphism + shadows
 * - GRADIENT BACKGROUNDS: Emerald/Amber gradients, never flat colors
 * - ROUNDED-FULL: Pure pill shapes, 48px+ touch targets
 * - HOVER EFFECTS: translateY(-4px) + shadow increase
 * - ACTIVE FEEDBACK: scale(0.98) with cubic-bezier
 * 
 * Variants:
 * - primary: Emerald gradient with glow
 * - secondary: Glass island with emerald border
 * - accent: Amber gradient with glow
 * - ghost: Transparent with subtle hover
 * - danger: Red gradient for destructive actions
 */

// Brutal luxury animations
const buttonMotion = {
  whileHover: { y: -2, scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { type: "spring", damping: 20, stiffness: 300 }
};

// VARIANT SYSTEM - Floating island components
const VARIANTS = {
  // Primary: Emerald gradient with glow shadow
  primary: "btn-primary",
  
  // Secondary: Glass island with emerald accent
  secondary: "btn-secondary", 
  
  // Accent: Amber gradient with warm glow
  accent: "btn-accent",
  
  // Ghost: Transparent with subtle interactions
  ghost: "btn-ghost",
  
  // Danger: Red gradient for destructive actions
  danger: "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-glow-red hover:shadow-glow-red-lg rounded-full px-8 py-4 hover-lift active-scale",
};

function Button({ 
  path, 
  title, 
  icon, 
  type, 
  variant = "primary", 
  classes, 
  fun, 
  loading, 
  loadingMessage, 
  disabled,
  size = "default"
}) {
  // Get variant class from CSS system
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  
  // Size variants for different use cases
  const sizeClasses = {
    sm: "px-6 py-3 text-sm min-h-[40px]",
    default: "px-8 py-4 text-base min-h-[48px]", 
    lg: "px-12 py-5 text-lg min-h-[56px]",
    xl: "px-16 py-6 text-xl min-h-[64px]"
  };

  // Common base classes - Always floating islands
  const baseClasses = `
    relative flex items-center justify-center space-md
    font-semibold tracking-tight w-full
    transition-all duration-200 ease-out
    outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50
    disabled:opacity-40 disabled:cursor-not-allowed
    ${sizeClasses[size]}
    ${variantClass}
    ${classes || ''}
  `.trim().replace(/\s+/g, ' ');

  const ButtonContent = () => (
    <>
      {loading ? (
        <div className="flex items-center space-sm">
          <Spinner size="sm" />
          <span className="text-caption font-medium">
            {loadingMessage || "CARGANDO..."}
          </span>
        </div>
      ) : (
        <>
          {icon && (
            <span className="flex items-center" aria-hidden="true">
              {icon}
            </span>
          )}
          <span className="font-semibold">{title}</span>
        </>
      )}
    </>
  );

  // Link variant - For navigation
  if (type === "link") {
    return (
      <motion.div className="inline-block w-full" {...buttonMotion}>
        <Link
          to={path}
          className={baseClasses}
          aria-label={title}
        >
          <ButtonContent />
        </Link>
      </motion.div>
    );
  }

  // Button variant - For actions
  return (
    <motion.button
      type={type || "button"}
      className={baseClasses}
      onClick={fun}
      disabled={loading || disabled}
      aria-busy={loading}
      aria-label={title}
      {...buttonMotion}
    >
      <ButtonContent />
    </motion.button>
  );
}

export default Button;
