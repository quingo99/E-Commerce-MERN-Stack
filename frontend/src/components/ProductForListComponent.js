import { Card, Button } from "react-bootstrap";
import { Rating, RatingView } from "react-simple-star-rating";
import { Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
const ProductForListComponent = ({productId, name, description, price, images, rating, reviewsNumber}) => {
  return (
    <Card style={{ marginTop: "30px", marginBottom: "50px" }}>
      <Row>
        <Col lg={5}>
          <Card.Img crossOrigin = "anonymous" variant="top" src={images[0] ? images[0].path : ''}/>
        </Col>
        <Col lg={7}>
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Text>
              {description.length > 100 ? description.slice(0, 100) + "..." : description}
            </Card.Text>
            <Card.Text>
              <Rating readonly size={20} initialValue={rating} /> ({reviewsNumber} reviews)
            </Card.Text>
            <Card.Text className="h4">
              ${price}{" "}
              <LinkContainer to={`/product-details/${productId}`}>
                  <Button variant="primary">See Product</Button>
              </LinkContainer>
              
            </Card.Text>
           
          </Card.Body>
        </Col>
      </Row>

    </Card>
  );
};

export default ProductForListComponent;
