import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import EditProductPageComponent from "./components/EditProductPageComponent";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { saveAttr } from "../../redux/action/categoryAction";

const AdminEditProductPage = () => {
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({});
  const reduxDispatch = useDispatch();

  // Get the categories from the Redux store
  const categoryList = useSelector((state) => state.categoryList.categories);

  const imageDeleteHandler = async (imagePath, productId) => {
    console.log(imagePath, productId);
    let ecodeImagePath = encodeURIComponent(imagePath);
     await axios.delete(`/api/products/admin/image/${ecodeImagePath}/${productId}`);
  }

  const uploadImageHandler = async (images, productId) => {
    const formData = new FormData();
    Array.from(images).forEach((image) => {
      formData.append("images", image);
    });
    const {data} = await axios.post(`/api/products/admin/upload?productId=${productId}`, formData);
    return data;


  }
  const fetchProduct = async (id) => {
    console.log(id);
    const { data } = await axios.get(`/api/products/get-one/${id}`);
    return data;
  };

  const updateProduct = async (productId, product) => {
    const { data } = await axios.put(`/api/products/admin/${productId}`, {
      ...product,
    });
    return data;
    //await axios.put(`/api/products/update/${productId}`, product);
  };

  useEffect(() => {
    // Extract the data from the Redux store and set the local state
    if (categoryList.length !== 0) {
      setCategories(categoryList);
    }
  }, [categoryList]);

  return (
    <EditProductPageComponent
      categories={categories}
      fetchProduct={fetchProduct}
      updateProduct={updateProduct}
      reduxDispatch={reduxDispatch}
      saveAttr={saveAttr}
      imageDeleteHandler={imageDeleteHandler}
      uploadImageHandler={uploadImageHandler}
    />
  );
};

export default AdminEditProductPage;
