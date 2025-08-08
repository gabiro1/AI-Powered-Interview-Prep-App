import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { CARD_BG } from '../../utils/data';
import toast from 'react-hot-toast';
import { LuPlus } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import moment from 'moment';
import SummaryCard from '../../components/Cards/SummaryCard';
import Modal from '../../components/Loader/Modal';
import CreateSessionForm from './CreateSessionForm';
import DeleteAlertContent from '../../components/DeleteAlertContent';

const Dashboard = () => {
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  const fetchAllSessions = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      console.log("Fetched sessions response:", response.data);

      // ✅ Adjust based on actual response shape
      const sessionList = Array.isArray(response.data)
        ? response.data
        : response.data.sessions || [];

      setSessions(sessionList);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast.error("Failed to load sessions");
    }
  };

  useEffect(() => {
    fetchAllSessions();
  }, []);

  const deleteSession = async (sessionData) => {
    try {
      await axiosInstance.delete(
        API_PATHS.SESSION.DELETE(sessionData?._id)
      );
      toast.success("Session deleted successfully");
      setOpenDeleteAlert({
        open:false,
        data:null,
      })

      fetchAllSessions(); 
    } catch (err) {
      console.error("Error deleting session data",err);
      toast.error("Failed to delete session");
    }
  };

  return (
    <DashboardLayout>
      <div className='container mx-auto px-4 py-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7 pt-1 pb-6 px-4 md:px-0'>
          {Array.isArray(sessions) && sessions.map((data, index) => (
            <SummaryCard
              key={data?._id}
              colors={CARD_BG[index % CARD_BG.length]}
              role={data?.role || ""}
              topicsToFocus={data?.topicsToFocus || ""}
              experience={data?.experience || "-"}
              questions={data?.questions?.length || "-"}
              description={data?.description || ""}
              lastUpdated={
                data?.updatedAt
                  ? moment(data.updatedAt).format("DD MMM YYYY")
                  : ""
              }
              onSelect={() => navigate(`/interview-prep/${data?._id}`)}
              onDelete={() =>
                setOpenDeleteAlert({
                  open: true,
                  data: data,
                })
              }
            />
          ))}
        </div>

        <button
          onClick={() => setOpenCreateModal(true)}
          className='h-12 md:h-12 flex items-center justify-center gap-3 bg-gradient-to-r from-[#ff9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer hover:shadow-2xl hover:shadow-orange-300 fixed bottom md:bottom-20 right-10 md:right-20'
        >
          <LuPlus className='text-lg text-white' />
          Add New
        </button>
      </div>

      <Modal
      isOpen={openCreateModal}
      onClose={() => 
      {
        setOpenCreateModal(false);
      }}
      hideHeader
      >
        <div>
          <CreateSessionForm />
        </div>
      </Modal>
      <Modal
       isOpen={openDeleteAlert?.open}
       onClose={()=>setOpenDeleteAlert({open:false, data:null})}
       title="Delete Alert"
      >
        <div className='w-[30vw]'>
          <DeleteAlertContent
            content="Are you sure you want to delete this session details?"
            onDelete={()=>deleteSession(openDeleteAlert.data)}
            />
        </div>

      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
