import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Car, 
  User, 
  Shield, 
  Zap, 
  MapPin,
  Sparkles 
} from "lucide-react";
import Button from "../components/Button";

/**
 * 🌟 RAPIDITO BRUTAL LUXURY - GET STARTED
 * Tesla Model S x Linear.app x iOS 17
 * 
 * Design System:
 * - HERO IMAGE: Unsplash luxury car with obsidian gradient overlay
 * - TYPOGRAPHY: 72px display heading with -0.04em tracking
 * - FLOATING ISLANDS: All UI elements are glassmorphism cards
 * - ANIMATIONS: Staggered fade-up with cubic-bezier easing
 * - SPACING: Aggressive 64px gaps, breathe don't suffocate
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

  // Features with luxury icons
  const features = [
    { 
      icon: Shield, 
      text: "Viajes seguros",
      desc: "Conductores verificados"
    },
    { 
      icon: Zap, 
      text: "Ultra rápido",
      desc: "Llega en minutos"
    },
    { 
      icon: MapPin, 
      text: "Cobertura total",
      desc: "Toda la frontera"
    },
  ];

  return (
    <div className="min-h-screen bg-obsidian relative overflow-hidden">
      {/* Hero Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&auto=format&fit=crop&q=80"
          alt="Luxury transportation"
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
        <div className="floating-island-subtle px-6 py-4 inline-block">
          <div className="flex items-center space-sm">
            <Sparkles className="text-emerald-400 w-6 h-6" strokeWidth={1.5} />
            <span className="text-heading font-bold text-gradient-primary">
              Rapidito
            </span>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Hero Section */}
        <div className="flex-1 flex flex-col justify-center px-8 space-3xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-lg"
          >
            {/* Brutal Luxury Typography */}
            <h1 className="text-display font-extrabold leading-none">
              Tu viaje,{" "}
              <span className="text-gradient-primary">
                reimaginado
              </span>
            </h1>
            
            <p className="text-body text-secondary max-w-md leading-relaxed">
              Experimenta el futuro del transporte. Viajes premium con tecnología de vanguardia.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="floating-island-subtle p-6 hover-lift"
              >
                <div className="flex items-start space-md">
                  <div className="floating-island-subtle p-3 rounded-2xl">
                    <feature.icon 
                      className="text-emerald-400 w-5 h-5" 
                      strokeWidth={1.5} 
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-heading text-sm font-semibold mb-1">
                      {feature.text}
                    </h3>
                    <p className="text-caption text-secondary">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Action Section - Bottom Floating Island */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 60 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="px-8 pb-safe pb-8"
        >
          <div className="floating-island p-8 space-xl">
            {/* Selection Label */}
            <div className="text-center">
              <p className="text-caption text-secondary">
                SELECCIONA TU PERFIL
              </p>
            </div>

            {/* User Type Cards */}
            <div className="space-lg">
              {/* Passenger Card */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/login")}
                className="floating-island-subtle p-6 w-full hover-lift active-scale"
              >
                <div className="flex items-center space-lg">
                  <div className="floating-island-subtle p-4 rounded-2xl">
                    <User 
                      className="text-emerald-400 w-6 h-6" 
                      strokeWidth={1.5} 
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-heading text-lg font-semibold mb-1">
                      Pasajero
                    </h3>
                    <p className="text-body text-secondary text-sm">
                      Solicita un viaje premium
                    </p>
                  </div>
                  <ArrowRight 
                    className="text-secondary w-5 h-5" 
                    strokeWidth={1.5} 
                  />
                </div>
              </motion.button>

              {/* Driver Card */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/captain/login")}
                className="floating-island-subtle p-6 w-full hover-lift active-scale"
              >
                <div className="flex items-center space-lg">
                  <div className="floating-island-subtle p-4 rounded-2xl">
                    <Car 
                      className="text-amber-400 w-6 h-6" 
                      strokeWidth={1.5} 
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-heading text-lg font-semibold mb-1">
                      Conductor
                    </h3>
                    <p className="text-body text-secondary text-sm">
                      Genera ingresos premium
                    </p>
                  </div>
                  <ArrowRight 
                    className="text-secondary w-5 h-5" 
                    strokeWidth={1.5} 
                  />
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>

  );
}


