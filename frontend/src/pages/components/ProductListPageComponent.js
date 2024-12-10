import { Row, Col, Container, ListGroup, Button } from "react-bootstrap";
import PaginationComponent from "../../components/PaginationComponent";
import ProductForListComponent from "../../components/ProductForListComponent";
import SortOptionsComponent from "../../components/SortOptionsComponent";
import PriceFilterComponent from "../../components/filterQueryResultOptions/PriceFilterComponent";
import RatingFilterComponent from "../../components/filterQueryResultOptions/RatingFilterComponent";
import CategoryFilterComponent from "../../components/filterQueryResultOptions/CategoryFilterComponent";
import AttributesFilterComponent from "../../components/filterQueryResultOptions/AttributesFilterComponent";
import { useEffect, useState } from "react";

import {useParams} from "react-router-dom";
const ProductListPageComponent = ({getProducts, categories}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attrsFilter, setAttrsFilter] = useState([]);
  const {categoryName} = useParams() || "";

  useEffect(() => {
    if(categoryName) {
      let categoryAllData = categories.find((item) => item.name === categoryName.replaceAll(",", "/"))
      if(categoryAllData){
        let mainCategory = categoryAllData.name.split("/")[0];
        let index = categories.findIndex((item) => item.name === mainCategory);
        if(index !== -1){
          setAttrsFilter(categories[index].attrs);
        }else{
          setAttrsFilter([]);
        }
      } else{
        setAttrsFilter([]);
      }
    }
  }, [categoryName, categories]);
    useEffect(() => {getProducts()
      .then(data => {
        setProducts(data.products)
        setLoading(false)
      })
      .catch(err => {
        setError(true)
      })}
    , []);
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
              <AttributesFilterComponent attrsFilter = {attrsFilter} />
            </ListGroup.Item>
            
            <ListGroup.Item>
              <Button variant="primary">Filter</Button> {" "}
              <Button variant="danger">Rest Filter</Button>
            </ListGroup.Item>

          </ListGroup>
        </Col>
        <Col md={9}>
          {loading ? (<h2>Loading....</h2>) : error ? (<h2>Error while loading products</h2>) : (
            products.map((product) => (
              <ProductForListComponent 
                key={product._id}
                images = {product.images}
                name={product.name}
                description={product.description}
                price={product.price}
                rating={product.rating}
                reviewsNumber={product.reviewsNumber}  
                productId={product._id}          
              />
            ))
          )}
          <br />
          
          <PaginationComponent />
        </Col>
      </Row>
    </Container>
  );
};

export default ProductListPageComponent;

