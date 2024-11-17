import { StarBorder } from '@mui/icons-material';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import { Stack } from '@mui/material';
import React from 'react';

export default function StartRating({ averageRating, onSetRating = () => {} }) {
  return (
    <Stack
      direction={'row'}
      spacing={1}
      alignItems={'center'}
      justifyContent={'flex-start'}
    >
      {[...Array(5).keys()].map((_, i) => {
        let Comp;
        if (i + 1 <= averageRating) {
          Comp = StarIcon;
        } else if (i + 1 - averageRating < 1) {
          Comp = StarHalfIcon;
        } else {
          Comp = StarBorder;
        }

        return (
          <div key={i} onClick={() => onSetRating(i + 1)}>
            <Comp sx={{ color: '#ffb742' }} />
          </div>
        );
      })}
    </Stack>
  );
}
