import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

export default function ProfileSidebar({ selectedUser,showProfile,setShowProfile }) {
  // const [showProfile, setShowProfile] = useState(true);

  if (!selectedUser) {
    return null; // Render nothing if no user is selected
  }

  // Determine if the selected user is from recommendations
  const isRecommendation = Boolean(selectedUser.user);

  // Extract user details based on the type
  const firstName = isRecommendation
    ? selectedUser.user.firstName
    : selectedUser.firstName;

  const lastName = isRecommendation
    ? selectedUser.user.lastName
    : selectedUser.lastName;

  const skills = isRecommendation
    ? selectedUser.sharedSkills
    : selectedUser.skills;

  const profilePicture = selectedUser.profilePicture || "/superman.jpg";

  const description = selectedUser.description || "No description available.";

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
  };

  return (
    <aside
    className={`profile fixed bottom-0 right-0 lg:static transform transition-all duration-300 ease-in-out shadow-xl border rounded-xl p-2 w-full max-w-sm bg-white dark:bg-gray-900 col-span-12 lg:col-span-4 overflow-hidden 
      ${showProfile ? "translate-y-0" : "translate-y-[0%]"} ${
      showProfile ? "lg:translate-y-0" : "lg:translate-y-[75%]"
    }`}
    aria-labelledby="profile-heading"
  >
    <h2 id="profile-heading" className="sr-only">Profile Information</h2>

    <div
      onClick={toggleProfile}
      className="head flex items-center justify-between cursor-pointer p-4 bg-gray-100 dark:bg-gray-800 rounded-t-lg"
    >
      <div className="flex gap-4 items-center">
        <div className="p-1 rounded-full border">
          <Image
            src={profilePicture}
            width={40}
            height={40}
            className="rounded-full"
            alt="Profile Picture"
          />
        </div>
        <p className="text-lg font-semibold">
          {firstName} <span className="ml">{lastName}</span>
        </p>
      </div>
      {showProfile ? <ChevronDown /> : <ChevronUp />}
    </div>

    {showProfile && (
      <div className="content p-4">
        <div className="description bg-white dark:bg-gray-800 dark:border dark:border-white rounded-lg p-4 mb-4"></div>

        <div className="skills-container h-40 overflow-y-auto scroll-hide  rounded-md p-2">
          <div className="skills flex flex-wrap gap-2">
            {skills && skills.length > 0 ? (
              <>
                <p className="font-semibold mb-2">
                  {isRecommendation ? "Shared skills with user:" : "Skills possessed by user:"}
                </p>
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-500 text-white dark:bg-white dark:text-black rounded-lg p-2"
                  >
                    {skill}
                  </span>
                ))}
              </>
            ) : (
              <p>No skills available</p>
            )}
          </div>
        </div>

        <div className="connect mt-4 flex gap-4">
          <button className="bg-blue-500 text-white rounded-lg p-2">
            Lets talk...
          </button>
          <button className="bg-gray-200 p-2 rounded-lg">
            <ChevronUp className="text-gray-600" />
          </button>
        </div>
      </div>
    )}
  </aside>
  );
}
