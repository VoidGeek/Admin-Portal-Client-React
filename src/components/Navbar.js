import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ showAdminBoard, showModeratorBoard, currentUser, logOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-opacity-75 backdrop-blur-lg py-3 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-black flex items-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Emblem_of_the_Ku_Klux_Klan.svg/2048px-Emblem_of_the_Ku_Klux_Klan.svg.png"
              alt="Logo"
              className="h-10 w-10"
            />
          </Link>
        </div>
        {isMobileView ? (
          // Render the mobile menu toggle button
          <button
            className="text-2xl text-black block sm:hidden"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            &#9776;
          </button>
        ) : (
          // Render the desktop navigation links
          <div className="flex space-x-4">
            <Link to={"/home"} className="text-lg hover:text-blue-300 text-black">
              Home
            </Link>
            <Link to={"/home/services"} className="text-lg hover:text-blue-300 text-black">
              Services
            </Link>
            <Link to={"/home/feeds"} className="text-lg hover:text-blue-300 text-black">
              Feeds
            </Link>
            {showAdminBoard && (
              <Link to={"/admin"} className="text-lg hover:text-blue-300 text-black">
                Admin Board
              </Link>
            )}
            {showModeratorBoard && (
              <Link to={"/moderator"} className="text-lg hover:text-blue-300 text-black">
                Moderator Board
              </Link>
            )}
            {currentUser ? (
              <>
                <Link to="/profile" className="text-lg hover:text-blue-300 text-black">
                  {currentUser.username}
                </Link>
                <a
                  href="/login"
                  className="text-md hover:text-blue-300 cursor-pointer text-white bg-gradient-to-r from-blue-200 to-blue-400 px-4 py-2 rounded-md"
                  onClick={logOut}
                >
                  Log Out
                </a>
              </>
            ) : (
              <>
                <Link to="/login" className="text-lg hover:text-blue-300 text-black">
                  Login
                </Link>
                <Link to="/register" className="text-lg hover:text-blue-300 text-black">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}

        <div
          className={`mobile-menu bg-white w-64 absolute top-16 right-0 mr-4 rounded-md shadow ${
            isMenuOpen ? "translate-y-0" : "translate-y-full invisible"
          } transition-transform ease-in-out duration-300`}
        >
          <ul className="py-4 px-2 space-y-2">
            <li>
              <Link to="/home" className="text-lg text-black hover:text-blue-300" onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/home/services" className="text-lg text-black hover:text-blue-300" onClick={closeMenu}>
                Services
              </Link>
            </li>
            <li>
              <Link to="/home/feeds" className="text-lg text-black hover:text-blue-300" onClick={closeMenu}>
                Feeds
              </Link>
            </li>
            {showAdminBoard && (
              <li>
                <Link to="/admin" className="text-lg text-black hover:text-blue-300" onClick={closeMenu}>
                  Admin Board
                </Link>
              </li>
            )}
            {showModeratorBoard && (
              <li>
                <Link to="/moderator" className="text-lg text-black hover:text-blue-300" onClick={closeMenu}>
                  Moderator Board
                </Link>
              </li>
            )}
            {currentUser ? (
              <>
                <li>
                  <Link to="/profile" className="text-lg text-black hover:text-blue-300" onClick={closeMenu}>
                    {currentUser.username}
                  </Link>
                </li>
                <li>
                  <a
                    href="/login"
                    className="text-md hover:text-blue-300 cursor-pointer text-white bg-gradient-to-r from-blue-200 to-blue-400 px-4 py-2 rounded-md"
                    onClick={() => {
                      logOut();
                      closeMenu();
                    }}
                  >
                    Log Out
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="text-lg text-black hover:text-blue-300" onClick={closeMenu}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-lg text-black hover:text-blue-300" onClick={closeMenu}>
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
