import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaHome } from 'react-icons/fa';
import ProfileDropdown from '../ProfileDropdown'; // Ensure this is your dropdown component or replace with custom implementation.

const ResponsiveHeaderBar = ({ title, userData, handleHome }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

    return (
        <div className="bg-custome-blue rounded-lg w-full p-3 flex flex-col sm:flex-row justify-between items-center shadow-lg">
            {/* Home Button */}
            <button
                onClick={handleHome}
                type="button"
                className="flex items-center p-2 rounded-full mb-2 sm:mb-0"
            >
                <FaHome className="text-white mr-2" size={25} />
            </button>

            {/* Title */}
            <h1 className="text-white text-xl sm:text-2xl font-bold text-center">
                {title}
            </h1>

            {/* User Profile Button */}
            {userData && (
                <button
                    onClick={toggleDropdown}
                    type="button"
                    className="bg-white flex items-center rounded-full mt-2 sm:mt-0 sm:mr-10 p-2"
                >
                    <div className="bg-white rounded-3xl p-2 flex items-center">
                        <div className="flex flex-col">
                            <h3 className="text-sm sm:text-[18px] font-semibold text-custome-black">
                                {userData.first_name} {userData.last_name}
                            </h3>
                        </div>
                    </div>
                </button>
            )}

            {/* Dropdown */}
            {isDropdownOpen && (
                <div className="fixed right-4 top-[70px] sm:top-[90px] w-full sm:w-auto z-10">
                    <ProfileDropdown className="absolute z-10 right-0" />
                </div>
            )}
        </div>
    );
};

ResponsiveHeaderBar.propTypes = {
    title: PropTypes.string.isRequired,
    userData: PropTypes.shape({
        first_name: PropTypes.string.isRequired,
        last_name: PropTypes.string.isRequired,
    }),
    handleHome: PropTypes.func.isRequired,
};

export default ResponsiveHeaderBar;
