import React, { useEffect, useState } from 'react';
import Sidebar from "./Sidebar/HRMSidebar";
import axios from 'axios';
import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ChangePassword from './Components/ChangePassword';
import API from './api';

const fetchUserProfileLocation = async (userId) => {
  const response = await fetch(`${API.API_BASE}/users/id_user/${userId}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  const data = await response.json();
  return data[0];
};

const fetchLocation = async () => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token is missing. Please log in again.');
  }
  try {
    const response = await fetch('http://13.204.15.86:3002/loc', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch location');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching location:', error.message);
    throw error;
  }
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const userId = sessionStorage.getItem('userId');
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [matchedLocation, setMatchedLocation] = useState(null);
  const [isChangePasswordVisible, setChangePasswordVisible] = useState(false);

  useEffect(() => {
    const getUserProfileAndLocation = async () => {
      try {
        const userProfile = await fetchUserProfileLocation(userId);
        const locations = await fetchLocation();
        const userLocation = locations.find(
          (loc) => loc.locality === userProfile.location
        );
        setMatchedLocation(userLocation);
        setProfile({ ...userProfile, ...userLocation });
        setUpdatedProfile({ ...userProfile, ...userLocation });
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getUserProfileAndLocation();
  }, [userId]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleClosePopup = () => {
    setChangePasswordVisible(false);
  };

  const handleChangePasswordClick = () => {
    setChangePasswordVisible(true);
  };

  const handleHome = () => {
    navigate('/Cards');
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className='flex h-screen'>
      <Sidebar />
      <div className='p-6 w-full overflow-y-auto'>
        <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg relative">
          <button onClick={handleHome} type="button" className="flex items-center p-2 rounded-full">
            <FaHome className="text-white mr-2" size={25} />
          </button>
          <h1 className="text-white text-[24px] font-bold">Profile</h1>
        </div>

        <div className="w-full mt-5 mx-auto p-6 bg-white shadow-lg rounded-lg">
          <section className="flex justify-between items-center border-b pb-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold">{profile.first_name} {profile.last_name}</h1>
              <p className="text-gray-500">{profile.email}</p>
              <p className="text-gray-500">{profile.user_status}</p>
            </div>
            <label onClick={handleChangePasswordClick} className="cursor-pointer text-blue-500">Change Password</label>
          </section>

          {isChangePasswordVisible && <ChangePassword email={profile.email} onClose={handleClosePopup} />}

          <section className="border rounded-lg p-4 mb-6">
            <h2 className="text-[18px] font-medium text-blue-500">Personal Information</h2>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <h3 className="text-gray-500">First Name</h3>
                <p>{profile.first_name}</p>
              </div>
              <div>
                <h3 className="text-gray-500">Last Name</h3>
                <p>{profile.last_name}</p>
              </div>
            </div>
          </section>

          <section className="border rounded-lg p-4">
            <h2 className="text-[18px] font-medium text-blue-600">Address</h2>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <h3 className="text-gray-500">Locality</h3>
                <p>{profile.locality}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
