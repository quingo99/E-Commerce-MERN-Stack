import ProductListPageComponent from "./components/ProductListPageComponent";
import axios from "axios";

import {useSelector} from "react-redux";
import { getCategories } from "../redux/action/categoryAction";
const getProducts = async () => {
  const {data} = await axios.get("/api/products");
  return data
}
const ProductList = () => {
  const {categories} = useSelector((state) => state.categoryList);
  return (
    <ProductListPageComponent getProducts={getProducts} categories={categories}/>
  );
};

export default ProductList;

