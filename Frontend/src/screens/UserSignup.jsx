import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import Console from "../utils/console";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { springConfig } from "../styles/designSystem";

/**
 * UserSignup - Silicon Valley Luxury Signup Screen
 * Ultra-Premium, Brutalist Minimalist, Liquid Glass aesthetic
 * iOS native experience with spring physics
 */
function UserSignup() {
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [mounted, setMounted] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const navigation = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const signupUser = async (data) => {
    if (!termsAccepted) {
      setResponseError("Debes aceptar los Términos y Condiciones");
      return;
    }

    const userData = {
      fullname: {
        firstname: data.firstname,
        lastname: data.lastname,
      },
      email: data.email,
      password: data.password,
      phone: data.phone
    };

    try {
      setLoading(true);
      setResponseError("");
      
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/user/register`,
        userData
      );
      Console.log(response);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userData", JSON.stringify({
        type: "user",
        data: response.data.user,
      }));
      
      setTimeout(() => {
        navigation("/home");
      }, 300);
    } catch (error) {
      setResponseError(error.response?.data?.[0]?.msg || error.response?.data?.message || "Error al registrarse");
      Console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (responseError) {
      const timer = setTimeout(() => {
        setResponseError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [responseError]);

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
          onClick={() => navigation("/")}
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
          <span style={styles.label}>NUEVO USUARIO</span>
          <h1 style={styles.title}>Crear Cuenta</h1>
          <p style={styles.subtitle}>
            Comienza tu viaje con Rapidito
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

        {/* Google OAuth Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ ...springConfig.panel, delay: 0.1 }}
          style={{ marginBottom: '16px' }}
        >
          <Button
            variant="secondary"
            size="large"
            icon={<img src="/screens/google-logo.png" alt="Google" style={{ width: 20, height: 20 }} />}
            title="Continuar con Google"
            onClick={() => window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google?userType=user`}
            fullWidth
          />
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ ...springConfig.gentle, delay: 0.15 }}
          style={styles.divider}
        >
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>o registrarse con email</span>
          <div style={styles.dividerLine} />
        </motion.div>

        {/* Signup form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ ...springConfig.panel, delay: 0.2 }}
          onSubmit={handleSubmit(signupUser)}
          style={styles.form}
        >
          {/* First Name */}
          <Input
            label="Nombre"
            type="text"
            name="firstname"
            icon={User}
            register={register}
            error={errors.firstname && { message: "El nombre es requerido" }}
            floatingLabel
            clearable
          />

          {/* Last Name */}
          <Input
            label="Apellido"
            type="text"
            name="lastname"
            icon={User}
            register={register}
            error={errors.lastname && { message: "El apellido es requerido" }}
            floatingLabel
            clearable
          />

          {/* Email */}
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

          {/* Phone */}
          <Input
            label="Teléfono"
            type="tel"
            name="phone"
            icon={Phone}
            register={register}
            error={errors.phone && { message: "El teléfono es requerido" }}
            floatingLabel
            clearable
          />

          {/* Password */}
          <div style={styles.passwordContainer}>
            <Input
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              name="password"
              icon={Lock}
              register={register}
              error={errors.password && {
                message: errors.password.type === "minLength"
                  ? "La contraseña debe tener al menos 6 caracteres"
                  : "La contraseña es requerida"
              }}
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

          {/* Terms Checkbox */}
          <div style={styles.termsContainer}>
            <label style={styles.termsLabel}>
              <div style={styles.checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  style={styles.checkbox}
                />
                <div style={{
                  ...styles.checkboxCustom,
                  backgroundColor: termsAccepted ? '#007AFF' : 'transparent',
                  borderColor: termsAccepted ? '#007AFF' : 'rgba(0, 0, 0, 0.15)',
                }}>
                  {termsAccepted && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>
              <span style={styles.termsText}>
                Acepto los{' '}
                <Link to="/terms" style={styles.termsLink}>Términos</Link>
                {' '}y la{' '}
                <Link to="/privacy" style={styles.termsLink}>Privacidad</Link>
              </span>
            </label>
          </div>

          {/* Submit button */}
          <div style={styles.buttonContainer}>
            <Button
              type="submit"
              variant="primary"
              size="large"
              title={loading ? "Creando cuenta..." : "Crear Cuenta"}
              icon={loading ? null : <UserPlus size={20} />}
              loading={loading}
              loadingMessage="Creando cuenta..."
              fullWidth
            />
          </div>
        </motion.form>

        {/* Login link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ ...springConfig.gentle, delay: 0.3 }}
          style={styles.loginContainer}
        >
          <p style={styles.loginText}>
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" style={styles.loginLink}>
              Inicia sesión
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
    backgroundColor: '#F2F2F7',
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
    overflowY: 'auto',
  },
  titleSection: {
    marginBottom: '24px',
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
    backgroundColor: 'rgba(255, 59, 48, 0.12)',
    borderRadius: '16px',
    marginBottom: '16px',
    border: '1px solid rgba(255, 59, 48, 0.20)',
  },
  errorText: {
    fontSize: '15px',
    color: '#FF3B30',
    margin: 0,
    fontWeight: '500',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    margin: '16px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
  },
  dividerText: {
    fontSize: '13px',
    color: '#8E8E93',
    whiteSpace: 'nowrap',
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
  termsContainer: {
    marginTop: '16px',
    marginBottom: '24px',
  },
  termsLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    cursor: 'pointer',
  },
  checkboxWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    position: 'absolute',
    opacity: 0,
    width: '22px',
    height: '22px',
    cursor: 'pointer',
  },
  checkboxCustom: {
    width: '22px',
    height: '22px',
    borderRadius: '6px',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  termsText: {
    fontSize: '14px',
    color: '#8E8E93',
    lineHeight: 1.4,
  },
  termsLink: {
    color: '#007AFF',
    textDecoration: 'none',
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: '8px',
  },
  loginContainer: {
    textAlign: 'center',
    marginTop: '24px',
  },
  loginText: {
    fontSize: '15px',
    color: '#8E8E93',
  },
  loginLink: {
    color: '#007AFF',
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

export default UserSignup;
