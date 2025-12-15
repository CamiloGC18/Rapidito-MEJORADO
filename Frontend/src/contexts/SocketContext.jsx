import { createContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

export const SocketDataContext = createContext();

import Console from "../utils/console";
import persistenceManager from "../utils/persistenceManager";

function SocketContext({ children }) {
  // Track socket connection state
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const [activeRide, setActiveRide] = useState(null);
  const [socket, setSocket] = useState(null);

  // Load persisted ride data
  useEffect(() => {
    const persistedRide = persistenceManager.ride.loadRideState();
    if (persistedRide) {
      setActiveRide(persistedRide);
      Console.log("Loaded persisted ride:", persistedRide.rideId);
    }
  }, []);

  // Initialize socket only when token is available
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Only create socket if we have a token
    if (!token) {
      Console.log("No token found - socket not initialized");
      return;
    }

    // Create socket instance with authentication
    const socketInstance = io(`${import.meta.env.VITE_SERVER_URL}`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
    });
    
    Console.log("Socket.io instance created with authentication");
    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      Console.log("Disconnecting socket");
      socketInstance.disconnect();
    };
  }, []); // Only run once on mount

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      setIsConnected(true);
      setReconnectAttempt(0);
      Console.log("Connected to server (authenticated)");
      
      // Attempt to rejoin active ride room if there's a persisted ride
      if (activeRide && activeRide.rideId) {
        Console.log(`Attempting to rejoin ride room: ${activeRide.rideId}`);
        socket.emit("rejoin-ride", {
          rideId: activeRide.rideId,
          userType: activeRide.captain ? "captain" : "user"
        });
      }
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      Console.log("Disconnected from server");
    });

    socket.on("reconnect_attempt", (attempt) => {
      setReconnectAttempt(attempt);
      Console.log(`Socket reconnection attempt ${attempt}`);
    });

    // Handle ride rejoining success/failure
    socket.on("rejoin-ride-success", (updatedRideData) => {
      Console.log("Successfully rejoined ride room", updatedRideData);
      setActiveRide(updatedRideData);
      persistenceManager.ride.saveRideState(updatedRideData);
    });

    socket.on("rejoin-ride-error", (error) => {
      Console.error("Failed to rejoin ride room:", error);
      if (error.message === "Ride not found" || error.message === "Ride completed") {
        persistenceManager.ride.clearRideState();
        setActiveRide(null);
      }
    });

    // Handle authentication errors
    socket.on("connect_error", (err) => {
      Console.error("Socket connection error:", err.message);
      if (err.message === "Authentication required" || 
          err.message === "Invalid token" || 
          err.message === "Token blacklisted") {
        Console.log("Socket authentication failed - user needs to re-login");
        // Clear invalid token
        localStorage.removeItem("token");
        setSocket(null);
      }
    });

    // Cleanup function
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("reconnect_attempt");
      socket.off("rejoin-ride-success");
      socket.off("rejoin-ride-error");
      socket.off("connect_error");
    };
  }, [socket, activeRide]);

  /**
   * Join a ride room and update persistence
   */
  const joinRideRoom = (rideId, rideData, userType) => {
    if (!rideId || !socket) return;
    
    socket.emit("join-ride", { rideId, userType });
    setActiveRide(rideData);
    persistenceManager.ride.saveRideState(rideData);
  };

  /**
   * Leave a ride room and clear persistence
   */
  const leaveRideRoom = (rideId) => {
    if (!rideId || !socket) return;
    
    socket.emit("leave-ride", { rideId });
    setActiveRide(null);
    persistenceManager.ride.clearRideState();
  };

  // Memoize context value
  const value = useMemo(() => ({ 
    socket,
    isConnected,
    reconnectAttempt,
    activeRide,
    joinRideRoom,
    leaveRideRoom
  }), [socket, isConnected, reconnectAttempt, activeRide]);

  return (
    <SocketDataContext.Provider value={value}>
      {children}
    </SocketDataContext.Provider>
  );
}

export default SocketContext;
