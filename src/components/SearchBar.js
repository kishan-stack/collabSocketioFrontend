"use client";
import { useState, useEffect, useCallback } from "react";

const SearchBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Handle opening and closing of the search bar
    const toggleSearch = useCallback(() => {
        setIsOpen((prev) => !prev);
        if (!isOpen) {
            setTimeout(() => document.getElementById("search-input")?.focus(), 100);
        }
    }, [isOpen]); // Now, it depends on isOpen

    // Close search bar with Escape key
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Open search bar with Ctrl + K
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === "k") {
                event.preventDefault();
                toggleSearch();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSearch]); // Include toggleSearch here

    return (
        <div>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
                    <input
                        id="search-input"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-4 w-1/3 rounded-lg bg-white shadow-lg"
                        placeholder="Search..."
                    />
                    <button onClick={() => setIsOpen(false)} className="ml-2 p-2 bg-red-500 text-white rounded-lg">Close</button>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
