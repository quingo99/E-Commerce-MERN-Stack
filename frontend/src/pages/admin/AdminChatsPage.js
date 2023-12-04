import { Col, Row } from "react-bootstrap";
import AdminLinksComponent from "../../components/admin/AdminLinksComponent";
import AdminChatRoomComponent from "../../components/admin/AdminChatRoomComponent"


const AdminChat = () => {
    return (<Row className="m-5">
        <Col md={2}>
            <AdminLinksComponent/>
        </Col>
        <Col md={8}>
            <Row>
                <AdminChatRoomComponent />
            </Row>
        </Col>
    </Row>)
}

export default AdminChat;