import React from "react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Paper,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import WorkIcon from "@mui/icons-material/Work";
import PetsIcon from "@mui/icons-material/Pets";
import LanguageIcon from "@mui/icons-material/Language";
import HomeIcon from "@mui/icons-material/Home";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function HostProfile() {
  return (
    <Grid container spacing={3} style={{ padding: "20px" }}>
      {/* Host Information */}
      <Grid item xs={12} md={4}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={2}
          >
            <Avatar
              src="https://example.com/avatar.jpg"
              alt="Patinee"
              sx={{ width: 100, height: 100 }}
            />
          </Box>
          <Typography variant="h5" align="center">
            Patinee
          </Typography>
          <Typography variant="body2" align="center" color="textSecondary">
            Chủ nhà/Người tổ chức
          </Typography>
          <Box mt={2} mb={2} display="flex" justifyContent="center">
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon />
                </ListItemIcon>
                <ListItemText primary="5 Đánh giá" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon />
                </ListItemIcon>
                <ListItemText primary="5 Xếp hạng" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon />
                </ListItemIcon>
                <ListItemText primary="7 Tháng kinh nghiệm" />
              </ListItem>
            </List>
          </Box>
          <Button variant="outlined" fullWidth>
            Báo cáo hồ sơ này
          </Button>
        </Paper>
      </Grid>

      {/* Host Details */}
      <Grid item xs={12} md={8}>
        <Card style={{ padding: "20px" }}>
          <Typography variant="h6">Thông tin về Patinee</Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <WorkIcon />
              </ListItemIcon>
              <ListItemText
                primary="Công việc của tôi"
                secondary="Trợ lý Thượng nghị sĩ"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PetsIcon />
              </ListItemIcon>
              <ListItemText primary="Thú cưng" secondary="C*́ó và mèo" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText primary="Nói Tiếng Anh, Tiếng Hàn Quốc, Tiếng Thái, và Tiếng Trung" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText
                primary="Điều làm nên sự độc đáo cho nhà tôi"
                secondary="Độc đáo"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LocationOnIcon />
              </ListItemIcon>
              <ListItemText primary="Sống tại" secondary="Bangkok, Thái Lan" />
            </ListItem>
          </List>
        </Card>
      </Grid>

      {/* Verified Information */}
      <Grid item xs={12} md={4}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Typography variant="h6" gutterBottom>
            Thông tin đã được xác nhận của Patinee
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckIcon />
              </ListItemIcon>
              <ListItemText primary="Danh tính" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckIcon />
              </ListItemIcon>
              <ListItemText primary="Địa chỉ email" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckIcon />
              </ListItemIcon>
              <ListItemText primary="Số điện thoại" />
            </ListItem>
          </List>
        </Paper>
      </Grid>

      {/* Reviews */}
      <Grid item xs={12} md={8}>
        <Card style={{ padding: "20px" }}>
          <Typography variant="h6">Đánh giá của Patinee</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} style={{ padding: "10px" }}>
                <Typography variant="body2" color="textSecondary">
                  "...Chúng tôi đã ở đây 1 đêm, đêm cuối cùng của chúng tôi ở
                  Thái Lan, nhưng đó cũng là đêm đẹp nhất! Chỗ ở có tầm nhìn đẹp
                  và phong cách rất đẹp..."
                </Typography>
                <Typography variant="body2" color="primary">
                  - Alara, tháng 9 năm 2024
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} style={{ padding: "10px" }}>
                <Typography variant="body2" color="textSecondary">
                  "...Một chỗ rất tuyệt để ở! Chắc chắn giới thiệu..."
                </Typography>
                <Typography variant="body2" color="primary">
                  - Krisztina, tháng 8 năm 2024
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          <Box mt={2}>
            <Button variant="outlined" fullWidth>
              Xem tất cả 5 đánh giá
            </Button>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}

export default HostProfile;
