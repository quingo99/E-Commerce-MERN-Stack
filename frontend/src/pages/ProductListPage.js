import { Row, Col, Container, ListGroup, Button } from "react-bootstrap";
import PaginationComponent from "../components/PaginationComponent";
import ProductForListComponent from "../components/ProductForListComponent";
import SortOptionsComponent from "../components/SortOptionsComponent";
import PriceFilterComponent from "../components/filterQueryResultOptions/PriceFilterComponent";
import RatingFilterComponent from "../components/filterQueryResultOptions/RatingFilterComponent";
import CategoryFilterComponent from "../components/filterQueryResultOptions/CategoryFilterComponent";
import AttributesFilterComponent from "../components/filterQueryResultOptions/AttributesFilterComponent";
import axios from "axios";
const ProductList = () => {
  axios.get("/api/products").then((res) => console.log(res))
  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item className="mb-3 mt-3">
              <SortOptionsComponent />
            </ListGroup.Item>
            
            <ListGroup.Item>
              Filter: <br />
              <PriceFilterComponent />
            </ListGroup.Item>
            
            <ListGroup.Item>
              <RatingFilterComponent />
            </ListGroup.Item>
            
            <ListGroup.Item>
              <CategoryFilterComponent />
            </ListGroup.Item>
            
            <ListGroup.Item>
              <AttributesFilterComponent />
            </ListGroup.Item>
            
            <ListGroup.Item>
              <Button variant="primary">Filter</Button> {" "}
              <Button variant="danger">Rest Filter</Button>
            </ListGroup.Item>

          </ListGroup>
        </Col>
        <Col md={9}>
          {Array.from({length: 5}).map((_, idx) => (
            <ProductForListComponent 
              key={idx}
              images = {["Macbook", "Iphone14Pro", "Blackswan", "AppleWatch", "Shoes"]}
              idx={idx}
             
            />
          ))}
          
          <PaginationComponent />
        </Col>
      </Row>
    </Container>
  );
};

export default ProductList;

