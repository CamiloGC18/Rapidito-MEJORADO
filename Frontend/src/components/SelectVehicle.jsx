import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  Clock, 
  Users, 
  Zap, 
  ChevronRight, 
  Car,
  Bike,
  Crown,
  Shield,
  Star,
  DollarSign
} from "lucide-react";
import PaymentMethodSelector from "./PaymentMethodSelector";

/**
 * 🌟 RAPIDITO SELECT VEHICLE - BRUTAL LUXURY
 * Linear.app x Tesla Model S x iOS 17
 * 
 * Design System:
 * - FLOATING VEHICLE ISLANDS: Each vehicle is a glassmorphism card
 * - LUXURY CAR IMAGERY: Real Unsplash photos, not icons
 * - EMERALD/AMBER ACCENTS: Premium brand colors with gradients  
 * - BRUTAL TYPOGRAPHY: Huge pricing, tiny labels with massive contrast
 * - HOVER EFFECTS: translateY(-4px) + shadow increase on cards
 * - SELECTION STATE: Emerald glow + scale animation
 * 
 * Vehicle Hierarchy:
 * - Rapidito (Economico): Standard car with emerald accent
 * - Rapidito Premium: Luxury sedan with amber accent + crown icon
 * - Rapidito Moto: Motorcycle option with bike imagery
 */

// Animation configurations
const cardAnimation = {
  whileHover: { y: -4, scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { type: "spring", damping: 20, stiffness: 300 }
};

// Haptic feedback for premium feel
const triggerHaptic = (intensity = 'light') => {
  if (navigator.vibrate) {
    const patterns = {
      light: [5],
      medium: [10],
      heavy: [15],
    };
    navigator.vibrate(patterns[intensity]);
  }
};

// Vehicle data with matte styling
const vehicles = [
  {
    id: 1,
    name: "Carro",
    description: "Cómodo y seguro",
    type: "car",
    image: "/Uber-PNG-Photos.png",
    capacity: "4 personas",
    eta: "3-5 min",
    icon: "🚗",
  },
  {
    id: 2,
    name: "Moto",
    description: "Rápido y económico",
    type: "bike",
    image: "/bike.webp",
    capacity: "1 persona",
    eta: "2-4 min",
    icon: "🏍️",
  },
];

function SelectVehicle({
  selectedVehicle,
  showPanel,
  setShowPanel,
  showPreviousPanel,
  showNextPanel,
  fare,
  paymentMethod = "cash",
  onPaymentMethodChange = () => {},
}) {
  const [currentlySelected, setCurrentlySelected] = useState(null);
  const [hoveredVehicle, setHoveredVehicle] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethod);

  // Check for reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Reset selection when panel closes
  useEffect(() => {
    if (!showPanel) {
      setCurrentlySelected(null);
    }
  }, [showPanel]);

  // Format currency
  const formatPrice = (price) => {
    if (!price) return '$0';
    return `$${(price / 1000).toFixed(0)}K`;
  };

  const formatFullPrice = (price) => {
    if (!price) return 'COP$ 0';
    return `COP$ ${price.toLocaleString('es-CO')}`;
  };

  const handleSelect = (vehicle) => {
    setCurrentlySelected(vehicle.id);
    triggerHaptic('medium');
    
    setTimeout(() => {
      selectedVehicle(vehicle.type);
      onPaymentMethodChange(selectedPaymentMethod);
      setShowPanel(false);
      showNextPanel(true);
      triggerHaptic('heavy');
    }, 300);
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    triggerHaptic('light');
  };

  return (
    <AnimatePresence>
      {showPanel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        >
          {/* Bottom Floating Island */}
          <motion.div
            initial={{ y: '100%', scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: '100%', scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 150 || velocity.y > 500) {
                setShowPanel(false);
                triggerHaptic('light');
              }
            }}
            className="absolute bottom-0 left-6 right-6 mb-6"
          >
            <div className="floating-island p-8 space-xl">
              {/* Drag Handle */}
              <div className="flex justify-center -mt-4 mb-6">
                <motion.div 
                  whileHover={{ scale: 1.2 }}
                  className="w-12 h-1 rounded-full bg-white/20"
                />
              </div>

              {/* Header - Brutal Typography */}
              <div className="text-center space-md mb-8">
                <h2 className="text-display text-4xl font-extrabold">
                  Elige tu{" "}
                  <span className="text-gradient-primary">viaje</span>
                </h2>
                <p className="text-caption text-secondary">
                  SELECCIONA TU VEHÍCULO PREMIUM
                </p>
              </div>

              {/* Vehicle Cards - Floating Islands Grid */}
              <div className="space-lg mb-8">
                {vehicles.map((vehicle, index) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    fare={fare}
                    isSelected={currentlySelected === vehicle.id}
                    onSelect={() => handleSelect(vehicle)}
                    formatPrice={formatPrice}
                    delay={index * 0.1}
                  />
                ))}
              </div>
              
              {/* Payment Method Selector */}
              <PaymentMethodSelector 
                selectedMethod={selectedPaymentMethod}
                onMethodChange={handlePaymentMethodChange}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * VehicleCard - Floating Island Component
 * Brutal luxury card with glassmorphism and gradients
 */
function VehicleCard({
  vehicle,
  fare,
  isSelected,
  onSelect,
  formatPrice,
  formatFullPrice,
  delay,
}) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Vehicle data with luxury imagery
  const vehicleImages = {
    car: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&auto=format&fit=crop&q=80",
    premium: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&auto=format&fit=crop&q=80", 
    bike: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop&q=80"
  };

  const vehicleInfo = {
    car: { icon: Car, accent: "emerald" },
    premium: { icon: Crown, accent: "amber" },
    bike: { icon: Bike, accent: "blue" }
  };

  const info = vehicleInfo[vehicle.type] || vehicleInfo.car;
  const IconComponent = info.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ...cardAnimation.transition }}
      {...cardAnimation}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onSelect}
      className={`
        floating-island cursor-pointer relative overflow-hidden
        ${isSelected ? 'border-2 border-emerald-500 shadow-glow-emerald' : 'border border-white/10'}
        hover-lift active-scale
      `}
    >
      {/* Selection Indicator */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            className="absolute top-4 right-4 z-10 floating-island-subtle p-2 rounded-xl bg-emerald-500"
          >
            <Check className="w-4 h-4 text-white" strokeWidth={2} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 flex items-center space-lg">
        {/* Vehicle Image with Luxury Imagery */}
        <div className="flex-shrink-0 relative">
          <motion.div
            animate={isSelected || isHovered ? { scale: 1.05 } : { scale: 1 }}
            className="w-24 h-24 rounded-2xl overflow-hidden floating-island-subtle relative"
          >
            {/* Premium Vehicle Imagery */}
            <img
              src={vehicleImages[vehicle.type] || vehicleImages.car}
              alt={vehicle.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Vehicle Icon Overlay */}
            <div className="absolute bottom-2 left-2">
              <IconComponent className={`w-6 h-6 ${
                vehicle.type === 'premium' ? 'text-amber-400' 
                : vehicle.type === 'bike' ? 'text-blue-400'
                : 'text-emerald-400'
              }`} strokeWidth={1.5} />
            </div>
          </motion.div>
        </div>

        {/* Vehicle Info */}
        <div className="flex-1">
          <h3 className={`text-heading text-lg font-bold mb-1 ${
            isSelected ? 'text-emerald-400' : 'text-white'
          }`}>
            {vehicle.name}
          </h3>
          
          <p className="text-body text-secondary text-sm mb-3">
            {vehicle.description}
          </p>

          {/* Vehicle Stats - Brutal Minimal Pills */}
          <div className="flex items-center space-sm">
            <div className="floating-island-subtle px-3 py-1.5 rounded-xl flex items-center space-sm">
              <Users className="w-3 h-3 text-secondary" strokeWidth={1.5} />
              <span className="text-caption text-secondary font-medium">
                {vehicle.capacity || "1-4"}
              </span>
            </div>
            
            <div className="floating-island-subtle px-3 py-1.5 rounded-xl flex items-center space-sm">
              <Clock className="w-3 h-3 text-secondary" strokeWidth={1.5} />
              <span className="text-caption text-secondary font-medium">
                {vehicle.eta || "3 min"}
              </span>
            </div>
            
            {vehicle.type === 'premium' && (
              <div className="floating-island-subtle px-3 py-1.5 rounded-xl flex items-center space-sm bg-amber-500/10 border border-amber-500/20">
                <Shield className="w-3 h-3 text-amber-400" strokeWidth={1.5} />
                <span className="text-caption text-amber-400 font-bold">LUXURY</span>
              </div>
            )}
          </div>
        </div>

        {/* Price - Brutal Typography */}
        <div className="text-right">
          <motion.h2
            animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className={`text-display font-black leading-none tracking-tight ${
              isSelected ? 'text-emerald-400' : 'text-white'
            }`}
          >
            {formatPrice(fare?.[vehicle.type])}
          </motion.h2>
          <p className="text-caption text-secondary mt-1 font-medium">
            {formatFullPrice(fare?.[vehicle.type])}
          </p>
        </div>
      </div>

      {/* Selection Glow Border */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-400"
        />
      )}

      {/* Hover Arrow */}
      <AnimatePresence>
        {isHovered && !isSelected && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <ChevronRight className="w-5 h-5 text-secondary" strokeWidth={1.5} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default SelectVehicle;