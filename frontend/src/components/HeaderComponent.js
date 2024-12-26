import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

import { LinkContainer } from 'react-router-bootstrap';
import {Link} from 'react-router-dom'
import { logout } from '../redux/action/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';





const HeaderComponent = () => {
    const dispatch = useDispatch();
    const {userInfo} = useSelector(state => state.userRegisterLogin);
    const itemCount = useSelector(state => state.cart.itemCount);
    const categories = useSelector(state => state.category.categories);
    console.log(categories);
   
    return <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
            {/*Help go back to the main page without reloading*/}
            <LinkContainer to = "/">
                <Navbar.Brand href="/">E&C Shopping</Navbar.Brand>
            </LinkContainer>

            <Navbar.Toggle aria-controls="responsive-navbar-nav" />

            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                    <InputGroup>
                        <DropdownButton id="dropdown-basic-button" title="ALL">
                            <Dropdown.Item>Electronics</Dropdown.Item>
                            <Dropdown.Item>Books</Dropdown.Item>
                            <Dropdown.Item>Cloths</Dropdown.Item>
                            <Dropdown.Item>Accessories</Dropdown.Item>
                        </DropdownButton>
                        <Form.Control type="text" placeholder="Search in our shop...." />
                        <Button variant="warning"><i className="bi bi-search-heart"></i></Button>
                    </InputGroup>
                </Nav>

                <Nav>
                    {userInfo.isAdmin ? (
                         <LinkContainer to ="/admin/orders">
                         <Nav.Link>
                             Admin
                             <span className="position-absolute top-1 start-10 translate-middle p-2 bg-danger border border-light rounded-circle"></span>
                         </Nav.Link>
                     </LinkContainer>
 
                    ) : userInfo.name && !userInfo.isAdmin ? (
                        <NavDropdown title={`${userInfo.name} ${userInfo.lastname}`} id="collasible-nav-dropdown">
                            <NavDropdown.Item  eventKey="/user/my-orders" as={Link} to="/user/my-orders">My orders</NavDropdown.Item>
                            <NavDropdown.Item  eventKey="/user/my-profile" as={Link} to="/user/my-profile">My profile</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => dispatch(logout())}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    ): (<>
                        <LinkContainer to ="/login">
                            <Nav.Link>
                                Login   
                            </Nav.Link>
                        </LinkContainer>

                        <LinkContainer to ="/register">
                            <Nav.Link>
                                Register  
                            </Nav.Link>
                        </LinkContainer>
                    </>
                    )}
                   
                  

                   

                    <LinkContainer to ="/cart">
                        <Nav.Link>
                            <Badge pill bg="danger">
                                {itemCount === 0 ? "" : itemCount}
                            </Badge>
                            <i className="bi bi-cart3"></i>
                            <span className="ms-1">Cart</span> {/*add margin */}
                        </Nav.Link>
                    </LinkContainer>

                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
}

export default HeaderComponent;