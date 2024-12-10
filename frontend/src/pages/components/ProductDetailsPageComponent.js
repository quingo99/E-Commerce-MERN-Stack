import {
  Row,
  Col,
  Container,
  Image,
  ListGroup,
  ListGroupItem,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import AddedToCartMessageComponent from "../../components/AddedToCartMessageComponent";
import { Rating } from "react-simple-star-rating";
import ImageZoom from "js-image-zoom";
import { useEffect, useState, useRef } from "react";

const ProductDetailsPageComponent = ({
  addToCartReduxAction,
  reduxDispatch,
  getProduct,
  userInfo,
  writeReviewApiRequest,
}) => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [showCartMessage, setShowCartMessage] = useState(false);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [productReviewed, setProductReviewed] = useState("");

  const messagesEndRef = useRef(null);  

  const addToCartHandler = () => {
    reduxDispatch(addToCartReduxAction(id, quantity));
    setShowCartMessage(true);
  };
  let option = {
    scale: 2,
    offset: { vertical: 0, horizontal: 0 },
  };
  useEffect(() => {
    if (product.images) {
      let option = {
        scale: 2,
        offset: { vertical: 0, horizontal: 0 },
      };
      product.images.map(
        (item, idx) =>
          new ImageZoom(document.getElementById(`imageId${idx + 1}`), option)
      );
    }
  });

  useEffect(() => {
    getProduct(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err.response.data.message
            ? err.response.data.message
            : err.response.data
        );
      });
  }, [id, productReviewed]);

  useEffect(() => {
    if(productReviewed){
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      })
    }
  }, [productReviewed]);

  const sendReviewHandler = (e) => {
    e.preventDefault();
    const form = e.currentTarget.elements;
    const formInputs = {
      comment: form.comment.value,
      rating: form.rating.value,
    };
    if (e.currentTarget.checkValidity()) {
      //send review
     writeReviewApiRequest(product._id, formInputs)
     .then((data) => {
         if(data === "review created"){
           setProductReviewed("You successfully reviewed this product");
         }
      })
      .catch((err) => {
        setError(
          err.response.data.message
            ? err.response.data.message
            : err.response.data
        );
      });
    }
  };

  return (
    <Container>
      <AddedToCartMessageComponent
        showCartMessage={showCartMessage}
        setShowCartMessage={setShowCartMessage}
      />
      <Row className="mt-5">
        {loading ? (
          <h2>Loading....</h2>
        ) : error ? (
          <h2>{error}</h2>
        ) : (
          <>
            <Col style={{ zIndex: 1 }} md={4}>
              {product.images
                ? product.images.map((item, idx) => (
                    <div key={id} id={`imageId${id + 1}`}>
                      <Image
                        crossOrigin="anonymous"
                        fluid
                        src={`${item.path ?? null}`}
                      />
                      <br />
                    </div>
                  ))
                : null}
            </Col>

            <Col md={8}>
              <Row>
                <Col md={8}>
                  <ListGroup variant="flush">
                    <ListGroupItem>
                      <h1>{product.name}</h1>
                    </ListGroupItem>
                    <ListGroupItem>
                      <Rating
                        readonly
                        size={20}
                        initialValue={product.rating}
                      />
                      {product.reviewsNumber}
                    </ListGroupItem>
                    <ListGroupItem>
                      Price <span className="fw-bold"> ${product.price}</span>
                    </ListGroupItem>
                    <ListGroup.Item>{product.description}</ListGroup.Item>
                  </ListGroup>
                </Col>

                {/*Select quantity and add to cart */}
                <Col md={4}>
                  <ListGroup>
                    <ListGroup.Item>
                      Status: {product.count > 0 ? "in stock" : "out of stock"}
                    </ListGroup.Item>
                    <ListGroupItem>
                      Price <span className="fw-bold"> ${product.price}</span>
                    </ListGroupItem>
                    <ListGroup.Item>
                      Quantity:
                      <Form.Select
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        size="lg"
                        aria-label="Default select example"
                      >
                        {[...Array(product.count).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Select>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Button onClick={addToCartHandler} variant="danger">
                        Add to cart
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>

              {/*Customer Review */}
              <Row>
                <Col className="mt-5">
                  <h5>Reviews</h5>
                  <ListGroup variant="flush">
                    {product.reviews &&
                      product.reviews.map((review, idx) => (
                        <ListGroup.Item key={idx}>
                          {review.user.name} <br />
                          <Rating
                            readonly
                            size={20}
                            initialValue={review.rating}
                          />
                          <br />
                          {review.createdAt.substring(0, 10)} <br />
                          {review.comment} <br />
                        </ListGroup.Item>
                      ))}
                      <div ref={messagesEndRef} />
                  </ListGroup>
                </Col>
              </Row>
              <hr />

              {!userInfo.name && (
                <Alert variant="danger">Login first to write a review</Alert>
              )}
              {/*Review Form */}

              <Form onSubmit={sendReviewHandler}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Write review</Form.Label>
                  <Form.Control
                    name="comment"
                    required
                    as="textarea"
                    disabled={!userInfo.name}
                    textarea
                    rows={3}
                  />
                </Form.Group>
                <Form.Select
                  aria-label="Default select example"
                  name="rating"
                  required
                  disabled={!userInfo.name}
                >
                  <option value="">Rating</option>
                  <option value="5">Very good</option>
                  <option value="4">Good</option>
                  <option value="3">Average</option>
                  <option value="2">Bad</option>
                  <option value="1">Awful</option>
                </Form.Select>
                <Button
                  disabled={!userInfo.name}
                  className="mb-5 mt-3"
                  variant="primary"
                  type="submit"
                >
                  Submit
                </Button>
              </Form>
            </Col>
          </>
        )}
        {/*z index help to zoom image work properly*/}
      </Row>
    </Container>
  );
};

export default ProductDetailsPageComponent;
