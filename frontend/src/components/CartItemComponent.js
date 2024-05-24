import { Col, ListGroup, Row, Image, Form, Button } from "react-bootstrap";
import RemoveCartComponent from "./RemoveCartComponent";

const CartItemComponent = ({item, orderCreated = false, changeCount = false, removeCartHandler = false}) => {
    return <>
        <ListGroup.Item>
            <Row>
                <Col md={2}>
                    <Image crossOrigin="anounymous" src = {item.image ? (item.image.path ?? null) : null} fluid/>
                </Col>
                <Col md={2}>
                    {item.name}
                </Col>
                <Col md={2}>
                    <b>${item.price}</b>
                </Col>
                    
                <Col md={3}> 
                <Form.Select onChange={changeCount ? (e) => changeCount(item.productId, e.target.value) : undefined} disabled={orderCreated} value={item.quantity}>
                {/* it will create from 1 to the quantity of product */}
                        {[...Array(item.count).keys()].map((x) => (<option key={x+1} value={x+1}> {x+1}</option>))} 
                        
                    </Form.Select>
                </Col>

                <Col md={3}>
                    <RemoveCartComponent orderCreated={orderCreated} productId={item.productId} quantity={item.quantity} price={item.price} removeCartHandler={removeCartHandler ? removeCartHandler:undefined}/>
                </Col>
                
            </Row>
        </ListGroup.Item>
        <br />
    </>
}

export default CartItemComponent;