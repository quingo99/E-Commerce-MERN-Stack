import * as actionTypes from "../constants/categoryConstants";
import axios from "axios";

export const getCategories = () => async (dispatch) => {
  const { data } = await axios.get("/api/categories");
  dispatch({
    type: actionTypes.GET_CATEGORIES_REQUEST,
    payload: data,
  });
};

export const saveAttr =
  (key, val, categoryChosen) => async (dispatch) => {
    try {
      const { data } = await axios.post("/api/categories/attr", {
        key,
        val,
        categoryChosen,
      });
      console.log("after axios", data.categoryUpdated);
      if (data.categoryUpdated) {
        dispatch({
          type: actionTypes.SAVE_ATTR,
          payload: [...data.categoryUpdated],
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

export const newCategory = (category) => async (dispatch) => {
    try {
        const { data } = await axios.post("/api/categories", { category });
        if (data.categoryCreated) {
        dispatch({
            type: actionTypes.NEW_CATEGORY,
            payload: data.categoryCreated,
        });
        }
    } catch (err) {
        console.log(err);
    }
}

export const deleteCategory = (category) => async (dispatch) => {
    try {
      console.log("category: ", category);

        const { data } = await axios.delete(`/api/categories/${encodeURIComponent(category)}`);
        if (data.categoryDeleted) {
        dispatch({
            type: actionTypes.DELETE_CATEGORY,
            payload: data.remainingCategories,
        });
        }
    } catch (err) {
        console.log(err);
    }
};


