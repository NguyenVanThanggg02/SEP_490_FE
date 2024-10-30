import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { Button, Row } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import axios from "axios";
import { FormControlLabel, Switch, TextField } from '@mui/material';

const CommunityStandards = (props) => {
    const { visible, setVisible, handleReject, postId } = props;
    const [reasons, setReasons] = useState([]);
    const [selectedReason, setSelectedReason] = useState([]);
    const [customReason, setCustomReason] = useState('');

    const reasonList = [
        "Nội dung không phù hợp",
        "Thiếu thông tin chi tiết, gây không rõ ràng hoặc hiểu nhầm",
        "Ảnh không rõ ràng hoặc không đúng yêu cầu",
        "Vi phạm pháp luật",
        "Không gian không an toàn",
        "Không phù hợp với nhu cầu người dùng",
        "Ngôn ngữ chứa từ cấm"
    ];

    useEffect(() => {
        axios
            .get("http://localhost:9999/communityStandards")
            .then((res) => {
                setReasons(res.data);
            })
            .catch((error) => {
                console.error("Error fetching reasons:", error);
            });
    }, []);

    const onHide = () => {
        setVisible(false);
    };

    const handleSubmit = () => {
        if (selectedReason) {
            handleReject(postId, selectedReason);
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
                                control={<Switch onChange={(e) => handleToggleReason(reason, e.target.checked)} />}
                                label={reason}
                            />
                        ))}
                        <TextField
                            label="Thêm lí do từ chối"
                            fullWidth
                            value={customReason}
                            onChange={handleCustomReasonChange}
                            helperText="Các lí do riêng lẻ có thể tách nhau bằng dấu ';'"
                            FormHelperTextProps={{
                                style: {
                                    fontSize: '14px', // Kích thước chữ helperText
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
