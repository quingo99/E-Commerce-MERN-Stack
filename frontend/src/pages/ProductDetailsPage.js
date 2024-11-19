import ProductDetailsPageComponent from "./components/ProductDetailsPageComponent";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/action/cartActions";

const getProduct = async (id) => {
  const { data } = await axios.get(`/api/products/get-one/${id}`);
  return data;
};

const ProductDetails = () => {
  //dispatch support for redux
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userRegisterLogin.userInfo);

  return (
    <ProductDetailsPageComponent
      addToCartReduxAction={addToCart}
      reduxDispatch={dispatch}
      getProduct={getProduct}
      userInfo={userInfo}
    />
  );
};

export default ProductDetails;