import { Row, Col, Container, ListGroup, Button, Collapse } from "react-bootstrap";
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
  const [attrsFilter, setAttrsFilter] = useState([]); //collect all attributes of category from db and show on the webpage 
  const {categoryName} = useParams() || "";
  const [attrsFromFilter, setAttrsFromFilter] = useState([]); //collect all attributes of category from filter
  const[filters, setFilters] = useState({}); //collect all filters
  const [showResetFilterButton, setShowResetFilterButton] = useState(false);
  const [price, setPrice] = useState(500);
  const [rating, setRating] = useState({});
  const [categoriesFromFilter, setCategoriesFromFilter] = useState({});
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
      });
      console.log("filter", filters);
    }
    , [filters]);

  const handleFilters = () => {
    setShowResetFilterButton(true);
    setFilters({
      price: price,
      rating: rating,
      categories: categoriesFromFilter,
      attrs: attrsFromFilter
    })
  }
  const resetFilter = () => {
    
    setShowResetFilterButton(false);
    setFilters({});
    window.location.href = "/product-list";
  }
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
              <PriceFilterComponent price={price} setPrice={setPrice} />
            </ListGroup.Item>
            
            <ListGroup.Item>
              <RatingFilterComponent setRating={setRating} rating={rating}/>
            </ListGroup.Item>
            
            <ListGroup.Item>
              <CategoryFilterComponent setCategoriesFromFilter={setCategoriesFromFilter} />
            </ListGroup.Item>
            
            <ListGroup.Item>
              <AttributesFilterComponent attrsFilter = {attrsFilter} setAttrsFromFilter = {setAttrsFromFilter}/>
            </ListGroup.Item>
            
            <ListGroup.Item>
              <Button variant="primary" onClick={handleFilters}>Filter</Button> {" "}
              {showResetFilterButton && (
                <Button variant="danger" onClick={resetFilter}>Reset Filter</Button>
              )}
             
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

