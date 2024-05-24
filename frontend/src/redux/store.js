import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import { cartReducer } from "./reducers/cartReducers";
import {userRegisterLoginReducer} from "./reducers/userReducers"


console.log("This is from store.js")
const reducer = combineReducers({
    cart: cartReducer,
    userRegisterLogin: userRegisterLoginReducer
})
const cartItemsInLocalStorage = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

const userInfoInLocalStorage = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")): sessionStorage.getItem("userInfo") ? JSON.parse(sessionStorage.getItem("userInfo")) : {}
const INITIAL_STATE = {
    cart: {
        cartItems: cartItemsInLocalStorage,
        itemCount: cartItemsInLocalStorage ? cartItemsInLocalStorage.reduce((acc, item) => acc + Number(item.quantity), 0) : 0,
        cartSubtotal: cartItemsInLocalStorage ? cartItemsInLocalStorage.reduce((acc, item) => acc +  Number(item.price) * Number(item.quantity), 0) : 0
    }, 
    userRegisterLogin : {userInfo: userInfoInLocalStorage}
}
const middleware = [thunk];
const store = createStore(reducer, INITIAL_STATE, composeWithDevTools(applyMiddleware(...middleware)))



export default store;

