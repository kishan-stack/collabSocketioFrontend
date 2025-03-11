// app/college-info/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "react-toastify";
import { data } from "../data.js";
import useApiRequest from "../../hooks/apihooks/useApiRequest.js";


const initialFormState = {
    collegeName: "",
    location: "",
    departmentName: "",
    academicYear: "",
    skills: [],
    interests: [],
};

export default function CollegeInfoForm() {
    const { sendRequest } = useApiRequest();

    const { user, isLoading } = useKindeAuth();
    const router = useRouter();
    const { colleges, locations, departments, academicYears, skills, interests } = data;
    const [formData, setFormData] = useState(initialFormState);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="spinner">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-red-600">You must be logged in to access this form.</p>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: prev[name].includes(value)
                ? prev[name].filter((item) => item !== value)
                : [...prev[name], value],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.info("Please wait while your profile is being created!");

        try {
           const data = await sendRequest("/auth/register","POST",formData);
        
           toast.success(data.message);
            router.push("/dashboard")
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("There was an error. Please try again.");
        }
    };

    // Filtered skills and interests based on department
    const departmentSkills = formData.departmentName ? skills[formData.departmentName] || [] : [];
    const departmentInterests = formData.departmentName ? interests[formData.departmentName] || [] : [];

    return (
        <div className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-white via-gray-100 to-gray-50 rounded-xl shadow-2xl mt-16">
            <Link href="#" className="text-lg font-bold text-indigo-600 mb-4 block">
                Collab.io
            </Link>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                College Information Form
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Location Dropdown */}
                <div className="space-y-1">
                    <label htmlFor="location" className="text-sm font-medium text-gray-600">
                        Location
                    </label>
                    <div className="relative">
                        <select
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={(e) => {
                                handleChange(e);
                                setFormData((prev) => ({ ...prev, collegeName: "" }));
                            }}
                            className="block w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out"
                            required
                        >
                            <option value="">Select Location</option>
                            {Object.keys(locations).map((loc) => (
                                <option key={loc} value={loc}>
                                    {loc}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">

                        </div>
                    </div>
                </div>

                {/* College Dropdown */}
                <div className="space-y-1">
                    <label htmlFor="collegeName" className="text-sm font-medium text-gray-600">
                        College Name
                    </label>
                    <div className="relative">
                        <select
                            id="collegeName"
                            name="collegeName"
                            value={formData.collegeName}
                            onChange={handleChange}
                            className="block w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out"
                            required
                        >
                            <option value="">Select College</option>
                            {formData.location &&
                                colleges[formData.location].map((college) => (
                                    <option key={college} value={college}>
                                        {college}
                                    </option>
                                ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">

                        </div>
                    </div>
                </div>

                {/* Department Dropdown */}
                <div className="space-y-1">
                    <label htmlFor="departmentName" className="text-sm font-medium text-gray-600">
                        Department Name
                    </label>
                    <div className="relative">
                        <select
                            id="departmentName"
                            name="departmentName"
                            value={formData.departmentName}
                            onChange={(e) => {
                                handleChange(e);
                                setFormData((prev) => ({ ...prev, skills: [], interests: [] }));
                            }}
                            className="block w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out"
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept} value={dept}>
                                    {dept}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">

                        </div>
                    </div>
                </div>

                {/* Academic Year Dropdown */}
                <div className="space-y-1">
                    <label htmlFor="academicYear" className="text-sm font-medium text-gray-600">
                        Academic Year
                    </label>
                    <div className="relative">
                        <select
                            id="academicYear"
                            name="academicYear"
                            value={formData.academicYear}
                            onChange={handleChange}
                            className="block w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out"
                            required
                        >
                            <option value="">Select Year</option>
                            {academicYears.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">

                        </div>
                    </div>
                </div>

                {/* Skills Checkboxes */}
                {/* {departmentSkills.length > 0 && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">Skills</label>
                        <div className="grid grid-cols-2 gap-4">
                            {departmentSkills.map((skill) => (
                                <label
                                    key={skill}
                                    className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg border border-gray-200"
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.skills.includes(skill)}
                                        onChange={() => handleCheckboxChange("skills", skill)}
                                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-gray-700">{skill}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )} */}

                {/* Interests Checkboxes */}
                {departmentInterests.length > 0 && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">Interests</label>
                        <div className="grid grid-cols-2 gap-4">
                            {departmentInterests.map((interest) => (
                                <label
                                    key={interest}
                                    className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg border border-gray-200"
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.interests.includes(interest)}
                                        onChange={() => handleCheckboxChange("interests", interest)}
                                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-gray-700">{interest}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-3 text-lg font-medium text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Submit
                </button>
            </form>

        </div>

    );
}
