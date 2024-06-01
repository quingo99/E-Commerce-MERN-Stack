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
  import { useState, useEffect, useRef } from "react";

  const UserOrderDetailsComponent = ({userInfo, user, order, loadPayPalScript}) => {
    
      const [paymentMethod, setPaymentMethod] = useState("pp");
      const [isPaid, setIsPaid] = useState(false);
      const [isDelivered, setIsDelivered] = useState(false);
      const [orderButtonMessage, setOrderButtonMessage] = useState(null);
      const [orderButtonDisabled, setOrderButtonDisabled] = useState(false);
      const [cartItems, setCartItem] = useState([]);
      const [orderSubtotal, setOrderSubTotal] = useState(0);
      const paypalContainer = useRef();
      
     
      function formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
      
        const options = { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          hour: 'numeric', 
          minute: 'numeric', 
          hour12: true 
        };
      
        return date.toLocaleString('en-US', options);
      }

      const updataStateAfterPayment = (paidAt) => {
        setIsPaid(true);
        setOrderButtonMessage("Your order was paid on " + formatDateTime(paidAt));  
        setOrderButtonDisabled(true);
        paypalContainer.current.style = "display: none";
        
      }

      const setUpData = () => {
        if (order) {

          setCartItem(order.cartItems || []);
          setOrderSubTotal(order.orderTotal.cartSubtotal || 0);
          setIsPaid(order.isPaid || false);
          setIsDelivered(order.isDelivered || false);
          if (order.isPaid) {
            setOrderButtonMessage("Done");
            setOrderButtonDisabled(true);
          } else {
            if (order.paymentMethod === "cod") {
              setOrderButtonMessage("Cash on delivery");
              setOrderButtonDisabled(true);
            } else {
              setOrderButtonMessage("Pay for the order");
              setOrderButtonDisabled(false);
            }
          }
        }
      };


      const orderHandler = () => { 
        setOrderButtonDisabled(true);
        loadPayPalScript(orderSubtotal, cartItems, updataStateAfterPayment);
      }

      useEffect(() => {
        if (order) {
          try{
            setUpData();
          }
          catch (error) {
            console.error("Error setting up data:", error);
          }
          
        }
      }, [order]);

    return (
      <Container fluid>
        <Row className="mt-4">
          <h1>Order Details</h1>
          <Col md={8}>
            <br />
            <Row>
              <Col md={6}>
                <h2>Shipping</h2>
                <b>Name</b>: {userInfo.name} {userInfo.lastname} <br />
                <b>Address</b>: {user.address} {user.city} {user.state}, {user.zipCode} <br />
                <b>Phone</b>: {user.phoneNumber}
              </Col>
              <Col md={6}>
                <h2>Payment method</h2>
                <Form.Select disabled={true}>
                   {paymentMethod === "pp" ? <option value="pp">PayPal</option> : <option value="cod">Cash On Delivery (delivery may be delayed)</option>}
                </Form.Select>
              </Col>
              <Row>
                <Col>
                  <Alert className="mt-3" variant="danger">
                    {isDelivered ? `Delivered on ${order.deliveredAt}` : "Not delivered yet"}
                  </Alert>
                </Col>
                <Col>
                {isPaid ? <Alert className="mt-3" variant="success">Paid on {formatDateTime(order.paidAt)}</Alert> : <Alert className="mt-3" variant="danger">Not paid yet</Alert>}
                 
                </Col>
              </Row>
            </Row>
            <br />
            <h2>Order items</h2>
            <ListGroup variant="flush">
                {cartItems.map((item, idx) => (CartItemComponent({orderCreated: true, item: item, key: idx})))}
            </ListGroup>
          </Col>
          <Col md={4}>
            <ListGroup>
              <ListGroup.Item>
                <h3>Order summary</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                Items price (after tax): <span className="fw-bold">${orderSubtotal}</span>
              </ListGroup.Item>
              <ListGroup.Item>
                Shipping: <span className="fw-bold">included</span>
              </ListGroup.Item>
              <ListGroup.Item>
                Tax: <span className="fw-bold">included</span>
              </ListGroup.Item>
              <ListGroup.Item className="text-danger">
                Total price: <span className="fw-bold">${orderSubtotal}</span>
              </ListGroup.Item>
              <ListGroup.Item>
                <div className="d-grid gap-2"> {/*making button take all the space*/ }
                  <Button size="lg" variant="danger" type="button" disabled={orderButtonDisabled} onClick={orderHandler}>
                    {orderButtonMessage}
                  </Button>
                </div>
                <div ref={paypalContainer} className="mt-4" id="paypal-container"></div>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Container>
    );
  };
  
  export default UserOrderDetailsComponent;
  
  