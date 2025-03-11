"use client"
import { useState,useEffect } from "react";
import useFetchUsers from "../../../hooks/apihooks/useFetchUsers";
import { useFetchRecommendations } from "../../../hooks/apihooks/useFetchRecommendations";
import SearchHeader from "./components/searchHeader";
import RecommendationsList from "./components/RecommendationsList";
import UsersList from "./components/UsersList";
import ProfileSidebar from "./components/ProfileSidebar";
import { useKindeAuth, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function FindMembers() {
  const {idToken}=useKindeAuth()
  const {user}=useKindeBrowserClient()
  const [selectedUser, setSelectedUser] = useState(null);
  const [email, setEmail] = useState(null);
  const { recommendations, loading: recommendationsLoading } = useFetchRecommendations(email);
  const { users, loading: usersLoading } = useFetchUsers(email);
  const [showProfile, setShowProfile] = useState(false);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowProfile(true)

  };
  useEffect(() => {
    if (idToken?.email) {
      setEmail(idToken.email);
    } else if (user?.email) {
      setEmail(user.email);
    }
  }, [idToken, user]);

  return (
    <main className="h-full rounded-lg mt-1 shadow-xl overflow-hidden dark:border-white pb-8 pt-4">
      <SearchHeader />
      <div className="relative h-full p-3 grid grid-cols-1 gap-4 sm:grid-cols-12">
        <section
          className="results rounded-xl col-span-12 md:col-span-12 lg:col-span-8 p-2 scroll-hide overflow-y-auto sm:p-4"
          aria-labelledby="results-heading"
        >
          <RecommendationsList
            recommendations={recommendations}
            loading={recommendationsLoading}
            onUserSelect={handleUserSelect}
          />
          <UsersList users={users} loading={usersLoading} onUserSelect={handleUserSelect} />
        </section>
        <ProfileSidebar selectedUser={selectedUser}showProfile={showProfile}
          setShowProfile={setShowProfile} />
      </div>
    </main>
  );
}
