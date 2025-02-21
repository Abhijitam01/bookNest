import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth";

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {user ? (
        <>
          <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
          <button onClick={logout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md">Logout</button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold">BookNest</h1>
          <button onClick={() => router.push("/auth/login")} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">Login</button>
          <button onClick={() => router.push("/auth/register")} className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md">Register</button>
        </>
      )}
    </div>
  );
}
