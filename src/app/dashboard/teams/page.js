"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useApiRequest from "@/hooks/apihooks/useApiRequest";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "react-toastify";
import Link from "next/link";
import { Send } from "lucide-react";

export default function Teams() {
    const { sendRequest } = useApiRequest();
    const [createTeamOpen, setCreateTeamOpen] = useState(false);
    const [joinTeamOpen, setJoinTeamOpen] = useState(false);
    const [teamName, setTeamName] = useState("");
    const [passPhrase, setPassPhrase] = useState("");
    const { idToken } = useKindeAuth();
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        if (idToken?.sub) {
            const fetchTeams = async () => {
                try {
                    const response = await sendRequest("/teams/getTeams", "GET");
                    console.log(response);
                    setTeams([...teams, ...response.data.data]);
                } catch (error) {
                    console.error(error);
                    toast.error("Failed to fetch teams. Please try again later.");
                }
            }
            fetchTeams();

        }
    }, [idToken]);

    const handleCreateTeam = async () => {
        if (!teamName || !passPhrase) {
            toast.error("Please enter team name and passphrase");
            return;
        }
        setCreateTeamOpen(false);
        toast.info("Creating team...");
        try {
            const response = await sendRequest("/teams/createteam", "POST", { teamName, passphrase: passPhrase });
            toast.success(response.message || "Team created successfully");
            console.log(response);
            setTeams([...teams, response.data]);
            setTeamName("");
            setPassPhrase("");


        } catch (error) {
            console.error(error);
            toast.error("Failed to create team. Please try again later.");
        }
    }

    const handleJoinTeam = async () => {
        if (!passPhrase) {
            toast.error("Please enter team passphrase");
            return;
        }

        setJoinTeamOpen(false);
        toast.info("Joining team...");

        try {
            const response = await sendRequest("/teams/joinTeam", "POST", { passphrase: passPhrase });
            toast.success(response.message || "Successfully joined the team!");

            // Update the team list with the joined team
            setTeams([...teams, response.data]);
            setPassPhrase(""); // Clear the input field
        } catch (error) {
            console.error(error);
            toast.error("Failed to join the team. Please try again.");
        }
    };



    return (
        <>
            <div className="flex flex-col h-full mt-1">
                {/* Top Bar with Buttons */}
                <div className="flex justify-end mb-4 space-x-4">
                    <Button variant="primary" onClick={() => setCreateTeamOpen(true)}>
                        Create Team
                    </Button>
                    <Button variant="secondary" onClick={() => setJoinTeamOpen(true)}>
                        Join Team
                    </Button>
                </div>

                {/* Main Content */}
                <Card className="flex-grow shadow-xl">
                    <CardHeader>
                        <CardTitle>Teams </CardTitle>
                    </CardHeader>
                    <CardContent className="mt-2">

                        {teams?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                                {teams.map((team) => (
                                    <div
                                        key={team.teamName} // Replace with a unique identifier like team._id
                                        className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow  flex flex-col"
                                    >
                                        {/* Team Name */}
                                        <h3 className="font-bold text-xl text-gray-800 mb-2">
                                            {team.teamName}
                                        </h3>

                                        {/* Team Leader */}
                                        <p className="text-sm text-gray-500 mb-4">
                                            Created by:  <span className="font-medium">
                                                {team.teamLeader?.name || "Unknown"}{" "}
                                                {team.teamLeader?.kindeAuthId === idToken?.sub && (
                                                    <span className="text-blue-500">(You)</span>
                                                )}
                                            </span>
                                        </p>
                                        <p className="text-sm text-gray-500 mb-4">
                                            Passphrase : <span className="font-medium">{team.passphrase || "Unknown"}</span>
                                        </p>

                                        <div className="text-sm text-gray-700 mb-4">
                                            <p className="font-medium mb-1">Participants:</p>
                                            {team.participants?.length > 0 ? (
                                                <ul className="list-disc pl-5">
                                                    {team.participants.map((participant) => (
                                                        <p key={participant.kindeAuthId}>
                                                            <span className="font-medium">
                                                                {"- "}
                                                                {participant.name}{" "}
                                                                {participant.kindeAuthId === idToken?.sub && (
                                                                    <span className="text-blue-500">(You)</span>
                                                                )}
                                                            </span>
                                                        </p>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>No participants yet.</p>
                                            )}
                                        </div>
                                        <div className="flex-grow"></div>
                                        {/* Action Buttons */}
                                        <div className="flex justify-end mt-auto">
                                            <Link
                                                href={`/dashboard/teams/${team._id}`} // Replace with the actual team identifier
                                            >
                                                <Send />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No teams available. Create or join a team to get started!</p>
                        )}
                    </CardContent>

                </Card>

                {/* Create Team Modal */}
                <Dialog open={createTeamOpen} onOpenChange={setCreateTeamOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create a New Team</DialogTitle>
                            <DialogDescription>
                                Enter the details below to create a new team.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="teamName">Team Name</Label>
                                <Input
                                    id="teamName"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    placeholder="Enter team name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="passphrase">Passphrase</Label>
                                <Input
                                    id="passphrase"
                                    value={passPhrase}
                                    onChange={(e) => setPassPhrase(e.target.value)}
                                    placeholder="Enter a unique passphrase"
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button variant="primary" onClick={handleCreateTeam}>Create Team</Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Join Team Modal */}
                <Dialog open={joinTeamOpen} onOpenChange={setJoinTeamOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Join a Team</DialogTitle>
                            <DialogDescription>
                                Enter the passphrase shared by the team leader to join.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="joinPassphrase">Passphrase</Label>
                                <Input
                                    id="joinPassphrase"
                                    value={passPhrase}
                                    onChange={(e) => setPassPhrase(e.target.value)}
                                    placeholder="Enter team passphrase"
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button variant="primary" onClick={handleJoinTeam}>Join Team</Button>
                        </div>
                    </DialogContent>
                </Dialog>



            </div>
        </>
    );
}
