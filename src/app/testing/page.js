"use client"
import { Button } from "../../components/ui/button";
import useApiRequest from "../../hooks/apihooks/useApiRequest";
export default function Testing() {
    const { sendRequest } = useApiRequest();
    const sendKindeInfo = async () => {
        try {
            const response = await sendRequest("http://localhost:5000/api/v1/testing/kinde-setup-check","POST",{});
            // console.log("response : ", response);
        } catch (error) {
            console.error("Error sending kinde information", error);
        }
    }

    return (
        <div>
            <Button onClick={sendKindeInfo}>Send kinde information</Button>

        </div>
    )
}