import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { Button, Row } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import axios from "axios";
import { FormControlLabel, Switch, TextField } from '@mui/material';

const CommunityStandards = (props) => {
    const { visible, setVisible, handleReject, postId } = props;
    const [selectedReason, setSelectedReason] = useState([]);
    const [customReason, setCustomReason] = useState('');

    const reasonList = [
        "Nội dung không phù hợp",
        "Ảnh không rõ ràng hoặc không đúng yêu cầu",
        "Không gian không an toàn",
        "Thiếu thông tin chi tiết, gây không rõ ràng hoặc hiểu nhầm",
        "Ngôn ngữ chứa từ cấm",
        "Không phù hợp với nhu cầu người dùng",
        "Vi phạm pháp luật có sẵn ",
    ];

    const onHide = () => {
        setVisible(false);
        setSelectedReason([]); // Reset selected reasons when closing
        setCustomReason(''); // Reset custom reason when closing

    };
    const handleSubmit = () => {
        if (selectedReason.length > 0 || customReason) {
            console.log("Submitting selectedReason:", selectedReason);
            console.log("Submitting customReason:", customReason);

            handleReject(postId, selectedReason, customReason);
            onHide();
        }
    };



    const dialogFooter = (
        <div style={{ margin: "20px" }}>
            <div style={{ display: "flex", justifyContent: "end" }}>
                <Button className="btn btn-dark" onClick={handleSubmit}>
                    Từ chối
                </Button>
            </div>
        </div>
    );

    const handleToggleReason = (reasonn, checked) => {
        setSelectedReason((prevSelectedReason) => {
            if (checked) {
                // Nếu switch được bật, thêm reasonn vào mảng
                return [...prevSelectedReason, reasonn];
            } else {
                // Nếu switch bị tắt, loại bỏ reasonn khỏi mảng
                return prevSelectedReason.filter(r => r !== reasonn);
            }
        });
    };

    const handleCustomReasonChange = (event) => {
        setCustomReason(event.target.value);
    };

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
                        <Row className="header text-center">
                            <h4>Lí do từ chối</h4>
                        </Row>
                        {reasonList.map((reason) => (
                            <FormControlLabel
                                key={reason}
                                control={<Switch
                                    color="warning"
                                    onChange={(e) => handleToggleReason(reason, e.target.checked)} />}
                                label={reason}
                            />
                        ))}
                        <TextField
                            className='mt-2'
                            label="Thêm lí do từ chối"
                            fullWidth
                            value={customReason}
                            onChange={handleCustomReasonChange}
                            helperText="Các lí do riêng lẻ có thể tách nhau bằng dấu ';'"
                            FormHelperTextProps={{
                                style: {
                                    fontSize: '13px', // Kích thước chữ helperText
                                },
                            }}
                        />
                    </div>
                </div>
            </Dialog>
            <ToastContainer />
        </div>
    );
};

export default CommunityStandards;
