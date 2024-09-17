import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import HotTubIcon from "@mui/icons-material/HotTub";
import WifiIcon from "@mui/icons-material/Wifi";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";

function BookingDetails() {
  return (
    <Grid container spacing={3} style={{ padding: "20px" }}>
      {/* Thông tin về giá và ngày đặt */}
      <Grid item xs={12} md={5}>
        <Card style={{ padding: "20px" }}>
          <CardContent>
            <Typography
              variant="h5"
              style={{ textDecoration: "line-through", color: "gray" }}
            >
              ₫30.752.619
            </Typography>
            <Typography
              variant="h4"
              style={{ color: "#ff5a5f", fontWeight: "bold" }}
            >
              ₫25.226.254
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Nhận phòng: 17/9/2024 - Trả phòng: 22/9/2024
            </Typography>
            <Typography variant="body2" gutterBottom>
              Khách: 1 khách
            </Typography>
            <Button variant="contained" color="primary" fullWidth>
              Đặt phòng
            </Button>
            <Typography
              variant="body2"
              style={{ color: "#ff5a5f", marginTop: "10px" }}
            >
              Ưu đãi đặc biệt: tiết kiệm ₫5.526.842
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Thông tin chi tiết về nơi ở */}
      <Grid item xs={12} md={7}>
        <Card style={{ padding: "20px" }}>
          <CardContent>
            <Typography variant="h6">
              Chỗ ở là bầu không khí và vị trí
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Thích hợp để thư giãn trong kỳ nghỉ. Bạn có thể nhâm nhi cà phê
              trong bầu không khí ven sông. Khu vực nướng BBQ với khung cảnh
              đẹp. Phòng thoáng mát và các hoạt động giải trí như đạp xe, chèo
              thuyền kayak, hoặc tham gia các hoạt động ngoài trời.
            </Typography>
          </CardContent>
          <Divider />
          <CardContent>
            <Typography variant="h6">Tiện nghi</Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <HotTubIcon />
                </ListItemIcon>
                <ListItemText primary="Bồn tắm nước nóng" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <WifiIcon />
                </ListItemIcon>
                <ListItemText primary="Wi-Fi" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DirectionsCarIcon />
                </ListItemIcon>
                <ListItemText primary="Chỗ đỗ xe miễn phí" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AcUnitIcon />
                </ListItemIcon>
                <ListItemText primary="Điều hòa nhiệt độ" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Thông tin về chủ nhà */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Chủ nhà: Patinee</Typography>
            <Typography variant="body2" color="textSecondary">
              7 tháng kinh nghiệm đón tiếp khách
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default BookingDetails;
