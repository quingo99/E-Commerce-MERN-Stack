import { Row, Col, Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";
import { useState, useEffect } from "react";
import { logout } from "../../../redux/action/userActions";
import { useDispatch } from "react-redux";


const ProductsPageComponent = ({fecthProduct, deleteProduct}) => {
  // apply log out for all admin components in case the token is expired so it will log out and remove all local storage and session see detail in userAction 
  const dispatch = useDispatch()
  const [products, setProducts] = useState([]);
  const [productDeleted, setProductDeleted] = useState(false)

  const deleteHandler = async (productId) => {
    if(window.confirm("Are you sure?")) {
      const data = await deleteProduct(productId)
      if(data.message === "Product is removed"){
        setProductDeleted(!productDeleted)
      }
    }alert("Product deleted!")
}
  useEffect (() => {
    const abctrl = new AbortController();
    fecthProduct(abctrl)
      .then((res) => setProducts(res))
      .catch((err) => 
          dispatch(logout())    
      //setProducts([{name: err.response.data.message ? err.response.data.message : err.response.data}])
      );
      return () => abctrl.abort();

  }, [productDeleted])
  return (
    <Row className="m-5">
      <Col md={2}>
        <AdminLinksComponent />
      </Col>
      <Col md={10}>
        <h1>
          Product List{" "}
          <LinkContainer to="/admin/create-new-product">
            <Button variant="primary" size="lg">
              Create new
            </Button>
          </LinkContainer>
        </h1>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.category}</td>
                <td>
                  <LinkContainer to={`/admin/edit-product/${item._id}`}>
                    <Button className="btn-sm">
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                  </LinkContainer>
                  {" / "}
                  <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(item._id)}>
                    <i className="bi bi-x-circle"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default ProductsPageComponent;

