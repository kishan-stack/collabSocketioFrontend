"use client";

import React, { useState, Suspense } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
// import TagSelector from "./components/TagSelector";
import { useUser } from "../../hooks/useUser";
import { HomeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
const UserInfo = React.lazy(() => import("./components/userInfo"));

const UpdateProfilePage = () => {
  const { userInfo, isLoading, isAuthenticated } = useUser();
  const router = useRouter();

  // State for form sections
  const [projects, setProjects] = useState([{ name: "", description: "", tags: [], additionalInfo: "" }]);
  const [hackathons, setHackathons] = useState([{ name: "", description: "", tags: [], additionalInfo: "" }]);
  const [courses, setCourses] = useState([{ name: "", description: "", tags: [], additionalInfo: "" }]);
  const [certifications, setCertifications] = useState([{ name: "", description: "", tags: [], additionalInfo: "" }]);
  const [workshops, setWorkshops] = useState([{ name: "", description: "", tags: [], additionalInfo: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Functions for managing state
  const addNewItem = (section, setSection) => {
    setSection([...section, { name: "", description: "", tags: [], additionalInfo: "" }]);
  };

  const removeItem = (section, setSection, index) => {
    const updatedSection = section.filter((_, i) => i !== index);
    setSection(updatedSection);
  };

  const updateItem = (section, setSection, index, key, value) => {
    const updatedSection = [...section];
    updatedSection[index][key] = value;
    setSection(updatedSection);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      email: userInfo?.email,
      projects,
      hackathons,
      courses,
      certifications,
      workshops,
    };

    setIsSubmitting(true);

    try {
      const response = await axios.post("http://localhost:5000/updateUserProfile ", formData);

      toast.info("Profile updating...");
      toast.success("Profile updated successfully...");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating your profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render section with the ability to remove items
  const renderSection = (section, setSection, sectionName, sectionIcon) => (
    <Card className="mb-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <CardHeader className="flex items-center justify-between space-x-4 p-8 bg-slate-900 text-white rounded-t-md">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{sectionIcon}</span>
          <h3 className="text-xl font-semibold">{sectionName}</h3>
        </div>
      </CardHeader>
      <CardContent className="bg-white mt-12 rounded-b-md relative">
        {section.map((item, index) => (
          <div key={index} className="relative grid gap-6 mb-6 border rounded-md p-4 shadow-sm">
            {/* Cross button */}
            <button
              type="button"
              onClick={() => removeItem(section, setSection, index)}
              className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full h-8 w-8 flex items-center justify-center shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
              title="Remove item"
            >
              ✕
            </button>

            {/* Inputs */}
            <Input
              value={item.name}
              onChange={(e) => updateItem(section, setSection, index, "name", e.target.value)}
              placeholder={`${sectionName} Name`}
              className="w-full border rounded-lg p-3 focus:ring-indigo-500 focus:outline-none"
            />
            <Textarea
              value={item.description}
              onChange={(e) => updateItem(section, setSection, index, "description", e.target.value)}
              placeholder={`${sectionName} Description`}
              className="w-full border rounded-lg p-3 focus:ring-indigo-500 focus:outline-none"
            />
            {/* <TagSelector
              instanceId={`${sectionName}-${index}`}
              onTagsSelected={(selectedTags) => updateItem(section, setSection, index, "tags", selectedTags)}
            /> */}
            <Input
              value={item.additionalInfo}
              onChange={(e) => updateItem(section, setSection, index, "additionalInfo", e.target.value)}
              placeholder="Additional Info (e.g., role, duration)"
              className="w-full border rounded-lg p-3 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-center p-4 bg-gray-50 rounded-b-md">
        <Button
          type="button"
          variant="outline"
          onClick={() => addNewItem(section, setSection)}
          className="py-2 px-4 text-white hover:text-slate-900 hover:bg-slate-100 bg-slate-900 focus:ring-2 focus:ring-indigo-500"
        >
          Add Another {sectionName}
        </Button>
      </CardFooter>
    </Card>

  );

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gray-50 rounded-lg shadow-lg">
      <div className="mb-6">
        <Button
          variant="link"
          onClick={() => router.push("/dashboard")}
          className="flex items-center space-x-2 text-indigo-600 hover:underline"
        >
          <HomeIcon className="h-5 w-5" />
          <span>Go to dashboard</span>
        </Button>
      </div>
      <div className="flex items-center space-x-6 mb-10">
        <Avatar className="h-20 w-20 shadow-xl">
          <AvatarImage src="/superman.jpg" alt="User Avatar" />
          <AvatarFallback>{userInfo?.firstName}</AvatarFallback>
        </Avatar>
        <Suspense fallback={<p>Loading name...</p>}>
          <UserInfo firstName={userInfo?.firstName} lastName={userInfo?.lastName} email={userInfo?.email} />
        </Suspense>
      </div>
      <h1 className="text-3xl font-bold text-gray-800">Update Profile</h1>
      <p className="text-lg text-gray-600">Edit and update your profile details below.</p>
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="grid md:grid-cols-2 gap-8">
          {renderSection(projects, setProjects, "Projects", "📁")}
          {renderSection(hackathons, setHackathons, "Hackathons", "🏆")}
          {renderSection(courses, setCourses, "Courses", "📚")}
          {renderSection(certifications, setCertifications, "Certifications", "🎓")}
          {renderSection(workshops, setWorkshops, "Workshops", "🛠️")}
        </div>
        <Button type="submit" className="mt-8 w-full max-w-md mx-auto block bg-slate-900 text-white py-3 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500">
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default UpdateProfilePage;
