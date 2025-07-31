import React, { useEffect,useState } from "react";
import { API_PATHS } from "../utils/apiPath";
import axiosInstance from "../utils/axiosInstance";

export const UserContext = React.createContext();
export const UserProvider = ({ children }) => {
    const [user, setUser] =     useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(user) return;

        const accessToken = localStorage.getItem("token");
        if (!accessToken) {
            setLoading(false);
            return;
        }   

       const fetchUser = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
            setUser(response.data.user);
            
        } catch (error) {
            console.error("User not Authorized:", error);
            clearUser();
        } finally {
            setLoading(false);
        }
       };

       fetchUser();
    }, []);

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem("token", userData.token); //save token
        setLoading(false);
    };

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("token"); //remove token
        setLoading(false);
    };

    return(
        <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    )
}