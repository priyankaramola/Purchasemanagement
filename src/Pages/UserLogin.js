import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "../Components/buttons";
import Label from "../Components/Label";
import InputField from "../Components/Inputfields";
import Text from "../Components/text";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notificationShown, setNotificationShown] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState({});
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setEmail("");
    let id = sessionStorage.getItem("userId");
    setUserId(id);
  }, []);

  window.addEventListener("popstate", function (event) {
    if (!userId) {
      navigate("/Login");
    }
  });

  const authenticateUser = async (email, password) => {
    try {
      // Authenticate the user with the login API
      const loginResponse = await axios.post(
        "http://13.204.15.86:3002/login",
        {
          email,
          password,
        }
      );

      const { userId } = loginResponse.data;
      sessionStorage.setItem("userId", userId);

      // Fetch the list of all users from the API
      const usersResponse = await axios.get("http://13.204.15.86:3002/users");
      const users = usersResponse.data;

      // Check if the entered email exists in the list of users
      const matchedUser = users.find((user) => user.email === email);

      if (matchedUser) {
        // Redirect to the matched user's dashboard
        navigate(`/dashboard/${matchedUser.userId}`);
      } else {
        showNotification("Email not found. Please enter a valid email.");
      }
    } catch (err) {
      console.log("Error during login:", err);
      showNotification(
        "Invalid credentials. Please enter a valid username and password to proceed."
      );
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await authenticateUser(email, password);
  };

  const showNotification = (msg) => {
    setNotificationShown(true);
    setNotificationMessage({ msg, caseId: "", isDownloadBtn: false });
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gray-200 flex justify-center items-center">
        {/* Add your image here */}
        <img
          src="your-image-url.jpg"
          alt="Login Background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-1/2 flex justify-center items-center p-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
          <div className="mb-4">
            <Label htmlFor="email">
              Email/ Phone{" "}
              <Text variant="imp" size="sm" decor="un" weight="xb">
                *
              </Text>
            </Label>
            <InputField
              type="email"
              id="email"
              placeholder="Enter email or phone"
              setValue={setEmail}
              value={email}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password">
              Password{" "}
              <Text variant="imp" size="sm" decor="un" weight="xb">
                *
              </Text>
            </Label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 pr-10 shadow-md focus:ring-gray-300 focus:outline-none focus:bg-white focus:border-gray-300"
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </span>
            </div>
          </div>
          <div className="mb-4 text-right">
            <Text decor="un" variant="link" size="xs" weight="b" align="r">
              <Link to="/forgot-password">Forgot Password?</Link>
            </Text>
          </div>
          <div className="mb-6 flex justify-center">
            <Button>Login</Button>
          </div>
          <div className="text-gray-600 text-center">
            Don't have an account?{" "}
            <Text
              decor="un"
              variant="link"
              onClick={() => navigate("/sign-up")}
              style={{ cursor: "pointer" }}
            >
              Signup
            </Text>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;