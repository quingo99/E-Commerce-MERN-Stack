import LoginPageComponent from "./components/LoginPageComponent";
import axios from "axios"
import { useDispatch } from "react-redux";
import { setReduxUserState } from "../redux/action/userActions";

const loginUserApiRequest = async(email, password, doNotLogOut) => {
  const {data} = await axios.post("/api/users/login", {email, password, doNotLogOut})
  if(data.userLoggedIn.doNotLogout){
    localStorage.setItem("userInfo", JSON.stringify(data.userLoggedIn)); //local storage will keep information in storage even if we close the web browser
  }
  else{
    sessionStorage.setItem("userInfo", JSON.stringify(data.userLoggedIn)); // data wont be available after closing web browser
  }
  return data;
}
const LoginPage = () => {
  const reduxDispatch = useDispatch()
  return <LoginPageComponent  loginUserApiRequest = {loginUserApiRequest} reduxDispatch = {reduxDispatch} setReduxUserState={setReduxUserState}/>
}

export default LoginPage