import { Outlet, Navigate } from 'react-router-dom'
import UserChatComponent from './user/UserChatComponent';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import LoginPage from '../pages/LoginPage';

const ProtectedRoutesComponent = ({ admin }) => {
    const [isAuth, setIsAuth] = useState()

    useEffect(() => {
        axios.get("/api/get-token")
        .then(function (data){
            if(data.data.token){
                setIsAuth(data.data.token);
            }
            return isAuth;
        })
        .catch(function (er){
            console.log(er);
            return <LoginPage />
        })
    })
    if (isAuth === undefined) return <LoginPage />

    //if trying to access admin route with regular user account
    return isAuth && admin && isAuth !== "admin" ? (
        <Navigate to="/login" />
    ) : isAuth && admin ? ( //is actual admin
        <Outlet />
    )
      : isAuth && !admin ? ( //is regular user but access to user route
            <>
                <UserChatComponent />
                <Outlet />
            </>
    )
      : ( //not authenticate
        <Navigate to="/login" />
      )

    //Outlet is the route inside of ProtectedRoute
}

export default ProtectedRoutesComponent