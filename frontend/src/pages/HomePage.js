import ProductCarousel from "../components/ProductCarouselComponent"
import CategoryComponent from "../components/CategoryComponent"
import Row from "react-bootstrap/esm/Row"
import Container from "react-bootstrap/esm/Container"
const HomePage = () => {
    const categories = ["Laptop", "Phone", "Monitor", "Jacket", "Watch", "Shoes", "Science Book", "Romance Book"]
    return (
        <>
            <ProductCarousel />
            <Container>
                <Row xs={1} md={2} className="g-4 mt-5 homePageRow">
                    {
                        categories.map((category, index) => (<CategoryComponent key={index} category = {category} index = {index} />))
                    }
                </Row>
            </Container>
        </>
    )
}

export default HomePage