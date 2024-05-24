import ProductDetailsPageComponent from "./components/ProductDetailsPageComponent";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/action/cartActions";

const getProduct = async (id) => {
  axios.get(`api/getProduct/%{id}`);
};

const ProductDetails = () => {
  //dispatch support for redux
  const dispatch = useDispatch();


  return (
    <ProductDetailsPageComponent
      addToCartReduxAction={addToCart}
      reduxDispatch={dispatch}
    />
  );
};

export default ProductDetails;