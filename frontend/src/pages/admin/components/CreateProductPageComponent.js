import {
  Row,
  Col,
  Container,
  Form,
  Button,
  CloseButton,
  Table,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CreateProductPageComponent = ({
  createProductApiRequest,
  uploadImagesApiRequest,
  categories,
  setCategories,
  categoryData,
  reduxDispatch,
  saveAttr,
  newCategory,
  deleteCategory,
}) => {
  const [validated, setValidated] = useState(false);
  const [attributesTable, setAttributesTable] = useState([]);
  const [images, setImages] = useState(false);
  const [imageMessageCreating, setImageMessageCreating] = useState("");
  const [createProductResponseState, setCreateProductResponseState] = useState({
    message: "",
    error: "",
  });
  const [choosenCategory, setChoosenCategory] = useState("Choose category");
  const [attributes, setAttributes] = useState([]);
  const [newAttributeKey, setNewAttributeKey] = useState(""); // for new attribute key [input field]
  const [newAttributeValue, setNewAttributeValue] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const attrKey = useRef();
  const attrVal = useRef();

  const createNewAttrKey = useRef(null);
  const createNewAttrValue = useRef(null);

  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    
    event.preventDefault();
    event.stopPropagation();
    let submitedCategory = form.category.value;
    if (newCategoryName.length > 0) {
      await reduxDispatch(newCategory(newCategoryName));
      submitedCategory = newCategoryName;
    }
    console.log("submitedCategory", submitedCategory);

    if(form.checkValidity() === false) {
      console.log("form is invalid");
    }
    

    const formInputs = {
      name: form.elements.name.value,
      description: form.elements.description.value,
      count: form.elements.count.value,
      price: form.elements.price.value,
      category: submitedCategory,
      attributesTable: attributesTable,
    };

    if (form.checkValidity() === true) {
      if (submitedCategory === "Choose category") {
        setCreateProductResponseState({
          error: "Please choose category or create a new one",
        });
        return;
      }
      createProductApiRequest(formInputs)
        .then((data) => {
          if (images && data) {
            uploadImagesApiRequest(images, data.productId)
              .then((response) => {})
              .catch((err) => {
                setImageMessageCreating(
                  err.response?.data?.message ||
                    err.response?.data ||
                    "Unknown error"
                );
              });
          }

          if (data.message === "product created") {
            navigate("/admin/products");
          }
        })
        .catch((err) => {
          console.error("Error in createProductApiRequest:", err);
          setCreateProductResponseState({
            error:
              err.response?.data?.message ||
              err.response?.data ||
              "Unknown error",
          });
        });
    }

    setValidated(true);
  };

  const selectCategoryHandler = (e) => {
    const highLevelCategory = e.target.value.split("/")[0];
    const highLevelCategoryData = categoryData.find(
      (category) => category.name === highLevelCategory
    );
    if (highLevelCategoryData && highLevelCategoryData.attrs.length > 0) {
      setAttributes(highLevelCategoryData.attrs);
    } else {
      setAttributes([]);
    }
    setChoosenCategory(e.target.value);
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

  const newCategoryHandler = (e) => {
    e.preventDefault();
    //console.log("newCategoryName", newCategoryName);
    setNewCategoryName(e.target.value);
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
  const addNewAtributeManually = async (e) => {
    e.preventDefault();
    if (e.keyCode && e.keyCode === 13) {
   
      if (newAttributeKey.length > 0 && newAttributeValue.length > 0) {
        await reduxDispatch(
          saveAttr(newAttributeKey, newAttributeValue, choosenCategory)
        );
        setAttributesTableWrapper(newAttributeKey, newAttributeValue);
        setNewAttributeKey("");
        setNewAttributeValue("");
        createNewAttrKey.current.value = "";
        createNewAttrValue.current.value = "";
      }
    }
  };
  const attributeValueSelected = (e) => {
    if (e.target.value === "Choose attribute value") return;
    setAttributesTableWrapper(attrKey.current.value, e.target.value);
  };

  const setAttributesTableWrapper = (attrKey, attrVal) => {
    setAttributesTable([...attributesTable, { key: attrKey, value: attrVal }]);
  };

  const uploadHandler = (images) => {
    setImages(images);
  };

  const deleteAtribute = (attrKey) => {
    let newAttributesTable = attributesTable.filter(
      (attr) => attr.key !== attrKey
    );
    setAttributesTable(newAttributesTable);
  };

  const deleteCategoryHandler = async () => {
    let category = choosenCategory;
    console.log("category", category);
    if (category === "Choose category") {
      return;
    }
    await reduxDispatch(deleteCategory(category));

    setCategories(categories.filter((cat) => cat.name !== category));
    categoryData = categoryData.filter((cat) => cat.name !== category);
  }

  const checkKeyDown = (e) => {
    if (e.keyCode === 13) e.preventDefault();
    };
  return (
    <Container className="mb-5">
      <Row className="justify-content-md-center mt-5">
        <Col md={1}>
          <Link to="/admin/products" className="btn btn-info my-3">
            Go Back
          </Link>
        </Col>
        <Col md={6}>
          <h1>Create a new product</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit} onKeyDown={(e) => checkKeyDown(e)}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" required type="text" />
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
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCount">
              <Form.Label>Count in stock</Form.Label>
              <Form.Control name="count" required type="number" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control name="price" required type="text" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCategory">
              <Form.Label>
                Category
                <CloseButton onClick={deleteCategoryHandler}/>(<small>remove selected</small>)
              </Form.Label>
              <Form.Select
                required
                name="category"
                aria-label="Default select example"
                onChange={selectCategoryHandler}
              >
                <option>Choose category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicNewCategory">
              <Form.Label>
                Or create a new category (e.g. Computers/Laptops/Intel){" "}
              </Form.Label>
              <Form.Control
                name="newCategory"
                type="text"
                onKeyUp={(e) => {
                  newCategoryHandler(e);
                }}
              />
            </Form.Group>

            <Row className="mt-5">
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicAttributes">
                  <Form.Label>Choose atrribute and set value</Form.Label>
                  <Form.Select
                    name="atrrKey"
                    aria-label="Default select example"
                    ref={attrKey}
                    onChange={setValuesAttrFromSelect}
                  >
                    <option>Choose attribute</option>
                    {attributes.map((attr, idx) => {
                      return (
                        <option key={idx} value={attr.key}>
                          {attr.key}
                        </option>
                      );
                    })}
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
                    name="atrrVal"
                    aria-label="Default select example"
                    ref={attrVal}
                    onChange={attributeValueSelected}
                  >
                    <option>Choose attribute value</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

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
                    disabled={false}
                    placeholder="first choose or create category"
                    name="newAttrValue"
                    type="text"
                    ref={createNewAttrKey}
                    onKeyUp={(e) => {
                      newAttributeKeyHandler(e);
                    }}
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
                    disabled={false}
                    placeholder="first choose or create category"
                    name="newAttrValue"
                    type="text"
                    ref={createNewAttrValue}
                    onKeyUp={(e) => {
                      newAttributeValueHandler(e);
                    }}
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

              <Form.Control
                required
                type="file"
                multiple
                onChange={(e) => {
                  uploadHandler(e.target.files);
                }}
              />
              {imageMessageCreating && (
                <Alert variant="danger">{imageMessageCreating}</Alert>
              )}
            </Form.Group>
            <Button variant="primary" type="submit">
              Create
            </Button>
            {createProductResponseState.error && (
              <Alert className="mt-2" variant="danger">
                {createProductResponseState.error}
              </Alert>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateProductPageComponent;
