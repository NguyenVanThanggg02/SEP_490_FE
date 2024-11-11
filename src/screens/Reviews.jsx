import { Stack, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Review from './Review';
import StartRating from './StartRating';

const calculateAverageRating = (reviews) => {
  if (!reviews.length) return 0;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

  return (totalRating / reviews.length).toFixed(2);
};

export default function Reviews() {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const averageRating = useMemo(() => {
    return calculateAverageRating(reviews);
  }, [reviews]);
  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:9999/reviews/' + id)
      .then((res) => {
        const sortedReviews = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setReviews(sortedReviews);
        console.log('sortedReviews', sortedReviews);
      })
      .catch((err) => {
        setError('Something wrongs');

        console.log(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Something wrong</p>;
  return (
    <Stack sx={{ width: '150%' }} spacing={2}>
      <Typography variant="h6" sx={{ fontSize: '20px', fontWeight: '700' }}>
        Đánh giá
      </Typography>
      {/* general info */}
      <Stack
        direction={'row'}
        spacing={2}
        alignItems={'center'}
        justifyContent={'flex-start'}
      >
        <StartRating averageRating={averageRating} />
        <Stack
          direction={'row'}
          spacing={1}
          alignItems={'center'}
          justifyContent={'flex-start'}
        >
          <Typography
            sx={{
              fontWeight: 600,
            }}
          >
            {averageRating}
          </Typography>
          <Typography>({reviews.length} đánh giá)</Typography>
        </Stack>
      </Stack>
      {/* details */}
      {!reviews.length ? (
        <p>Chưa có đánh giá nào.</p>
      ) : (
        <Container>
          <Row>
            {reviews.map((review, i) => {
              return (
                <Col key={review._id} md={6} sm={6} xs={12} className="mb-4">
                  <Review key={i} review={review} />
                </Col>
              );
            })}
          </Row>
        </Container>
      )}
    </Stack>
  );
}
