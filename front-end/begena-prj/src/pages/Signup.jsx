import { Link } from "react-router-dom";
export function Signup() {
  return (
    <>
      <div className="center  m-4 sm:m-8">
        <h1 className="text-black dark:text-white p-3 text-2xl sm:text-3xl font-bold text-center">
          Sign Up
        </h1>
        <p className="text-center">create an account!</p>
      </div>
      <div className="center gap-4 p-2 max-w-md mx-auto">
        <input className="input w-full" type="text" placeholder="Email" />
        <input className="input w-full" type="password" placeholder="*******" />
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
      </div>
    </>
  );
}
