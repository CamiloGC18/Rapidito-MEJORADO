import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Car, User, Shield, Clock, MapPin } from "lucide-react";
import Button from "../components/common/Button";
import { springConfig } from "../styles/designSystem";

/**
 * 🏝️ SILICON VALLEY LUXURY - GET STARTED SCREEN
 * Ultra-Premium Landing with Brutalist Typography
 * 
 * Design DNA:
 * - BACKGROUND: #F2F2F7 (iOS System Gray 6)
 * - TYPOGRAPHY: 48px+ bold headings, -0.02em tracking
 * - CARDS: Glass islands with rounded-3xl
 * - BUTTONS: Pure black, rounded-full
 * - LABELS: 11px uppercase tracking-wider
 */
function GetStarted() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check for existing user session
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        if (parsedData.type === "user") {
          navigate("/home");
        } else if (parsedData.type === "captain") {
          navigate("/captain/home");
        }
      } catch {
        // Invalid data, continue to landing page
      }
    }
  }, [navigate]);

  const features = [
    { icon: Shield, text: "Viajes seguros" },
    { icon: Clock, text: "Llegamos en minutos" },
    { icon: MapPin, text: "Cobertura total" },
  ];

  return (
    <div style={styles.container}>
      {/* Main content */}
      <div style={styles.content}>
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -20 }}
          transition={springConfig.panel}
          style={styles.header}
        >
          <div style={styles.logo}>
            <span style={styles.logoText}>Rapidito</span>
          </div>
        </motion.header>

        {/* Hero Section */}
        <div style={styles.heroSection}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 40 }}
            transition={{ ...springConfig.panel, delay: 0.1 }}
          >
            <h1 style={styles.heroTitle}>
              Tu viaje,{" "}
              <span style={styles.heroHighlight}>simplificado</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Solicita un viaje en segundos. Llega a donde necesites de forma
              segura y confiable.
            </p>
          </motion.div>

          {/* Features - Pill badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ ...springConfig.panel, delay: 0.2 }}
            style={styles.features}
          >
            {features.map((feature, index) => (
              <div key={index} style={styles.featureItem}>
                <feature.icon size={16} color="#000" strokeWidth={2.5} />
                <span style={styles.featureText}>{feature.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Action Section - Glass Island */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 60 }}
          transition={{ ...springConfig.panel, delay: 0.3 }}
          style={styles.actionSection}
        >
          {/* User type selection */}
          <div style={styles.userTypeSection}>
            <p style={styles.selectLabel}>SELECCIONA TU PERFIL</p>

            {/* Rider option - Glass Card */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              style={styles.userTypeCard}
              onClick={() => navigate("/login")}
            >
              <div style={styles.userTypeIcon}>
                <User size={22} color="#000" strokeWidth={2} />
              </div>
              <div style={styles.userTypeContent}>
                <h3 style={styles.userTypeTitle}>Pasajero</h3>
                <p style={styles.userTypeDesc}>Solicita un viaje ahora</p>
              </div>
              <ArrowRight size={18} color="#8E8E93" />
            </motion.button>

            {/* Driver option - Glass Card */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              style={styles.userTypeCard}
              onClick={() => navigate("/captain/login")}
            >
              <div style={styles.userTypeIcon}>
                <Car size={22} color="#000" strokeWidth={2} />
              </div>
              <div style={styles.userTypeContent}>
                <h3 style={styles.userTypeTitle}>Conductor</h3>
                <p style={styles.userTypeDesc}>Genera ingresos manejando</p>
              </div>
              <ArrowRight size={18} color="#8E8E93" />
            </motion.button>
          </div>

          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>o</span>
            <div style={styles.dividerLine} />
          </div>

          {/* Google Sign In */}
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

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={styles.footer}
        >
          <div style={styles.footerLinks}>
            <Link to="/terms" style={styles.footerLink}>Términos</Link>
            <span style={styles.footerDot}>·</span>
            <Link to="/privacy" style={styles.footerLink}>Privacidad</Link>
            <span style={styles.footerDot}>·</span>
            <Link to="/help" style={styles.footerLink}>Ayuda</Link>
          </div>
          <p style={styles.footerCopyright}>
            © 2024 Rapidito. San Antonio del Táchira.
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#F2F2F7', // iOS System Gray 6
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
    maxWidth: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: '32px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
  },
  logoText: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#000000',
    letterSpacing: '-0.02em',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif",
  },
  heroSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: '24px',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#000000',
    lineHeight: 1.1,
    marginBottom: '16px',
    letterSpacing: '-0.02em',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif",
  },
  heroHighlight: {
    color: '#007AFF', // iOS Blue accent
  },
  heroSubtitle: {
    fontSize: '17px',
    color: '#8E8E93', // iOS Gray
    lineHeight: 1.5,
    marginBottom: '32px',
    maxWidth: '320px',
  },
  features: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.80)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '100px',
    border: '1px solid rgba(255, 255, 255, 0.20)',
  },
  featureText: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#000000',
  },
  actionSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingBottom: '24px',
  },
  userTypeSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  selectLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: '4px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  userTypeCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.20)',
    borderRadius: '24px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    width: '100%',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  },
  userTypeIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '16px',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  userTypeContent: {
    flex: 1,
  },
  userTypeTitle: {
    fontSize: '17px',
    fontWeight: '600',
    color: '#000000',
    marginBottom: '2px',
  },
  userTypeDesc: {
    fontSize: '13px',
    color: '#8E8E93',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    margin: '8px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
  },
  dividerText: {
    fontSize: '13px',
    color: '#8E8E93',
  },
  footer: {
    textAlign: 'center',
    paddingTop: '16px',
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  footerLink: {
    fontSize: '13px',
    color: '#8E8E93',
    textDecoration: 'none',
  },
  footerDot: {
    color: '#C7C7CC',
  },
  footerCopyright: {
    fontSize: '11px',
    color: '#8E8E93',
    letterSpacing: '0.02em',
  },
};

export default GetStarted;
