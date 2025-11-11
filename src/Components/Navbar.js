import React, { useState } from "react";
import { Link } from "react-router-dom";
// import logo from "./logo.png";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white fixed w-full z-50 shadow-md">
      <div className="flex items-center justify-between p-4">
        {/* <img src={logo} alt="logo" className="w-16 h-16" /> */}
        <div className={`w-full md:flex md:items-center md:w-auto ${isOpen ? "block" : "hidden"}`}>
          <div className="flex flex-col md:flex-row md:ml-auto md:space-x-8 space-y-2 md:space-y-0">
            <Link to="/" onClick={toggleMenu} className="text-black no-underline">Home</Link>
            <Link to="/About" onClick={toggleMenu} className="text-black no-underline">About</Link>
            <Link to="/Solution" onClick={toggleMenu} className="text-black no-underline">Solution</Link>
            <Link to="/Connect" onClick={toggleMenu} className="text-black no-underline">Contact</Link>
            <div className="flex space-x-4">
              <Link to="/Login" onClick={toggleMenu} className="px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md no-underline">Login</Link>
              <Link to="/Signup" onClick={toggleMenu} className="px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md no-underline">Sign up</Link>
            </div>
          </div>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? (
              <i className="fas fa-times text-black text-xl"></i>
            ) : (
              <i className="fas fa-bars text-black text-xl"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
