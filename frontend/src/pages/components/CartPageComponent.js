import { Col, Container, Row, Alert, ListGroup, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import CartItemComponent from "../../components/CartItemComponent"

const CartPageComponent = ({removeCartItem, changecartItemQuantity, cartItems, cartSubtotal, reduxDispatch}) => {
    const changeCount = (productID, quantity) => {
        reduxDispatch(changecartItemQuantity(productID, quantity))
    }
    const removeCartHandler = (productID, quantity, price) => {
        if(window.confirm("Are you sure?")){
           reduxDispatch(removeCartItem(productID, quantity, price))

        }

    }
    return(
    <Container fluid>
        <Row className="mt-4">
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? (<Alert variant="info">Your cart is empty</Alert>) : (
                    <ListGroup variant="flush">
                    {cartItems.map((item, idx) => (
                        <CartItemComponent item={item} key ={idx} changeCount={changeCount} removeCartHandler={removeCartHandler}/>
                    ))}
                    </ListGroup>
                )}
                
                
            </Col>
            <Col md={4}>
                <ListGroup>
                    <ListGroup.Item>
                    <h1>Subtotal ({cartItems.length} {cartItems.length === 1 ? "product": "products"}) </h1>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        Price: <span className="fw-bold">${cartSubtotal}</span>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <LinkContainer to ="/user/cart-details">
                            <Button disabled={cartSubtotal === 0} type="button">Proceed to Checkout</Button>
                        </LinkContainer>
                    </ListGroup.Item>
                </ListGroup>
                
            </Col>
        </Row>
    </Container>
    )
}

export default CartPageComponent;