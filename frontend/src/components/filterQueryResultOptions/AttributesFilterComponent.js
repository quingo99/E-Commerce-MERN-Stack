import { Form } from "react-bootstrap";

const AttributesFilterComponent = ({attrsFilter}) => {
  console.log("attrsFilter: ", attrsFilter);
  return (
    <>
      {[{ Color: ["white", "grey", "black"] }, { Ram: ["8 GB", "16 GB", "32 GB", "64 GB"] }].map((item, idx) => (
        <div key={idx} className="mb-3">
          <Form.Label><b>{Object.keys(item)}</b></Form.Label>
          {item[Object.keys(item)].map((element, idx) => (
              <Form.Check
              key={idx}
              type="checkbox"
              id="default-checkbox"
              label={element}
            />
          ))}
        </div>
      ))}

    </>
  );
};

export default AttributesFilterComponent;
