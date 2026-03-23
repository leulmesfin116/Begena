import React, { useState, useEffect } from "react";
import { Home } from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import { Signup } from "./pages/Signup.jsx";
import { NewMusic } from "./pages/NewMusic.jsx";
import { Podcast } from "./pages/Podcast.jsx";
import { Playlist } from "./pages/Playlist.jsx";
import { LofiMusic } from "./pages/LofiMusic.jsx";
import { Favourite } from "./pages/Favourite.jsx";
import { Search } from "./pages/Search.jsx";
import { Upload } from "./pages/Upload.jsx";
import { AdminUploads } from "./pages/AdminUploads.jsx";
import { About } from "./pages/About.jsx";

import { Link, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { ArrowLeft, Moon, Sun, Menu, X, Search as SearchIcon } from "lucide-react";
import { useTheme } from "./ThemeContext.jsx";
import { GlobalPlayer } from "./components/GlobalPlayer.jsx";
import { useUser } from "./context/UserContext.jsx";

function App() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, isAdmin, logout } = useUser();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // handling searches
  const [search, setSearch] = useState("");
  function handleSearch(e) {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/Search?q=${encodeURIComponent(search.trim())}`);
    }
  }

  const handleUserIcon = () => {
    if (!isLoggedIn) {
      navigate("/Login");
    } else {
      setShowUserMenu((prev) => !prev);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/Login");
  };

  return (
    <>
      <nav className="bg-white dark:bg-background border-b border-gray-200 dark:border-border shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {location.pathname !== '/' && (
                <button
                  onClick={() => navigate(-1)}
                  className="mr-2 sm:mr-4 p-1 sm:p-2 rounded-md bg-gray-200 dark:bg-secondary text-black dark:text-white hover:bg-gray-300 dark:hover:bg-accent transition-colors flex items-center justify-center"
                  aria-label="Go back"
                  title="Go back"
                >
                  <ArrowLeft size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
              <Link className="nav text-xl sm:text-2xl" to="/">
                BEGENA
              </Link>
            </div>
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
              <Link className="nav" to="/">
                Home
              </Link>
              <Link className="nav" to="/Login">
                Login
              </Link>
              <Link className="nav" to="/signup">
                Signup
              </Link>
              <Link className="nav" to="/about">
                About
              </Link>
              {isAdmin && (
                <>
                  <Link className="nav font-bold text-gray-900 dark:text-gray-200" to="/upload">
                    Music
                  </Link>
                  <Link className="nav font-bold text-gray-900 dark:text-gray-200" to="/admin/uploads">
                    Pod/Lofi
                  </Link>
                </>
              )}
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
              <button
                onClick={toggleTheme}
                aria-label={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
                title={isDarkMode ? "Light mode" : "Dark mode"}
                className="p-1 sm:p-2 rounded-md bg-gray-200 dark:bg-secondary text-black dark:text-white hover:bg-gray-300 dark:hover:bg-accent transition-colors"
              >
                {isDarkMode ? (
                  <Sun size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Moon size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>

              <div className="relative hidden sm:block">
                {/* on change */}
                <SearchIcon
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Search songs"
                  className="pl-7 pr-2 py-1 sm:pl-9 sm:pr-3 sm:py-2 border-2 rounded-md input w-32 md:w-52 lg:w-64 text-xs sm:text-sm outline-none focus:border-black dark:focus:border-white transition-colors"
                />
              </div>

              {/* user icon with dropdown */}
              <div className="relative">
                <button
                  onClick={handleUserIcon}
                  className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <FaUserCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-card shadow-lg rounded-md z-10 border dark:border-border">
                    {isLoggedIn ? (
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-accent"
                      >
                        Logout
                      </button>
                    ) : (
                      <Link
                        to="/Login"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-accent"
                      >
                        Login
                      </Link>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-1 sm:p-2 rounded-md bg-gray-200 dark:bg-secondary text-black dark:text-white hover:bg-gray-300 dark:hover:bg-accent transition-colors"
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
            <div className="lg:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-background border-t border-gray-200 dark:border-border">
                <Link
                  className="nav block px-3 py-2"
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
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
                <Link
                  className="nav block px-3 py-2"
                  to="/about"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                {isAdmin && (
                  <>
                    <Link
                      className="nav block px-3 py-2 font-bold text-gray-900 hover:text-gray-600 dark:text-gray-200 dark:hover:text-white transition-colors"
                      to="/upload"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Upload Music
                    </Link>
                    <Link
                      className="nav block px-3 py-2 font-bold text-gray-900 hover:text-gray-600 dark:text-gray-200 dark:hover:text-white transition-colors"
                      to="/admin/uploads"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Upload Pod/Lofi
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/newMusic" element={<NewMusic />} />
        <Route path="/Podcast" element={<Podcast />} />
        <Route path="/Playlist" element={<Playlist />} />
        <Route path="/LofiMusic" element={<LofiMusic />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/admin/uploads" element={<AdminUploads />} />

        <Route path="/Favourite" element={<Favourite />} />
        <Route path="/Search" element={<Search />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <GlobalPlayer />
    </>
  );
}

export default App;
