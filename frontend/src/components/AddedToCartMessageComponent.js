import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

function AddedToCartMessageComponent() {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert show={show} variant="success" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>The product was added to your cart</Alert.Heading>
        <p>
          <Button variant="success">Go back</Button> {" "} {/*  this is how to navigate back  */}
          <Link to="/cart">
            <Button variant="danger">Go to cart</Button>
          </Link>
          
        </p>
      </Alert>
    );
  }
  return <Button onClick={() => setShow(true)}>Show Alert</Button>;
}

export default AddedToCartMessageComponent