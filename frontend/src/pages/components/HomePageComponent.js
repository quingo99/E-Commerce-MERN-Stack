import ProductCarousel from "../../components/ProductCarouselComponent"
import CategoryComponent from "../../components/CategoryComponent"
import Row from "react-bootstrap/esm/Row"
import Container from "react-bootstrap/esm/Container"
import { useEffect, useState } from "react"
const HomePageComponent = ({categories}) => {
    const [mainCategories, setMainCategories] = useState([])
    useEffect(() => {
        setMainCategories((cat) => categories.filter((item) => !item.name.includes("/")));
    }, [])
    return (
        <>
            <ProductCarousel />
            <Container>
                <Row xs={1} md={2} className="g-6 mt-5 homePageRow">
                    {
                        mainCategories.map((category, index) => (<CategoryComponent key={index} category = {category} index = {index} />))
                    }
                </Row>
            </Container>
        </>
    )
}

export default HomePageComponent