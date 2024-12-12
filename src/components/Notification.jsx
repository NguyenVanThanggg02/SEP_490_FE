import React, { useEffect, useState } from 'react';
import {
  Tooltip,
  IconButton,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useSocket } from '../Context/SocketContext';
import { useUser } from '../hooks/useUser';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Notification() {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();
  const { user } = useUser();
  const navigate = useNavigate(); // Get the navigate function

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    getAllNotification();
  };

  const handleClose = () => {
    setAnchorEl(null);
    markAllNotificationAsRead();
  };

  const openMenu = Boolean(anchorEl);

  const getAllNotification = () => {
    if (!user) return;
    axios
      .get(`http://localhost:9999/notification`, {
        params: {
          userId: user.id,
        },
      })
      .then((res) => {
        setNotifications(res.data);
      })
      .catch((err) => {});
  };

  const markAllNotificationAsRead = () => {
    if (!user) return;
    const listMark = notifications
      .filter((notification) => !notification.isRead)
      .map((notification) => notification._id);
    if (listMark.length === 0) return;
    axios
      .post(`http://localhost:9999/notification/mark-read`, {
        userId: user.id,
        notificationList: listMark,
      })
      .catch((err) => {});

    const newNotification = notifications.map((noti) => {
      return { ...noti, isRead: true };
    });
    setNotifications(newNotification);
  };

  const handleReceiveMessage = (message) => {
    const newNoti = [...notifications];
    newNoti.unshift(message);
    setNotifications(newNoti);
  };

  useEffect(() => {
    if (!socket) return;
    socket.on('new-noti', handleReceiveMessage);
    return () => {
      socket.off('new-noti', handleReceiveMessage);
    };
  }, [notifications, socket]);

  useEffect(() => {
    getAllNotification();
  }, [user]);

  const handleNotificationClick = (notification) => {
    console.log(notification)
    if (notification.url) {
      handleClose();
      navigate(notification.url, { replace: true });
      window.location.reload();
    }
  };

  return (
    <Box>
      <Badge
        badgeContent={
          notifications.length === 0
            ? undefined
            : notifications.filter((notification) => !notification.isRead)
                .length
        }
        color="error"
        sx={{ marginLeft: "8px" }}
      >
        <IconButton onClick={handleClick}>
          <NotificationsIcon />
        </IconButton>
      </Badge>

      {/* Notification Menu */}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          style: {
            width: "400px", // Fixed width
            overflowY: "auto", // Enable vertical scrolling
          },
        }}
        sx={{marginTop:'7px'}}
      >
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <MenuItem
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                backgroundColor: notification.isRead
                  ? "transparent"
                  : "#e0f7fa",
              }}
            >
              <Avatar
                src={
                  notification.imageUrl ||
                  "https://res.cloudinary.com/degpdpheb/image/upload/v1732010263/newlogo_2_xlrq0d.png"
                }
                alt="Icon"
                style={{ width: "40px", height: "40px", marginRight: "10px" }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="body1"
                  noWrap
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    WebkitLineClamp: 2,
                    lineHeight: "1.2em",
                    maxHeight: "2.4em",
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    letterSpacing: "normal",
                  }}
                >
                  {notification.content}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(notification.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </MenuItem>
          ))
        ) : (
          <MenuItem>
            <img
              src={"/no-records.png"}
              alt="No records"
              style={{ width: "60px", height: "60px", marginLeft: "10px" }}
            />
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}
