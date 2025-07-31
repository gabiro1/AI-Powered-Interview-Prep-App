import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../../utils/apiPath";
import { UserContext } from "../../context/userContext";

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // For modal context, we don't need to navigate to signup page
  // The setCurrentPage prop will handle switching between login/signup in the modal

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email && !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }
    setError("");

    try {
      console.log("Making API call to:", `${BASE_URL}${API_PATHS.AUTH.LOGIN}`);
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      console.log("Login response:", response.data);
      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });

      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message || "Login failed. Please try again.");
      } else {
        console.error("Login error:", error);
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">Welcome Back</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Please enter your details to log in
      </p>

      {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300 w-full pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className="absolute inset-y-0 right-3 flex items-center"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <FaRegEyeSlash size={17} className="text-slate-400 cursor-pointer" />
            ) : (
              <FaRegEye size={17} className="text-primary cursor-pointer" />
            )}
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#FF9324] hover:bg-[#e27800] text-white font-semibold py-2 rounded transition-colors"
        >
          Log In
        </button>

        <p className="text-sm text-center mt-2">
          Don't have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer underline"
            onClick={() => setCurrentPage("signup")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
