import { Button } from "react-bootstrap"
const RemoveCartComponent = ({ productId, orderCreated, quantity, price, removeCartHandler = false }) => {
    return (
        <Button 
        disabled = {orderCreated}
        type = "button" 
        variant = "secondary" 
        onClick = {removeCartHandler ? () => removeCartHandler(productId, quantity, price ) : undefined => console.log("RemoveCartComponent")}
        >
            <i className="bi bi-trash"></i>
        </Button>
    )
}
export default RemoveCartComponent;