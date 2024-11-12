import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const CancelBooking = (props) => {
  const { visible, setVisible, booking, updateBookingStatus  } = props;
  const [cancelReason, setCancelReason] = useState("");

  const cancelReasons = [
    "Thay đổi lịch trình hoặc kế hoạch",
    "Không còn nhu cầu sử dụng dịch vụ",
    "Vấn đề với chất lượng phòng hoặc tiện nghi",
    "Địa điểm không như mong đợi hoặc không phù hợp",
    "Vấn đề với dịch vụ khách hàng",
    "Khác"
  ];
  

  const onHide = () => {
    setVisible(false);
  };

  const handleCancelBooking = async () => {
    try {
      const response = await axios.put(`http://localhost:9999/bookings/${booking._id}/cancel`, {
        cancelReason,
      });

      toast.success(response.data.message || "Lịch book đã được hủy thành công");
      updateBookingStatus(booking._id, "canceled");
      setVisible(false);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Lỗi khi hủy booking");
        setVisible(false);
      } else {
        toast.error("Không thể kết nối tới server");
      }
    }
  };

  const dialogFooter = (
    <div style={{ display: "flex", justifyContent: "end" }}>
      <Button
        onClick={handleCancelBooking}
        className="btn btn-danger mr-2"
        disabled={
          !cancelReason || 
          booking.ownerApprovalStatus === "accepted" ||
          booking.ownerApprovalStatus === "declined" 
          // ||           booking.status === "completed"
        }
      >
        Huỷ Lịch
      </Button>
    </div>
  );

  return (
    <div className="card flex justify-content-center">
      <Dialog
        visible={visible}
        onHide={onHide}
        footer={dialogFooter}
        className="bg-light"
        style={{ width: "30vw" }}
        modal
        header={
          <div className="custom-dialog-header">
            Chọn lý do hủy lịch book địa điểm:
            <strong style={{ color: "red", display: "block", marginBottom: "10px" }}>
              {booking.items[0]?.spaceId.name}
            </strong>
          </div>
        }
      >
        <div className="bg-light p-3" style={{ margin: "15px" }}>
          <h6>Lý do hủy</h6>
          <Form.Group>
            {cancelReasons.map((reason) => (
              <Form.Check
                key={reason}
                type="radio"
                label={reason}
                name="cancelReason"
                value={reason}
                checked={cancelReason === reason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="mb-2"
              />
            ))}
          </Form.Group>
        </div>
      </Dialog>
    </div>
  );
};

export default CancelBooking;
