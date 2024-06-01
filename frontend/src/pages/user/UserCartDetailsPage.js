import UserCartDetailsComponent from "./components/UserCartDetailsComponent";
import {useSelector, useDispatch} from "react-redux";
import {changecartItemQuantity, removeCartItem} from "../../redux/action/cartActions";
import {useState, useEffect} from "react";
import axios from "axios";

  const UserCartDetailsPage = () => {
    const cartItems = useSelector((state) => state.cart.cartItems); 
    const itemCount = useSelector((state) => state.cart.itemCount);
    const cartSubtotal = useSelector((state) => state.cart.cartSubtotal);
    const userInfo = useSelector((state) => state.userRegisterLogin.userInfo);

    const [user, setUser] = useState({}); 
    

    const getUser = async () =>{
      try{
          if(userInfo){
              const {data} = await axios.get(`/api/users/profile/${userInfo._id}`);
              setUser(data);
             
          }
      }
      catch(error){
          console.error(error);
      }
    }

    const createOrder = async(orderData) => {
        const {data} = await axios.post(`/api/orders`, {...orderData});

        return data;
    }

    useEffect(()=>{
      getUser();
    }, [])
    
    const reduxDispatch = useDispatch();

    return (
      <UserCartDetailsComponent
          user={user}
         cartItems={cartItems} itemCount={itemCount} cartSubtotal={cartSubtotal}
         changecartItemQuantity={changecartItemQuantity} removeCartItem={removeCartItem} reduxDispatch={reduxDispatch} 
         createOrder ={createOrder}/>
    );
  };
  
  export default UserCartDetailsPage;
  
  