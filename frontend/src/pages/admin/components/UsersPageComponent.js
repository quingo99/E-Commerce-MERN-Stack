import { Row, Col, Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";
import { useState, useEffect } from "react";
import { logout } from "../../../redux/action/userActions";
import { useDispatch } from "react-redux";

const UsersPageComponent = ({ fetchUsers, deleteUser }) => {
    const dispatch = useDispatch()
    const [users, setUsers] = useState([]);
    const [userDeleted, setUserDeleteted] = useState(false)
    const deleteHandler = async (userId) => {
        if (window.confirm("Are you sure?")) {
            const data = await deleteUser(userId)
            if (data === 'user removed') {
                setUserDeleteted(!userDeleted);
            }
        };
    }
    useEffect(() => {
        const abctrl = new AbortController();
        // first the entire html will render, then it will call useEffect and rerender html page again
        fetchUsers(abctrl)
            .then(res => setUsers(res))
            .catch(err => {console.log(err); dispatch(logout())})
        return () => abctrl.abort() //when exist page return will be called to disconnect database
    }, [userDeleted])
    return (
        <Row className="m-5">
            <Col md={2}>
                <AdminLinksComponent />
            </Col>
            <Col md={10}>
                <h1>User List</h1>
                {console.log(users)}
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Is Admin</th>
                            <th>Edit/Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(
                            (user, idx) => (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.enail}</td>
                                    <td>
                                        {user.isAdmin ?
                                            <i className="bi bi-check-lg text-success"></i> : <i className="bi bi-x-lg text-danger"></i>}
                                    </td>
                                    <td>
                                        <LinkContainer to={`/admin/edit-user/${user._id}`}>
                                            <Button className="btn-sm">
                                                <i className="bi bi-pencil-square"></i>
                                            </Button>
                                        </LinkContainer>
                                        {" / "}
                                        <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(user._id)}>
                                            <i className="bi bi-x-circle"></i>
                                        </Button>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </Table>
            </Col>
        </Row>
    );
};

export default UsersPageComponent;

