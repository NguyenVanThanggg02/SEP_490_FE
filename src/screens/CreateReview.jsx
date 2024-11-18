import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import StartRating from './StartRating';

export default function CreateReview() {
  const { spaceId } = useParams();
  const navigate = useNavigate();
  const [spaceData, setSpaceData] = useState({});
  const [loading, setLoading] = useState(false);

  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');

  const onSetRating = (rating) => {
    console.log('onSetRating', rating);
    setRating(rating);
  };

  const onSave = async () => {
    const userId = localStorage.getItem('userId');

    const data = {
      rating,
      spaceId,
      text,
      userId,
    };
    console.log(data);

    try {
      setLoading(true);
      await axios.post('http://localhost:9999/reviews', data);
      toast.success('Đánh giá thành công');
      setTimeout(() => {
        navigate(`/spaces/${spaceId}`);
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error('Đánh giá thất bại');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSpaceData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:9999/spaces/${spaceId}`
        );
        setSpaceData(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpaceData();
  }, [spaceId]);
  return (
    <Stack alignItems={'center'} justifyContent={'center'}>
      <Paper sx={{ width: '800px', p: '40px' }}>
        <Stack spacing={2} alignItems={'center'} justifyContent={'center'}>
          <Typography variant="h1" sx={{ fontSize: '2rem' }}>
            Đánh giá không gian: {spaceData?.name}
          </Typography>
          <StartRating averageRating={rating} onSetRating={onSetRating} />
          <Stack
            direction="row"
            spacing={2}
            alignItems={'center'}
            justifyContent={'space-between'}
            sx={{ width: '100%' }}
          >
            <TextField
              id="review"
              label="Đánh giá"
              value={text}
              onChange={(e) => setText(e.target.value)}
              sx={{
                width: '100%',
              }}
            />
          </Stack>
          <Button onClick={onSave}>Nộp</Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
