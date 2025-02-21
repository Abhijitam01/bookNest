import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center dark:text-white">Register</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Name" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"/>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"/>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"/>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
