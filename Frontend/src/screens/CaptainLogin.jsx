import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Mail, 
  Lock, 
  Car,
  Crown,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import Console from "../utils/console";
import MembershipRequiredModal from "../components/MembershipRequiredModal";
import Button from "../components/Button";

/**
 * 🌟 RAPIDITO CAPTAIN LOGIN - BRUTAL LUXURY
 * Tesla Model S x Linear.app x iOS 17 - Driver Edition
 * 
 * Design System:
 * - HERO BACKGROUND: Unsplash luxury driver with amber overlay
 * - FLOATING FORM ISLAND: Glassmorphism with amber accents
 * - INPUTS: Glass inputs with amber focus glow
 * - TYPOGRAPHY: Massive 48px heading with conductor theme
 * - ANIMATIONS: Staggered entrance with power driver vibes
 */
function CaptainLogin() {
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (responseError) {
      const timer = setTimeout(() => setResponseError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [responseError]);

  const loginCaptain = async (data) => {
    if (!data.email?.trim() || !data.password?.trim()) return;

    try {
      setLoading(true);
      setResponseError("");

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/captain/login`,
        data
      );

      Console.log(response);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          type: "captain",
          data: response.data.captain,
        })
      );

      setTimeout(() => navigate("/captain/home"), 300);
    } catch (error) {
      if (
        error.response?.status === 403 &&
        error.response?.data?.error === "MEMBERSHIP_REQUIRED"
      ) {
        setShowMembershipModal(true);
      } else {
        setResponseError(
          error.response?.data?.message || "Error al iniciar sesión"
        );
      }
      Console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian relative overflow-hidden">
      {/* Hero Background Image with Amber Gradient Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1200&auto=format&fit=crop&q=80"
          alt="Professional driver"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/70 via-black/60 to-black/80" />
      </div>

      {/* Floating Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -20 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="relative z-10 pt-safe px-8 pt-8"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="floating-island-subtle p-4 rounded-2xl hover-lift"
          aria-label="Volver"
        >
          <ArrowLeft 
            className="text-white w-5 h-5" 
            strokeWidth={1.5} 
          />
        </motion.button>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col justify-center px-8 space-3xl">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-lg"
          >
            {/* Driver Badge */}
            <div className="flex items-center space-sm mb-4">
              <div className="floating-island-subtle p-3 rounded-2xl">
                <Crown 
                  className="text-amber-400 w-6 h-6" 
                  strokeWidth={1.5} 
                />
              </div>
              <span className="text-caption text-secondary">
                CONDUCTOR PREMIUM
              </span>
            </div>
            
            <h1 className="text-display font-extrabold">
              Hola,{" "}
              <span className="text-gradient-accent">
                conductor
              </span>
            </h1>
            
            <p className="text-body text-secondary">
              Inicia sesión para comenzar a generar ingresos premium
            </p>
          </motion.div>

          {/* Error Message */}
          {responseError && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="floating-island p-4 border-red-500/20 bg-red-500/10"
            >
              <p className="text-red-400 text-sm font-medium">
                {responseError}
              </p>
            </motion.div>
          )}

          {/* Login Form - Floating Island */}
          <motion.form
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 40 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            onSubmit={handleSubmit(loginCaptain)}
            className="floating-island p-8 space-xl"
          </motion.div>
        )}

          >
            {/* Email Input */}
            <div className="space-sm">
              <label className="text-caption text-secondary block mb-2">
                CORREO ELECTRÓNICO
              </label>
              <div className="relative">
                <Mail 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" 
                  strokeWidth={1.5}
                />
                <input
                  type="email"
                  {...register("email", { required: "El email es requerido" })}
                  className="input-base pl-12 w-full focus:border-amber-500 focus:shadow-glow-amber"
                  placeholder="conductor@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-sm">
              <label className="text-caption text-secondary block mb-2">
                CONTRASEÑA
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" 
                  strokeWidth={1.5}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "La contraseña es requerida" })}
                  className="input-base pl-12 pr-12 w-full focus:border-amber-500 focus:shadow-glow-amber"
                  placeholder="Tu contraseña"
                />
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-secondary hover:text-white transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" strokeWidth={1.5} />
                  ) : (
                    <Eye className="w-5 h-5" strokeWidth={1.5} />
                  )}
                </motion.button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-center">
              <Link 
                to="/captain/forgot-password" 
                className="text-sm text-secondary hover:text-amber-400 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit Button - Accent variant for drivers */}
            <Button
              type="submit"
              variant="accent"
              title={loading ? "Iniciando sesión..." : "Iniciar sesión"}
              loading={loading}
              loadingMessage="Iniciando..."
              disabled={loading}
            />

            {/* Divider */}
            <div className="flex items-center space-md">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-caption text-secondary px-4">O</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Google Sign In */}
            <Button
              variant="secondary"
              icon={
                <img
                  src="/screens/google-logo.png"
                  alt="Google"
                  className="w-5 h-5"
                />
              }
              title="Continuar con Google"
              fun={() => {
                window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google?userType=captain`;
              }}
            />
          </motion.form>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="px-8 pb-safe pb-8"
        >
          <div className="floating-island-subtle p-6 text-center">
            <p className="text-body text-secondary">
              ¿No tienes cuenta de conductor?{" "}
              <Link 
                to="/captain/register" 
                className="text-amber-400 font-semibold hover:text-amber-300 transition-colors"
              >
                Aplica aquí
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Membership Required Modal */}
      {showMembershipModal && (
        <MembershipRequiredModal
          isOpen={showMembershipModal}
          onClose={() => setShowMembershipModal(false)}
        />
      )}
    </div>
  );
}


  container: {
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#F2F2F7", // iOS System Gray 6
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  header: {
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
  },
  backButton: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  content: {
    flex: 1,
    padding: "0 24px",
    display: "flex",
    flexDirection: "column",
  },
  badgeContainer: {
    marginBottom: "16px",
  },
  driverBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 14px",
    backgroundColor: "rgba(52, 199, 89, 0.12)", // iOS Green with opacity
    borderRadius: "100px",
    border: "1px solid rgba(52, 199, 89, 0.20)",
  },
  badgeText: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#34C759", // iOS Green
    letterSpacing: "0.06em",
  },
  titleSection: {
    marginBottom: "32px",
  },
  title: {
    fontSize: "48px",
    fontWeight: "700",
    color: "#000000",
    marginBottom: "8px",
    letterSpacing: "-0.02em",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif",
  },
  subtitle: {
    fontSize: "17px",
    color: "#8E8E93",
    lineHeight: 1.5,
  },
  errorContainer: {
    padding: "16px 20px",
    backgroundColor: "rgba(255, 59, 48, 0.12)",
    borderRadius: "16px",
    marginBottom: "16px",
    border: "1px solid rgba(255, 59, 48, 0.20)",
  },
  errorText: {
    fontSize: "15px",
    color: "#FF3B30",
    margin: 0,
    fontWeight: "500",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  passwordContainer: {
    position: "relative",
  },
  showPasswordButton: {
    position: "absolute",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    padding: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  forgotPasswordContainer: {
    textAlign: "right",
    marginTop: "8px",
    marginBottom: "24px",
  },
  forgotPasswordLink: {
    fontSize: "15px",
    color: "#007AFF",
    fontWeight: "600",
    textDecoration: "none",
  },
  buttonContainer: {
    marginTop: "8px",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    margin: "24px 0",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "rgba(0, 0, 0, 0.10)",
  },
  dividerText: {
    fontSize: "13px",
    color: "#8E8E93",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  linksSection: {
    textAlign: "center",
    marginTop: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  signupText: {
    fontSize: "15px",
    color: "#8E8E93",
  },
  signupLink: {
    color: "#007AFF",
    fontWeight: "600",
    textDecoration: "none",
  },
  switchText: {
    fontSize: "14px",
    color: "#8E8E93",
  },
  switchLink: {
    color: "#34C759", // iOS Green for driver
    fontWeight: "500",
    textDecoration: "none",
  },
  footer: {
    padding: "24px",
    textAlign: "center",
  },
  footerLinks: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
  },
  footerLink: {
    fontSize: "13px",
    color: "#8E8E93",
    textDecoration: "none",
  },
  footerDot: {
    color: "#C7C7CC",
  },
};

export default CaptainLogin;
