import axios from "axios";
import OrdersPageComponent from "./components/OrdersPageComponent";

const getOrders = async() => {
  const {data} = await axios.get("/api/orders/admin")
  return data
}

const AdminOrdersPage = () => {
  return (
    <OrdersPageComponent className="wrapper" getOrders={getOrders} />
  );
};

export default AdminOrdersPage;

