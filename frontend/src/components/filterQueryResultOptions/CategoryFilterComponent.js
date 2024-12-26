import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useRef, useState } from "react";
const CategoryFilterComponent = ({setCategoriesFromFilter}) => {
  const{categories} = useSelector(state => state.categoryList);
  const myRef = useRef([]);
  const[selectedCategory, setSelectedCategory] = useState([]);
  const selectCategory = (e, category, idx) => {
      setCategoriesFromFilter((item) => {
        return {...item, [category.name]: e.target.checked}
      })

      var selectedMainCategory = category.name.split("/")[0];
      var allCategories = myRef.current.map((_, idx) => {
        return {name: categories[idx].name, idx: idx}
      })
      var indexsOfMainCategory = allCategories.reduce((acc, item) => {
        var cat = item.name.split("/")[0];
        if(cat === selectedMainCategory){
          acc.push(item.idx);
        }
        return acc;
      }, [])
      if(e.target.checked){
        setSelectedCategory((old) => [...old, "cat"]);
        myRef.current.map((_, idx) => {
          if(!indexsOfMainCategory.includes(idx)){
            myRef.current[idx].disabled = true;
          }
          return null;
        })
      } else{
        setSelectedCategory((old) => {
          var a = [...old];
          a.pop();
          if(a.length === 0){
            myRef.current.map((_, idx2) => {
              myRef.current[idx2].disabled = false;
              return null;
            })
          }
          return a;
        })
      }

  }
  return (
    <>
    <span className="fw-bold">Category</span>
      <Form>
        {categories.map((category, idx) => (
          <div key={idx} className="mb-3">
            <Form.Check type="checkbox" id={`check-api2-${idx}`}>
              <Form.Check.Input type="checkbox" isValid onChange={(e) => selectCategory(e, category, idx)} ref={(el) => (myRef.current[idx] = el)}/>
              <Form.Check.Label style={{ cursor: "pointer" }}>{category.name}</Form.Check.Label>

            </Form.Check>
          </div>
        ))}
      </Form>
    </>
  );
};

export default CategoryFilterComponent;
