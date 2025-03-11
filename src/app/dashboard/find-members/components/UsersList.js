import Image from "next/image";
import Link from "next/link";

export default function UsersList({ users, loading, onUserSelect }) {
  if (loading) return <p>Loading...</p>;
  if (!users.length) return <p>No users in the database</p>;
    
  return (
    <div className="resultsCard max-h-[600px] overflow-y-auto scroll-hide space-y-4">
      <p className="text-xl text-black p-4 rounded-b-xl bg-white/30 dark:bg-black dark:text-white backdrop-blur-lg sticky top-0">
        Checkout other members
      </p>
      {users.map((user, index) => (
        <button
          key={index}
          onClick={() => onUserSelect(user)}
          className="flex-grow shadow-xl border-s-8 mt-2 w-full p-4 bg-white rounded-lg dark:bg-gray-800"
        >
          <div className="flex items-center gap-4">
            <Image src="/superman.jpg" width={50} height={50} className="rounded-full" alt="Profile Picture" />
            <Link href={`/dashboard/users/${index}`} className="block">
              <p>{user.firstName} {user.lastName}</p>
              <p>{user.email}</p>
            </Link>
          </div>
          <p>Skills : <span className="font-bold">{user.skills.join(", ")}</span></p>
        </button>
      ))}
    </div>
  );
}
