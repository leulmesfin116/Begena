import { Link } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../api/auth.js"; // make sure this file exists
import { useNavigate } from "react-router-dom";
import { useAudio } from "../context/AudioContext";
import { useUser } from "../context/UserContext";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshLikes } = useAudio();
  const { login } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(""); // clear previous message
    try {
      const data = await loginUser(email, password);

      if (data.token) {
        login(data.token, data.role);
        await refreshLikes(); // Load user's favorites immediately
        navigate("/");
      } else {
        setMessage("Login failed: " + data.message);
      }
    } catch (error) {
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="center mt-6 px-4 sm:mt-10">
        <h1 className="text-black dark:text-white p-3 text-2xl sm:text-3xl font-bold text-center">
          Login
        </h1>
        <p className="text-center text-sm sm:text-base">Create an account!</p>
      </div>

      <form
        className="center gap-4 px-4 pb-28 sm:pb-32 max-w-md mx-auto w-full"
        onSubmit={handleLogin}
      >
        <input
          className="input w-full"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input w-full"
          type="password"
          placeholder="*******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`relative bg-gray-300 dark:bg-muted rounded-lg p-3 border-2 border-black dark:border-white
          overflow-hidden group w-full ${
            isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"
          }`}
        >
          {!isLoading && (
            <span
              className="absolute inset-0 bg-black dark:bg-white translate-y-[-100%]
               group-hover:translate-y-0 transition-transform duration-550 z-0"
            ></span>
          )}
          <span className="relative z-10 group-hover:text-white dark:group-hover:text-background transition-colors duration-400">
            {isLoading ? "Logging in..." : "submit"}
          </span>
        </button>

        {message && (
          <p className="text-center text-sm text-red-600 break-words">
            {message}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center text-sm sm:text-base">
          <p>Need an account?</p>
          <Link
            className="text-blue-600 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300"
            to="/signup"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </>
  );
}
