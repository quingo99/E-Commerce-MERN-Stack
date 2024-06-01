import UserOrderPageComponent from "./components/UserOrderPageComponent";
import axios from "axios";
import { useEffect, useState } from "react";

const getUserOrders = async () => {
  const{data} = await axios.get("/api/orders/");
  return data;
};


const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () =>{
      await getUserOrders()
      .then((data) => {
        setOrders(data)
        setLoading(false)
      })
      .catch(err => console.log(err));
    }
    fetchOrders();
  }, []);
  if(loading) return (<h1>Loading...</h1>);
  return (
    <UserOrderPageComponent orders={orders}/>
  );
}

export default UserOrdersPage;