import React from "react";
import { Home } from "./pages/Home.jsx";
import { Library } from "./pages/Library.jsx";
import { Login } from "./pages/Login.jsx";
import { Signup } from "./pages/Signup.jsx";
import { Link, Route, Routes } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
function App() {
  return (
    <>
      <nav className="">
        <ul className="flex flex-row  gap-5">
          <li>
            <Link className="nav" to="/">
              BEGENA
            </Link>
          </li>
          <li className="nav">
            <Link to="/">Home</Link>
          </li>
          <li>
            <div className="relative mt-1">
              <input
                type="text"
                placeholder="search songs"
                className="pl-10 border-2 rounded-md  "
              />
              <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2" />
            </div>
          </li>
          <li className="nav ml-auto">
            <Link to="/Library">Libary</Link>
          </li>
          <li className="nav">
            <Link to="/Login">Login</Link>
          </li>
          <li className="nav ">
            <Link to="/signup">signup</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Library" element={<Library />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
