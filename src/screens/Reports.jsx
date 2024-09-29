import { Dialog } from "primereact/dialog";
import { Button, Col, Row } from "react-bootstrap";
import { Trash, WalletFill, X } from "react-bootstrap-icons";
import '../style/reports.css'
import { useEffect, useState } from "react";
import axios from "axios";
const Reports = (props) => {
  const { visible, setVisible } = props;
  const [reasons, setReasons] = useState([]);
console.log(reasons);

  useEffect(() => {
    axios
      .get("http://localhost:9999/reasons")
      .then((res) => {
        setReasons(res.data);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
      });
  }, []);
  
  const onHide = () => {
    setVisible(false);
  };
  
  const dialogFooter = (
    <div style={{ margin: "20px" }}>
      <div style={{ display: "flex", justifyContent: "end" }}>
        <Button className="btn btn-dark">
          Tiếp theo
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      <Dialog
        visible={visible}
        onHide={onHide}
        footer={dialogFooter}
        className="bg-light dialogForm"
        style={{ width: "40vw" }}
        modal
      >
        <div style={{ margin: "20px" }}>
          <div className="container">
            <Row className="header">
              <h4>Tại sao bạn báo cáo nhà/phòng cho thuê này?</h4>
            </Row>
            <Row className="description">
              <h6>Nội dung này sẽ không được chia sẻ với Chủ nhà.</h6>
            </Row>
            {reasons.map((r, index) => (
              <div className="option" key={index}>
                <input
                  type="radio"
                  id={`option${index}`}
                  name="report"
                  className="reportt"
                  value={r._id}
                />
                <label htmlFor={`option${index}`}>{r.text[0]}</label>
              </div>
            ))}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Reports;