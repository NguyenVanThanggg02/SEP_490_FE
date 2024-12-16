import { Avatar, Stack, Typography } from '@mui/material';
import React from 'react';
import { format } from 'timeago.js';
import StartRating from './StartRating';

export default function Review({ review }) {
  return (
    <Stack
      spacing={2}
      sx={{
        width: '100%',
        backgroundColor: '#d3d3d3',
        borderRadius: '8px',
        padding: 3,
      }}
    >
      <Stack
        direction={'row'}
        spacing={2}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Stack
          direction={'row'}
          spacing={2}
          alignItems={'center'}
          justifyContent={'flex-start'}
        >
          <Avatar
            src={review.userId.avatar}
            alt={review.userId.username}
            sizes={30}
          />
          <Stack spacing={0.5} justifyContent={'flex-start'}>
            <Typography>{review?.userId?.fullname}</Typography>
            <Typography sx={{ fontSize: '13px', color: 'gray' }}>
              {format(review.createdAt)}
            </Typography>
          </Stack>
        </Stack>

        <StartRating averageRating={review.rating} />
      </Stack>

      {/*  */}
      <Typography> {review.text}</Typography>
    </Stack>
  );
}
