import axios from "axios";
import RegisterPageComponents from "./components/RegisterPageComponent";
import { useDispatch } from "react-redux";
import { setReduxUserState } from "../redux/action/userActions";

const registerUserApiRequest = async (name, lastName, email, password) => {
    const {data} = await axios.post("/api/users/register", {name, lastName, email, password});
    sessionStorage.setItem("userInfo", JSON.stringify(data.userCreated));
    if (data.success === "User created") window.location.href = "/";
    return data
}

const Register = () => {
    const reduxDispatch = useDispatch();
    return <RegisterPageComponents registerUserApiRequest={registerUserApiRequest} reduxDispatch={reduxDispatch} setReduxUserState={setReduxUserState}/>
    
}

export default Register;
