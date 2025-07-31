import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage";
import InterviewPreps from "./pages/interviewPreps/InterviewPreps";
import Dashboard from "./pages/home/Dashboard";
import { UserProvider } from "./context/userContext";

function App() {
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview-prep/:sessionId" element={<InterviewPreps />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Router>

      <Toaster 
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </div>
    </UserProvider>
  );
}

export default App;
