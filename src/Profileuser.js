import React, { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const token = sessionStorage.getItem('token'); 
            if (!token) {
                throw new Error('Token not found. Please log in again.');
            }
            const response = await axios.get("http://13.204.15.86:3002/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const user = response.data;
            setUserData(user);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };
    fetchUserData();
}, []); 

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p><strong>First Name:</strong> {userData.firstName}</p>
        <p><strong>Last Name:</strong> {userData.lastName}</p>
        <p><strong>Email ID:</strong> {userData.email}</p>
      </div>
    </div>
  );
};
export default UserProfile;