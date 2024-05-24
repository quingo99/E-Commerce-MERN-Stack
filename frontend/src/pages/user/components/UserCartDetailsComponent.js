import {
    Container,
    Row,
    Col,
    Form,
    Alert,
    ListGroup,
    Button,
  } from "react-bootstrap";
  import CartItemComponent from "../../../components/CartItemComponent";
  import { useState, useEffect } from "react";
  
  const UserCartDetailsComponent = ({user, cartItems, itemCount, cartSubtotal, changecartItemQuantity, removeCartItem, reduxDispatch}) => {

    const [buttonDisabled, setButtonDisabled] = useState(false);

    const changeCount = (productId, quantity) => {
      reduxDispatch(changecartItemQuantity(productId, quantity));
    }

    const removeCartItemHandler = (productId, quantity, price) => {
      if(window.confirm("Are you sure you want to remove this item?")){
        reduxDispatch(removeCartItem(productId, quantity, price));
      }
    }

    useEffect(() => {
      if (!user.state || !user.address || !user.city || !user.zipCode || !user.phoneNumber) {
          setButtonDisabled(true);
      } else {
          setButtonDisabled(false);
      }
  }, [user]);

    return (
      <Container fluid>
        <Row className="mt-4">
          <h1>Cart Details</h1>
          <Col md={8}>
            <br />
            <Row>
              <Col md={6}>
                <h2>Shipping</h2>
                <b>Name</b>: {user.name} {user.lastName} <br />
                <b>Address</b>: {user.address} {user.city} {user.state}, {user.zipCode} <br />
                <b>Phone</b>: {user.phoneNumber} <br />
              </Col>
              <Col md={6}>
                <h2>Payment method</h2>
                <Form.Select>
                  <option value="pp">PayPal</option>
                  <option value="cod">
                    Cash On Delivery (delivery may be delayed)
                  </option>
                </Form.Select>
              </Col>
              <Row>
                <Col>
                  <Alert className="mt-3" variant="danger">
                    Not delivered. In order to make order, fill out your profile with correct address, city etc.
                  </Alert>
                </Col>
                <Col>
                  <Alert className="mt-3" variant="success">
                    Not paid yet
                  </Alert>
                </Col>
              </Row>
            </Row>
            <br />
            <h2>Order items</h2>
            <ListGroup variant="flush">
              {cartItems.map((item, idx) => (
                <CartItemComponent item={item} key ={idx} changeCount={changeCount} removeCartItemHandler={removeCartItemHandler}/>
              ))}
            </ListGroup>
          </Col>
          <Col md={4}>
            <ListGroup>
              <ListGroup.Item>
                <h3>Order summary</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                Items price (after tax): <span className="fw-bold">${cartSubtotal}</span>
              </ListGroup.Item>
              <ListGroup.Item>
                Shipping: <span className="fw-bold">included</span>
              </ListGroup.Item>
              <ListGroup.Item>
                Tax: <span className="fw-bold">included</span>
              </ListGroup.Item>
              <ListGroup.Item className="text-danger">
                Total price: <span className="fw-bold">${cartSubtotal}</span>
              </ListGroup.Item>
              <ListGroup.Item>
                <div className="d-grid gap-2">
                  <Button size="lg" variant="danger" type="button" disabled={buttonDisabled}>
                    Pay for the order
                  </Button>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Container>
    );
  };
  
  export default UserCartDetailsComponent;
  
  