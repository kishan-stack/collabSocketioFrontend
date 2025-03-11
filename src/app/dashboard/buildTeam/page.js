"use client"
import { Card } from "../../../components/ui/card"
import { useState ,useEffect} from "react"
import { CardContent, CardDescription, CardHeader } from "../../../components/ui/card"
import { Textarea } from "../../../components/ui/textarea"
import { Button } from "../../../components/ui/button"
import axios from "axios"
import { toast } from "react-toastify"
import useApiRequest from "../../../hooks/apihooks/useApiRequest";
import { useSocket } from "@/context/socketContext"
import Link from "next/link"
export default function BuildTeam() {
    const socket = useSocket();
    const [userDescriptionOfTeam, setUserDescriptionOfTeam] = useState('')
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState([])
    const { sendRequest } = useApiRequest()
    
    
    const handleDescriptionChange = async () => {
        if (!userDescriptionOfTeam.trim()) {
            toast.error("Please provide a description for your team.");
            return;
        }
        setLoading(true)
        // console.log(userDescriptionOfTeam);
        try {

            toast.info("Please wait while we find potential users for your team")
            const response = await sendRequest("/users/getPotentialUsers", "POST", { userDescriptionOfTeam })
            setRecommendations(response.data)
            console.log(response.data);
        } catch (error) {
            console.error("error :: ", error);
            toast.error("An error occured while getting recommendations")

        }
        finally {
            setLoading(false)
        }
    }
    return (
        <>
            <div className="flex flex-col h-full mt-1">
                <Card className='flex-grow shadow-xl border-s-8'>
                    <CardHeader>
                        <h2 className="text-2xl font-bold text-gray-900">Build a Team</h2>
                    </CardHeader>
                    <CardDescription className='px-4'>
                        You can build your personalised team here ...
                    </CardDescription>
                    <CardContent className='mt-5'>
                        {/* <Input className="w-full lg:w-2/3 md:w-2/3 bg-gray-100 p-4  overflow-x-auto whitespace-nowrap" value={userDescriptionOfTeam} onChange={(e)=>setUserDescriptionOfTeam(e.target.value)}   placeholder="Input your idea of how your team members should be and what skills your team members should have..."/> */}
                        <div className="flex  w-full gap-4 items-center">
                            <Textarea className='w-full md:w-2/3 lg:w-2/3 scroll-hide' value={userDescriptionOfTeam} placeholder="describe here what skills you want your team members to have..." onChange={(e) => setUserDescriptionOfTeam(e.target.value)} onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleDescriptionChange();
                                }
                            }} />
                            <Button className="p-7" onClick={handleDescriptionChange} >Build A team</Button>
                        </div>
                        <div className=" mt-8 resultsOfPotentialUsers max-h-[450px] overflow-y-auto scroll-hide">
                            {loading ? (
                                <div className=" loadig flex justify-center items-center h-screen">
                                    loading
                                </div>
                            ) : recommendations.length > 0 ? (
                                <div className="resultsDiv ">
                                    {recommendations.map((rec, index) => (
                                        
                                            <Card key={index} className='shadow-xl border mb-4  '>
                                                <CardHeader>
                                                <Link
                                        key={index}
                                        href={`/dashboard/users/${rec.user.kindeAuthId}`} // Dynamic link to user profile
                                        passHref
                                    >
                                                    <h3 className="font-bold text-lg text-gray-800">
                                                        {rec.user.name ? `${rec.user.name} ` : "Anonymous user"}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 ">{rec.user.email}</p>
                                                    </Link>
                                                </CardHeader>
                                                <CardContent>
                                                   
                                                    <p>
                                                        <span className="font-semibold"> Matched Skills : </span>{" "}
                                                        {rec.matchedSkills.join(", ")}
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold"> Total Score Of Profile  : </span>{" "}
                                                        {typeof rec.totalScore === 'number' ? rec.totalScore.toFixed(2) : "NA"}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                    ))}
                                </div>
                            ) : (
                                !loading && <p className="text-gray-500">No recommendation yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}