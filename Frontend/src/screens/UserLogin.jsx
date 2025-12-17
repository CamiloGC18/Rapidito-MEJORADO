import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import Console from "../utils/console";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { springConfig } from "../styles/designSystem";

/**
 * UserLogin - Silicon Valley Luxury Login Screen
 * Ultra-Premium, Brutalist Minimalist, Liquid Glass aesthetic
 * iOS native experience with spring physics
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
    <div style={styles.container}>
      {/* Header with back button - Glass Island */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -20 }}
        transition={springConfig.panel}
        style={styles.header}
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          transition={springConfig.button}
          onClick={() => navigate("/")}
          style={styles.backButton}
          aria-label="Volver"
        >
          <ArrowLeft size={20} color="#000" strokeWidth={2.5} />
        </motion.button>
      </motion.header>

      {/* Main content */}
      <div style={styles.content}>
        {/* Title section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={springConfig.panel}
          style={styles.titleSection}
        >
          <span style={styles.label}>INICIAR SESIÓN</span>
          <h1 style={styles.title}>Bienvenido</h1>
          <p style={styles.subtitle}>
            Ingresa tus datos para continuar
          </p>
        </motion.div>

        {/* Error message */}
        {responseError && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={springConfig.button}
            style={styles.errorContainer}
          >
            <p style={styles.errorText}>{responseError}</p>
          </motion.div>
        )}

        {/* Login form - Glass Card */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ ...springConfig.panel, delay: 0.1 }}
          onSubmit={handleSubmit(loginUser)}
          style={styles.form}
        >
          {/* Email input */}
          <Input
            label="Correo electrónico"
            type="email"
            name="email"
            icon={Mail}
            register={register}
            error={errors.email && { message: "El email es requerido" }}
            floatingLabel
            clearable
          />

          {/* Password input */}
          <div style={styles.passwordContainer}>
            <Input
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              name="password"
              icon={Lock}
              register={register}
              error={errors.password && { message: "La contraseña es requerida" }}
              floatingLabel
              clearable={false}
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.showPasswordButton}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? (
                <EyeOff size={18} color="#8E8E93" />
              ) : (
                <Eye size={18} color="#8E8E93" />
              )}
            </motion.button>
          </div>

          {/* Forgot password link */}
          <div style={styles.forgotPasswordContainer}>
            <Link to="/user/forgot-password" style={styles.forgotPasswordLink}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Submit button */}
          <div style={styles.buttonContainer}>
            <Button
              type="submit"
              variant="primary"
              size="large"
              title={loading ? "Iniciando sesión..." : "Iniciar sesión"}
              loading={loading}
              loadingMessage="Iniciando..."
              fullWidth
            />
          </div>
        </motion.form>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ ...springConfig.gentle, delay: 0.2 }}
          style={styles.divider}
        >
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>o</span>
          <div style={styles.dividerLine} />
        </motion.div>

        {/* Google button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ ...springConfig.panel, delay: 0.25 }}
        >
          <Button
            variant="secondary"
            size="large"
            icon={
              <img
                src="/screens/google-logo.png"
                alt="Google"
                style={{ width: 20, height: 20 }}
              />
            }
            title="Continuar con Google"
            onClick={() => {
              window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google?userType=user`;
            }}
            fullWidth
          />
        </motion.div>

        {/* Sign up link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ ...springConfig.gentle, delay: 0.3 }}
          style={styles.signupContainer}
        >
          <p style={styles.signupText}>
            ¿No tienes cuenta?{" "}
            <Link to="/signup" style={styles.signupLink}>
              Regístrate
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ ...springConfig.gentle, delay: 0.35 }}
        style={styles.footer}
      >
        <div style={styles.footerLinks}>
          <Link to="/terms" style={styles.footerLink}>Términos</Link>
          <span style={styles.footerDot}>·</span>
          <Link to="/privacy" style={styles.footerLink}>Privacidad</Link>
          <span style={styles.footerDot}>·</span>
          <Link to="/help" style={styles.footerLink}>Ayuda</Link>
        </div>
      </motion.footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#F2F2F7', // iOS System Gray 6
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
  },
  backButton: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  content: {
    flex: 1,
    padding: '0 24px',
    display: 'flex',
    flexDirection: 'column',
  },
  titleSection: {
    marginBottom: '32px',
  },
  label: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#8E8E93',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: '8px',
    display: 'block',
  },
  title: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#000000',
    marginBottom: '8px',
    letterSpacing: '-0.02em',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif",
  },
  subtitle: {
    fontSize: '17px',
    color: '#8E8E93',
    lineHeight: 1.5,
  },
  errorContainer: {
    padding: '16px 20px',
    backgroundColor: 'rgba(255, 59, 48, 0.12)', // iOS Red with opacity
    borderRadius: '16px',
    marginBottom: '16px',
    border: '1px solid rgba(255, 59, 48, 0.20)',
  },
  errorText: {
    fontSize: '15px',
    color: '#FF3B30', // iOS Red
    margin: 0,
    fontWeight: '500',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  passwordContainer: {
    position: 'relative',
  },
  showPasswordButton: {
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    padding: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  forgotPasswordContainer: {
    textAlign: 'right',
    marginTop: '8px',
    marginBottom: '24px',
  },
  forgotPasswordLink: {
    fontSize: '15px',
    color: '#007AFF', // iOS Blue
    fontWeight: '600',
    textDecoration: 'none',
  },
  buttonContainer: {
    marginTop: '8px',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    margin: '24px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
  },
  dividerText: {
    fontSize: '13px',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  signupContainer: {
    textAlign: 'center',
    marginTop: '24px',
  },
  signupText: {
    fontSize: '15px',
    color: '#8E8E93',
  },
  signupLink: {
    color: '#007AFF', // iOS Blue
    fontWeight: '600',
    textDecoration: 'none',
  },
  footer: {
    padding: '24px',
    textAlign: 'center',
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
  },
  footerLink: {
    fontSize: '13px',
    color: '#8E8E93',
    textDecoration: 'none',
  },
  footerDot: {
    color: '#C7C7CC',
  },
};

export default UserLogin;
