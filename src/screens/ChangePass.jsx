import React from "react";
import {
  Breadcrumb,
  Button,
  Col,
  Container,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import { Lock, Unlock } from "react-bootstrap-icons";

const ChangePass = () => {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "70px",
    marginBottom: "70px",
    height: "400px",
  };

  return (
    <Container fluid>
      <Row className="mt-2 ml-2">
        <Breadcrumb>
          <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item active>Thay đổi mật khẩu</Breadcrumb.Item>
        </Breadcrumb>
      </Row>
      <Container style={{ borderRadius: "30px" }}>
        <Row style={containerStyle}>
          {/* <Row style={{ marginTop: "60px", paddingBottom: "20px" }}>
            <h3> Change PassWord</h3>
          </Row> */}
          <Col md={8}>
            <InputGroup className="mb-3">
              <Lock
                style={{
                  fontSize: "25px",
                  border: "solid #CCCC 1px",
                  height: "38px",
                  color: "#808080",
                  backgroundColor: "#EEEEEE",
                  width: "30px",
                }}
              />
              <FormControl
                placeholder="Mật khẩu cũ"
                aria-label="Old Password"
                type="password"
                // value={oldPass}
                // onChange={(e) => setOldPass(e.target.value)}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <Unlock
                style={{
                  fontSize: "25px",
                  border: "solid #CCCC 1px",
                  height: "38px",
                  color: "#808080",
                  backgroundColor: "#EEEEEE",
                  width: "30px",
                }}
              />
              <FormControl
                placeholder="Mật khẩu mới"
                aria-label="New Password"
                type="password"
                // value={newPass}
                // onChange={(e) => setNewPass(e.target.value)}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <Unlock
                style={{
                  fontSize: "25px",
                  border: "solid #CCCC 1px",
                  height: "38px",
                  color: "#808080",
                  backgroundColor: "#EEEEEE",
                  width: "30px",
                }}
              />

              <FormControl
                placeholder="Nhập lại mật khẩu mới"
                aria-label="Re-enter New Password"
                // value={reNewPass}
                // onChange={(e) => setReNewPass(e.target.value)}
                type="password"
              />
            </InputGroup>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="primary"
                //   onClick={handleUpdate}
              >
                Lưu
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default ChangePass;
