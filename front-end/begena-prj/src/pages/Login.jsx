import { Link } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../api/auth.js"; // make sure this file exists

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = await loginUser(email, password);

    if (data.token) {
      localStorage.setItem("token", data.token);
      setMessage("Login successful!");
    } else {
      setMessage("Login failed: " + data.message);
    }
  };

  return (
    <>
      <div className="center m-4 sm:m-8">
        <h1 className="text-black dark:text-white p-3 text-2xl sm:text-3xl font-bold text-center">
          Login
        </h1>
        <p className="text-center">create an account!</p>
      </div>

      <form
        className="center gap-4 p-2 max-w-md mx-auto"
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
          className="relative bg-gray-300 dark:bg-gray-600 rounded-lg p-3 border-2 border-black dark:border-white
          overflow-hidden group cursor-pointer w-full"
        >
          <span
            className="absolute inset-0 bg-black dark:bg-white translate-y-[-100%]
             group-hover:translate-y-0 transition-transform duration-550 z-0"
          ></span>
          <span className="relative z-10 group-hover:text-white dark:group-hover:text-gray-700 transition-colors duration-400">
            submit
          </span>
        </button>

        <p className="text-center">{message}</p>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
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
