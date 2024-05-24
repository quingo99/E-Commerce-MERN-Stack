import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner'



const LoginPageComponent = ({loginUserApiRequest, reduxDispatch, setReduxUserState }) => {
  const [validated, setValidated] = useState(false);
  const [loginUserResponseState, setLoginUserReponseState] = useState({success: "", error: "", loading: false})


  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget.elements;

    const email = form.email.value
    const password = form.password.value
    const doNotLogOut = form.doNotLogout.checked;
    if(event.currentTarget.checkValidity() === true && email && password){
        setLoginUserReponseState({loading: true})
        loginUserApiRequest(email, password, doNotLogOut)
        .then((res) => {
            setLoginUserReponseState({success: res.success, loading: false, error: ""})
            if(res.userLoggedIn){
                console.log(res.userLoggedIn)
                reduxDispatch(setReduxUserState(res.userLoggedIn))
            }
            if(res.success == "user logged in" && !res.userLoggedIn.isAdmin){
                //replace: true help get rid off login page in the history which doesn't let you to click goes back
                //navigate("/", {replace: true}); 
                window.location.href = '/'
            } else{
                //navigate("/admin/orders", {replace:true})
                window.location.href = '/admin/orders'
            }
        })
        .catch((err) => {setLoginUserReponseState({error: err.response.data.message ? err.response.data.message : err.response.data})});
    }
    

    setValidated(true);
  };

  const navigate = useNavigate();

  return (
    <Container className="main">
      <Row className="mt-5 justify-content-md-center">
        <Col md={6}>
          <h1>Login</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            
            
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                required
                type="email"
                placeholder="Enter email"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                required
                type="password"
                placeholder="Password"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                name="doNotLogout"
                type="checkbox"
                label="Do not logout"
              />
            </Form.Group>

            <Row className="pb-2">
              <Col>
               Don't you have an account?
                <Link to={"/register"}> Register </Link>
              </Col>
            </Row>

            <Button variant="primary" type="submit">
                {loginUserResponseState && loginUserResponseState.loading === true ? (
                     <Spinner
                     as="span"
                     animation="border"
                     size="sm"
                     role="status"
                     aria-hidden="true"
                   />) : 
                    ("")
                }
             
              Login
            </Button>
            <Alert show={loginUserResponseState && loginUserResponseState.error === "Wrong credential"} variant="danger">
                Wrong credentials
            </Alert>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPageComponent;

