import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { Button, Row } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import axios from "axios";
import { TextField } from '@mui/material';

const CommunityStandards = (props) => {
    const { visible, setVisible, handleReject, postId } = props; 
    const [reasons, setReasons] = useState([]);
    const [selectedReason, setSelectedReason] = useState(null); 
    const [customCom, setCustomCom]= useState("")

    const handleCustomCom = (event) => {
        setCustomCom(event.target.value);
    };
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

    const handleSubmit = async () => {
        try {
            const dataToSend = {
                communityStandardsId: selectedReason, 
                customComment: customCom || null 
            };
    
            if (customCom) {
                await axios.post("http://localhost:9999/communityStandards/addCom", {
                    customeCommunityStandards: customCom,
                });
            }
    
            if (selectedReason) {
                await handleReject(postId, dataToSend); 
            }
            onHide();
        } catch (error) {
            console.error("Error submitting community standards:", error);
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
              {reasons.map((r) => (
                <div className="option" key={r._id}>
                  <input
                    type="radio"
                    id={`option-${r._id}`}
                    name="report"
                    className="reportt"
                    value={r._id}
                    onChange={() => setSelectedReason(r._id)}
                  />
                  <label htmlFor={`option-${r._id}`}>{r.reason}</label>
                </div>
              ))}
            </div>
            <div>
              <TextField
                className="mt-3"
                id="outlined-basic"
                label="Vấn đề khác"
                variant="outlined"
                value={customCom}
                onChange={handleCustomCom}
                FormHelperTextProps={{
                  style: {
                    fontSize: "14px",
                  },
                }}
                fullWidth 
              />
            </div>
          </div>
        </Dialog>
        <ToastContainer />
      </div>
    );
};

export default CommunityStandards;
