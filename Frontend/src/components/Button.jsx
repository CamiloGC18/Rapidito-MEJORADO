import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Spinner from "./Spinner";
import { springConfig, animation } from "../styles/designSystem";

/**
 * 🏝️ SILICON VALLEY LUXURY BUTTON
 * Ultra-Premium, Brutalist Minimalist Design
 * 
 * Design DNA:
 * - PILL SHAPE: rounded-full (buttons & inputs)
 * - BRUTALIST: Primary = Pure Black, Text = White
 * - TACTILE: scale-0.95 on tap with spring physics
 * - GLASS VARIANT: Glassmorphism for overlay buttons
 * - Min 48px touch target (iOS HIG)
 * 
 * Variants:
 * - primary: Pure Black button, white text
 * - secondary: Glass/transparent with border
 * - accent: iOS Blue (#007AFF) for key CTAs
 * - danger: iOS Red for destructive actions
 * - ghost: Transparent with text only
 */

// Spring physics for tap animation
const tapSpring = springConfig.button;

// Variant Styles - Silicon Valley Luxury
const VARIANTS = {
  // Primary: Pure Black - Brutalist Minimalist
  primary: [
    "bg-black dark:bg-white",
    "text-white dark:text-black",
    "shadow-island dark:shadow-island-dark",
  ].join(" "),
  
  // Secondary: Glass effect - Floating feel
  secondary: [
    "bg-white/80 dark:bg-white/10",
    "backdrop-blur-xl",
    "text-black dark:text-white",
    "border border-white/20 dark:border-white/10",
    "shadow-glass",
  ].join(" "),
  
  // Accent: iOS Blue - Interactive highlight
  accent: [
    "bg-[#007AFF]",
    "text-white",
    "shadow-glow-blue",
  ].join(" "),
  
  // Danger: iOS Red - Destructive actions
  danger: [
    "bg-[#FF3B30]",
    "text-white",
    "shadow-lg",
  ].join(" "),
  
  // Ghost: Transparent - Subtle actions
  ghost: [
    "bg-transparent",
    "text-black dark:text-white",
    "hover:bg-black/5 dark:hover:bg-white/10",
  ].join(" "),
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
  disabled 
}) {
  // Get variant styles or fallback to primary
  const variantClasses = VARIANTS[variant] || VARIANTS.primary;

  // Common classes - PILL SHAPE, premium typography
  const commonClasses = `
    flex justify-center items-center gap-3
    py-4 px-8 font-semibold text-[17px] w-full
    rounded-full
    min-h-[48px]
    ${variantClasses}
    ${classes || ''}
  `.trim().replace(/\s+/g, ' ');

  // Motion props for tap feedback
  const motionProps = {
    whileTap: { scale: animation.tapScale },
    transition: tapSpring,
  };

  return (
    <>
      {type === "link" ? (
        <motion.div {...motionProps}>
          <Link
            to={path}
            className={commonClasses}
            aria-label={title}
          >
            {icon && <span aria-hidden="true">{icon}</span>}
            {title}
          </Link>
        </motion.div>
      ) : (
        <motion.button
          {...motionProps}
          type={type || "button"}
          className={`
            ${commonClasses}
            cursor-pointer
            disabled:opacity-50 
            disabled:cursor-not-allowed 
            focus:outline-none 
            focus-visible:ring-2
            focus-visible:ring-[#007AFF]
            focus-visible:ring-offset-2
            ${loading ? "cursor-wait opacity-90" : ""}
          `.trim().replace(/\s+/g, ' ')}
          onClick={fun}
          disabled={loading || disabled}
          aria-busy={loading}
          aria-label={title}
        >
          {loading ? (
            <span className="flex gap-3 items-center">
              <Spinner size="sm" />
              <span className="font-semibold">{loadingMessage || "Cargando..."}</span>
            </span>
          ) : (
            <>
              {icon && <span aria-hidden="true">{icon}</span>}
              <span className="tracking-wide">{title}</span>
            </>
          )}
        </motion.button>
      )}
    </>
  );
}

export default Button;
