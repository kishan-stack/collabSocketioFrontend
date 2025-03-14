"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../../../../components/ui/avatar";
import { HomeIcon } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import UserInfo from "../../../../app/updateUserProfile/components/userInfo";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import UserDetails from "./userDetails";
import axios from "axios";
import { MessageSquareShare } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import Modal from "./chatModal";
import useApiRequest from "@/hooks/apihooks/useApiRequest";
import { useSocket } from "@/context/socketContext";
export default function UserProfile() {
    const { socket, isSocketReady } = useSocket();
    const { sendRequest } = useApiRequest();
    const { userInfo } = useUser(); //F Custom hook to get user info from your app
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { userid } = useParams();
    const [generatedChatId, setGeneratedChatId] = useState(null);
    const ownId = userInfo?.id;

    const { getToken } = useKindeAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const handleChatButtonClick = () => {
        setIsModalOpen(true);
    };

    // Function to confirm chat creation
    const handleConfirmChat = async () => {
        setIsModalOpen(false);
        socket.emit("create_chat", { targetId: userid }, (response) => {
            if (response.error) {
                console.error("Failed to create or fetch the chat:", response.error);
                return;
            }

            if (response.chat && response.chat._id) {
                // Redirect to the chat page with the chat ID
                window.location.href = `/dashboard/chats/${response.chat._id}`;
            } else {
                console.error("Unexpected response format:", response);
            }
        });
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await getToken();
                if (token) {
                    
                    const response = await sendRequest(`/users/getAllUsers/${userid}`);

                    console.log(response);

                    setData(response.data);
                }
            } catch (err) {
                setError(err.message || "Failed to fetch user data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [getToken, userid]);

    // const { query } = router;
    // const userIdFromUrl = query?.userid;
    // console.log(userIdFromUrl)//
    // State for Modal and Form Inputs (if editing allowed)

    // Section Names for rendering
    const sectionNames = [
        { sectionName: "Projects", sectionIcon: "📁" },
        { sectionName: "Hackathons", sectionIcon: "🏆" },
        { sectionName: "Courses", sectionIcon: "📚" },
        { sectionName: "Certifications", sectionIcon: "🎓" },
        { sectionName: "Workshops", sectionIcon: "🛠️" },
    ];

    // Check if the profile belongs to the logged-in user
    const isOwnProfile = userInfo?.id === data?.data.id; // Assuming 'id' is the unique identifier for users

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8 space-y-8">
            {/* <Button
                variant="link"
                onClick={() => router.push("/dashboard")}
                className="flex items-center text-indigo-600 hover:underline"
            >
                <HomeIcon className="h-5 w-5 mr-2" />
                Go to dashboard
            </Button> */}

            <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20 shadow-xl">
                    <AvatarImage src="/superman.jpg" alt="User Avatar" />
                    <AvatarFallback>{userInfo?.firstName}</AvatarFallback>
                </Avatar>
                <div>
                    {data?.data?.name ? (
                        <UserDetails
                            name={data.data.name}
                            email={data.data.email}
                        />
                    ) : (
                        "Loading"
                    )}
                </div>
            </div>
            <div className="flex items-center gap-4">
                <h1 className="text-4xl font-bold text-gray-800">Profile</h1>
                <Button
                    onClick={handleChatButtonClick} // Show the modal on button click
                    aria-label="Start Chat"
                    className="flex items-center gap-2"
                >
                    <MessageSquareShare />
                </Button>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirmChat}
                    title="Chat"
                >
                    <p className="ml-24">
                        Do u want to chat?
                    </p>
                </Modal>
            </div>

            <p className="text-lg text-gray-600">
                View and manage your profile details below.
            </p>

            {/* Personal Information & Interests */}
            <div className="mt-6 grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
                <div className="p-6 bg-white rounded-md shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Personal Information
                    </h2>
                    <p>
                        <strong>College Name:</strong> {data?.data.college}
                    </p>
                    <p>
                        <strong>Department Name:</strong>{" "}
                        {data?.data.department}
                    </p>
                    <p>
                        <strong>Academic Year:</strong>{" "}
                        {data?.data.academicYear}
                    </p>
                    <p>
                        <strong>Location:</strong> {data?.data.location}
                    </p>
                </div>

                <div className="p-6 bg-white rounded-md shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Interests
                    </h2>
                    {data?.data.interests.length > 0 ? (
                        <ul className="flex flex-wrap gap-2 mt-4">
                            {data.data.interests.map((interest, index) => (
                                <li key={index}>
                                    <Button className="bg-black text-white py-1 px-3 rounded-l text-sm">
                                        {interest}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No interests added yet.</p>
                    )}
                </div>
            </div>

            {/* Section Rendering for Projects, Hackathons, etc. */}
            <div className="mt-8">
                {sectionNames.map((section, index) => (
                    <div
                        key={index}
                        className="p-6 mt-6 bg-white rounded-md shadow-md"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {section.sectionIcon} {section.sectionName}
                            </h2>
                            {isOwnProfile && (
                                <Button
                                    onClick={() => {
                                        setActiveSection(
                                            section.sectionName.toLowerCase()
                                        );
                                        setModalOpen(true);
                                    }}
                                    className="bg-blue-500 text-white"
                                >
                                    Add {section.sectionName}
                                </Button>
                            )}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-6">
                            {data?.data[section.sectionName.toLowerCase()]?.map(
                                (item, index) => (
                                    <div
                                        key={index}
                                        className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-4 border rounded-lg shadow-md bg-white"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            <strong>Description : </strong>
                                            {item.description}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Tags : </strong>
                                            {item.tags.join(", ")}
                                        </p>
                                        {item.additionalInfo && (
                                            <p className="text-sm text-gray-500 mt-2">
                                                <strong>
                                                    Additional Info :{" "}
                                                </strong>
                                                {item.additionalInfo}
                                            </p>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
