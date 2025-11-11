import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const profileItems = [
  {
    icon: "http://cdn.builder.io/api/v1/image/assets/TEMP/a407c21bbddbba8e9f32540c38b89b1bc9feea9abe41dade9b0eb372ade13f3c?placeholderIfAbsent=true&apiKey=f4328c4a551b4b9fa165bba17dc932db",
    text: "My Profile",
  },
  // {
  //   icon: "http://cdn.builder.io/api/v1/image/assets/TEMP/a407c21bbddbba8e9f32540c38b89b1bc9feea9abe41dade9b0eb372ade13f3c?placeholderIfAbsent=true&apiKey=f4328c4a551b4b9fa165bba17dc932db",
  //   text: "Password Change",
  // },
];

function ProfileItem({ icon, text }) {
      const navigate = useNavigate();
      const userId = sessionStorage.getItem("userId");

  const handleClick = () => {
    if (text === "My Profile") {
      navigate(`/employeelayout/${userId}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex gap-2.5 mt-4 text-xs text-neutral-600 w-full"
    >
      <img
        loading="lazy"
        src={icon}
        alt=""
        className="object-contain shrink-0 w-6 aspect-square"
      />
      <span className="my-auto">{text}</span>
    </button>
  );
}

function LogoutButton() {
  const navigate = useNavigate();

  const Logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userId"); // Add this line to clear sessionStorage

    navigate("/");
  };
  return (
    <button
      className="flex gap-2.5 self-stretch px-2.5 py-2 mt-5 text-xs text-red-400 rounded-lg bg-zinc-300 bg-opacity-50 w-full"
      onClick={Logout}
    >
      <img
        loading="lazy"
        src="http://cdn.builder.io/api/v1/image/assets/TEMP/342bb2da21789f81ffbfd2d7b23f61fcc6c937b98e58d57453a75ada6e36e758?placeholderIfAbsent=true&apiKey=f4328c4a551b4b9fa165bba17dc932db"
        alt=""
        className="object-contain shrink-0 w-6 aspect-square"
      />
      <span className="grow shrink my-auto w-[179px]">Log Out</span>
    </button>
  );
}

function ProfileDropdown() {
  const userId = sessionStorage.getItem("userId") || sessionStorage.getItem("employeeeId");
  const [userData, setUserData] = useState(null);
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        navigate("/");
        return;
      }
      try {
        const response = await axios.post(
          " https://devapi.softtrails.net/saas/test/users/verify-token",
          { token }
        );
        console.log("Token is valid:", response.data);
      } catch (error) {
        console.error(
          "Token verification failed:",
          error.response ? error.response.data : error.message
        );
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("tokenExpiry");
        navigate("/");
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://devapi.softtrails.net/saas/test/users/id_user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data) {
          setUserData(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    verifyToken();
    if (userId) {
      fetchUserData();
    }
  }, [token, userId, navigate]);

  return (
    <section className="flex overflow-hidden flex-col items-start px-4 py-3.5 bg-white rounded-lg border border-solid z-20 border-zinc-500 w-[295px]">
      <header className="flex gap-3.5">
        <img
          loading="lazy"
          src="http://cdn.builder.io/api/v1/image/assets/TEMP/8839e5a86c91c744ae902ecbb75ae11121a15ba11a67d20ec56f825e116dd9ef?placeholderIfAbsent=true&apiKey=f4328c4a551b4b9fa165bba17dc932db"
          alt=""
          className="object-contain shrink-0 aspect-square w-[45px]"
        />
        <div className="flex flex-col my-auto">
          {userData && (
            <div className="ml-auto flex items-center gap-4">
              <h3 className="font-semibold text-custome-black text-[14px]">
                {userData.first_name} {userData.last_name}
                <br />
                {userData.email}
              </h3>
            </div>
          )}
        </div>
      </header>
      <hr className="shrink-0 self-stretch mt-3.5 h-0 border border-solid border-zinc-400" />
      <nav className="w-full">
        {profileItems.map((item, index) => (
          <ProfileItem
            key={index}
            icon={item.icon}
            text={item.text}
            navigate={navigate}
          />
        ))}
      </nav>
      <LogoutButton />
    </section>
  );
}
export default ProfileDropdown;