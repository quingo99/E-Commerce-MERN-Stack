import * as actionTypes from "../constants/cartConstants";
import axios from "axios";



export const addToCart = (productId, quantity) => async (dispatch, getState) => {

    const {data} = await axios.get(`/api/products/get-one/${productId}`)
    console.log('Add to cart:', productId, quantity);
    dispatch({
        type: actionTypes.ADD_TO_CART,
        payload: {
            productId: data._id,
            name: data.name,
            price: data.price,
            image: data.images[0] ?? null,
            count: data.count,
            quantity,
        },
    })
    localStorage.setItem("cart", JSON.stringify(getState().cart.cartItems));
}

export const changecartItemQuantity = (productId, quantity) => async (dispatch, getState) => {
    console.log('Change cart item quantity:', productId, quantity);
    
    const {data} = await axios.get(`/api/products/get-one/${productId}`)
    dispatch({
        type: actionTypes.CHANGE_CART_ITEM_QUANTITY,
        payload: {
            productId,
            quantity
        }
    })
    localStorage.setItem("cart", JSON.stringify(getState().cart.cartItems));
}
export const removeCartItem = (productId,  quantity, price) => async (dispatch, getState) => {
    dispatch({
        type: actionTypes.REMOVE_CART_ITEM,
        payload: {
            productId,
            quantity,
            price
        }
    })
    localStorage.setItem("cart", JSON.stringify(getState().cart.cartItems));
}

