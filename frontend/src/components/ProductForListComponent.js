import { Card, Button } from "react-bootstrap";
import { Rating, RatingView } from "react-simple-star-rating";
import { Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
const ProductForListComponent = ({images, idx}) => {
  return (
    <Card style={{ marginTop: "30px", marginBottom: "50px" }}>
      <Row>
        <Col lg={5}>
          <Card.Img crossOrigin = "anonymous" variant="top" src={"/img/producList/" + images[idx] +".jpg"}/>
        </Col>
        <Col lg={7}>
          <Card.Body>
            <Card.Title>{images[idx]}</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
            <Card.Text>
              <Rating readonly size={20} initialValue={5} /> (1)
            </Card.Text>
            <Card.Text className="h4">
              $1200{" "}
              <LinkContainer to="/product-details/macbook">
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
