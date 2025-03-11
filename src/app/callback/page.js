"use client";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function CallbackPage() {
    const router = useRouter();
    const { user, isLoading, isAuthenticated } = useKindeAuth();
    const isProfileComplete = user?.properties?.profile_complete;
    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated) {
                if (isProfileComplete) {
                    router.push("/dashboard");
                }
                else {
                    router.push("/save-info");
                }
            }
        }


    }, [isLoading, isAuthenticated, router, isProfileComplete])
    if (isLoading) {
        return <div>loading your account please wait</div>
    }

    return (
        <>
            <div>Redirecting...</div>
        </>
    )
}

