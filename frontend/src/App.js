import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import ProductList from "./pages/ProductListPage";
import ProductDetails from "./pages/ProductDetailsPage";
import Cart from "./pages/CartPage";

//user
import UserCartDetails from "./pages/user/UserCartDetailsPage";
import UserOrderDetails from "./pages/user/UserOrderDetailsPage";
import UserOrders from "./pages/user/UserOrdersPage";
import UserProfile from "./pages/user/UserProfilePage";

//admin
import AdminAnaLytic from "./pages/admin/AdminAnalyticsPage";
import AdminChat from "./pages/admin/AdminChatsPage";
import AdminCreateProduct from "./pages/admin/AdminCreateProductPage";
import AdminEditProduct from "./pages/admin/AdminEditProductPage";
import AdminEditUser from "./pages/admin/AdminEditUserPage";
import AdminOrderDetail from "./pages/admin/AdminOrderDetailsPage";
import AdminOrder from "./pages/admin/AdminOrdersPage";
import AdminProducts from "./pages/admin/AdminProductsPage";
import AdminUsers from "./pages/admin/AdminUsersPage";

//component
import ProtectedRoutesComponent from "./components/ProtectedRoutesComponent";
import FooterComponent from "./components/FooterComponent";
import HeaderComponent from "./components/HeaderComponent";
import RoutesWithUserChatComponent from "./components/user/RoutesWithUserChatComponent";

//utils
import ScrollToTop from "./utils/ScrollToTop";

//load category
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getCategories } from "./redux/action/categoryAction";

function App() {
  const dispatch = useDispatch();
  const [isCategories, setIsCategories] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await dispatch(getCategories());
        setIsCategories(true);
        console.log("Categories loaded from app.js");
      } catch (err) {
        console.error(err);
        setError("Failed to load categories. Please try again later.");
      }
    };

    fetchCategories();
  }, [dispatch]);

  if (!isCategories) {
    return (
      <div>
        {error ? (
          <h2>{error}</h2>
        ) : (
          <h2>Loading...</h2>
        )}
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <HeaderComponent />
      <div className="main">
        <Routes>
          <Route element={<RoutesWithUserChatComponent />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/product-list/category/:categoryName" element={<ProductList />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product-details/:id" element={<ProductDetails />} />
          </Route>

          {/* User Routes */}
          <Route element={<ProtectedRoutesComponent admin={false} />}>
            <Route path="/user/cart-details" element={<UserCartDetails />} />
            <Route path="/user/order-details/:id" element={<UserOrderDetails />} />
            <Route path="/user/my-profile" element={<UserProfile />} />
            <Route path="/user/my-orders" element={<UserOrders />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoutesComponent admin={true} />}>
            <Route path="/admin/analytics" element={<AdminAnaLytic />} />
            <Route path="/admin/chats" element={<AdminChat />} />
            <Route path="/admin/create-new-product" element={<AdminCreateProduct />} />
            <Route path="/admin/edit-product/:id" element={<AdminEditProduct />} />
            <Route path="/admin/edit-user/:id" element={<AdminEditUser />} />
            <Route path="/admin/order-details/:id" element={<AdminOrderDetail />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrder />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>

          <Route path="*" element={<h2>Page Not Found (404)</h2>} />
        </Routes>
      </div>
      <FooterComponent />
    </BrowserRouter>
  );
}

export default App;
