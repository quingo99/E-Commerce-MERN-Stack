import {
  Row,
  Col,
  Container,
  Form,
  Button,
  CloseButton,
  Table,
  Alert,
  Image,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState, Fragment, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const onHover = {
  cursor: "pointer",
  position: "absolute",
  left: "5px",
  top: "-10px",
  transform: "scale(2.7)",
};

const EditProductPageComponent = ({
  categories,
  fetchProduct,
  updateProduct,
  reduxDispatch,
  saveAttr,
  imageDeleteHandler,
  uploadImageHandler
}) => {
  const [validated, setValidated] = useState(false);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [updateProductResponse, setUpdateProductResponse] = useState({
    message: "",
    error: "",
  });
  const [attributes, setAttributes] = useState([]); // for select list
  const [attributesTable, setAttributesTable] = useState([]); //for html table
  const [categoryChosen, setCategoryChosen] = useState("Choose category"); // for select list [category chosen by user
  const [newAttributeKey, setNewAttributeKey] = useState(""); // for new attribute key [input field]
  const [newAttributeValue, setNewAttributeValue] = useState(""); // for new attribute value [input field]
  const [imageRemoved, setImageRemoved] = useState(false); // for image delete [button click
  const [imageUploading, setImageUploading] = useState(""); // for image upload [button click
  const [isImageUpDated, setIsImageUpDated] = useState(false); // for image update [button click 
  const id = useParams().id;
  const attrVal = useRef(null);
  const attrKey = useRef(null);
  const createNewAttrKey = useRef(null);
  const createNewAttrValue = useRef(null);

  const navigate = useNavigate();

  const attributeValueSelected = (e) => {
    if (e.target.value === "Choose attribute value") return;
    setAttributesTableWrapper(attrKey.current.value, e.target.value);
  };

  const changeCategory = (e) => {
    const highLevelCategory = e.target.value.split("/")[0];
    const highLevelCategoryData = categories.find(
      (category) => category.name === highLevelCategory
    );
    if (highLevelCategoryData && highLevelCategoryData.attrs.length > 0) {
      setAttributes(highLevelCategoryData.attrs);
    } else {
      setAttributes([]);
    }
    setCategoryChosen(e.target.value);
  };

  const checkKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const deleteAtribute = (attrKey) => {
    let newAttributesTable = attributesTable.filter(
      (attr) => attr.key !== attrKey
    );
    setAttributesTable(newAttributesTable);
  };

  const newAttributeKeyHandler = (e) => {
    e.preventDefault();
    setNewAttributeKey(e.target.value);
    addNewAtributeManually(e);
  };
  const newAttributeValueHandler = (e) => {
    e.preventDefault();
    setNewAttributeValue(e.target.value);
    addNewAtributeManually(e);
  };
  const addNewAtributeManually = (e) => {
    e.preventDefault();
    if (e.keyCode && e.keyCode === 13) {
      if (newAttributeKey.length > 0 && newAttributeValue.length > 0) {
        reduxDispatch(saveAttr(newAttributeKey, newAttributeValue, categoryChosen));
        setAttributesTableWrapper(newAttributeKey, newAttributeValue);
        setNewAttributeKey("");
        setNewAttributeValue("");
        createNewAttrKey.current.value = "";
        createNewAttrValue.current.value = "";
      }
    }
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget.elements;
    event.preventDefault();
    event.stopPropagation();
    const product = {
      name: form.name.value,
      description: form.description.value,
      count: form.count.value,
      price: Number(form.price.value.replace("$", "")),
      category: form.category.value,
      attributesTable: attributesTable,
    };

    if (event.currentTarget.checkValidity() === true) {
      updateProduct(id, product)
        .then((data) => {
          if (data.message === "product updated")
            console.log("product updated");
          navigate("/admin/products");
        })
        .catch((err) => {
          setUpdateProductResponse({
            error: err.response.data.message
              ? err.response.data.message
              : err.response.data,
          });
        });
    }

    setValidated(true);
  };

  const setAttributesTableWrapper = (attrKey, attrVal) => {
    setAttributesTable([...attributesTable, { key: attrKey, value: attrVal }]);
  };

  const setValuesAttrFromSelect = (e) => {
    let valuesForAttrKey = attrVal.current;
    if (e.target.value === "Choose attribute") {
      while (valuesForAttrKey.options.length > 0) {
        valuesForAttrKey.remove(0);
      }
      return;
    }
    let selectedAttr = attributes.find((attr) => attr.key === e.target.value);
    if (selectedAttr && selectedAttr.value.length > 0) {
      while (valuesForAttrKey.options.length > 0) {
        valuesForAttrKey.remove(0);
      }
      valuesForAttrKey.options.add(new Option("Choose attribute value"));
      selectedAttr.value.forEach((value) => {
        valuesForAttrKey.options.add(new Option(value));
      });
    }
  };

  const updateAttributes = async () => {
    let categoryOfEditProduct = categories.find(
      (category) => category.name === product.category
    );
    if (categoryOfEditProduct) {
      const mainCategoryOfEditProduct =
        categoryOfEditProduct.name.split("/")[0];
      const mainCategoryOfEditedProductAllData = categories.find(
        (category) => category.name === mainCategoryOfEditProduct
      );
      if (mainCategoryOfEditedProductAllData) {
        setAttributes(mainCategoryOfEditedProductAllData.attrs);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchProduct(id)
        .then((data) => {
          console.log(data);
          setProduct(data);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
      setLoading(false);
    };

    fetchData();
  }, [id, imageRemoved, isImageUpDated]);

  useEffect(() => {
    if (product.category) {
      updateAttributes();
    }
    setCategoryChosen(product.category);
    setAttributesTable(product.attrs);
  }, [product, categories]);

  if (loading) return <h1>Loading...</h1>;

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={1}>
          <Link to="/admin/products" className="btn btn-info my-3">
            Go Back
          </Link>
        </Col>
        <Col md={6}>
          <h1>Edit product</h1>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            onKeyDown={(e) => checkKeyDown(e)}
          >
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                required
                type="text"
                defaultValue={product.name}
              />
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                required
                as="textarea"
                rows={3}
                defaultValue={product.description}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCount">
              <Form.Label>Count in stock</Form.Label>
              <Form.Control
                name="count"
                required
                type="number"
                defaultValue={product.count}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                name="price"
                required
                type="text"
                defaultValue={
                  product.price !== undefined ? `$${product.price}` : ""
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCategory">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                defaultValue={product.category}
                required
                aria-label="Default select example"
                onChange={changeCategory}
              >
                <option value="Choose category">Choose category</option>
                {categories.map((category, idx) => (
                  <option key={idx} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {attributes.length > 0 && (
              <Row className="mt-5">
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formBasicAttributes">
                    <Form.Label>Choose attribute and set value</Form.Label>
                    <Form.Select
                      name="attrKey"
                      aria-label="Default select example"
                      ref={attrKey}
                      onChange={setValuesAttrFromSelect}
                    >
                      <option>Choose attribute</option>
                      {attributes.map((attr, idx) => (
                        <option key={idx} value={attr.key}>
                          {idx + 1}. {attr.key}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group
                    className="mb-3"
                    controlId="formBasicAttributeValue"
                  >
                    <Form.Label>Attribute value</Form.Label>
                    <Form.Select
                      name="attrVal"
                      aria-label="Default select example"
                      ref={attrVal}
                      onChange={attributeValueSelected}
                    >
                      <option>Choose attribute value</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Row>
              {attributesTable.length > 0 && (
                <Table hover>
                  <thead>
                    <tr>
                      <th>Attribute</th>
                      <th>Value</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attributesTable.map((attr, idx) => (
                      <tr key={idx}>
                        <td>{attr.key}</td>
                        <td>{attr.value}</td>
                        <td>
                          <CloseButton
                            onClick={() => {
                              deleteAtribute(attr.key);
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicNewAttribute">
                  <Form.Label>Create new attribute</Form.Label>
                  <Form.Control
                    ref={createNewAttrKey}
                    disabled={categoryChosen === "Choose category"}
                    placeholder="first choose or create category"
                    name="newAttrKey"
                    type="text"
                    onKeyUp={(e) => {
                      newAttributeKeyHandler(e);
                    }}
                    required={newAttributeValue.length === 0}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group
                  className="mb-3"
                  controlId="formBasicNewAttributeValue"
                >
                  <Form.Label>Attribute value</Form.Label>
                  <Form.Control
                    ref={createNewAttrValue}
                    disabled={categoryChosen === "Choose category"}
                    placeholder="first choose or create category"
                    name="newAttrValue"
                    type="text"
                    onKeyUp={(e) => {
                      newAttributeValueHandler(e);
                    }}
                    required={newAttributeKey.length === 0}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Alert
              show={
                newAttributeKey.length != 0 && newAttributeValue.length != 0
              }
              variant="primary"
            >
              After typing attribute key and value press enter on one of the
              field
            </Alert>

            <Form.Group controlId="formFileMultiple" className="mb-3 mt-3">
              <Form.Label>Images</Form.Label>
              <Row>
                {product.images &&
                  product.images.map((img, idx) => (
                    <Col key={idx} style={{ position: "relative" }} xs={3}>
                      <Image src={img.path} fluid />
                      <i style={onHover} className="bi bi-x text-danger" onClick={() => {
                        imageDeleteHandler(img.path, id);
                        setImageRemoved(!imageRemoved);
                      }}></i>
                    </Col>
                  ))}
              </Row>
              <Form.Control  type="file" multiple onChange={e =>{
                setImageUploading("uploading in progress ...");
                uploadImageHandler(e.target.files, id)
                .then(data => {
                  setImageUploading("uploading finished");
                  setIsImageUpDated(!isImageUpDated);
                })
                .catch(err => {
                  setImageUploading(err.response.data.message ? err.response.data.message : err.response.data);
                })
              }}/>
              {imageUploading && <Alert variant="primary">{imageUploading}</Alert>}
            </Form.Group>
            <Button className="mb-5" variant="primary" type="submit">
              UPDATE
            </Button>
            {updateProductResponse.error && (
              <Alert variant="danger">{updateProductResponse.error}</Alert>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProductPageComponent;
