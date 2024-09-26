import React from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";

const DashBoard = () => {
  return (
    <Tab.Container id="left-tabs-example" defaultActiveKey={"first"}>
      <Row style={{ marginTop: "50px" }}>
        <Col sm={2} style={{ backgroundColor: "#23282d", height: "100vh", color: "#fff" }}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="zero" style={{ color: "#b4b9be" }}>
                Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="first" style={{ color: "#b4b9be" }}>
                Dashboard
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="second" style={{ color: "#b4b9be" }}>
                Updates
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="third" style={{ color: "#b4b9be" }}>
                Posts
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="fourth" style={{ color: "#b4b9be" }}>
                Media
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="fifth" style={{ color: "#b4b9be" }}>
                Pages
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="sixth" style={{ color: "#b4b9be" }}>
                Comments
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="seventh" style={{ color: "#b4b9be" }}>
                Plugins
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="eighth" style={{ color: "#b4b9be" }}>
                Users
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="ninth" style={{ color: "#b4b9be" }}>
                Tools
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="tenth" style={{ color: "#b4b9be" }}>
                Settings
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="eleventh" style={{ color: "#b4b9be" }}>
                Collapse menu
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey="zero">
              {/* component tab 1 */}
              <h1>Home</h1>
            </Tab.Pane>
            <Tab.Pane eventKey="first">
              {/* component tab 1 */}
              <h1>Dashboard Content</h1>
            </Tab.Pane>
            <Tab.Pane eventKey="second">
              {/* component tab 2 */}
              <h1>Updates Content</h1>
            </Tab.Pane>
            <Tab.Pane eventKey="third">
              {/* component tab 3 */}
              <h1>Posts Content</h1>
            </Tab.Pane>
            <Tab.Pane eventKey="fourth">
              {/* component tab 4 */}
              <h1>Media Content</h1>
            </Tab.Pane>
            <Tab.Pane eventKey="fifth">
              {/* component tab 5 */}
              <h1>Pages Content</h1>
            </Tab.Pane>
            <Tab.Pane eventKey="sixth">
              {/* component tab 6 */}
              <h1>Comments Content</h1>
            </Tab.Pane>
            <Tab.Pane eventKey="seventh">
              {/* component tab 7 */}
              <h1>Plugins Content</h1>
            </Tab.Pane>
            <Tab.Pane eventKey="eighth">
              {/* component tab 8 */}
              <h1>Users Content</h1>
            </Tab.Pane>
            <Tab.Pane eventKey="ninth">
              {/* component tab 9 */}
              <h1>Tools Content</h1>
            </Tab.Pane>
            <Tab.Pane eventKey="tenth">
              {/* component tab 10 */}
              <h1>Settings Content</h1>
            </Tab.Pane>
            <Tab.Pane eventKey="eleventh">
              {/* component tab 11 */}
              <h1>Collapse Menu Content</h1>
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
};

export default DashBoard;
