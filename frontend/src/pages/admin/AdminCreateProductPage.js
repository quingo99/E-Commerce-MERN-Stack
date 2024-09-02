import { useOutlet } from "react-router-dom";
import CreateProductPageComponent from "./components/CreateProductPageComponent";
import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { saveAttr, newCategory } from "../../redux/action/categoryAction";

const createProductApiRequest = async (formImputs) => {
  const { data } = await axios.post("/api/products/admin", { ...formImputs });
  return data;
};

const uploadImagesApiRequest = async (images, productId) => {
  const formData = new FormData();
  Array.from(images).forEach((image) => {
    formData.append("images", image);
  });
  const { data } = await axios.post(
    `/api/products/admin/upload?productId=${productId}`,
    formData
  );
  return data;
};

const AdminCreateProductPage = () => {
  const [categories, setCategories] = useState([]);
  const categoryList = useSelector((state) => state.categoryList.categories);
  const reduxDispatch = useDispatch();

  useEffect(() => {
    const setCategoryList = () => {
      const categoriesTemp = categoryList.map((category) => category.name); // Fixed here
      setCategories(categoriesTemp); // Assigning categoriesTemp to state
      console.log(categoriesTemp);
    };
    setCategoryList(); // Calling the function
  }, [categoryList]); // Adding categoryList as a dependency

  return (
    <CreateProductPageComponent
      createProductApiRequest={createProductApiRequest}
      uploadImagesApiRequest={uploadImagesApiRequest}
      categories={categories}
      categoryData={categoryList}
      reduxDispatch={reduxDispatch}
      saveAttr={saveAttr}
      newCategory={newCategory}
    />
  );
};

export default AdminCreateProductPage;
