import * as actionTypes from "../constants/cartConstants";

const CART_INITIAL_STATE = {
    cartItems: [],
    itemCount: 0,
    cartSubtotal: 0,
}

export const cartReducer = (state = CART_INITIAL_STATE, action) => {
    let currState = {...state}

    switch(action.type){
        case actionTypes.ADD_TO_CART: 
            const product = action.payload;
            const existItem = state.cartItems.find((x) => x.productId === product.productId);
            

            if(existItem){
              
                currState.cartItems = currState.cartItems.map((item) => {
                    if (item.productId === product.productId) {
                        // Create a new object with the updated quantity
                        return {
                            ...item,
                            quantity: Number(item.quantity) + Number(product.quantity)
                        };
                    }
                    // Return the item unchanged if it's not the one being updated
                    return item;
                });
                currState.itemCount += Number(product.quantity);
                currState.cartSubtotal += Number(product.price) * Number(product.quantity);
                console.log("currState", currState)
                return currState
                
            } else {
                currState.itemCount += Number(product.quantity);
                currState.cartSubtotal += Number(product.price) * Number(product.quantity);
                currState.cartItems.push(product)
            }
            return currState

        case actionTypes.CHANGE_CART_ITEM_QUANTITY:
            const {productId, quantity} = action.payload;
            const existItem2 = state.cartItems.find((x) => x.productId === productId);
            let tempSubtotal = 0;
            let tempCount = 0;
            currState.cartItems = currState.cartItems.map((item) => {                
                if (item.productId === productId) {
                    // Create a new object with the updated quantity
                    tempCount += Number(quantity);
                    tempSubtotal += Number(item.price) * Number(quantity);
                    return {
                        ...item,
                        quantity: quantity
                    };
                }
                else{
                    tempCount += Number(item.quantity);
                    tempSubtotal += Number(item.price) * Number(item.quantity);
                }
                // Return the item unchanged if it's not the one being updated
                return item;
            });
            currState.itemCount = tempCount;
            currState.cartSubtotal = tempSubtotal;
            return currState

        case actionTypes.REMOVE_CART_ITEM:
           return {
                ...state,
                cartItems: state.cartItems.filter((x) => x.productId !== action.payload.productId),
                itemCount: state.itemCount - action.payload.quantity,
                cartSubtotal: state.cartSubtotal - (action.payload.price * action.payload.quantity)
            }


        default:
            return state
    }
    
}