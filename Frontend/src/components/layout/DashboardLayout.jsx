import React, { useContext, useEffect } from 'react'
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import SpinnerLoader from '../Loader/SpinnerLoader';

const DashboardLayout = ({ children }) => {
    const { user, loading } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/');
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <SpinnerLoader />
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect to home page
    }

    return (
        <div>
            <Navbar/>
            <div>{ children }</div>
        </div>
    )
}

export default DashboardLayout