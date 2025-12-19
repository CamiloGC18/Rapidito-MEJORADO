import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Mail, 
  Lock,
  Sparkles,
  User
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import Console from "../utils/console";
import Button from "../components/Button";

/**
 * 🌟 RAPIDITO USER LOGIN - BRUTAL LUXURY
 * Tesla Model S x Linear.app x iOS 17
 * 
 * Design System:
 * - HERO BACKGROUND: Unsplash city night with obsidian overlay
 * - FLOATING FORM ISLAND: Glassmorphism with emerald accents
 * - INPUTS: Glass inputs with focus glow effects
 * - TYPOGRAPHY: Massive 48px heading with -0.04em tracking
 * - ANIMATIONS: Staggered entrance with brutal easing
 */
function UserLogin() {
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const loginUser = async (data) => {
    if (!data.email?.trim() || !data.password?.trim()) return;

    try {
      setLoading(true);
      setResponseError("");

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/user/login`,
        data
      );

      Console.log(response);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          type: "user",
          data: response.data.user,
        })
      );

      setTimeout(() => navigate("/home"), 300);
    } catch (error) {
      setResponseError(
        error.response?.data?.message || "Error al iniciar sesión"
      );
      Console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian relative overflow-hidden">
      {/* Hero Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&auto=format&fit=crop&q=80"
          alt="Luxury cityscape night"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
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
            <div className="flex items-center space-sm mb-4">
              <div className="floating-island-subtle p-3 rounded-2xl">
                <User 
                  className="text-emerald-400 w-6 h-6" 
                  strokeWidth={1.5} 
                />
              </div>
              <span className="text-caption text-secondary">
                INICIAR SESIÓN
              </span>
            </div>
            
            <h1 className="text-display font-extrabold">
              Bienvenido de{" "}
              <span className="text-gradient-primary">
                vuelta
              </span>
            </h1>
            
            <p className="text-body text-secondary">
              Ingresa tus datos para acceder a tu cuenta premium
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
            onSubmit={handleSubmit(loginUser)}
            className="floating-island p-8 space-xl"
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
                  className="input-base pl-12 w-full"
                  placeholder="tu@email.com"
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
                  className="input-base pl-12 pr-12 w-full"
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
                to="/user/forgot-password" 
                className="text-sm text-secondary hover:text-emerald-400 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
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
                window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google?userType=user`;
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
              ¿No tienes cuenta?{" "}
              <Link 
                to="/register" 
                className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


