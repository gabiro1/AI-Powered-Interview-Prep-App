import React from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from '../../utils/apiPath';


const CreateSessionForm = () => {
  const [formData, setFormData] = React.useState({
    role: '',
    topicsToFocus: '',
    experience: '',
    description: '',
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const navigate = useNavigate();

  
  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  }

 const handleCreateSession = async (e) => {
    e.preventDefault();
    
    const {role, topicsToFocus, experience, description} = formData;

    if (!role || !topicsToFocus || !experience ) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setIsLoading(true);
    
    try {
      // TODO: Add your API call here to create the session
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role,
          experience,
          topicToFocus: topicsToFocus,
          numberOfQuestions: 10,
        }
      );

      const generatedQuestions = aiResponse.data;

      const response = await axiosInstance.post(
        API_PATHS.SESSION.CREATE,
        {
          ...formData,
          questions: generatedQuestions,
        }
      );


   if(response.data?.session?._id){
    navigate(`/interview-prep/${response.data.session._id}`);
   }
  } catch (err) {
    if(err.response && err.response.data.message){
      setError(err.response.data.message);
    } else {
      setError("Something went wrong. Please try again.");
    }
    
    } finally {
      setIsLoading(false);
    }
 }
  return (
    <div className='w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center '>
      <h3 className='text-lg font-semibold text-black'>Start a new interview Journey</h3>
      <p className='text-sm text-slate-700 mt-[5px] mb-2'>Fill out  a few quick details and unlock your personalized set  of  intreview questions!</p>

      <form onSubmit={handleCreateSession} >
        <Input
          label="Target Role"
          placeholder="(e.g, Software Engineer, Data Scientist, etc.)"
          value={formData.role}
          onChange={({ target }) => handleChange('role', target.value)}
          type="text"
        />

        <Input
          label="Topics to Focus"
          placeholder="(e.g, Algorithms, System Design, etc.)"  
          value={formData.topicsToFocus}
          onChange={({ target }) => handleChange('topicsToFocus', target.value)}
          type="text"
        />

        <Input
          label="Experience Level"  
          placeholder="(e.g, 1 year, 3 years, etc.)"
          value={formData.experience}
          onChange={({ target }) => handleChange('experience', target.value)}
          type="number"
        />

        <Input
          label="Description" 
          placeholder="(Optional: Describe your goals or preferences)"
          value={formData.description}
          onChange={({ target }) => handleChange('description', target.value)}
          type="text"
        /> 
       

        {error && <p className='text-red-500 pb-2.25'>{error}</p>}

        <button type='submit' className='btn btn-primary mt-4' disabled={isLoading}>
        {isLoading && <SpinnerLoader />}  Create Session
        </button>
      </form>

    </div>
  )
}

export default CreateSessionForm