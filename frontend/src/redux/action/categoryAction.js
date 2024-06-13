import * as actionTypes from '../constants/categoryConstants';
import axios from 'axios';

export const getCategories = () => async (dispatch) => {
    const {data} = await axios.get('/api/categories');
    dispatch({
        type: actionTypes.GET_CATEGORIES_REQUEST,
        payload: data,
    })
}

export const saveAttr = (key, val, categoryChosen ) =>  async (dispatch, getState) =>{
    console.log(key, val, categoryChosen);
    const {data} = await axios.post('/api/categories/attr', {key, val, categoryChosen});
    if(data.catagoryUpdated){
        dispatch({
            type: actionTypes.SAVE_ATTR,
            payload: [...data.catagoryUpdated],
        })
    }
} 

