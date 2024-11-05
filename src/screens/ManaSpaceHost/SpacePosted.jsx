import React, { useEffect, useState } from 'react'
import { Box, Button, Card, CardActions, CardContent, CardMedia, InputAdornment, TextField, Typography } from '@mui/material'
import { Col, Container, Row } from 'react-bootstrap'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { Pane, Spinner } from "evergreen-ui";
import { Link } from "react-router-dom";

const SpacePosted = () => {
    const [listPosted, setlistPosted] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchSpaces = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:9999/spaces/for/${userId}`
                );
                if (response.status === 200) {
                    setlistPosted(response.data);
                }
            } catch (err) {
            } finally {
                setLoading(false);
            }
        };
        fetchSpaces();
    }, [userId]);

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

    const handleDeleteSpace = (id) => {
        if (window.confirm("Bạn có muốn xóa không gian này không?")) {
            axios
                .delete(`http://localhost:9999/spaces/delete/${id}`)
                .then(() => {
                    setlistPosted(listPosted.filter((product) => product._id !== id));
                })
                .catch((error) => {
                    console.error("Failed to delete product:", error);
                });
        }
    };


    return (
        <Container>
            <Row className="pb-5">
                <Typography variant="h4" className="text-center" >
                    Danh sách phòng cho thuê
                </Typography>
            </Row>
            <Row className="pb-5">
                <Col md={6} style={{ marginLeft: "auto", flexDirection:'row' }}>
                    <TextField id="outlined-basic" placeholder='Tên không gian' variant="outlined" size="small"
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <SearchIcon />
                                </InputAdornment>,
                        }}
                        sx={{ width: '350px' }} />
                    <Link
                        to={'/alladd'}
                        style={{ textDecoration: "none" }}
                    >
                        <Button variant="contained" disableElevation size="large" className="ms-4"><AddIcon />Thêm không gian</Button>

                    </Link>
                </Col>
            </Row>
            <Row>
                {listPosted.length === 0 ? (
                    <Typography variant="body1" align="center">
                        Không có không gian nào được đăng.
                    </Typography>
                ) : (
                    listPosted.map((lpost) => (
                        <Col md={3} className='pb-5'>
                            <Card key={lpost._id} sx={{ maxWidth: 345, height: "100%" }}>
                                <CardMedia
                                    sx={{ height: 200 }}
                                    image={lpost.images[0]?.url || "path/to/default/image.jpg"} // Thay thế với đường dẫn hình ảnh mặc định nếu không có
                                    title={lpost.name}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div" noWrap>
                                        {lpost.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                        {lpost.location}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                        {lpost.pricePerHour} VNĐ/giờ
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                        Host {lpost.userId?.username}
                                    </Typography>
                                         {renderCensorshipIcon(lpost.censorship)}
                                </CardContent>
                                <CardActions>
                                    {/* Chỉnh sửa và Xem phòng */}
                                        <Link to={`/editposted`} state={{ spaceId: lpost._id }} style={{ textDecoration: 'none' }}>
                                            <Button size="small" variant="contained" disableElevation sx={{ textTransform: 'none' }}>
                                                Chỉnh sửa
                                            </Button>
                                        </Link>

                                        <Link to={`/spaces/${lpost._id}`} style={{ textDecoration: 'none' }}>
                                            <Button size="small" variant="outlined" sx={{ textTransform: 'none' }}>
                                                Xem phòng
                                            </Button>
                                        </Link>
                                    {/* Xóa phòng và Trạng thái */}
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                textTransform: 'none',
                                                backgroundColor: 'red',
                                                color: 'white',
                                                '&:hover': { backgroundColor: 'darkred' }
                                            }}
                                            onClick={() => handleDeleteSpace(lpost._id)}
                                        >
                                            Xóa phòng
                                        </Button>

                                </CardActions>
                            </Card>
                        </Col>

                    ))
                )}

            </Row>
        </Container >
    )
}

export default SpacePosted