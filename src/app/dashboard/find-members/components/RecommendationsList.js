import Image from "next/image";

export default function RecommendationsList({ recommendations, loading, onUserSelect }) {
  if (loading) return <p>Loading...</p>;
  if (!recommendations.length) return <p>No recommendations in DB</p>;

  return (
    <div className="resultsCard max-h-[600px] overflow-y-auto scroll-hide space-y-4">
      <p className="text-xl text-black p-4 rounded-b-xl bg-white/30 dark:bg-black dark:text-white backdrop-blur-lg sticky top-0 z-10">
        Recommendations for you
      </p>
      {recommendations.map((recommendation, index) => (
        <button
          key={index}
          onClick={() => onUserSelect(recommendation)}
          className="flex-grow shadow-xl border-s-8 mt-2 w-full p-4 bg-white rounded-lg dark:bg-gray-800"
        >
          <div className="flex items-center gap-4">
            <Image src="/superman.jpg" width={50} height={50} className="rounded-full" alt="Profile Picture" />
            <div>
              <p>{recommendation.user.firstName} {recommendation.user.lastName}</p>
              <p>{recommendation.user.email}</p>
            </div>
          </div>
          <p>Shared Skills: <span className="font-bold">{recommendation.sharedSkills.join(", ")}</span></p>
        </button>
      ))}
    </div>
  );
}
