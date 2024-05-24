import { Row, Col, Container, Image, ListGroup, ListGroupItem, Form, Button, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom'
import AddedToCartMessageComponent from '../../components/AddedToCartMessageComponent';
import { Rating } from 'react-simple-star-rating';
import ImageZoom from 'js-image-zoom';
import { useEffect, useState } from 'react';

const ProductDetailsPageComponent = ({addToCartReduxAction, reduxDispatch}) => {

    const {id} = useParams();
    const [quantity, setQuantity] = useState(1);
    const [showCartMessage, setShowCartMessage] = useState(false);


    const addToCartHandler = () => {
        reduxDispatch(addToCartReduxAction(id, quantity));
        setShowCartMessage(true);
    }
    let option = {
        scale: 2,
        offset: {vertical: 0, horizontal: 0}
    }
    useEffect(() =>{
        new ImageZoom(document.getElementById("first"), option);
        new ImageZoom(document.getElementById("second"), option);
    })

    
    return (<Container>
        <AddedToCartMessageComponent showCartMessage={showCartMessage} setShowCartMessage={setShowCartMessage}/>
        <Row className='mt-5'>
            {/*z index help to zoom image work properly*/}
            <Col style = {{zIndex: 1}}md={4}>
                <div id='first'>
                    <Image crossOrigin = "anonymous" fluid src="/img/productList/AppleWatch.jpg" />
                </div>
                <br />
                <div id='second'>
                    <Image fluid src="/img/productList/Macbook.jpg" />
                </div>
                <br />
                
                
            </Col>

            <Col md={8}>
                <Row>
                    <Col md={8}>
                        <ListGroup variant="flush">
                            <ListGroupItem><h1>Product Name</h1></ListGroupItem>
                            <ListGroupItem><Rating readonly size={20} initialValue={4} />(2)</ListGroupItem>
                            <ListGroupItem>Price <span className='fw-bold'> $199</span></ListGroupItem>
                            <ListGroup.Item>Cras justo odio</ListGroup.Item>

                        </ListGroup>
                    </Col>

                    {/*Select quantity and add to cart */}
                    <Col md={4}><ListGroup>
                        <ListGroup.Item>Status: in stock</ListGroup.Item>
                        <ListGroupItem>Price <span className='fw-bold'> $199</span></ListGroupItem>
                        <ListGroup.Item>
                            Quantity:
                            <Form.Select  onChange={e => setQuantity(e.target.value)} size="lg" aria-label="Default select example">
                                <option>Choose</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </Form.Select>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button onClick={addToCartHandler} variant="danger">Add to cart</Button>
                        </ListGroup.Item>
                        
                    </ListGroup>
                    </Col>

                </Row>

                {/*Customer Review */}
                <Row>
                    <Col className='mt-5'>
                        <h5>Reviews</h5>
                        <ListGroup variant="flush">
                            {Array.from({length: 10}).map((item, idx) => (
                                <ListGroup.Item key ={idx}>Qui Ngo <br /> 
                                    <Rating readonly size={20} initialValue={4}/> <br />
                                    04-28-1999 <br />
                                    The product is awesome, easy to use. However, there are still small errors during using. huhu
                                 </ListGroup.Item>
                            ))}
                            
                            
                        </ListGroup>
                    </Col>
                </Row>
                <hr />

                {/*Review Form */}
                <Alert variant="danger">Login first to write a review</Alert>
                <Form>
                    
                    <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                    >
                        <Form.Label>Write review</Form.Label>
                        <Form.Control as="textarea" rows={3} />
                    </Form.Group>
                    <Form.Select aria-label="Default select example">
                        <option>Rating</option>
                        <option value="5">(very good)</option>
                        <option value="4">(good)</option>
                        <option value="3">(average)</option>
                        <option value="2">(bad)</option>
                        <option value="1">(awful)</option>
                    </Form.Select>
                    <Button className = "mb-5 mt-3" variant="primary">Submit</Button>
                </Form>

            </Col>
        </Row>
    </Container>)

}

export default ProductDetailsPageComponent;