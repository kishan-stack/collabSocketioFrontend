"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { Italic } from "lucide-react";

export const useFetchRecommendations = (email) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!email) return;
      setLoading(true);
      try {
        const { data } = await axios.get("http://localhost:5000/recommendations", { params: { email } });
        setRecommendations(data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [email]);

  return { recommendations, loading };
};
    