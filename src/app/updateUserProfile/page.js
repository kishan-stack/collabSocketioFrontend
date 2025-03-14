"use client";
import React, { useState, Suspense } from "react";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { useUser } from "../../hooks/useUser";
import { HomeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import UserInfo from "./components/userInfo";
import Modal from "../../components/ui/modal";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import TagSelector from "./components/TagSelector";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import useApiRequest from "../../hooks/apihooks/useApiRequest";
// import useSWR from "swr";
import { toast } from "react-toastify";
import { useEffect } from "react";
import axios from "axios";


export default function UserProfile() {
    const { getToken } = useKindeAuth();
    const { sendRequest } = useApiRequest();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null)
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await getToken();
                if (token) {
                    
                    const response = await sendRequest(`/users/getAllUsers/`);

                    console.log(response.data)

                    setData(response.data);
                }


            } catch (err) {
                setError(err.message || "Failed to fetch user data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [getToken]);

    const { userInfo } = useUser(); // Custom hook to get user info from your app
    const router = useRouter(); // Next.js router to navigate between pages

    const [localInfo, setLocalInfo] = useState({
        projects: [],
        hackathons: [],
        courses: [],
        certifications: [],
        workshops: [],
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [activeSection, setActiveSection] = useState(null);
    const [newItem, setNewItem] = useState({
        name: "",
        description: "",
        additionalInfo: "",
        tags: [],
    });

    const sectionNames = [
        { sectionName: "Projects", sectionIcon: "📁" },
        { sectionName: "Hackathons", sectionIcon: "🏆" },
        { sectionName: "Courses", sectionIcon: "📚" },
        { sectionName: "Certifications", sectionIcon: "🎓" },
        { sectionName: "Workshops", sectionIcon: "🛠️" },
    ];

    // Handle input changes for adding new items
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmitChanges = async () => {
        if (!Object.values(localInfo).some((section) => section.length > 0)) {
            toast.error("No changes made");
            return;
        }
        toast.info("Please wait while we save your changes...")
        try {
            const response = await sendRequest("/users/saveUserProfile", "POST", localInfo);
            console.log(response);

            toast.success("User profile changes updated.");
            window.location.reload();
        } catch (error) {
            console.log(error)
        }
    }
    // Handle tag changes
    const handleTagsChange = (tags) => {
        setNewItem((prevState) => ({ ...prevState, tags }));
    };

    // Add a new item to the appropriate section
    const addNewItem = async () => {
        if (activeSection && newItem.name.trim()) {
            const updatedItem = { ...newItem };
            setLocalInfo((prevState) => ({
                ...prevState,
                [activeSection]: [...prevState[activeSection], updatedItem],
            }));
            setModalOpen(false);
            setNewItem({
                name: "",
                description: "",
                additionalInfo: "",
                tags: [],
            });
        } else {
            alert("Please enter a valid name!");
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8 space-y-8">
            <Button
                variant="link"
                onClick={() => router.push("/dashboard")}
                className="flex items-center text-indigo-600 hover:underline"
            >
                <HomeIcon className="h-5 w-5 mr-2" />
                Go to dashboard
            </Button>

            <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20 shadow-xl">
                    <AvatarImage src="/superman.jpg" alt="User Avatar" />
                    <AvatarFallback>{userInfo?.firstName}</AvatarFallback>
                </Avatar>
                <div>
                    {<Suspense fallback={<p>Loading name...</p>}>
                        <UserInfo
                            firstName={userInfo?.firstName}
                            lastName={userInfo?.lastName}
                            email={userInfo?.email}
                        />
                    </Suspense>}
                </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-800">Profile</h1>
            <p className="text-lg text-gray-600">View and manage your profile details below.</p>

            {/* Personal Information & Interests */}
            <div className="mt-6 grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
                <div className="p-6 bg-white rounded-md shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                    <p><strong>College Name:</strong> {data?.data.college}</p>
                    <p><strong>Department Name:</strong> {data?.data.department}</p>
                    <p><strong>Academic Year:</strong> {data?.data.academicYear}</p>
                    <p><strong>Location:</strong> {data?.data.location}</p>
                </div>

                <div className="p-6 bg-white rounded-md shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800">Interests</h2>
                    {data?.data.interests.length > 0 ? (
                        <ul>
                            {data.data.interests.map((interest, index) => (
                                <Button key={index} className="mr-4 mt-2">{interest}</Button>
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
                    <div key={index} className="p-6 mt-6 bg-white rounded-md shadow-md">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {section.sectionIcon} {section.sectionName}
                            </h2>
                            <Button
                                onClick={() => {
                                    setActiveSection(section.sectionName.toLowerCase());
                                    setModalOpen(true);
                                }}
                                className="bg-blue-500 text-white"
                            >
                                Add {section.sectionName}
                            </Button>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-6">
                            {[...(data?.data[section.sectionName.toLowerCase()] || []), ...(localInfo[section.sectionName.toLowerCase()] || [])].map((item, index) => (
                                <div key={index} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-4 border rounded-lg shadow-md bg-white">
                                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                    <p className="text-sm mt-2 text-gray-600"><strong>Description: </strong>{item.description}</p>
                                    <p className="text-sm mt-2 text-gray-600"> <strong>Tags: </strong>{item.tags.join(', ')}</p>
                                    {item.additionalInfo && <p className="text-sm mt-2 text-gray-500 "><strong>Additional Info: </strong>{item.additionalInfo}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for Adding Items */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Add ${activeSection}`}  style={{ top: '-35%' }}  >
                <Input
                    name="name"
                    value={newItem.name}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                />
                <Textarea
                    name="description"
                    value={newItem.description}
                    onChange={handleInputChange}
                    placeholder="Enter description"
                />
                <Input
                    name="additionalInfo"
                    value={newItem.additionalInfo}
                    onChange={handleInputChange}
                    placeholder="Enter additional info"
                />
                <TagSelector
                    instanceId="tag-selector"
                    onTagsSelected={handleTagsChange}
                />
                <Button
                    onClick={addNewItem}
                    className="mt-4 bg-indigo-600 text-white"
                >
                    Add
                </Button>
            </Modal>

            {/* Save Changes Button */}
            <Button
                type="submit"
                onClick={handleSubmitChanges}
                className="mt-8 w-full max-w-md mx-auto block bg-slate-900 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
            >
                Save Changes
            </Button>
        </div>
    );
}



