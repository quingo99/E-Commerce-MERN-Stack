import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function AddedToCartMessageComponent({showCartMessage, setShowCartMessage}) {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  }

    return (
      <Alert show={showCartMessage} variant="success" onClose={() => setShowCartMessage(false)} dismissible>
        <Alert.Heading>The product was added to your cart</Alert.Heading>
        <p>
          <Button variant="success" onClick={goBack}>Go back</Button> {" "} {/*  this is how to navigate back  */}
          <Link to="/cart">
            <Button variant="danger">Go to cart</Button>
          </Link>
          
        </p>
      </Alert>
    );
}

export default AddedToCartMessageComponent