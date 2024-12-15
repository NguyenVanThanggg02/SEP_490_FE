import { TextField, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { SpaceContext } from '../../Context/SpaceContext ';
import LocationSelect from '../LocationSelect';

const AddSpaceLocation = () => {
  const { spaceInfo, setSpaceInfo, location, setLocation } =
    useContext(SpaceContext);

  return (
    <Container fluid>
      <Row className="pb-5">
        <Typography variant="h4" fontWeight={700} className="text-center">
          Vị trí không gian của bạn
        </Typography>
      </Row>
      <Row className="d-flex justify-content-center align-items-center">
        <Col md={6}>
          <Row>
            <Typography
              variant="h6"
              style={{
                fontWeight: 700,
                fontSize: "20px",
                marginBottom: "10px",
              }}
            >
              Chọn địa chỉ <span style={{ color: 'red' }}>*</span>
            </Typography>

            <LocationSelect
              {...{ spaceInfo, setSpaceInfo, location, setLocation }}
            />
            <TextField
              className="mt-2"
              label="Mô tả địa chỉ chi tiết của bạn"
              value={spaceInfo.detailAddress || ""}
              onChange={(e) =>
                setSpaceInfo((prev) => ({
                  ...prev,
                  detailAddress: e.target.value,
                }))
              }
              fullWidth
              sx={{
                width: "100%",
                marginTop: "10px",
                marginBottom: "20px",
                borderRadius: "8px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                },
                "& .MuiFormHelperText-root": {
                  fontSize: "12px",
                },
              }}
              FormHelperTextProps={{
                style: {
                  fontSize: "13px",
                },
              }}
            />
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default AddSpaceLocation;
