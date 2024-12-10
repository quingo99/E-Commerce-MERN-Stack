import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { LinkContainer } from 'react-router-bootstrap';

function CategoryComponent({category, index}) {
    
  return (
    <Card className='mb-5'>

      <Card.Img crossOrigin='anonymous' variant="top" src={category.image ?? null} />
      <Card.Body>
        <Card.Title>{category.name}</Card.Title>
        <Card.Text>
         {category.description}
        </Card.Text>
        <LinkContainer to ={`/product-list/category/${category.name}`}>
        <Button variant="primary">Explore</Button>
        </LinkContainer>
      </Card.Body>
    </Card>
  );
}

export default CategoryComponent;