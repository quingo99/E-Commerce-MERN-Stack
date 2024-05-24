import { Col, Container, Row, Form, Button, InputGroup, Alert } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';

const RegisterPageComponents = ({ registerUserApiRequest, reduxDispatch, setReduxUserState }) => {
    const [validated, setValidated] = useState(false);
    const [passwordsMatchState, setPasswordsMatchState] = useState(true); // [passwordsMatchState, setPasswordsMatchState
    const [registerUserResponseState, setRegisterUserResponseState] = useState({
        success: "",
        error: "",
        loading: false,
    });

    const onChange = () => {
        const password = document.querySelector("input[name = password]")
        const confirm = document.querySelector("input[name=confirmPassword]")
        if (confirm.value === password.value) {
            setPasswordsMatchState(true);
        } else {
            setPasswordsMatchState(false);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget.elements;
        const email = form.email.value;
        const name = form.name.value;
        const lastName = form.lastName.value;
        const password = form.password.value;
        if (
            event.currentTarget.checkValidity() === true &&
            email &&
            password &&
            name &&
            lastName &&
            form.password.value === form.confirmPassword.value
        ) {
            setRegisterUserResponseState({ loading: true });
            registerUserApiRequest(name, lastName, email, password)
                .then((data) => {
                    setRegisterUserResponseState({
                        success: data.success,
                        loading: false,
                    });
                    reduxDispatch(setReduxUserState(data.userCreated));
                    
                })
                .catch((er) =>
                    setRegisterUserResponseState({
                        error: er.response.data.message
                            ? er.response.data.message
                            : er.response.data,
                    })
                )
        }

        setValidated(true);
    };
    return (
        <Container>
            <Row className="mt-5">
                <Col md={6}>
                    <h1>Register</h1>
                    <Form noValidate validated={validated} onSubmit={handleSubmit} className="mb-3">

                        <Form.Group as={Col} md="8" controlId="formBasicFirstName">
                            <Form.Label>Your first name</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Enter your first name"
                                name="name"
                            />
                            <Form.Control.Feedback type="invalid">Please enter a name</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} md="8" controlId="formBasicLastName" className="mb-3">
                            <Form.Label>Your last name</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Enter your last name"
                                name="lastName"
                            />
                            <Form.Control.Feedback type="invalid">Please enter your last name</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="8" controlId="formBasicEmail" className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                required
                                type="email"
                                placeholder="Enter your email"
                                name="email"
                            />
                            <Form.Control.Feedback type="invalid">Please enter a valid email address</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} md="8" controlId="formBasicPassword" className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                placeholder="Password"
                                name="password"
                                minLength={6}
                                onChange={onChange}
                                isInvalid={!passwordsMatchState}
                            />
                            <Form.Control.Feedback type="invalid">Please enter a valid password</Form.Control.Feedback>
                            <Form.Text className="text-muted">
                                Password shoud have at least 6 characters
                            </Form.Text>
                        </Form.Group>

                        <Form.Group as={Col} md="8" controlId="formBasicPasswordRepeat" className="mb-3">
                            <Form.Label>Re-Enter Password</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                placeholder="Re-enter password"
                                name="confirmPassword"
                                minLength={6}
                                onChange={onChange}
                                isInvalid={!passwordsMatchState}
                            />
                            <Form.Control.Feedback type="invalid">Both passwords shoud match</Form.Control.Feedback>
                        </Form.Group>

                        <Row className="pb-2">
                            <Col>
                                Do you have an account already?
                                <Link to={"/login"}> Login </Link>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Check
                                required
                                label="Agree to terms and conditions"
                                feedback="You must agree before submitting."
                                feedbackType="invalid"
                            />
                        </Form.Group>
                        <Button type="submit">
                            {registerUserResponseState &&
                                registerUserResponseState.loading === true ? (
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                            ) : (
                                ""
                            )}
                            Submit
                        </Button>
                        <Alert show={registerUserResponseState && registerUserResponseState.error === "user exists"} variant="danger">
                            User with that email already exists!
                        </Alert>
                        <Alert show={registerUserResponseState && registerUserResponseState.success === "User created"} variant="info">
                            User created
                        </Alert>
                    </Form>
                </Col>

            </Row>
            <Row>

            </Row>
        </Container>
    )
}

export default RegisterPageComponents;