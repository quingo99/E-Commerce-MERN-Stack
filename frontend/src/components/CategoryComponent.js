import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { LinkContainer } from 'react-router-bootstrap';

function CategoryComponent({category, index}) {
    const ImgSrc = ["/img/category/laptop.jpg", 
                    "/img/category/phone.jpg", 
                    "/img/category/monitor.jpg", 
                    "/img/category/jacket.jpg", 
                    "/img/category/watch.jpg",
                    "/img/category/shoes.jpg",
                    "/img/category/science-book.jpg",
                    "/img/category/romance-book.jpg" ]
  return (
    <Card>
      <Card.Img crossOrigin='anonymous' variant="top" src={ImgSrc[index]} />
      <Card.Body>
        <Card.Title>{category}</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <LinkContainer to ="/product-list">
        <Button variant="primary">Explore</Button>
        </LinkContainer>
      </Card.Body>
    </Card>
  );
}

export default CategoryComponent;