import { Pagination } from "react-bootstrap";

const PaginationComponent = () => {
  return (
    <Pagination style={{marginBottom: "200px"}}>
      
      <Pagination.Prev />
      <Pagination.Item active>{1}</Pagination.Item>

      <Pagination.Item>{2}</Pagination.Item>
      <Pagination.Item>{3}</Pagination.Item>
      <Pagination.Item >{5}</Pagination.Item>
      <Pagination.Item>{6}</Pagination.Item>
      <Pagination.Item>{7}</Pagination.Item>
      <Pagination.Item>{8}</Pagination.Item>
      <Pagination.Item>{9}</Pagination.Item>


      <Pagination.Ellipsis />
      
      <Pagination.Next />
    
    </Pagination>
  );
};

export default PaginationComponent;
