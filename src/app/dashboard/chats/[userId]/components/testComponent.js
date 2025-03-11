"use client";
import { useEffect } from "react";
import { io } from "socket.io-client";
export default function ChatTestComponent({onNewMessage,userId }) {

    useEffect(() => {
        
        // Connect to the backend Socket.io server
        if (user) {
            const socket = io("http://localhost:5000", {
                auth: { userId: userId }, // Pass userId here
            });
    
            // Listen for a connection confirmation
            socket.on("connect", () => {
                console.log("Connected to the server with ID:", socket.id);
            });
    
            socket.on("message", (messageData) => {
                console.log("New message received:", messageData);
                // Update the chat state here with the new message
                setMessages((prev) => [
                    ...prev,
                    { sender: "other", text: messageData.text },
                ]);
            });
            // Cleanup socket connection on unmount
            return () => {
                socket.disconnect();
            }; 
        }
        
    }, [getUser]);

    return socket;
}
