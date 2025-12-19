import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, ChevronRight, Car, User, Mail, Lock, Phone, UserPlus, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Console from "../utils/console";

// Import design system components
import { springConfig } from "../styles/designSystem";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Badge from "../components/common/Badge";

/**
 * CaptainSignup - Silicon Valley Luxury Design
 * Premium dual-mode design with liquid glass and depth layers
 * Two-step form with floating inputs and spring animations
 */
function CaptainSignup() {
  const [responseError, setResponseError] = useState("");
  const [showVehiclePanel, setShowVehiclePanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Animation variants with iOS spring physics
  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        delayChildren: prefersReducedMotion ? 0 : 0.2
      }
    }
  };

  const fadeInUp = {
    initial: prefersReducedMotion ? {} : { opacity: 0, y: 40 },
    animate: prefersReducedMotion ? {} : { opacity: 1, y: 0 },
    transition: { type: "spring", damping: 30, stiffness: 300, mass: 0.8 }
  };

  const scaleIn = {
    initial: prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 },
    animate: prefersReducedMotion ? {} : { opacity: 1, scale: 1 },
    transition: { type: "spring", damping: 30, stiffness: 300, mass: 0.8, delay: 0.1 }
  };

  const panelTransition = {
    initial: prefersReducedMotion ? {} : { opacity: 0, x: 20, scale: 0.98 },
    animate: prefersReducedMotion ? {} : { opacity: 1, x: 0, scale: 1 },
    exit: prefersReducedMotion ? {} : { opacity: 0, x: -20, scale: 0.95 },
    transition: { type: "spring", damping: 25, stiffness: 250, mass: 0.8 }
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
    trigger,
  } = useForm();

  const navigation = useNavigate();
  
  const signupCaptain = async (data) => {
    if (!termsAccepted) {
      setResponseError("Debes aceptar los Términos y Condiciones");
      return;
    }

    const captainData = {
      fullname: {
        firstname: data.firstname,
        lastname: data.lastname,
      },
      email: data.email,
      password: data.password,
      phone: data.phone,
      vehicle: {
        color: data.color,
        number: data.number,
        capacity: data.capacity,
        type: data.type,
        brand: data.brand,
        model: data.model,
      },
    };
    Console.log(captainData);

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/captain/register`,
        captainData
      );
      Console.log(response);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userData", JSON.stringify({
        type: "captain",
        data: response.data.captain,
      }));
      navigation("/captain/home");
    } catch (error) {
      setResponseError(
        error.response?.data?.[0]?.msg || error.response?.data?.message || "Error al registrarse"
      );
      setShowVehiclePanel(false);
      Console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async () => {
    // Validate personal info fields before proceeding
    const isValid = await trigger(['firstname', 'lastname', 'email', 'phone', 'password']);
    if (isValid) {
      setShowVehiclePanel(true);
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
    <div className="min-h-screen bg-ios-light dark:bg-black flex flex-col overflow-y-auto">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-white to-zinc-50 dark:from-[#0A0A0A] dark:via-[#101010] dark:to-[#080808] opacity-90" />
      
      {/* Subtle Mesh Gradient Overlay */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[url('/2.webp')] bg-cover bg-center opacity-30 mix-blend-overlay dark:opacity-30"
        aria-hidden="true"
      />

      {/* Back Button - Floating Glass Pill */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300, delay: 0.1 }}
        className="absolute top-6 left-6 z-20"
      >
        <Button
          variant="glass"
          size="small"
          icon={<ArrowLeft size={18} />}
          title={showVehiclePanel ? "Atrás" : "Volver"}
          onClick={() => showVehiclePanel ? setShowVehiclePanel(false) : navigation('/')}
          fullWidth={false}
        />
      </motion.div>

      {/* Content Wrapper - Centered Signup Island */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-6 py-10">
        {/* Centered Floating Island Card */}
        <motion.div
          variants={scaleIn}
          initial="initial"
          animate="animate"
          className="w-full max-w-md"
        >
          <Card 
            variant="floating" 
            borderRadius="xlarge"
            className="py-10 px-8"
          >
            {/* Header with Title and Captain Badge */}
            <div className="flex flex-col items-center mb-8">
              <motion.div variants={fadeInUp} className="mb-4">
                <Badge 
                  variant="primary" 
                  size="medium"
                  icon={<Car size={16} />}
                  className="mb-3"
                >
                  CONDUCTOR
                </Badge>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="text-center">
                <h2 className="text-[28px] font-bold tracking-tight text-black dark:text-white">Crear Cuenta</h2>
                <p className="mt-2 text-ios-gray">Únete a Rapidito como conductor</p>
              </motion.div>
            </div>

            {/* iOS Style Progress Indicator */}
            <motion.div 
              variants={fadeInUp}
              className="flex items-center gap-4 mb-8 px-4"
            >
              {/* Step 1 - User Info */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full ${!showVehiclePanel ? 'bg-ios-blue' : 'bg-ios-blue/20'} flex items-center justify-center mb-2 transition-all duration-300 shadow-lg`}>
                  <User className={`w-5 h-5 ${!showVehiclePanel ? 'text-white' : 'text-ios-blue'}`} />
                </div>
                <span className={`text-xs ${!showVehiclePanel ? 'text-black dark:text-white' : 'text-ios-gray'} font-medium`}>Personal</span>
              </div>
              
              {/* Progress Line */}
              <div className="flex-1 h-[3px] relative overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
                <div 
                  className="absolute top-0 left-0 h-full bg-ios-blue transition-all duration-500 ease-out"
                  style={{ width: showVehiclePanel ? '100%' : '0%' }}
                />
              </div>
              
              {/* Step 2 - Vehicle Info */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full ${showVehiclePanel ? 'bg-ios-blue' : 'bg-ios-blue/10'} flex items-center justify-center mb-2 transition-all duration-300`}>
                  <Car className={`w-5 h-5 ${showVehiclePanel ? 'text-white' : 'text-ios-blue/70'}`} />
                </div>
                <span className={`text-xs ${showVehiclePanel ? 'text-black dark:text-white' : 'text-ios-gray'} font-medium`}>Vehículo</span>
              </div>
            </motion.div>
            
            {/* Google OAuth Button - Only show on first step */}
            {!showVehiclePanel && (
              <>
                <motion.div variants={fadeInUp} className="mb-4">
                  <Button
                    variant="glass"
                    size="large"
                    icon={<img src="/screens/google-logo.png" alt="Google" className="w-5 h-5" />}
                    title="Continuar con Google"
                    onClick={() => window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google?userType=captain`}
                    fullWidth
                  />
                </motion.div>

                {/* Divider with text */}
                <motion.div variants={fadeInUp} className="flex items-center gap-4 my-6">
                  <div className="h-px flex-1 bg-zinc-200 dark:bg-white/10"></div>
                  <span className="text-ios-gray text-sm">o registrarse con email</span>
                  <div className="h-px flex-1 bg-zinc-200 dark:bg-white/10"></div>
                </motion.div>
              </>
            )}

            {/* Error Message */}
            {responseError && (
              <motion.div
                variants={fadeInUp}
                className="mb-6 px-4 py-3 bg-ios-red/10 border border-ios-red/20 rounded-xl text-ios-red text-sm flex items-center gap-2"
                role="alert"
              >
                <span className="rounded-full bg-ios-red/20 p-1">
                  <AlertCircle size={14} />
                </span>
                {responseError}
              </motion.div>
            )}

            <form onSubmit={handleSubmit(signupCaptain)} className="space-y-5">
              <AnimatePresence mode="wait">
                {!showVehiclePanel ? (
                  <motion.div
                    key="personal"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    {...panelTransition}
                  >
                    {/* Personal Info Form */}
                    <div className="space-y-5">
                      {/* First Name Input - iOS Floating Label */}
                      <motion.div variants={fadeInUp}>
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
                      </motion.div>

                      {/* Last Name Input - iOS Floating Label */}
                      <motion.div variants={fadeInUp}>
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
                      </motion.div>

                      {/* Email Input - iOS Floating Label */}
                      <motion.div variants={fadeInUp}>
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
                      </motion.div>

                      {/* Phone Input - iOS Floating Label */}
                      <motion.div variants={fadeInUp}>
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
                      </motion.div>

                      {/* Password Input - iOS Floating Label */}
                      <motion.div variants={fadeInUp} className="relative">
                        <Input
                          label="Contraseña"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          icon={Lock}
                          register={register("password", { required: true, minLength: 6 })}
                          error={errors.password && { 
                            message: errors.password.type === "minLength" 
                              ? "La contraseña debe tener al menos 6 caracteres" 
                              : "La contraseña es requerida"
                          }}
                          floatingLabel
                          clearable={false}
                        />
                        
                        {/* Show/Hide Password Button */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-ios-gray hover:text-black dark:hover:text-white p-1 rounded-full transition-colors"
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </motion.div>
                      
                      {/* Login Link */}
                      <motion.div variants={fadeInUp} className="mt-6 pt-2 text-center">
                        <p className="text-ios-gray">
                          ¿Ya tienes cuenta?{" "}
                          <Link 
                            to="/captain/login" 
                            className="font-semibold text-black dark:text-white hover:text-ios-blue transition-colors"
                          >
                            Inicia sesión
                          </Link>
                        </p>
                      </motion.div>
                      
                      {/* Next Step Button */}
                      <motion.div variants={fadeInUp} className="mt-8">
                        <Button
                          variant="primary"
                          size="large"
                          title="Siguiente paso"
                          icon={<ChevronRight size={20} />}
                          iconPosition="right"
                          onClick={handleNextStep}
                          fullWidth
                        />
                      </motion.div>
                    </div>
                  </motion.div>
              ) : (
                <motion.div
                  key="vehicle"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  {...panelTransition}
                >
                  {/* Vehicle Info Form */}
                  <div className="space-y-5">
                    <motion.div variants={fadeInUp}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-full bg-ios-blue/10 text-ios-blue">
                          <Car size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-black dark:text-white">Información del vehículo</h3>
                      </div>
                    </motion.div>
                    
                    {/* Vehicle Type - iOS Style Select */}
                    <motion.div variants={fadeInUp} className="relative">
                      <div className="relative rounded-xl border border-zinc-200 dark:border-white/10 overflow-hidden">
                        <select
                          id="type"
                          {...register("type", { required: true })}
                          className="w-full bg-white dark:bg-zinc-900 px-4 py-3.5 pr-12 text-black dark:text-white appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-ios-blue transition-all duration-200"
                          aria-describedby={errors.type ? "type-error" : undefined}
                          defaultValue=""
                        >
                          <option value="" disabled className="bg-white dark:bg-zinc-900">
                            Tipo de vehículo
                          </option>
                          <option value="car" className="bg-white dark:bg-zinc-900">Carro</option>
                          <option value="bike" className="bg-white dark:bg-zinc-900">Moto</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-ios-blue/10 text-ios-blue pointer-events-none">
                          <ChevronRight className="w-4 h-4 rotate-90" />
                        </div>
                      </div>
                      {errors.type && (
                        <p className="mt-1 text-sm text-ios-red" role="alert">
                          El tipo es requerido
                        </p>
                      )}
                    </motion.div>

                    {/* Vehicle Number (Plate) - iOS Floating Label */}
                    <motion.div variants={fadeInUp}>
                      <Input
                        label="Placa del vehículo"
                        type="text"
                        name="number"
                        icon={Car}
                        register={register}
                        error={errors.number && { message: "La placa es requerida" }}
                        floatingLabel
                        clearable
                      />
                    </motion.div>

                    {/* Color - iOS Floating Label */}
                    <motion.div variants={fadeInUp}>
                      <Input
                        label="Color del vehículo"
                        type="text"
                        name="color"
                        register={register}
                        error={errors.color && { message: "El color es requerido" }}
                        floatingLabel
                        clearable
                      />
                    </motion.div>

                    {/* Brand - iOS Floating Label */}
                    <motion.div variants={fadeInUp}>
                      <Input
                        label="Marca del vehículo"
                        type="text"
                        name="brand"
                        register={register}
                        error={errors.brand && { message: "La marca es requerida" }}
                        floatingLabel
                        clearable
                      />
                    </motion.div>

                    {/* Model - iOS Floating Label */}
                    <motion.div variants={fadeInUp}>
                      <Input
                        label="Modelo del vehículo"
                        type="text"
                        name="model"
                        register={register}
                        error={errors.model && { message: "El modelo es requerido" }}
                        floatingLabel
                        clearable
                      />
                    </motion.div>

                    {/* Capacity - iOS Floating Label */}
                    <motion.div variants={fadeInUp}>
                      <Input
                        label="Capacidad de pasajeros"
                        type="number"
                        name="capacity"
                        register={register("capacity", { required: true, min: 1 })}
                        error={errors.capacity && { message: "La capacidad es requerida" }}
                        floatingLabel
                        clearable
                      />
                    </motion.div>

                    {/* Terms Checkbox - iOS Style */}
                    <motion.div variants={fadeInUp} className="mt-6">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="peer appearance-none h-[22px] w-[22px] rounded-[6px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 checked:bg-ios-blue checked:border-0 transition-all duration-200"
                          />
                          <svg
                            className="absolute h-[14px] w-[14px] text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <span className="text-sm text-ios-gray">
                          Acepto los{' '}
                          <Link to="/terms" className="text-ios-blue hover:text-ios-blue/80 transition-colors">
                            Términos y Condiciones
                          </Link>
                          {' '}y la{' '}
                          <Link to="/privacy" className="text-ios-blue hover:text-ios-blue/80 transition-colors">
                            Política de Privacidad
                          </Link>
                        </span>
                      </label>
                    </motion.div>

                    {/* Info Text - iOS Style */}
                    <motion.div variants={fadeInUp} className="mt-6">
                      <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-ios-blue/5 text-sm text-ios-gray">
                        <AlertCircle size={16} className="text-ios-blue" />
                        <span>Revisaremos tu solicitud en 24-48 horas</span>
                      </div>
                    </motion.div>
                    
                    {/* Submit Button */}
                    <motion.div variants={fadeInUp} className="mt-8">
                      <Button
                        variant="primary"
                        size="large"
                        title={loading ? "Creando cuenta..." : "Crear Cuenta"}
                        icon={loading ? null : <Car size={20} />}
                        loading={loading}
                        loadingMessage="Creando cuenta..."
                        onClick={handleSubmit(signupCaptain)}
                        fullWidth
                      />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
          
          {/* Footer with Legal Links */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="relative z-10 mt-4 py-4 flex flex-col items-center"
          >
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="ghost">
                <Link to="/privacy" className="px-1">
                  Privacidad
                </Link>
              </Badge>
              <Badge variant="ghost">
                <Link to="/terms" className="px-1">
                  Términos
                </Link>
              </Badge>
              <Badge variant="ghost">
                <Link to="/help" className="px-1">
                  Ayuda
                </Link>
              </Badge>
            </div>
          </motion.footer>
          
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default CaptainSignup;
