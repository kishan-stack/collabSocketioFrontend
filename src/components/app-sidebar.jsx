"use client";
import {
    Search,
    Swords,
    Handshake,
    GraduationCap,
    UsersRoundIcon,
    CommandIcon,
    User,
    AirplayIcon,
    HomeIcon,
} from "lucide-react";
import { NavMain } from "./nav-main";
import { useSidebar } from "./ui/sidebar";
import { useUser } from "@/hooks/useUser";
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
    SidebarFooter,
} from "./ui/sidebar";
import { NavUser } from "./nav-user";
import { useEffect, useState } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import useApiRequest from "@/hooks/apihooks/useApiRequest";
import { useSocket } from "@/context/socketContext";
// import useSocket from "@/hooks/useSocket";
// import { useSocketContext } from "@/app/context/SocketContext";

const dashboardUrls = [
    { name: "Home", url: "/", icon: HomeIcon },
    { name: "Dashboard", url: "/dashboard", icon: AirplayIcon },
    { name: "Build Team", url: "/dashboard/buildTeam", icon: Handshake },
    { name: "Teams", url: "/dashboard/teams", icon: UsersRoundIcon },
    { name: "Hackathons", url: "/dashboard/hackathons", icon: Swords },
    { name: "Internships", url: "/dashboard/internships", icon: GraduationCap },
];

export function AppSidebar({ ...props }) {
    const { socket, isSocketReady } = useSocket();

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const { idToken, user: kindeUser } = useKindeAuth();

    const [error, setError] = useState(null);
    const { userInfo } = useUser();
    const ownid = userInfo?.id;
    // console.log(ownid)
    // Initialize the socket connection using the custom hook
    // const socket = useSocketContext(); // A/ccess the socket instance
    const [chats, setChats] = useState([]); // Log the socket object to check if it's initialized

    useEffect(() => {
        if (isSocketReady && socket) {
            socket.emit("get_direct_conversations", (err, conversations) => {
                if (err) {
                    console.error("Error fetching conversations:", err);
                    // Handle the error
                } else {
                    setChats(conversations);
                    // console.log(conversations);
                }
            });

            socket.on("update_chat_list", ({ chat }) => {
                // Add the new chat to your state or update the chat list in your UI
                setChats((prevChats) => [...prevChats, chat]);
                console.log("Chat list updated with new chat:", chat);
            });
        }

        if (idToken?.email) {
            setEmail(idToken.email);
            setUsername(idToken.name); // Set email from idToken
        }
    }, [idToken, isSocketReady, socket]);
    const user = {
        user: {
            name: username,
            email: email,
            avatar: "/superman.jpg",
        },
    };
    // Close dropdown on route change
    const { } = useSidebar();
    return (
        <Sidebar variant="floating" side="left" collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <CommandIcon className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        Collab.io
                                    </span>
                                    <span className="truncate text-xs">
                                        Dashboard
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent>
                <NavMain dashboardItems={dashboardUrls} chatItems={chats} />
            </SidebarContent>
            <SidebarSeparator />
            {/* Sidebar Footer with Dropdown for Team Members */}
            <SidebarFooter>
                <NavUser user={user.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
