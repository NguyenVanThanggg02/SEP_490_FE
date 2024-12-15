import { Dialog } from "primereact/dialog";
import { Button, Col, Row } from "react-bootstrap";
import { Trash, WalletFill, X } from "react-bootstrap-icons";
import '../style/reports.css';
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";  
import "react-toastify/dist/ReactToastify.css";
import { DialogContent, TextField } from "@mui/material";
const Reports = (props) => {
  const { visibleReport, setVisibleReport, idSpace } = props;
  const [reasons, setReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState([]); 
  const userId = localStorage.getItem("userId");
  const [customReason, setCustomReason] = useState("");
  
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
      spaceId: idSpace,
      customReason: customReason.trim(),
      statusReport: "Chờ duyệt", 
    };
    axios
      .post("http://localhost:9999/reports", reportData)
      .then((response) => {
        toast.success("Báo cáo thành công,báo cáo của bạn đang được phê duyệt");
        setSelectedReason([]);
        setCustomReason("");
        document.querySelectorAll('input[name="report"]').forEach(input => input.checked = false);

      })
      .catch((error) => {
        toast.warning(error.response.data.message || "Hãy thử lại");
        console.error({ error: error.message });
      });
  };

  const handleCheckboxChange = (reasonId) => {
    setSelectedReason((prevSelected) => {
      if (prevSelected.includes(reasonId)) {
        return prevSelected.filter((id) => id !== reasonId);
      } else {
        return [...prevSelected, reasonId];
      }
    });
  };

  const onHide = () => {
    setVisibleReport(false);
  };

  const dialogFooter = (
    <div style={{ margin: "20px" }}>
      <div style={{ display: "flex", justifyContent: "end" }}>
        <Button 
          className="btn btn-dark" 
          onClick={handleReport} 
          disabled={selectedReason.length === 0 && customReason.trim() === ""}
        >
          Tiếp theo
        </Button>
      </div>
    </div>
  );
  
  return (
    <div>
      <Dialog
        visible={visibleReport}
        onHide={onHide}
        footer={dialogFooter}
        className="bg-light dialogForm"
        style={{ width: "35vw", height:'80vh' }}
        modal
      >
        <div style={{ margin: "20px" }}>
          <div className="container">
            <Row className="header">
              <h4>Tại sao bạn báo cáo nhà/phòng cho thuê này?</h4>
            </Row>
            {/* <Row className="description">
              <h6>Nội dung này sẽ không được chia sẻ với Chủ nhà.</h6>
            </Row> */}
            {reasons.map((r, index) => (
              <div className="option" key={index}>
                <input
                  type="checkbox"
                  id={`option${index}`}
                  name="report"
                  className="reportt"
                  value={r._id}
                  onChange={() => handleCheckboxChange(r._id)}
                />
                <label htmlFor={`option${index}`}>{r.text[0]}</label>
              </div>
            ))}
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Lý do từ chối"
                type="text"
                fullWidth
                variant="outlined"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            </DialogContent>
          </div>
        </div>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default Reports;
