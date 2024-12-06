import React, { useEffect, useState } from "react";
import { Container, Grid, Card, CardContent, Typography, Avatar, AvatarGroup, Box, Button, Stack } from "@mui/material";
import { Block as BlockIcon, Undo as UndoIcon, Person as PersonIcon } from '@mui/icons-material';
import axios from "axios";
import { Row } from "react-bootstrap";
import { Paginator } from "primereact/paginator";

const UserManagement = () => {
  const [listUser, setListUser] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [rows, setRows] = useState(9);
  const [first, setFirst] = useState(0);
  const listUserOnPage = listUser.slice(first, first + rows);
  const [, setCurrentPage] = useState(1);

  const onPageChange = (event) => {
    setFirst(event?.first);
    setCurrentPage(event.page + 1);
    setRows(event?.rows);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setCurrentUserId(storedUserId);
    }

    fetch("http://localhost:9999/users")
      .then((resp) => resp.json())
      .then((data) => setListUser(data))
      .catch((err) => console.log(err.message));
  }, []);

  const formatDate = (inputDate) => {
    const dateObject = new Date(inputDate);
    return dateObject.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleBanUser = (userId, isBan) => {
    if (userId === currentUserId) {
      console.warn("Không thể ban chính mình!");
      return;
    }

    axios
      .put(`http://localhost:9999/users/${userId}`, { isBan: !isBan })
      .then((response) => {
        if (response.status === 200) {
          const updatedUsers = listUser.map((user) =>
            user._id === userId ? { ...user, isBan: !isBan } : user
          );
          setListUser(updatedUsers);
        } else {
          console.error("Cập nhật thất bại");
        }
      })
      .catch((error) => console.error("Đã xảy ra lỗi:", error));
  };

  return (
    <Container style={{marginBottom:'55px'}}>
      <Grid container spacing={3}>
        {listUserOnPage.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user._id}>
            <Card 
              variant="outlined" 
              sx={{ 
                borderRadius: 4, 
                boxShadow: 3, 
                overflow: 'hidden', 
                position: 'relative', 
                transition: "transform 0.3s", 
                "&:hover": { transform: "scale(1.05)" } 
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar 
                    alt={user.fullname} 
                    src={user.avatar || "/default-avatar.png"} 
                    sx={{ width: 56, height: 56 }}
                  />
                  <Box>
                    <Typography variant="h6">{user.fullname}</Typography>
                    <Typography variant="body2" color="textSecondary">@{user.username}</Typography>
                  </Box>
                </Stack>

                <Box mt={2}>
                <Typography variant="body2" color="textSecondary">
                  Giới tính: {user.gender === "Male" ? "Nam" : user.gender === "Female" ? "Nữ" : "Khác"}
                </Typography>
                  <Typography variant="body2" color="textSecondary">Địa chỉ: {user.address}</Typography>
                  <Typography variant="body2" color="textSecondary">Ngày sinh: {formatDate(user.birthday)}</Typography>
                  <Typography variant="body2" color="textSecondary">SĐT: {user.phone}</Typography>
                  <Typography variant="body2" color="textSecondary">Email: {user.gmail}</Typography>
                </Box>

                <Box mt={3} textAlign="center">
                  <Button
                    variant="contained"
                    color={user.isBan ? "success" : "error"}
                    startIcon={user.isBan ? <UndoIcon /> : <BlockIcon />}
                    onClick={() => handleBanUser(user._id, user.isBan)}
                    sx={{ borderRadius: 2, px: 3 }}
                    disabled={user._id === currentUserId}
                  >
                    {user.isBan ? "Unban" : "Ban"}
                  </Button>
                </Box>
              </CardContent>

              <Box 
                position="absolute" 
                top={16} 
                right={16}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <AvatarGroup max={2}>
                  <Avatar sx={{ bgcolor: user.isBan ? "error.main" : "success.main" }}>
                    <PersonIcon />
                  </Avatar>
                  {user.isBan && (
                    <Avatar sx={{ bgcolor: "error.main" }}>
                      <BlockIcon />
                    </Avatar>
                  )}
                </AvatarGroup>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Row
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
          <Paginator
            style={{ backgroundColor: "white" }}
            first={first}
            rows={rows}
            totalRecords={listUser.length}
            onPageChange={onPageChange}
          />
      </Row>
    </Container>
  );
};

export default UserManagement;
