import React, { useEffect, useState } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import PostManagement from "./PostManagement";
import UserManagement from "./UserManagement ";
import {
  Check2Square,
  GearFill,
  HouseGearFill,
  PersonFillGear,
  Receipt,
  Speedometer,
} from "react-bootstrap-icons";
import StatCards from "./Chart/StartCard";
import HomeAdmin from "./HomeAdmin";
import { TransactionManagement } from "./TransactionManagement";
import ProfileAdmin from "./profile/ProfileAdmin";

const DashBoard = () => {
  const [activeKey, setActiveKey] = useState("one");

  useEffect(() => {
    const hash = window.location.hash;
    const segment = hash.replace('#', '');
    if (segment === "manage-spaces") {
      setActiveKey("three");
    }

    window.history.pushState({}, '', window.location.href.replace(/#manage-spaces/, ''));
  }, [])

  return (
    <Tab.Container
      id="left-tabs-example"
      defaultActiveKey={"one"}
      activeKey={activeKey}
      onSelect={(k) => setActiveKey(k)}
    >
      <Row style={{marginTop:'-32px'}}>
        <Col
          sm={2}
          style={{
            backgroundColor: "#23282d",
            height: (activeKey === "three" || "transaction" || "five") ? "auto" : "100vh",          }}
        >
          <Nav variant="pills" className="flex-column mt-3">
            <Nav.Item>
              <Nav.Link eventKey="one" style={{ color: "white" }}>
                <HouseGearFill style={{ fontSize: "25px" }} /> Trang chủ
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="two" style={{ color: "white" }}>
                <Speedometer style={{ fontSize: "25px" }} /> Dashboard
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link eventKey="three" style={{ color: "white" }}>
                <Check2Square style={{ fontSize: "25px" }} /> Quản lí bài đăng
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link eventKey="transaction" style={{ color: "white" }}>
                <Receipt style={{ fontSize: "25px" }} /> Quản lí giao dịch
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link eventKey="four" style={{ color: "white" }}>
                <PersonFillGear style={{ fontSize: "25px" }} /> Quản lí người
                dùng
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link eventKey="five" style={{ color: "white" }}>
                <GearFill style={{ fontSize: "25px" }} /> Cài đặt
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey="one">
              <HomeAdmin />
            </Tab.Pane>
            <Tab.Pane eventKey="two">
              <StatCards />
            </Tab.Pane>

            <Tab.Pane eventKey="three">
              <PostManagement />
            </Tab.Pane>

            <Tab.Pane eventKey="four">
              <UserManagement />
            </Tab.Pane>

            <Tab.Pane eventKey="transaction">
              <TransactionManagement />
            </Tab.Pane>

            <Tab.Pane eventKey="five">
              <ProfileAdmin/>
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
};

export default DashBoard;
