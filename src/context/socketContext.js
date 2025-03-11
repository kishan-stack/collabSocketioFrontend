// src/context/socketContext.js
"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user } = useKindeAuth();
    const socket = useRef(null);
    const [isSocketReady, setIsSocketReady] = useState(false); // Track socket readiness
    const [connectionAttempts, setConnectionAttempts] = useState(0);

    useEffect(() => {
        if (user && user.id) {
            // Connect to the socket server with the userId
            socket.current = io("http://localhost:5000", {
                auth: { userId: user.id },
                transports: ["websocket", "polling"],
                reconnectionAttempts: 5,
                reconnectionDelay: 2000,
            });

            socket.current.on("connect", () => {
                console.log(`socket from context provider connected as ${socket.current.id} with user id:: ${user.id}`);
                setIsSocketReady(true); // Set the socket as ready
                setConnectionAttempts(0);
            });

            socket.current.on("disconnect", () => {
                console.log("Socket disconnected");
                setIsSocketReady(false); // Reset socket readiness
            });

            socket.current.on("connect_error", (err) => {
                console.log(`Socket connection attempt ${connectionAttempts + 1} failed: ${err.message}`);
                setConnectionAttempts(prev => prev + 1);

                if (connectionAttempts >= 5) {
                    console.error("Could not connect to socket after multiple attempts.");
                }// Handle connection errors
            });

            // Cleanup on unmount
            return () => {
                if (socket.current) {
                    socket.current.disconnect();
                    setIsSocketReady(false);
                }
            };
        }
    }, [user,connectionAttempts]);

    return (
        <SocketContext.Provider value={{ socket: socket.current, isSocketReady }}>
            {children}
        </SocketContext.Provider>
    );
};  

// Custom hook to use socket
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};
