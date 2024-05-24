import CartPageComponent from "./components/CartPageComponent";

import {useSelector, useDispatch} from "react-redux";
import {changecartItemQuantity, removeCartItem} from "../redux/action/cartActions";



const Cart = () => {
    const cartItems = useSelector((state) => state.cart.cartItems);
    const cartSubtotal = useSelector((state) => state.cart.cartSubtotal);
    const reduxDispatch = useDispatch();

    return(
        <CartPageComponent removeCartItem= {removeCartItem} changecartItemQuantity={changecartItemQuantity} cartItems={cartItems} cartSubtotal={cartSubtotal} reduxDispatch={reduxDispatch}/>
    )
}

export default Cart;