import Carousel from 'react-bootstrap/Carousel';
import { LinkContainer } from 'react-router-bootstrap';

function ProductCarousel() {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          crossOrigin='anonymous'
          className="d-block w-100"
          src="/img/Electronics.png"
          alt="First slide"
          style={{height: "300px", objectFit: "cover"}}
        />
        <Carousel.Caption>
          <LinkContainer style={{cursor: "pointer"}} to="/product-list">
            <h3>Electronics Sale Up To 30%</h3>
          </LinkContainer>
          <p>Explore Electronics With Best Price Ever</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          crossOrigin='anonymous'
          className="d-block w-100"
          src="/img/Books.png"
          alt="Second slide"
          style={{height: "300px", objectFit: "cover"}}
        />

        <Carousel.Caption>
        <LinkContainer style={{cursor: "pointer"}} to="/product-list">
            <h3>Books Sale Up To 25%</h3>
        </LinkContainer>
          <p>Best Time To Buy Book To Broaden Your Knowledge</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          crossOrigin='anonymous'
          className="d-block w-100"
          src="/img/Accessories.png"
          alt="Third slide"
          style={{height: "300px", objectFit: "cover"}}
        />

        <Carousel.Caption>
        <LinkContainer style={{cursor: "pointer"}} to="/product-list">
            <h3>Accessories Sale Up To 60%</h3>
        </LinkContainer>
          <p>Explore Fashionable Accessories To Style Yourself With A Best Price Ever</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default ProductCarousel;