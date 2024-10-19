import { Dialog } from "primereact/dialog";
import { Button, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";  
import "react-toastify/dist/ReactToastify.css";

const ReadMore = ({ visible, setVisible }) => {
  const [reasons, setReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState(null); 
  const userId = localStorage.getItem("userId");
  const { id } = useParams();

  useEffect(() => {
    axios
      .get("http://localhost:9999/reasons")
      .then((res) => {
        setReasons(res.data);
      })
      .catch((error) => {
        console.error("Error fetching reasons:", error);
      });
  }, []);

  const handleReport = () => {
    if (!selectedReason) {
      toast.error("Vui lòng chọn lý do báo cáo.");
      return;
    }
    const reportData = {
      userId: userId,
      reasonId: selectedReason,
      spaceId: id,
    };
    axios
      .post("http://localhost:9999/reports", reportData)
      .then((response) => {
        toast.success("Báo cáo thành công");
        setSelectedReason(null)
        document.querySelectorAll('input[name="report"]').forEach(input => input.checked = false);
      })
      .catch((error) => {
        toast.error("Hãy thử lại");
        console.error({ error: error.message });
      });
  };

  const onHide = () => {
    setVisible(false);
  };

  const dialogFooter = (
    <div style={{ margin: "20px" }}>
      <div style={{ display: "flex", justifyContent: "end" }}>
        <Button className="btn btn-dark" onClick={handleReport}>
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
                  onChange={() => setSelectedReason(r._id)} 
                />
                <label htmlFor={`option${index}`}>{r.text[0]}</label>
              </div>
            ))}
          </div>
        </div>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default ReadMore;