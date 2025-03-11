"use client";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useTokenCheck = () => {
  const { idToken } = useKindeAuth(); // Extract token
  const router = useRouter();
  console.log(idToken);
  useEffect(() => {
    const checkUser = async () => {
      if (!idToken) return; // Ensure token is available

      try {
        const response = await axios.post("http://localhost:5000/auth/check-user", {
          token: idToken,
        });

        const { userExists } = response.data;

        if (userExists) {
          router.push("/dashboard"); // Redirect to dashboard if user exists
        } else {
          router.push("/save-info"); // Redirect to save-info if user does not exist
        }
      } catch (error) {
        console.error("Error checking user:", error);
      }
    };

    checkUser();
  }, [idToken, router]);
};

export default useTokenCheck;
