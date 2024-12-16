import { Form } from "react-bootstrap";

const AttributesFilterComponent = ({ attrsFilter, setAttrsFromFilter }) => {
  return (
    <>
      {attrsFilter &&
        attrsFilter.length > 0 &&
        attrsFilter.map((item, idx) => (
          <div key={idx} className="mb-3">
            <Form.Label>
              <b>{item.key}</b>
            </Form.Label>
            {item.value.map((element, idx) => (
              <Form.Check
                key={idx}
                type="checkbox"
                id="default-checkbox"
                label={element}
                onChange={(e) => {
                  setAttrsFromFilter((prev) => {
                    let index = prev.findIndex((attr) => attr.key === item.key);
                    console.log(prev);
                    if(index == -1){
                      return [...prev, { key: item.key, value: [element] }];
                    }
                    if (e.target.checked) {
                      prev[index].value.push(element);
                      //remove duplicates value in array 
                      let unique = [...new Set(prev[index].value)];
                      prev[index].value = unique;
                      return [...prev];
                      
                    } else {
                      let valueWithoutElement = prev[index].value.filter((val) => val !== element);
                      prev[index].value = valueWithoutElement;
                      if(prev[index].value.length > 0){
                        return [...prev];
                      } else{
                          let prevWithoutUncheckedKey = prev.filter((attr) => attr.key !== item.key);
                          return [...prevWithoutUncheckedKey];
                      }
                    }
                  });
                }}
              />
            ))}
          </div>
        ))}
    </>
  );
}; 

export default AttributesFilterComponent;
