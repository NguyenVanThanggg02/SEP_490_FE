import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";

const CancelBooking = (props) => {
  const { visible, setVisible, booking, updateBookingStatus } = props;
  const [cancelReasons, setCancelReasons] = useState([]);
  const [customReason, setCustomReason] = useState(""); 
  const availableReasons = [
    "Thay đổi lịch trình hoặc kế hoạch",
    "Không còn nhu cầu sử dụng dịch vụ",
    "Vấn đề với chất lượng phòng hoặc tiện nghi",
    "Địa điểm không như mong đợi hoặc không phù hợp",
    "Vấn đề với dịch vụ khách hàng",
  ];

  const onHide = () => {
    setVisible(false);
    setCancelReasons([]);
    setCustomReason("");
  };

  const handleCancelBooking = async () => {
    const allReasons = [...cancelReasons];
    if (customReason.trim()) {
      allReasons.push(customReason.trim()); 
    }

    try {
      const response = await axios.put(
        `http://localhost:9999/bookings/${booking._id}/cancel`,
        { cancelReason: allReasons }
      );
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

  const handleCheckboxChange = (reason) => {
    setCancelReasons((prev) => {
      if (prev.includes(reason)) {
        return prev.filter((r) => r !== reason);
      } else {
        return [...prev, reason];
      }
    });
  };

  const dialogFooter = (
    <div style={{ display: "flex", justifyContent: "end" }}>
      <Button
        onClick={handleCancelBooking}
        className="btn btn-danger mr-2"
        disabled={
          (cancelReasons.length === 0 && !customReason.trim()) ||
          booking.ownerApprovalStatus === "accepted" ||
          booking.ownerApprovalStatus === "declined" ||
          booking.status === "completed"
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
        <div style={{ margin: "9px" }}>
          <h6>Lý do hủy</h6>
          <Form.Group>
            {availableReasons.map((reason) => (
              <Form.Check
                key={reason}
                type="checkbox"
                label={reason}
                value={reason}
                checked={cancelReasons.includes(reason)}
                onChange={() => handleCheckboxChange(reason)}
                className="mb-2"
              />
            ))}
            <TextField
              fullWidth
              variant="outlined"
              label="Nhập lý do khác"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="mt-2"
            />
          </Form.Group>
        </div>
      </Dialog>
    </div>
  );
};

export default CancelBooking;
