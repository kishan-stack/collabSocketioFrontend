// import { useState, useEffect } from "react";
import { cookies } from "next/headers";
import { SidebarTrigger, SidebarProvider } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";
import { Separator } from "../../components/ui/separator";
import { SocketProvider } from "@/context/socketContext";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "../../components/ui/breadcrumb";

export default function Layout({ children }) {
    return (
            <SidebarProvider defaultOpen="open">
                <AppSidebar />
                <div className="w-full">
                    <header className="flex h-10 mt-2 shrink-0 items-center gap-2 ">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 h-4"
                            />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="#">
                                            Building Your Application
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>
                                            Data Fetching
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="flex-1 h-[calc(100vh-4rem)] px-2 ">
                        {children}
                    </div>
                </div>
            </SidebarProvider>
    );
}
