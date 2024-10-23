import { Button, Card, CardActions, CardContent, CardMedia, InputAdornment, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { Pane, Spinner } from "evergreen-ui";

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
    return (
        <Container>
            <Row className="pb-5">
                <Typography variant="h4" className="text-center" >
                    Danh sách phòng cho thuê
                </Typography>
            </Row>
            <Row>
                <Col md={5} style={{ marginLeft: "auto" }}>
                    <TextField id="outlined-basic" placeholder='Tên không gian' variant="outlined" size="small"

                        InputProps={{
                            endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>,
                        }} />
                    <Button variant="contained" disableElevation size="large" className="ms-4"><AddIcon />Thêm không gian</Button>
                </Col>
            </Row>
            <Row>
                {listPosted.length === 0 ? (
                    <Typography variant="body1" align="center">
                        Không có không gian nào được đăng.
                    </Typography>
                ) : (
                    listPosted.map((lpost) => (
                        <Col md={4}>

                            <Card key={lpost.id} sx={{ maxWidth: 345 }}>
                                <CardMedia
                                    sx={{ height: 140 }}
                                    image={lpost.images[0]?.url || "path/to/default/image.jpg"} // Thay thế với đường dẫn hình ảnh mặc định nếu không có
                                    title={lpost.name}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {lpost.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {lpost.location}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {lpost.pricePerHour} VNĐ/giờ
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {lpost.userId?.name} {/* Đảm bảo rằng userId tồn tại trước khi truy cập name */}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small">Share</Button>
                                    <Button size="small">Learn More</Button>
                                </CardActions>
                            </Card>
                        </Col>

                    ))
                )}

            </Row>
        </Container>
    )
}

export default SpacePosted