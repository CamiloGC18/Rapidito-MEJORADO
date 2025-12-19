import { useContext, useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import toast from "react-hot-toast";
import { useCaptain } from "../contexts/CaptainContext";
import { SocketDataContext } from "../contexts/SocketContext";
import { NewRide, Sidebar } from "../components";
import MapboxStaticMap from "../components/maps/MapboxStaticMap";
import MessageNotificationBanner from "../components/ui/MessageNotificationBanner";
import { showRideRequestToast } from "../components/notifications/RideRequestToast";
import { useNavigate } from "react-router-dom";
import Console from "../utils/console";
import { useAlert } from "../hooks/useAlert";
import { Alert } from "../components";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu,
  Plus,
  Minus,
  Compass,
  TrendingUp,
  DollarSign,
  Activity,
  Clock,
  Star,
  Target,
  CheckCircle,
  ShieldCheck,
  Car,
  ArrowRight,
  User as UserIcon
} from "lucide-react";

/**
 * 🌟 RAPIDITO CAPTAIN HOME - BRUTAL LUXURY DASHBOARD
 * Tesla Model S x Linear.app x iOS 17 - Professional Driver Edition
 * 
 * Design System:
 * - FLOATING DASHBOARD ISLANDS: Cards flotan sobre mapa obsidian
 * - AMBER ACCENT THEME: Professional driver color scheme
 * - REAL-TIME STATS: Earnings, rides, ratings con brutal typography
 * - GLASSMORPHISM HUD: Stats overlay con backdrop-blur
 * - LUXURY MAP: Mapbox con controles floating pill
 * - RIDE REQUEST TOASTS: Premium notification system
 * 
 * Captain Features:
 * - Live Location Tracking
 * - Earnings Dashboard  
 * - Ride Request System
 * - Performance Analytics
 */

// Coordenadas de San Antonio del Táchira
const DEFAULT_LOCATION = {
  lat: 7.8146,
  lng: -72.4430
};

// URLs de sonidos de notificación
const NOTIFICATION_SOUNDS = {
  newRide: "https://assets.mixkit.co/active_storage/sfx/2645/2645-preview.mp3",
  rideAccepted: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
  rideEnded: "https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3",
  newMessage: "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3"
};

const playSound = (soundUrl) => {
  try {
    const audio = new Audio(soundUrl);
    audio.volume = 0.6;
    audio.play().catch(e => Console.log("Error reproduciendo sonido:", e));
  } catch (e) {
    Console.log("Error con audio:", e);
  }
};

const vibrate = (pattern = [200, 100, 200]) => {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

const defaultRideData = {
  user: {
    fullname: {
      firstname: "Sin",
      lastname: "Usuario",
    },
    _id: "",
    email: "ejemplo@gmail.com",
    rides: [],
  },
  pickup: "Lugar, Ciudad, Estado, País",
  destination: "Lugar, Ciudad, Estado, País",
  fare: 0,
  vehicle: "car",
  status: "pending",
  duration: 0,
  distance: 0,
  _id: "123456789012345678901234",
};

function CaptainHomeScreen() {
  const token = localStorage.getItem("token");
  const { captain, setCaptain } = useCaptain();
  const { socket } = useContext(SocketDataContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();
  
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [showMessageBanner, setShowMessageBanner] = useState(false);
  const [lastMessage, setLastMessage] = useState({ sender: "", text: "" });

  const [riderLocation, setRiderLocation] = useState({
    lat: DEFAULT_LOCATION.lat,
    lng: DEFAULT_LOCATION.lng,
  });
  const [mapCenter, setMapCenter] = useState({
    lat: DEFAULT_LOCATION.lat,
    lng: DEFAULT_LOCATION.lng
  });
  const [earnings, setEarnings] = useState({
    total: 0,
    today: 0,
  });

  const [rides, setRides] = useState({
    accepted: 0,
    cancelled: 0,
    distanceTravelled: 0,
  });
  const [newRide, setNewRide] = useState(
    JSON.parse(localStorage.getItem("rideDetails")) || defaultRideData
  );

  const [otp, setOtp] = useState("");
  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem("messages")) || []
  );
  const [error, setError] = useState("");
  const [showRideCompleted, setShowRideCompleted] = useState(false);
  const [completedRideData, setCompletedRideData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentRideStatus, setCurrentRideStatus] = useState("pending");
  const locationUpdateInterval = useRef(null);

  const activeRideToastsRef = useRef(new Map());
  // CRITICAL-FIX: Ref to track latest ride data to avoid stale closures in callbacks
  const newRideRef = useRef(newRide);

  const [showCaptainDetailsPanel, setShowCaptainDetailsPanel] = useState(true);
  const [showNewRidePanel, setShowNewRidePanel] = useState(
    JSON.parse(localStorage.getItem("showPanel")) || false
  );
  const [showBtn, setShowBtn] = useState(
    JSON.parse(localStorage.getItem("showBtn")) || "accept"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mapZoom, setMapZoom] = useState(14);
  const [isLocating, setIsLocating] = useState(false);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Animation variants with iOS spring physics - Silicon Valley Luxury
  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
        delayChildren: prefersReducedMotion ? 0 : 0.1
      }
    }
  };

  const fadeInUp = {
    initial: prefersReducedMotion ? {} : { opacity: 0, y: 30 },
    animate: prefersReducedMotion ? {} : { opacity: 1, y: 0 },
    transition: springConfig.panel
  };

  const fadeInDown = {
    initial: prefersReducedMotion ? {} : { opacity: 0, y: -30 },
    animate: prefersReducedMotion ? {} : { opacity: 1, y: 0 },
    transition: springConfig.panel
  };

  const fadeInRight = {
    initial: prefersReducedMotion ? {} : { opacity: 0, x: -30 },
    animate: prefersReducedMotion ? {} : { opacity: 1, x: 0 },
    transition: springConfig.panel
  };

  const scaleIn = {
    initial: prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 },
    animate: prefersReducedMotion ? {} : { opacity: 1, scale: 1 },
    transition: springConfig.panel
  };

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  const refreshCaptainData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/captain/profile`,
        {
          headers: { token: token }
        }
      );
      if (response.data.captain) {
        setCaptain(response.data.captain);
        localStorage.setItem("userData", JSON.stringify({
          type: "captain",
          data: response.data.captain,
        }));
      }
    } catch (error) {
      Console.log("Error refrescando datos:", error);
    }
  };

  // CRITICAL-FIX: Keep ref in sync with state
  useEffect(() => {
    newRideRef.current = newRide;
  }, [newRide]);

  // CRITICAL-FIX: Accept optional rideId to avoid stale closure
  const acceptRide = async (rideIdOverride) => {
    // Use override if provided, otherwise use ref (always has latest value)
    const rideId = rideIdOverride || newRideRef.current._id;

    try {
      if (rideId && rideId !== "" && rideId !== "123456789012345678901234") {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/ride/confirm`,
          { rideId: rideId },
          {
            headers: {
              token: token,
            },
          }
        );
        setLoading(false);
        setShowBtn("otp");
        setCurrentRideStatus("accepted");

        vibrate([200, 100, 200]);
        playSound(NOTIFICATION_SOUNDS.rideAccepted);

        setMapCenter({
          lat: riderLocation.lat,
          lng: riderLocation.lng
        });
        Console.log(response);
      } else {
        Console.error("acceptRide called with invalid rideId:", rideId);
      }
    } catch (error) {
      setLoading(false);
      showAlert('Ocurrió un error', error.response?.data?.message || 'Error desconocido', 'failure');
      Console.log(error.response);
      setTimeout(() => {
        clearRideData();
      }, 1000);
    }
  };

  const verifyOTP = async () => {
    try {
      if (newRide._id !== "" && otp.length === 6) {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/ride/start-ride?rideId=${newRide._id}&otp=${otp}`,
          {
            headers: {
              token: token,
            },
          }
        );
        setMapCenter({
          lat: riderLocation.lat,
          lng: riderLocation.lng
        });
        setShowBtn("end-ride");
        setCurrentRideStatus("ongoing");
        setLoading(false);
        Console.log(response);
      }
    } catch (err) {
      setLoading(false);
      setError("OTP inválido");
      Console.log(err);
    }
  };

  const endRide = async () => {
    try {
      if (newRide._id !== "") {
        setLoading(true);
        await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/ride/end-ride`,
          {
            rideId: newRide._id,
          },
          {
            headers: {
              token: token,
            },
          }
        );
        
        setCompletedRideData({
          fare: newRide.fare,
          pickup: newRide.pickup,
          destination: newRide.destination,
          distance: newRide.distance
        });
        
        vibrate([300, 150, 300, 150, 300]);
        playSound(NOTIFICATION_SOUNDS.rideEnded);
        
        setShowRideCompleted(true);
        
        setMapCenter({
          lat: riderLocation.lat,
          lng: riderLocation.lng
        });
        setShowBtn("accept");
        setCurrentRideStatus("pending");
        setLoading(false);
        setShowCaptainDetailsPanel(false);
        setShowNewRidePanel(false);
        setNewRide(defaultRideData);
        localStorage.removeItem("rideDetails");
        localStorage.removeItem("showPanel");
        localStorage.removeItem("messages");
        
        await refreshCaptainData();
      }
    } catch (err) {
      setLoading(false);
      Console.log(err);
    }
  };

  const cancelRide = async () => {
    try {
      if (newRide._id !== "") {
        setLoading(true);
        await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/ride/cancel`,
          {
            rideId: newRide._id,
          },
          {
            headers: {
              token: token,
            },
          }
        );
        
        setLoading(false);
        showAlert('Viaje cancelado', 'El viaje ha sido cancelado exitosamente', 'success');
        
        clearRideData();
      }
    } catch (err) {
      setLoading(false);
      showAlert('Error', err.response?.data?.message || 'No se pudo cancelar el viaje', 'failure');
      Console.log(err);
    }
  };

  const closeRideCompleted = () => {
    setShowRideCompleted(false);
    setCompletedRideData(null);
    setShowCaptainDetailsPanel(true);
  };

  const updateLocation = () => {
    if (navigator.geolocation && captain?._id && socket) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          setRiderLocation(location);
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });

          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          
          socket.emit("update-location-captain", {
            userId: captain._id,
            location: location,
          });
        },
        (error) => {
          console.error("Error obteniendo posición:", error);
          setMapCenter({
            lat: DEFAULT_LOCATION.lat,
            lng: DEFAULT_LOCATION.lng
          });
        }
      );
    }
  };

  const clearRideData = () => {
    setShowBtn("accept");
    setLoading(false);
    setShowCaptainDetailsPanel(true);
    setShowNewRidePanel(false);
    setNewRide(defaultRideData);
    setCurrentRideStatus("pending");
    localStorage.removeItem("rideDetails");
    localStorage.removeItem("showPanel");
  };

  const saveMessagesDebounced = useMemo(
    () => debounce((messages) => {
      localStorage.setItem("messages", JSON.stringify(messages));
    }, 1000),
    []
  );

  const saveRideDetailsDebounced = useMemo(
    () => debounce((rideDetails) => {
      localStorage.setItem("rideDetails", JSON.stringify(rideDetails));
    }, 500),
    []
  );

  const savePanelStateDebounced = useMemo(
    () => debounce((showPanel, showBtnState) => {
      localStorage.setItem("showPanel", JSON.stringify(showPanel));
      localStorage.setItem("showBtn", JSON.stringify(showBtnState));
    }, 500),
    []
  );

  // Socket connection and location updates
  useEffect(() => {
    if (captain?._id && socket) {
      socket.emit("join", {
        userId: captain._id,
        userType: "captain",
      });

      updateLocation();
      
      const locationInterval = setInterval(updateLocation, 30000);
      
      let activeRideLocationInterval = null;
      let locationWatchId = null;
      
      // Professional tracking: Use watchPosition for active rides
      if (showBtn === "otp" || showBtn === "end-ride") {
        const trackingInterval = parseInt(import.meta.env.VITE_TRACKING_UPDATE_INTERVAL) || 4000;
        let lastUpdateTime = 0;
        
        locationWatchId = navigator.geolocation.watchPosition(
          (position) => {
            const now = Date.now();
            // Throttle updates to configured interval
            if (now - lastUpdateTime < trackingInterval) return;
            lastUpdateTime = now;
            
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            
            setRiderLocation(location);
            setCurrentLocation(location);
            
            // Send enhanced location data for professional tracking
            socket.emit("driver:locationUpdate", {
              driverId: captain._id,
              location,
              rideId: newRide._id,
              heading: position.coords.heading || 0,
              speed: position.coords.speed ? position.coords.speed * 3.6 : 0, // m/s to km/h
              accuracy: position.coords.accuracy || 0,
              timestamp: now,
            });
            
            Console.log("Ubicación enviada:", location);
          },
          (error) => {
            Console.log("Error obteniendo ubicación:", error);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000,
          }
        );
      }
      
      const handleNewRide = (data) => {
        Console.log("Nuevo viaje disponible:", data);

        if (data.isLateJoinOffer) {
          Console.log(`[LateJoiner] Received pending ride with ${data.timeRemaining}s remaining`);
        }

        vibrate([500, 200, 500, 200, 500]);
        playSound(NOTIFICATION_SOUNDS.newRide);

        setShowBtn("accept");
        setNewRide(data);
        setShowNewRidePanel(true);

        // CRITICAL-FIX: Pass rideId directly to avoid stale closure issue
        const rideId = data._id;
        const toastId = showRideRequestToast(
          data,
          () => {
            acceptRide(rideId); // Pass rideId directly
            activeRideToastsRef.current.delete(rideId);
          },
          () => {
            Console.log("Viaje rechazado por el conductor");
            activeRideToastsRef.current.delete(rideId);
          },
          data.timeRemaining
        );

        activeRideToastsRef.current.set(rideId, toastId);
      };

      const handleRideCancelled = (data) => {
        Console.log("Viaje cancelado", data);
        
        const toastId = activeRideToastsRef.current.get(data.rideId);
        if (toastId) {
          toast.dismiss(toastId);
          activeRideToastsRef.current.delete(data.rideId);
        }
        
        updateLocation();
        clearRideData();
      };
      
      const handleRideTaken = (data) => {
        Console.log("Viaje tomado por otro conductor", data);
        
        const toastId = activeRideToastsRef.current.get(data.rideId);
        if (toastId) {
          toast.dismiss(toastId);
          activeRideToastsRef.current.delete(data.rideId);
        }
        
        if (newRide?._id === data.rideId) {
          clearRideData();
        }
      };

      socket.on("new-ride", handleNewRide);
      socket.on("ride-cancelled", handleRideCancelled);
      socket.on("ride-taken", handleRideTaken);
      
      return () => {
        clearInterval(locationInterval);
        if (activeRideLocationInterval) {
          clearInterval(activeRideLocationInterval);
        }
        if (locationWatchId !== null) {
          navigator.geolocation.clearWatch(locationWatchId);
        }
        socket.off("new-ride", handleNewRide);
        socket.off("ride-cancelled", handleRideCancelled);
        socket.off("ride-taken", handleRideTaken);
      };
    }
  }, [captain?._id, socket, showBtn, newRide._id]);

  useEffect(() => {
    saveMessagesDebounced(messages);
  }, [messages, saveMessagesDebounced]);

  useEffect(() => {
    if (socket && newRide._id && newRide._id !== "123456789012345678901234") {
      socket.emit("join-room", newRide._id);

      const handleReceiveMessage = (data) => {
        const messageText = typeof data === 'string' ? data : (data?.msg || '');
        const messageBy = typeof data === 'string' ? 'other' : (data?.by || 'other');
        const messageTime = typeof data === 'string' ? '' : (data?.time || '');
        
        setMessages((prev) => [...prev, { msg: messageText, by: messageBy, time: messageTime }]);
        setUnreadMessages((prev) => prev + 1);
        
        setLastMessage({
          sender: newRide?.user?.fullname?.firstname || "Pasajero",
          text: messageText
        });
        
        setShowMessageBanner(true);
        playSound(NOTIFICATION_SOUNDS.newMessage);
        vibrate([200, 100, 200]);
      };

      socket.on("receiveMessage", handleReceiveMessage);

      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [newRide._id, socket]);

  useEffect(() => {
    saveRideDetailsDebounced(newRide);
  }, [newRide, saveRideDetailsDebounced]);

  useEffect(() => {
    savePanelStateDebounced(showNewRidePanel, showBtn);
  }, [showNewRidePanel, showBtn, savePanelStateDebounced]);

  // Calcular ganancias
  useEffect(() => {
    if (captain?.rides && Array.isArray(captain.rides)) {
      let Totalearnings = 0;
      let Todaysearning = 0;
      let acceptedRides = 0;
      let cancelledRides = 0;
      let distanceTravelled = 0;

      const today = new Date();
      const todayWithoutTime = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      captain.rides.forEach((ride) => {
        if (ride.status === "completed") {
          acceptedRides++;
          distanceTravelled += ride.distance || 0;
          Totalearnings += ride.fare || 0;
          
          const rideDate = new Date(ride.updatedAt);
          const rideDateWithoutTime = new Date(
            rideDate.getFullYear(),
            rideDate.getMonth(),
            rideDate.getDate()
          );

          if (rideDateWithoutTime.getTime() === todayWithoutTime.getTime()) {
            Todaysearning += ride.fare || 0;
          }
        }
        if (ride.status === "cancelled") cancelledRides++;
      });

      setEarnings({ total: Totalearnings, today: Todaysearning });
      setRides({
        accepted: acceptedRides,
        cancelled: cancelledRides,
        distanceTravelled: Math.round(distanceTravelled / 1000),
      });
    }
  }, [captain?.rides]);

  useEffect(() => {
    if (socket?.id) {
      Console.log("socket id:", socket.id);
    }
  }, [socket?.id]);

  const captainData = captain || {
    fullname: { firstname: "Cargando", lastname: "" },
    _id: null,
    vehicle: { type: "car", capacity: 4, number: "---", color: "Gris" }
  };

  return (
    <div className="relative w-full h-dvh overflow-hidden obsidian-gradient">
      <Alert
        heading={alert.heading}
        text={alert.text}
        isVisible={alert.isVisible}
        onClose={hideAlert}
        type={alert.type}
      />
      <Sidebar onToggle={handleSidebarToggle} />
      
      {/* Map Container - Brutal Luxury Style */}
      <div className="absolute inset-0 z-0">
        <MapboxStaticMap
          latitude={mapCenter.lat}
          longitude={mapCenter.lng}
          zoom={mapZoom}
          interactive={true}
          showMarker={true}
          markerColor="#F59E0B"
          className="w-full h-full"
        />
        {/* Obsidian overlay for professional look */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Captain Dashboard UI */}
      {!isSidebarOpen && !showNewRidePanel && (
        <>
          {/* Top Header - Captain Profile Floating Island */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="absolute top-safe left-6 right-6 z-20 flex items-center justify-between"
          >
            {/* Captain Profile Card */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsSidebarOpen(true)}
              className="floating-island px-4 py-3 flex items-center space-md hover-lift"
            >
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-sm shadow-lg">
                {captain?.fullname?.firstname?.[0]?.toUpperCase() || 'C'}
              </div>
              <div className="text-left">
                <p className="text-heading text-sm font-bold text-white">
                  {captain?.fullname?.firstname || 'Conductor'}
                </p>
                <div className="flex items-center space-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-caption text-secondary">ACTIVO</p>
                </div>
              </div>
            </motion.button>

            {/* Menu Button - Floating Glass */}
            {/* Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarOpen(true)}
              className="floating-island-subtle p-3 rounded-2xl hover-lift"
              aria-label="Abrir menú"
            >
              <Menu className="w-5 h-5 text-white" strokeWidth={1.5} />
            </motion.button>
          </motion.div>

          {/* Map Controls - Brutal Luxury Floating Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute right-6 top-24 z-20 space-md"
          >
            {/* Controls Stack */}
            <div className="floating-island p-3 space-sm">
              {/* Zoom In */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMapZoom(prev => Math.min(prev + 1, 20))}
                className="floating-island-subtle p-3 rounded-xl hover-lift w-full"
                aria-label="Acercar mapa"
              >
                <Plus className="w-4 h-4 text-white mx-auto" strokeWidth={2} />
              </motion.button>
              
              {/* Zoom Out */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMapZoom(prev => Math.max(prev - 1, 1))}
                className="floating-island-subtle p-3 rounded-xl hover-lift w-full"
                aria-label="Alejar mapa"
              >
                <Minus className="w-4 h-4 text-white mx-auto" strokeWidth={2} />
              </motion.button>
              
              {/* Recenter */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsLocating(true);
                  updateLocation();
                  setTimeout(() => setIsLocating(false), 1500);
                }}
                className="floating-island-subtle p-3 rounded-xl hover-lift w-full"
                aria-label="Mi ubicación"
              >
                <Target className={`w-4 h-4 text-amber-400 mx-auto ${isLocating ? 'animate-spin' : ''}`} strokeWidth={2} />
              </motion.button>
            </div>
          </motion.div>

          {/* Bottom Stats Dashboard - Brutal Luxury HUD */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute bottom-safe left-6 right-6 z-20"
          >
            <div className="floating-island p-8 space-xl">
              {/* Hero Earnings - Brutal Typography */}
              <div className="text-center mb-8">
                <p className="text-caption text-secondary mb-2">GANANCIA DE HOY</p>
                <h1 className="text-display font-black text-amber-400 tracking-tight">
                  ${Math.round(earnings.today).toLocaleString('es-CO')}
                </h1>
              </div>

              {/* Stats Grid - Professional */}
              <div className="grid grid-cols-3 gap-4">
                {/* Total Earnings */}
                <div className="floating-island-subtle p-4 text-center hover-lift">
                  <div className="w-10 h-10 mx-auto mb-3 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
                  </div>
                  <p className="text-caption text-secondary mb-1">TOTAL</p>
                  <p className="text-heading text-lg font-bold text-white">
                    ${Math.round(earnings.total).toLocaleString('es-CO')}
                  </p>
                </div>

                {/* Rides Today */}
                <div className="floating-island-subtle p-4 text-center hover-lift">
                  <div className="w-10 h-10 mx-auto mb-3 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
                  </div>
                  <p className="text-caption text-secondary mb-1">VIAJES</p>
                  <p className="text-heading text-lg font-bold text-white">
                    {rides.accepted}
                  </p>
                </Card>

                {/* Distance */}
                <div className="floating-island-subtle p-4 text-center hover-lift">
                  <div className="w-10 h-10 mx-auto mb-3 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-400" strokeWidth={1.5} />
                  </div>
                  <p className="text-caption text-secondary mb-1">DISTANCIA</p>
                  <p className="text-heading text-lg font-bold text-white">
                    {rides.distanceTravelled}km
                  </p>
                </div>
              </div>

              {/* Rating Display - Professional Badge */}
              {captain?.rating && (
                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-center space-md">
                  <div className="floating-island-subtle px-4 py-2 rounded-xl flex items-center space-sm">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" strokeWidth={1.5} />
                    <span className="text-body font-bold text-amber-400">
                      {captain.rating.average.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-caption text-secondary">
                    {captain.rating.count} calificaciones
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}

      {/* New Ride Panel */}
      {!isSidebarOpen && (
        <NewRide
          rideData={newRide}
          otp={otp}
          setOtp={setOtp}
          showBtn={showBtn}
          showPanel={showNewRidePanel}
          setShowPanel={setShowNewRidePanel}
          showPreviousPanel={setShowCaptainDetailsPanel}
          loading={loading}
          acceptRide={acceptRide}
          verifyOTP={verifyOTP}
          endRide={endRide}
          cancelRide={cancelRide}
          error={error}
          unreadMessages={unreadMessages}
        />
      )}

      {/* Ride Completed Modal - iOS Deluxe Style */}
      <AnimatePresence>
        {showRideCompleted && completedRideData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            {/* Glass Card Container */}
            <motion.div
              variants={scaleIn}
              initial="initial"
              animate="animate"
              className="w-full max-w-sm px-2"
            >
              <Card
                variant="floating"
                borderRadius="xlarge"
                className="py-8 px-6"
              >
                {/* Success Icon with Animated Check */}
                <motion.div 
                  className="mx-auto mb-6 flex justify-center"
                  initial={prefersReducedMotion ? {} : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-ios-green to-ios-green/70 flex items-center justify-center shadow-lg">
                    <CheckCircle size={36} strokeWidth={2.5} className="text-white" />
                  </div>
                </motion.div>

                <h2 className="text-2xl font-bold text-black dark:text-white mb-2 text-center">
                  ¡Viaje completado!
                </h2>
                <p className="text-center text-ios-gray mb-6">
                  Has finalizado el viaje exitosamente
                </p>
                
                {/* Earnings Display - Glass Card */}
                <Card
                  variant="glass"
                  borderRadius="large"
                  className="p-5 mb-6"
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-ios-green/10 flex items-center justify-center text-ios-green">
                      <DollarSign size={20} />
                    </div>
                  </div>
                  <p className="text-sm text-ios-gray text-center mb-1">
                    Ganancia del viaje
                  </p>
                  <p className="text-4xl font-black text-center text-ios-green">
                    ${completedRideData.fare?.toLocaleString('es-CO') || 0}
                  </p>
                </Card>
                
                {/* Distance Badge */}
                <div className="flex justify-center mb-8">
                  <Badge variant="glass">
                    <div className="flex items-center gap-1.5 px-2 py-1">
                      <MapPinned size={14} className="text-ios-gray" />
                      <span className="text-sm text-ios-gray">
                        {Math.round((completedRideData.distance || 0) / 1000)} km
                      </span>
                    </div>
                  </Badge>
                </div>
                
                {/* Continue Button */}
                <Button
                  variant="primary"
                  size="large"
                  title="Continuar"
                  onClick={closeRideCompleted}
                  fullWidth
                />
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Message Notification Banner */}
      <MessageNotificationBanner
        senderName={lastMessage.sender}
        message={lastMessage.text}
        show={showMessageBanner}
        onClose={() => setShowMessageBanner(false)}
        onTap={() => {
          setShowMessageBanner(false);
          setUnreadMessages(0);
          navigate(`/captain/chat/${newRide?._id}`);
        }}
      />
    </div>
  );
}

export default CaptainHomeScreen;