import React, {useContext} from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { APP_FEATURES } from "../utils/data";
import { LuSparkles } from "react-icons/lu"; 
import Hero_img from "../assets/Hero_img.jpg"; 
import Modal from "../components/Loader/Modal";
import Login from "./auth/login";
import Signup from "./auth/signup";
import ProfileInfoCard from "../components/Cards/ProfileInfoCard";
import { UserContext } from "../context/userContext";

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if(!user){
      setOpenAuthModal(true);
    }else{
      navigate("/dashboard");
    }
  };
  return (
    <>
   <div className="w-full min-h-screen bg-[#FFFCEF] pb-36">
  {/* glowing blur effect */}
  <div className="w-[500px] h-[500px] bg-amber-200/20 blur-[65px] absolute top-0 left-0 z-0" />

  <div className="container mx-auto px-4 pt-6 pb-[200px] relative z-10">
    
    {/* Header */}
    <header className="flex justify-between items-center mb-25">
      <div className="text-xl text-black font-bold">Interview Prep AI</div>
      {user ?(
        <ProfileInfoCard/>
      ) : (
        
        <button
        className="bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-black hover:text-white border-white transition-colors cursor-pointer"
        onClick={() => setOpenAuthModal(true)}
      >
        Login / Signup
      </button>
      )}
    </header>

    {/* Hero Section */}
    <div className="ml-10 md:flex-row items-center justify-between ">
      {/* Left Column */}
      <div className="w-full md:w-1/2 pr-4 mb-8 md:mb-0">
        {/* Badge */}
        <div className="flex items-center justify-start mb-4">
          <div className="flex items-center gap-2 text-[13px] text-amber-600 font-semibold bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
           <LuSparkles /> AI Powered
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-5xl text-black font-medium mb-6 leading-tight">
          Ace Interviews with{" "}
          <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#ff9324_0%,_#fcd760_100%)] bg-[length:200%_200%] animate-text-shine font-semibold">
            AI-Powered
          </span>{" "}
          Learning
        </h1>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-2/2 ml-2">
        <p className="text-[17px] text-gray-900 mr-0 md:mr-20 mb-6">
          Get role-specific questions, expand answers when you need them, dive
          deeper into concepts, and organize everything your way. From
          preparation to mastery — your ultimate interview toolkit is here.
        </p>
        <button
          className="bg-yellow-100 text-sm font-semibold text-black px-7 py-2.5 rounded-full hover:bg-black hover:text-white border border-yellow-300 transition-colors cursor-pointer"
          onClick={handleCTA}
        >
          Get Started
        </button>
      </div>
    </div>
  </div>
</div>

    <div className="w-full min-h-full relative z-10">
      <div>
      <section className=" flex items-center justify-center -mt-50 ">
        <img
        className="w-[80vw] rounded-lg "
         src={Hero_img} alt="Hello Image" />
      </section>
    </div>

    <div className=" w-full min-h-full bg-[#fffcef] mt-10 ">
      <div className="container mx-auto px-4 pt-10 pb-20">
        <section className="mt-5">
          <h2 className="text-2xl font-medium text-center mb-12"> Feature that makes shine</h2>

          <div className="flex flex-col items-center gap-8">
          {/* First 3 features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {APP_FEATURES.slice(0,3).map((feature) => (
              <div 
              key={feature.id} 
              className="bg-[#FFFCEF] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 tansition border border-amber-100 ">
                <h3 className=" text-base  font-semibold mb-3"> {feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* remaining 2 features  */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {APP_FEATURES.slice(3).map((feature) => (
              <div 
              key={feature.id} 
              className="bg-[#FFFCEF] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 tansition border border-amber-100 ">
                <h3 className="text-base  font-semibold mb-3"> {feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
          </div>
        </section>
      </div>
    </div>

    <div className="text-sm bg-gray-50 text-secondary text-center  p-5 mt-5"> Made  by Jovial

    </div>
    </div>

   <Modal
  isOpen={openAuthModal}
  onClose={() => {
    setOpenAuthModal(false);
    setCurrentPage("login");
  }}
  hideHeader
>
  <div>
    {currentPage === "login" && (
      <Login setCurrentPage={setCurrentPage} />
    )}
    {currentPage === "signup" && (
      <Signup setCurrentPage={setCurrentPage} />
    )}
  </div>
</Modal>

    </>
  );
};

export default LandingPage;
