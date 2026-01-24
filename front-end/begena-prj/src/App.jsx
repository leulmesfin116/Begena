import React, { useState } from "react";
import { Home } from "./pages/Home.jsx";
import { Library } from "./pages/Library.jsx";
import { Login } from "./pages/Login.jsx";
import { Signup } from "./pages/Signup.jsx";
import { NewMusic } from "./pages/NewMusic.jsx";
import { Podcast } from "./pages/Podcast.jsx";
import { Link, Route, Routes } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "./ThemeContext.jsx";
function App() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
      <nav className="bg-white dark:bg-gray-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link className="nav text-xl sm:text-2xl" to="/">
                BEGENA
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link className="nav" to="/">
                Home
              </Link>
              <Link className="nav" to="/Library">
                Library
              </Link>
              <Link className="nav" to="/Login">
                Login
              </Link>
              <Link className="nav" to="/signup">
                Signup
              </Link>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="search songs"
                  className="pl-8 pr-2 py-1 sm:pl-10 sm:pr-4 sm:py-2 border-2 rounded-md input w-24 sm:w-48 md:w-64 text-xs sm:text-sm md:text-base"
                />
                <FaSearch className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </div>
              <button
                onClick={toggleTheme}
                className="p-1 sm:p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {isDarkMode ? (
                  <Sun size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Moon size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-1 sm:p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {isMenuOpen ? (
                  <X size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Menu size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <Link
                  className="nav block px-3 py-2"
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  className="nav block px-3 py-2"
                  to="/Library"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Library
                </Link>
                <Link
                  className="nav block px-3 py-2"
                  to="/Login"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  className="nav block px-3 py-2"
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Signup
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Library" element={<Library />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/newMusic" element={<NewMusic />} />
        <Route path="/Podcast" element={<Podcast />} />
      </Routes>
    </>
  );
}

export default App;
