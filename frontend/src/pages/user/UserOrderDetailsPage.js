import axios from "axios";
import UserOrderDetailsComponent from "./components/UserOrderDetailsPageComponent";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadScript } from "@paypal/paypal-js";

const UserOrderDetailsPage = () => {
  const userInfo = useSelector((state) => state.userRegisterLogin.userInfo);
  const [user, setUser] = useState({});
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState(null);

  const { id } = useParams();

  //paypal part
  //--------------------------  PAYPAL  --------------------------

  const createPayPalOrderHandler = (orderSubtotal, cartItems) => {
    return function (data, actions) {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: orderSubtotal,
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: orderSubtotal,
                },
              },
            },
            items: cartItems.map((item) => {
              return {
                name: item.name,
                unit_amount: {
                  currency_code: "USD",
                  value: item.price,
                },
                quantity: item.quantity,
              };
            }),
          },
        ],
      });
    };
  };

  const onCancelPayPalOrderHandler = function () {
    console.log("PayPal order cancelled...");
  };

  const onApprovePayPalOrderHandler = (orderSubtotal, cartItems, updataStateAfterPayment ) => {
    return function (data, actions) {
      return actions.order.capture().then(async function (details) {
        var transaction = details.purchase_units[0].payments.captures[0];
        if (transaction.status === "COMPLETED" && Number(transaction.amount.value) === Number(orderSubtotal)) {
          try {
            await axios.put(`/api/orders/paid/${id}`)
              .then(() => {
                updataStateAfterPayment(transaction.create_time);
              })
              .catch((error) => {
                console.error("Error updating order status:", error);
              });
            
          } catch (error) {
            console.error("Error updating order status:", error);
          }
        } else {
          console.log("Transaction status or amount mismatch:", transaction);
        }
      }).catch(function (error) {
        console.error("Error capturing PayPal order:", error);
      });
    };
  };
  
  

  const onErrorPayPalOrderHandler = function (err) {
    console.error("Error creating PayPal order:", err);
  };

  const loadPayPalScript = async (orderSubtotal, cartItems, updataStateAfterPayment) => {
    loadScript({ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID })
      .then((paypal) => {
        paypal
          .Buttons(buttonPayPalFunctions(orderSubtotal, cartItems, updataStateAfterPayment))
          .render("#paypal-container");
      })
      .catch((error) => {
        console.error("Error loading paypal script:", error);
      });
  };

  const buttonPayPalFunctions = (orderSubtotal, cartItems, updataStateAfterPayment) => {
    return {
      createOrder: createPayPalOrderHandler(orderSubtotal, cartItems),
      onCancel: onCancelPayPalOrderHandler,
      onApprove: onApprovePayPalOrderHandler(orderSubtotal, cartItems, updataStateAfterPayment),
      onError: onErrorPayPalOrderHandler,
    };
  };
  //--------------------------  PAYPAL  --------------------------

  const getOrder = async (orderId) => {
    try {
      const { data } = await axios.get(`/api/orders/user/${orderId}`);
      setOrder(data);
      setLoading(false); // Set loading to false once the order is fetched
    } catch (error) {
      console.error("Error fetching order:", error);
      setLoading(false); // Set loading to false even if there's an error
    }
  };

  const getUser = async () => {
    try {
      if (userInfo) {
        const { data } = await axios.get(`/api/users/profile/${userInfo._id}`);
        setUser(data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getUser();
      await getOrder(id);
      setOrderId(id);
    };

    fetchData().catch((error) => console.error("Error fetching data:", error));
  }, [userInfo, id]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      {order ? (
        <UserOrderDetailsComponent
          userInfo={userInfo}
          user={user}
          order={order}
          loadPayPalScript={loadPayPalScript}
        />
      ) : (
        <h1>Order not found</h1>
      )}
    </>
  );
};

export default UserOrderDetailsPage;
