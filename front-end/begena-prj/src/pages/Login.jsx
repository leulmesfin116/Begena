import { Link } from "react-router-dom";
export function Login() {
  return (
    <>
      <div className="center  m-8">
        <h1 className="text-white p-3 text-3xl font-bold">Login</h1>
        <p>create an account!</p>
      </div>
      <div className="center gap-4 p-2">
        <input className="input" type="text" placeholder="Email" />
        <input className="input" type="password" placeholder="*******" />
        <button
          className="relative bg-gray-600 rounded-lg p-3 border-2 border-white
        overflow-hidden group cursor-pointer "
        >
          <span
            className="absolute inset-0 bg-white translate-y-[-100%]
             group-hover:translate-y-0 transition-transform duration-550 z-0"
          ></span>
          <span className="relative z-10 group-hover:text-gray-700 transition-colors duration-400">
            submit
          </span>
        </button>
        <div className="flex flex-row gap-3">
          <p>Need an account?</p>
          <Link className="text-blue-600  hover:text-blue-400" to="/signup">
            Sign Up
          </Link>
        </div>
      </div>
    </>
  );
}
