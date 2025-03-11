"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
// import useSocket from "@/hooks/useSocket"; // assuming useSocket is the custom hook
import { useUser } from "@/hooks/useUser";
import { useSocket } from "@/context/socketContext";
// import { SocketProvider } from "@/app/context/SocketContext";
export default function ChatPage() {
    const { userId: chatId } = useParams();
    const { userInfo } = useUser();
    const { socket, isSocketReady } = useSocket();

    const ownid = userInfo?.id;
    // console.log(ownid)

    const [toUserId, setToUserId] = useState(null)
    const [otherUserName, setOtherUserName] = useState("")
    // State to manage messages
    const [messages, setMessages] = useState([]);

    const [newMessage, setNewMessage] = useState("");
    const [typing, setTyping] = useState(false);
    // Ref to track the chat container for auto-scrolling
    const chatContainerRef = useRef(null);

    // Effect to listen for incoming messages
    useEffect(() => {
        if (isSocketReady && socket) {
            // Emit event to fetch messages for the chat
            socket.emit("get_messages", { chatId });

            // Listen for messages received from the backend
            socket.on("get_messages", (data) => {
                console.log("Received messages:", data);
                setToUserId(data.participants?.kindeAuthId||null)
                setOtherUserName(data.participants.name)
                // console.log("otherParticipantsId", otherParticipantsId);
                setMessages(
                    data.messages.map((msg) => ({
                        ...msg,
                        sender: msg.from?.kindeAuthId === ownid ? "me" : "other",
                    }))
                ); // Update state with received messages
            });

            socket.on("new_message", (message) => {
                console.log("New message received:", message);
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            // Cleanup socket listeners on component unmount
            return () => {
                socket.off("get_messages");
                socket.off("send_message");
            };
        }
    }, [socket, ownid,]);

    // Function to handle sending a new message
    const handleSendMessage = () => {
        if (!newMessage.trim() || !socket) return;
        const timestamp = new Date().toISOString();
        const tempId = `${timestamp}-${Math.random()}`; 
        // Emit the message to the backend with chatId
        socket.emit("send_message", {
            chatId, // Pass the actual chatId from your app state
            toUserId, // Correct property name for the recipient
            message: {
                text: newMessage,
                type: "Text",
                createdAt: timestamp,
                clientGeneratedId: tempId,
                 // Assuming the type is "text" for now
            },
        });

        // Optimistically update the UI
        setMessages((prev) => [
            ...prev,
            {
                sender: "me",
                text: newMessage,
                chatId,
                createdAt:timestamp // Include chatId for message reference
            },
        ]);
        setNewMessage(""); // Clear the input field
    };


    // Automatically scroll to the bottom when messages change
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Handle key press (Enter to send message)
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevent default Enter behavior (like form submission)
            handleSendMessage(); // Send message on Enter key
        }
        if (e.key === "Enter" && e.shiftKey) {
            // Allow newline when Shift + Enter is pressed
            return;
        }
    };
    const handleTyping = (e) => {
        const isTyping = e.target.value.trim() !== "";
        // if (socket) {
        //     socket.emit("typing", { targetUserId, isTyping });
        // }
    };

    return (
        <div className="flex flex-col h-full bg-gray-100 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-white shadow-md border rounded-t-xl">
                <h1 className="ml-10 text-lg font-bold">{otherUserName}</h1>
            </div>

            {/* Chat Area */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 scroll-hide bg-gray-100"
            >
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm">
                        Say hi! and start the conversation!
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.sender === "me"
                                ? "justify-end"
                                : "justify-start"
                                }`}
                        >
                            <div
                                className={`p-4 text-sm rounded-lg shadow-md relative ${message.sender === "me"
                                    ? "text-white bg-blue-500"
                                    : "text-gray-800 bg-gray-200"
                                    }`}
                                style={{
                                    maxWidth: "70%",
                                    wordWrap: "break-word",
                                    overflowWrap: "break-word",
                                    whiteSpace: "pre-wrap",
                                    overflow: "hidden",
                                }}
                            >{/* Sender's Name */}
                                {message.from?.kindeAuthId !== ownid && (
                                    <div className="text-xs font-semibold text-gray-500 mb-1">
                                        {message.from?.name}
                                    </div>
                                )}
                                {message.text}
                                {/* Timestamp */}
                                <div className="text-xs text-white-400 mt-2 text-right">
                                    {new Date(message.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                {typing && (
                    <div className="text-gray-500">User is typing...</div>
                )}
            </div>

            {/* Message Input */}
            <div className="relative p-4 bg-white shadow-md border rounded-b-xl">
                <div className="flex items-center">
                    <textarea
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value);
                            handleTyping(e);
                        }}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onKeyDown={handleKeyDown}
                        rows={2} // Allow multiple lines
                        style={{
                            resize: "none", // Prevent manual resizing of the textarea
                            overflow: "hidden", // Hide vertical scrollbar
                        }}
                    />
                    <button
                        onClick={handleSendMessage}
                        className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
