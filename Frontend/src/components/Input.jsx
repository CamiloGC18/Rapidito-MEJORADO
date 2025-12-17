import { motion } from "framer-motion";
import { springConfig } from "../styles/designSystem";

/**
 * 🏝️ SILICON VALLEY LUXURY INPUT
 * Ultra-Premium, Brutalist Minimalist Design
 * 
 * Design DNA:
 * - PILL SHAPE: rounded-full (like buttons)
 * - GLASSMORPHISM: bg-white/80 backdrop-blur-xl
 * - FOCUS STATE: ring-2 ring-[#007AFF] (iOS Blue)
 * - HEIGHT: h-14 (56px) massive touch targets
 * - LABELS: 11px uppercase tracking-wide
 * - Dark mode native support
 */

function Input({ 
  label, 
  type, 
  name, 
  placeholder, 
  defaultValue, 
  register, 
  error, 
  options, 
  disabled,
  className
}) {
  // Base input classes - Silicon Valley Luxury
  const inputBaseClasses = `
    w-full h-14
    bg-white/80 dark:bg-white/10
    backdrop-blur-xl
    px-6 py-4
    rounded-full
    border border-white/20 dark:border-white/10
    outline-none
    text-[17px] text-black dark:text-white
    placeholder:text-[#8E8E93]
    shadow-glass dark:shadow-glass-dark
    transition-all duration-200 ease-out
    focus:ring-2 focus:ring-[#007AFF]
    focus:border-transparent
    focus:bg-white/90 dark:focus:bg-white/15
    hover:bg-white/90 dark:hover:bg-white/15
    ${disabled ? "cursor-not-allowed select-none opacity-50 bg-[#F2F2F7] dark:bg-white/5" : ""}
    ${error ? "ring-2 ring-[#FF3B30] focus:ring-[#FF3B30] bg-red-50/50 dark:bg-red-900/10" : ""}
    ${className || ""}
  `.trim().replace(/\s+/g, ' ');

  return (
    <motion.div 
      className="my-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springConfig.gentle}
    >
      {label && (
        <label 
          htmlFor={name} 
          className="block mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8E8E93]"
        >
          {label}
        </label>
      )}
      
      {type === "select" ? (
        <select
          id={name}
          {...register(name)}
          defaultValue={defaultValue}
          disabled={disabled}
          className={inputBaseClasses}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${name}-error` : undefined}
        >
          {options?.map((option) => (
            <option 
              key={option} 
              value={option.toLowerCase()} 
              className="bg-white dark:bg-black text-black dark:text-white"
            >
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          {...register(name)}
          type={type || "text"}
          placeholder={placeholder || label}
          disabled={disabled}
          defaultValue={defaultValue}
          className={inputBaseClasses}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      )}
      
      {error && (
        <motion.p 
          id={`${name}-error`} 
          className="mt-2 text-[13px] font-medium text-[#FF3B30] flex items-center gap-1.5"
          role="alert"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg 
            className="w-4 h-4 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
              clipRule="evenodd" 
            />
          </svg>
          <span>{error.message}</span>
        </motion.p>
      )}
    </motion.div>
  );
}

export default Input;