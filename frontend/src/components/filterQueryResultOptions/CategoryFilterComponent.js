import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
const CategoryFilterComponent = ({setCategoriesFromFilter}) => {
  const{categories} = useSelector(state => state.categoryList);
  
  const selectCategory = (e, category, idx) => {
      setCategoriesFromFilter((item) => {
        return {...item, [category.name]: e.target.checked}
      })
  }
  return (
    <>
    <span className="fw-bold">Category</span>
      <Form>
        {categories.map((category, idx) => (
          <div key={idx} className="mb-3">
            <Form.Check type="checkbox" id={`check-api2-${idx}`}>
              <Form.Check.Input type="checkbox" isValid onChange={(e) => selectCategory(e, category, idx)} />
              <Form.Check.Label style={{ cursor: "pointer" }}>{category.name}</Form.Check.Label>

            </Form.Check>
          </div>
        ))}
      </Form>
    </>
  );
};

export default CategoryFilterComponent;
