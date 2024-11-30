import React, { useEffect, useState } from 'react'
import { Box, Button, Card, CardActions, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import { Col, Container, Row } from 'react-bootstrap'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { Pane, Spinner } from "evergreen-ui";
import { Link } from "react-router-dom";
import { ExclamationCircleFill } from 'react-bootstrap-icons';
import { Paginator } from 'primereact/paginator';
import { priceFormatter } from '../../utils/numberFormatter';

const SpacePosted = () => {
    const [listPosted, setlistPosted] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSpace, setSelectedSpace] = useState(null);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(8);
    const [curentPage, setCurrentPage] = useState(1);
    const listPostedOnPage = listPosted.slice(first, first + rows);

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchSpaces = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:9999/spaces/for/${userId}`
                );
                if (response.status === 200) {
                  const sortedSpaces = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                  setlistPosted(sortedSpaces);
                }
            } catch (err) {
            } finally {
                setLoading(false);
            }
        };
        fetchSpaces();
    }, [userId]);

    const onPageChange = async (event) => {
      setFirst(event?.first);
      setCurrentPage(event.page + 1);
      setRows(event?.rows);
    };

    if (loading) {
        return (
            <Pane
                display="flex"
                alignItems="center"
                justifyContent="center"
                height={400}
            >
                <Spinner />
            </Pane>
        );
    }

    const renderCensorshipIcon = (censorship) => {
        switch (censorship) {
            case 'Chờ duyệt':
                return <Typography variant="body2" sx={{ color: '#FFCA28' }}>
                    <AccessTimeIcon /> Chờ duyệt
                </Typography>;
            case 'Chấp nhận':
                return <Typography variant="body2" sx={{ color: '#4CAF50' }}>
                    <CheckIcon /> Chấp nhận
                </Typography>;
            case 'Từ chối':
                return <Typography variant="body2" sx={{ color: '#F44336' }}>
                    <CloseIcon /> Từ chối
                </Typography>;
            default:
                return null;
        }
    };

    const handleDeleteClick = (space) => {
        setSelectedSpace(space);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedSpace(null);
    };

    const handleConfirmDelete = () => {
        if (selectedSpace) {
            axios
                .delete(`http://localhost:9999/spaces/delete/${selectedSpace._id}`)
                .then(() => {
                    setlistPosted(listPosted.filter((product) => product._id !== selectedSpace._id));
                })
                .catch((error) => {
                    console.error("Failed to delete product:", error);
                })
                .finally(() => {
                    handleCloseDialog();
                });
        }
    };

    return (
      <Container>
        <Row className="pb-5">
          <Typography variant="h4" className="text-center">
            Danh sách phòng cho thuê
          </Typography>
        </Row>
        <Row className="pb-5">
          <Col md={6} style={{ marginLeft: "auto", flexDirection: "row" }}>
            <TextField
              id="outlined-basic"
              placeholder="Tên không gian"
              variant="outlined"
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: "350px" }}
            />
            <Link to={"/alladd"} style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                disableElevation
                size="large"
                className="ms-4"
              >
                <AddIcon />
                Thêm không gian
              </Button>
            </Link>
          </Col>
        </Row>
        <Row>
          {listPostedOnPage.length === 0 ? (
            <Typography variant="body1" align="center">
              Không có không gian nào được đăng.
            </Typography>
          ) : (
            listPostedOnPage.map((lpost) => (
              <Col md={3} className="pb-5" key={lpost._id}>
                <Card sx={{ maxWidth: 345, height: "100%" }}>
                  <CardMedia
                    sx={{ height: 200 }}
                    image={lpost.images[0]?.url || "path/to/default/image.jpg"}
                    title={lpost.name}
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      noWrap
                    >
                      {lpost.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                      noWrap
                    >
                      {lpost.location}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                      noWrap
                    >
                      {lpost.pricePerHour
                        ? `${priceFormatter(lpost.pricePerHour)} VND/Giờ`
                        : lpost.pricePerDay
                          ? `${priceFormatter(lpost.pricePerDay)} VND/Ngày`
                          // : lpost.pricePerWeek
                          //   ? `${priceFormatter(lpost.pricePerWeek)} VND/Tuần`
                            : lpost.pricePerMonth
                              ? `${priceFormatter(lpost.pricePerMonth)} VND/Tháng`
                              : ""}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                      noWrap
                    >
                      Host {lpost.userId?.username}
                    </Typography>
                    {renderCensorshipIcon(lpost.censorship)}
                  </CardContent>
                  <CardActions>
                    <Link
                      to={`/editposted`}
                      state={{ spaceId: lpost._id }}
                      style={{ textDecoration: "none" }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        disableElevation
                        sx={{ textTransform: "none" }}
                      >
                        Chỉnh sửa
                      </Button>
                    </Link>
                    <Link
                      to={`/spaces/${lpost._id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ textTransform: "none" }}
                      >
                        Xem phòng
                      </Button>
                    </Link>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        textTransform: "none",
                        backgroundColor: "red",
                        color: "white",
                        "&:hover": { backgroundColor: "darkred" },
                      }}
                      onClick={() => handleDeleteClick(lpost)}
                    >
                      Xóa phòng
                    </Button>
                  </CardActions>
                </Card>
              </Col>
            ))
          )}
        </Row>

        {/* Dialog xác nhận xóa */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          PaperProps={{
            sx: {
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
              textAlign: "center",
            },
          }}
        >
          <DialogTitle>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mb={1}
            >
              <ExclamationCircleFill
                style={{ fontSize: "50px", color: "#ff8080" }}
              />
            </Box>
            <Typography variant="h5" sx={{ color: "red" }}>
              Xác nhận xóa
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bạn có chắc chắn muốn xóa:
              <div>
                <strong style={{ color: "red" }}>{selectedSpace?.name}</strong>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              sx={{
                backgroundColor: "red",
                color: "white",
                "&:hover": { backgroundColor: "darkred" },
                marginRight: "10px",
                textTransform: "none",
                width: "100px",
              }}
            >
              Xác nhận
            </Button>
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              sx={{
                color: "red",
                borderColor: "red",
                "&:hover": { borderColor: "darkred", color: "darkred" },
                textTransform: "none",
                width: "100px",
                backgroundColor: "#fde7e9",
              }}
            >
              Hủy bỏ
            </Button>
          </DialogActions>
        </Dialog>
        <Row
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <Paginator
            style={{ backgroundColor: "white" }}
            first={first}
            rows={rows}
            totalRecords={listPosted.length}
            onPageChange={onPageChange}
          />
        </Row>
      </Container>
    );
};

export default SpacePosted;
