import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { LuCircleAlert, LuListCollapse } from "react-icons/lu";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import RoleInfoHeader from "../../components/RoleInfoHeader";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import QuestionCard from "../../components/Cards/QuestionCard"
import AIResponsePreview from "../../components/AIResponsePreview";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";
import Drawer from "../../components/Drawer";



const InterviewPreps = () => {
  const { sessionId } = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [openLeanMoreDrawer, setOpenLeanMoreDrawer] = useState(false);
  const [explaination, setExplanation] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);

  // fetching sessionData
  const fetchSessionDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.SESSION.GET_ONE(sessionId)
      );

      if (response.data && response.data.session) {
        setSessionData(response.data.session);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const generateConceptExplanation = async (question) => {
    try {
      setErrorMsg("");
      setExplanation(null);
      setIsLoading(true);
      setOpenLeanMoreDrawer(true);
      
      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_EXPLANATION,
        {
          question,
        }
      );

      if(response.data){
        setExplanation(response.data)
      }
    } catch (error) {
      setExplanation(null)
      setErrorMsg("Failed to generate explaination, Try again later");
      console.error("Error:", error);
    }finally{
      setIsLoading(false)
    }
  };

  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response =await axiosInstance.post(
        API_PATHS.QUESTION.PIN(questionId)
      );

      console.log(response)
      if(response.data && response.data.question){
        fetchSessionDetailsById();
      }
    } catch (error) {
       console.error("Error:", error);
    }
  };

  const UploadMoreQuestions = async () => {
    try{
      setIsUpdateLoader(true);

      // call api to generate more question 
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role:sessionData?.role,
          experience:sessionData?.experience,
          topicsToFocus:sessionData?.topicsToFocus,
          numberOfQeustions:10,
        }
      );

      // should array like 

      const generatedQuestions =aiResponse.data;

      const response = await axiosInstance.post(
        API_PATHS.  QUESTION.ADD_TO_SESSION, {
          sessionId,
          question:generatedQuestions,
        }
      );

      if(response.data){
        toast.success("Add More Q&A!!");
        fetchSessionDetailsById();
      }
    }catch(error){
      if(error.response && error.response.data.message){
        setError(error.response.data.message)
      }else{
        setError("Something went wrong. Please try again")
      }
    }finally{
      setIsUpdateLoader(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsById();
    }

    return () => {};
  }, []);

  return (
    <DashboardLayout>
      <RoleInfoHeader
        role={sessionData?.role}
        experience={sessionData?.experience || "-"}
        topicsToFocus={sessionData?.topicsToFocus || ""}
        questions={
          Array.isArray(sessionData?.questions)
            ? sessionData.questions.length
            : 0
        }
        description={sessionData?.description || ""}
        lastUpdated={
          sessionData?.updatedAt
            ? moment(sessionData.updatedAt).format("MMM DD, YYYY")
            : ""
        }
      />

      <div className="container mx-auto pt-4 pb-4 px-4  md:px-0">
        <h2 className="text-lg font-semibold color-black"> Interview Q & A</h2>
        <div className="grid grid-cols-12 gap-4 mt-5 mb-10">
          <div
            className={`col-span-12 ${
              openLeanMoreDrawer ? "md:col-span-7" : "md:col-span-8"
            }`}
          >
            <AnimatePresence>
              {sessionData?.questions?.map((data, index) => (
                <motion.div
                  key={data._id || index}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.4,
                    type: "spring",
                    stiffness: 100,
                    delay: index * 0.1,
                    damping: 15,
                  }}
                  layout
                  layoutId={`question-${data._id || index}`}
                >
                  <>
                    <QuestionCard
                      question={data.question}
                      answer={data.answer}
                      onLearnMore={() => {
                        // add your click handler logic here
                        generateConceptExplanation(data.question);
                        console.log("Learn more clicked:", data._id);
                      }}
                      isPinned={data?.isPinned}
                      onTogglePin={() => toggleQuestionPinStatus(data._id)}
                    />
                  
                  {
                    !isLoading && 
                    sessionData?.question?.length == index + 1 && (
                      <div className=" flex items-center justify-center mt-5">
                        <button 
                        className="flex items-center gap-3 text-sm text-center font-medium bg-black px-5 py-2 mr-2 rounded text-nowrap cursor-pointer"
                        disabled={isLoading || isUpdateLoader}
                        onClick={UploadMoreQuestions}
                        >
                          {isUpdateLoader ? (
                            <SpinnerLoader/>
                          ):(
                            <LuListCollapse className="text-lg"/>
                          )} { " "} 
                          Load More
                        </button>
                      </div>
                    )
                  }
                  </>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <Drawer
            isOpen={openLeanMoreDrawer}
            onClose={()=>setOpenLeanMoreDrawer(false)}
            title={!isLoading && explaination?.title}
          >
            {errorMsg &&(
              <p className="flex gap-2 text-sm text-amber-600 font-medium ">
                <LuCircleAlert className="mt-1"/> {errorMsg}
              </p>
            )}
            {isLoading && <SkeletonLoader />}
            {
              !isLoading && explaination && (
                <AIResponsePreview content={explaination?.explaination}/>
              )
            }
          </Drawer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewPreps;
