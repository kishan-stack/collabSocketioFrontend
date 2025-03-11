"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "./ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuAction,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from "./ui/sidebar";
import { useUser } from "@/hooks/useUser";

export function NavMain({ dashboardItems, chatItems }) {
    const {userInfo}=useUser();
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {/* Render Dashboard Items */}
                {dashboardItems.map((item) => (
                    <Collapsible
                        key={item.name}
                        asChild
                        defaultOpen={item.isActive}
                    >
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={item.name}>
                                <a href={item.url}>
                                    {item.icon && <item.icon />}
                                    <span>{item.name}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}

                {/* Render Chat Items */}
                <SidebarGroupLabel>Chats</SidebarGroupLabel>
                {chatItems.length > 0 ? (
                    chatItems.map((chat) => {
                        // console.log('chat',chat)
                        // Find the participant who is not the current user
                        const otherParticipant = chat.participants.find(
                            (participant) => participant.kindeAuthId !== userInfo?.id
                        );
                
                        // console.log(otherParticipant);  // Skip if no other participant
                        if (!otherParticipant) return null; // Skip if no other participant


                        return (
                            <SidebarMenuItem key={chat._id}>
                                <SidebarMenuButton asChild>
                                    <Link
                                        href={`/dashboard/chats/${chat._id}`}
                                        
                                    >
                                        <span>{otherParticipant.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })
                ) : (
                    <SidebarMenuItem>
                        <span className="text-sm italic">
                            No recent chats !
                        </span>
                    </SidebarMenuItem>
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}
