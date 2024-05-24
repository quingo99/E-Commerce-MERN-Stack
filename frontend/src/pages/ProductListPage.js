import ProductListPageComponent from "./components/ProductListPageComponent";
import axios from "axios";

const getProducts = async () => {
  const {data} = await axios.get("/api/products");
  return data
}
const ProductList = () => {
  return (
    <ProductListPageComponent getProducts={getProducts}/>
  );
};

export default ProductList;

