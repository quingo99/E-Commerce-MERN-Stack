import axios from 'axios';
import {LOGIN_USER, LOGOUT_USER} from '../constants/userConstants'

export const setReduxUserState = (userCreated) => (dispatch) => {
    
    //the patch help calling reducer
    dispatch({
        type: LOGIN_USER,
        payload: userCreated
    })
}  

export const logout = () => (dispatch) =>  {
    console.log("logout")
    document.location.href = "/login";
    axios.get("/api/logout")
    localStorage.removeItem("userInfo"); 
    sessionStorage.removeItem("userInfo");
    localStorage.removeItem("cart")
    dispatch({type: LOGOUT_USER})

}