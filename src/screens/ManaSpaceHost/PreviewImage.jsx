import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Typography } from '@mui/material';
import { Image } from 'antd'; // Import các component từ Antd
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Constants } from '../../utils/constants';

export default function PreviewImage({ spaceInfo, setSpaceInfo,setIsNotChangeData }) {
  const [imagesPreview, setImagesPreview] = useState([]);
  const [error, setError] = useState(''); // Để lưu thông báo lỗi cho từng trường
  const [isLoading, setIsLoading] = useState(false);

  const handleFiles = async (e) => {
    console.log('change file image', e.target.files);
    e.preventDefault();
    setIsLoading(true);
    let newImages = [];

    const files = e.target.files; // Lấy tất cả các file

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]); // Thêm từng file vào formData
    }

    try {
      const response = await axios.post(
        `${Constants.apiHost}/spaces/uploadImages`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Đặt header để gửi file
          },
        }
      );

      if (response.status === 200) {
        newImages = response.data.images; // Lưu thông tin ảnh vào mảng từ phản hồi
      } else {
        setError('Failed to upload images');
      }
    } catch (error) {
      console.log(error);
      setError('Error uploading images:');
    }

    setIsLoading(false);
    setImagesPreview((prev) => [...prev, ...newImages]);
    if (newImages.length) {
      setIsNotChangeData(false);
    }
    setSpaceInfo((prevSpaceInfo) => ({
      ...prevSpaceInfo,
      images: [...prevSpaceInfo.images, ...newImages],
    }));
  };

  const handleDeleteImage = async (public_id) => {
    try {
      // Gửi request đến server-side để xóa ảnh từ Cloudinary
      const response = await axios.post(
        `${Constants.apiHost}/spaces/removeImage`,
        { public_id }
      );

      if (response.status === 200) {
        setError('Image deleted successfully');

        // Xóa ảnh khỏi danh sách hiển thị
        setImagesPreview((prev) =>
          prev.filter((item) => item.public_id !== public_id)
        );
        setSpaceInfo((prevSpaceInfo) => ({
          ...prevSpaceInfo,
          images: prevSpaceInfo.images.filter(
            (item) => item.public_id !== public_id
          ),
        }));
      } else {
        setError('Failed to delete image');
      }
    } catch (error) {
      console.log(error);
      setError('Error deleting image:', error);
    }
  };

  useEffect(() => {
    setImagesPreview(spaceInfo.images);
  }, [spaceInfo]);

  return (
    <Container>
      {/* Thêm ảnh */}
      <Row style={{ marginBottom: '20px' }}>
        <Col md={6} style={{ marginBottom: '20px' }}>
          <Box
            sx={{
              border: '2px dashed grey',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100px',
              width: '150px',
              cursor: 'pointer',
            }}
            onClick={() => document.getElementById('file').click()} // Kích hoạt input khi nhấn vào Box
          >
            <input
              onChange={handleFiles}
              hidden
              type="file"
              id="file"
              multiple
            />
            <AddPhotoAlternateIcon sx={{ fontSize: 40, color: 'grey' }} />
            <Typography variant="body1" color="grey">
              Thêm ảnh
            </Typography>
          </Box>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Row gutter={[16, 16]} type="flex" justify="space-between">
            <Image.PreviewGroup>
              {imagesPreview?.map((item, index) => (
                <Col md={3} key={index} className="image-item">
                  <div>
                    {/* Sử dụng Image của Antd với tính năng preview */}
                    <Image
                      src={item.url}
                      alt="preview"
                      height={100}
                      style={{ objectFit: 'cover' }}
                      className="relative"
                    />
                    {/* Nút xóa ảnh */}
                    <span
                      title="Xóa"
                      onClick={() => handleDeleteImage(item.public_id)}
                      className="closeicon"
                    >
                      <CloseIcon sx={{ fontSize: '20px' }} />
                    </span>
                  </div>
                </Col>
              ))}
            </Image.PreviewGroup>
            {isLoading ? <span>Loading...</span> : null}
            {error ? error : null}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
