import { Dialog } from "primereact/dialog"; // Thư viện để tạo modal.
import { Button, Col, Row } from "react-bootstrap"; // Các thành phần giao diện như nút, cột, hàng.
import { toast, ToastContainer } from "react-toastify"; // Hiển thị thông báo (success, error).
import "react-toastify/dist/ReactToastify.css"; // CSS của Toastify.
import { Trash, WalletFill, X } from "react-bootstrap-icons"; // Các biểu tượng giao diện.
import { useEffect, useState } from "react"; // React hooks để quản lý trạng thái và side-effects.
import axios from "axios"; // Thư viện gửi HTTP request.
import { useParams } from "react-router-dom"; // Lấy tham số từ URL.
import '../style/reports.css'; // CSS tùy chỉnh cho giao diện báo cáo.

const ReportOwner = (props) => {
  // Truyền trạng thái visible từ props để kiểm soát hiển thị modal.
  const { visible, setVisible } = props;

  // State để lưu danh sách lý do và lý do được chọn.
  const [reasons, setReasons] = useState([]); 
  const [selectedReason, setSelectedReason] = useState(null);

  // Lấy ID người dùng từ localStorage.
  const userId = localStorage.getItem("userId");
  
  // Lấy space ID từ URL qua useParams.
  const { id } = useParams();

  // Fetch danh sách lý do báo cáo khi component mount.
  useEffect(() => {
    axios
      .get("http://localhost:9999/reasons") // Gửi yêu cầu GET tới API.
      .then((res) => {
        setReasons(res.data); // Lưu danh sách lý do báo cáo vào state.
      })
      .catch((error) => {
        console.error("Error fetching reasons:", error); // Ghi log lỗi nếu có.
      });
  }, []);

  // Xử lý sự kiện báo cáo khi nhấn nút.
  const handleReport = () => {
    if (!selectedReason) { // Kiểm tra xem người dùng đã chọn lý do chưa.
      toast.error("Vui lòng chọn lý do báo cáo."); // Hiển thị lỗi nếu chưa chọn.
      return;
    }

    // Dữ liệu báo cáo gửi lên server.
    const reportData = {
      userId: userId,
      reasonId: selectedReason,
      spaceId: id,
    };

    axios
      .post("http://localhost:9999/reports", reportData) // Gửi yêu cầu POST tới API.
      .then((response) => {
        toast.success("Báo cáo thành công"); // Thông báo thành công.
        setSelectedReason(null); // Reset lựa chọn.
        document.querySelectorAll('input[name="report"]').forEach(input => input.checked = false); // Reset các input radio.
      })
      .catch((error) => {
        toast.error("Hãy thử lại"); // Thông báo lỗi nếu báo cáo thất bại.
        console.error({ error: error.message }); // Ghi log lỗi.
      });
  };

  // Ẩn modal khi người dùng đóng.
  const onHide = () => {
    setVisible(false);
  };

  // Footer của modal, bao gồm nút "Tiếp theo".
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
      {/* Modal hiển thị form báo cáo */}
      <Dialog
        visible={visible} // Kiểm soát trạng thái hiển thị.
        onHide={onHide} // Đóng modal.
        footer={dialogFooter} // Gán footer cho modal.
        className="bg-light dialogForm" // Lớp CSS tùy chỉnh.
        style={{ width: "40vw" }} // Độ rộng của modal.
        modal
      >
        {/* Nội dung modal */}
        <div style={{ margin: "20px" }}>
          <div className="container">
            {/* Header modal */}
            <Row className="header">
              <h4>Tại sao bạn báo cáo nhà/phòng cho thuê này?</h4>
            </Row>
            <Row className="description">
              <h6>Nội dung này sẽ không được chia sẻ với Chủ nhà.</h6>
            </Row>

            {/* Hiển thị danh sách lý do báo cáo */}
            {reasons.map((r, index) => (
              <div className="option" key={index}>
                <input
                  type="radio" // Input radio để chọn lý do.
                  id={`option${index}`} // ID duy nhất cho mỗi lý do.
                  name="report" // Nhóm các radio.
                  className="reportt" // Lớp CSS tùy chỉnh.
                  value={r._id} // Giá trị của lý do.
                  onChange={() => setSelectedReason(r._id)} // Cập nhật lý do được chọn.
                />
                <label htmlFor={`option${index}`}>{r.text[0]}</label> {/* Hiển thị lý do. */}
              </div>
            ))}
          </div>
        </div>
      </Dialog>

      {/* Hiển thị thông báo với Toastify */}
      <ToastContainer />
    </div>
  );
};

export default ReportOwner;
