// "use client";
import config from "../../../config";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import axios from "axios";

const environment = process.env.NODE_ENV;
const baseUrl = config[environment].Url;

const useApiRequest = () => {
    const { getToken } = useKindeAuth();
    const sendRequest = async (endpoint, method = 'GET', data = null) => {
        const url = `${baseUrl}${endpoint}`
        try {
            const token = await getToken();
            // console.log(token);
            const config = {
                method,
                url,
                headers: {
                    Authorization: `Bearer ${token}`,

                },
                data,
            };
            const response = await axios(config);
            return response.data;
        } catch (error) {
            console.error("Error sending API request", error);
            throw error;
        }
    }

    return { sendRequest }

}

export default useApiRequest;