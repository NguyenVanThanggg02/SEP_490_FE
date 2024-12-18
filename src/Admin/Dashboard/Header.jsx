/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';

import Notification from '../../components/Notification';
import { Avatar, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Constants } from '../../utils/constants';

export default function Header({ mainContent }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState({});
  const userId = localStorage.getItem('userId');

  const navigate = useNavigate();

  const fetchUserData = () => {
    axios
      .get(`${Constants.apiHost}/users/${userId}`)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  };

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    handleClose();
    navigate('/login');
  };

  const handleChangePass = () => {
    handleClose();
    navigate('/changepassadm');
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {/* Thanh cố định trên cùng */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: 'white',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          width: '100%',
        }}
      >
        <Stack
          direction="row"
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: { sm: '100%', md: '1700px' },
            p: 1.5,
          }}
          spacing={2}
        >
          <NavbarBreadcrumbs text={mainContent?.text} />
          <Stack direction="row" sx={{ gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Notification />
            </Box>
            <IconButton color="inherit" onClick={handleClick}>
              <Avatar
                src={userData?.avatar || '/default-avatar.png'}
                sx={{ width: 56, height: 56 }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
              <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
            </Menu>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
