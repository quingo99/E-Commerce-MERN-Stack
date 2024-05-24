import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import UserProfilePageComponent from "./components/UserProfilePageComponent";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setReduxUserState } from "../../redux/action/userActions";

const updateUserApiRequest = async (name, lastName, phoneNumber, address, country, zipCode, city, state, password) => {
  const {data} = await axios.put("/api/users/profile", {name, lastName, phoneNumber, address, country, zipCode, city, state, password});
  return data
}
const fetchUser = async (id) => {
  const {data} = await axios.get(`/api/users/profile/${id}`);
  return data
}
const UserProfilePage = () => {
  const reduxDispatch = useDispatch();
  const {userInfo} = useSelector(state => state.userRegisterLogin);
  return (
    <Container className="main">
      <Row className="mt-5 justify-content-md-center">
        <Col md={12}>
          <UserProfilePageComponent 
            updateUserApiRequest={updateUserApiRequest} 
            fetchUser={fetchUser} 
            userInfoFromRedux={userInfo} 
            setReduxUserState={setReduxUserState}
            reduxDispatch={reduxDispatch}
            localStorage={window.localStorage}
            sessionStorage={window.sessionStorage}/>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfilePage;

