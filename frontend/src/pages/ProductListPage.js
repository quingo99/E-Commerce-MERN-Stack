import ProductListPageComponent from "./components/ProductListPageComponent";
import axios from "axios";

import { useSelector } from "react-redux";
import { getCategories } from "../redux/action/categoryAction";
const getProducts = async (
  categoryName = "",
  pageNumParam = null,
  searchQuery = "",
  filter = {},
  sortOption = ""
) => {
  
  let rating = [];
  let price = "";
  let attrs = "";
  let categories = [];
  let category = "";
  console.log('filter', filter);
  if (filter.rating) {
    rating = Object.keys(filter.rating).filter(
      (key) => filter.rating[key] === true
    );
   
  }
  if (filter.price) {
    price = filter.price;
  }
  if(filter.attrs){
    attrs = [...filter.attrs];
    
  }
  if(filter.categories){
    categories = Object.keys(filter.categories).filter(
      (key) => filter.categories[key] === true
    );
    if(categories.length>0)
      category = categories.join(",");
  }
  if(filter.attrs){
    console.log('filter.attrs[0]', filter.attrs[0])
    attrs = filter.attrs.reduce((acc, item)=>{
     
      let val = item.value.join("-");
      let key = item.key;
      return acc+key + "-" + val + ",";
    }, ""
  )
  }
  console.log("searchQuery", categoryName);  
 
  const queryParams = new URLSearchParams({
    category,
    categoryName,
    pageNum: pageNumParam,
    searchQuery,
    sort: sortOption,
    rating,
    price,
    attrs,
  }).toString();

  const { data } = await axios.get(`/api/products?${queryParams}`);
  return data;
};
const ProductList = () => {
  const { categories } = useSelector((state) => state.categoryList);
  return (
    <ProductListPageComponent
      getProducts={getProducts}
      categories={categories}
    />
  );
};

export default ProductList;
