import React, { useEffect, useState } from "react";
import axios from "axios";
import Avatar from "./assests/Avatar.png";
import SoftTrails from "./assests/SoftTrails.png";
import API from "./config/api";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);
  const getToken = () => sessionStorage.getItem("token");
  const token = getToken();
  useEffect(() => {
    const fetchData = async () => {
      const userId = parseInt(sessionStorage.getItem("userId")); // Get from sessionStorage

      if (!userId) {
        console.error("No userId found in sessionStorage");
        return;
      }

      try {
        const userRes = await axios.get(
          `${API.API_BASE}/users`,

          { headers: { Authorization: `Bearer ${token}` } }
        );
        const loggedInUser = userRes.data.find((u) => u.user_id === userId);

        if (loggedInUser) {
          setUser(loggedInUser);

          const locRes = await axios.get(
            `${API.API_BASE}/loc`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const userLoc = locRes.data.find(
            (loc) =>
              loc.locality.toLowerCase() === loggedInUser.locality.toLowerCase()
          );

          if (userLoc) setLocation(userLoc);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  if (!user)
    return <div className="text-center mt-10">Loading user profile...</div>;

  const formattedDate = new Date(user.created_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="h-full flex flex-col rounded-none md:rounded-xl shadow-md overflow-hidden">
      <div className="bg-blue-100 flex justify-center p-6 relative">
        <img
          src={Avatar}
          alt="Avatar"
          className="w-24 h-24 rounded-full border-4 border-white -mb-12"
        />
      </div>
      <div className="pt-16 pb-6 text-center px-4">
        <h2 className="text-lg font-semibold text-blue-600">
          {user ? `${user.first_name} ${user.last_name}` : "Loading Name..."}
        </h2>
        <p className="text-sm text-gray-600">
          {user ? user.email : "Loading Email..."}
        </p>
      </div>

      <div className="px-6 pb-6">
        <h3 className="text-md font-semibold text-gray-700 mb-3">
          Basic Information
        </h3>
        <div className="grid grid-cols-2 gap-y-4 text-sm text-gray-700">
          <div>
            <p className="text-xs text-gray-500">Employee ID</p>
            <p>{user ? user.emp_id : "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Phone number</p>
            <p>{user ? `+91-${user.phone_no}` : "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Registered date</p>
            <p>
              {user
                ? new Date(user.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">User status</p>
            <p>
              {user
                ? user.user_status.charAt(0).toUpperCase() +
                  user.user_status.slice(1)
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Address</p>
            <p>{location ? location.locality : "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">City</p>
            <p>{location ? location.city : "N/A"}</p>
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-col items-center text-center pb-4">
        <p className="text-sm text-gray-500">Powered by</p>
        <img src={SoftTrails} alt="SoftTrails Logo" className="w-24" />
      </div>
    </div>
  );
};
export default UserProfile;
