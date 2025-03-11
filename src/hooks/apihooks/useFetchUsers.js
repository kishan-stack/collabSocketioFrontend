import { useEffect, useState } from "react";
import useApiRequest from "./useApiRequest";

/**
 * Custom hook to fetch users data.
 *
 * @param {string} email - The email of the currently logged-in user.
 * @returns {Object} An object containing users, loading state, and error.
 */

export default function useFetchUsers() {
    const { sendRequest } = useApiRequest();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await sendRequest("/users/getAllUsers");
                setUsers(data); // Assuming API response has a "data" field containing the users
            } catch (err) {
                console.error("Error fetching users:", err);
                setError(err.message || "An error occurred");
            }
        };

        fetchUsers();
    }, [sendRequest]);

    return { users, loading, error };

}
