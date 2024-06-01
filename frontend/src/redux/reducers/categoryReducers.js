import * as actionTypes from '../constants/categoryConstants';

export const categoryListReducer = (state = {categories: []}, action) => {
    switch(action.type){
        case actionTypes.GET_CATEGORIES_REQUEST:
            return {
                ...state,
                categories: action.payload,
            }
        default:
            return state;
    }
}