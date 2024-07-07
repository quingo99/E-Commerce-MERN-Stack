import { useOutlet } from "react-router-dom";
import CreateProductPageComponent from "./components/CreateProductPageComponent";
import axios from 'axios';
  
  const createProductApiRequest = async (formImputs) => {
    const {data} = await axios.post('/api/products/admin', {...formImputs});
    return data
  }

  const uploadImageApiRequest = async (images, productId) => {
    const formData = new FormData();
    Array.from(images).forEach(image => {
      formData.append('images', image);
    
    })
    await axios.post(`/api/products/admin/upload?productId=${productId}`, formData);
  }
  const AdminCreateProductPage = () => {
    
    return (
      <CreateProductPageComponent createProductApiRequest={createProductApiRequest} uploadImageApiRequest={uploadImageApiRequest}/>
    );
  };
  
  export default AdminCreateProductPage;
  
  