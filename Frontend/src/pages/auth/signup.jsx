import React, { useState, useContext } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import ProfilePhotoSelector from "../../components/Inputs/profilePhotoSelector";
import { validateEmail } from "../../utils/helper";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../../utils/apiPath";
import { uploadImage } from "../../utils/uploadImages";
import { useNavigate } from "react-router-dom";


const Signup = ({ setCurrentPage }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  const { updateUser } = useContext(UserContext);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!fullName && !email && !password) {
      setError("Please fill in all fields");
      return;
    }

    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter your full name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter your email address");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setError("");

    // signup API logic goes here
    try {
      console.log("Signing up with:", { fullName, email, password });
      // TODO: Call signup API and handle image upload if needed
      if(profilePic){
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || ""; 
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
      });

      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }

    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message || "Signup failed. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const goToLogin = () => {
    // In modal context, setCurrentPage will always be available
    setCurrentPage("login");
  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">Create Account</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Please enter your details to sign up
      </p>

      {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <input
          type="text"
          placeholder="Full Name"
          className="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

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
          Sign Up
        </button>

        <p className="text-sm text-center mt-2">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer underline"
            onClick={goToLogin}
          >
            Log In
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
