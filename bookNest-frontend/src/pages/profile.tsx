import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get("/api/users/me");
      setUser(res.data);
    };
    fetchUser();
  }, []);

  return user ? (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold dark:text-white">Profile</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">Welcome, {user.name}!</p>

        {/* User Info */}
        <div className="mt-4">
          <p className="text-md dark:text-white"><strong>Email:</strong> {user.email}</p>
          <p className="text-md dark:text-white"><strong>Joined:</strong> {new Date(user.createdAt).toDateString()}</p>
        </div>

        {/* Logout Button */}
        <button onClick={() => { axios.post("/api/logout"); window.location.href = "/login"; }}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded">
          Logout
        </button>
      </div>
    </div>
  ) : (
    <p className="text-center dark:text-white">Loading...</p>
  );
};

export default Profile;
