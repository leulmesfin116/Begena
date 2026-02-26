import { Link } from "react-router-dom";
import { signupUser } from "../api/auth.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSignup = async (e) => {
    e.preventDefault();
    // ensure email contains a domain — if user omitted '@', append @gmail.com
    let finalEmail = email || "";
    if (finalEmail && !finalEmail.includes("@")) {
      finalEmail = finalEmail + "@gmail.com";
    }
    const data = await signupUser(name, finalEmail, password);

    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/");
    } else {
      setMessage("Signup failed: " + data.message);
    }
  };

  return (
    <>
      <div className="center  m-4 sm:m-8">
        <h1 className="text-black dark:text-white p-3 text-2xl sm:text-3xl font-bold text-center">
          Sign Up
        </h1>
        <p className="text-center">create an account!</p>
      </div>

      <form
        className="center gap-4 p-2 max-w-md mx-auto"
        onSubmit={handleSignup}
      >
        <input
          className="input w-full"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input w-full"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => {
            // if user forgot to include '@', assume gmail and append
            if (email && !email.includes("@")) {
              setEmail((prev) => prev + "@gmail.com");
            }
          }}
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
          className="relative bg-gray-300 dark:bg-gray-600 rounded-lg p-3 border-2 border-black dark:border-white overflow-hidden group cursor-pointer w-full"
        >
          <span className="absolute inset-0 bg-black dark:bg-white translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-550 z-0"></span>
          <span className="relative z-10 group-hover:text-white dark:group-hover:text-gray-700 transition-colors duration-400">
            submit
          </span>
        </button>

        {message && (
          <p className="text-center text-sm text-red-600">{message}</p>
        )}
      </form>
    </>
  );
}
