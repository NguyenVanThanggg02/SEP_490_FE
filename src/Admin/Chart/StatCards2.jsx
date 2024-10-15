import Moving from "@mui/icons-material/Moving";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
  Card,
  Fab,
  Grid,
  Icon,
  lighten,
  styled,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";

const ContentBox = styled("div")(() => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
}));

const FabIcon = styled(Fab)(() => ({
  width: "44px !important",
  height: "44px !important",
  boxShadow: "none !important",
}));

const H3 = styled("h3")(({ textcolor }) => ({
  margin: 0,
  color: textcolor,
  fontWeight: "500",
  marginLeft: "12px",
  fontSize: "12px", // Giảm kích thước font cho tiêu đề
}));

const H1 = styled("h1")(({ theme }) => ({
  margin: 0,
  flexGrow: 1,
  color: theme.palette.text.secondary,
  fontSize: "20px", // Giảm kích thước font cho số liệu
}));

const Span = styled("span")(({ textcolor }) => ({
  fontSize: "13px",
  color: textcolor,
  marginLeft: "4px",
}));

const IconBox = styled("div")(() => ({
  width: 16,
  height: 16,
  color: "#fff",
  display: "flex",
  overflow: "hidden",
  borderRadius: "300px ",
  justifyContent: "center",
  "& .icon": { fontSize: "14px" },
}));

const StatCards2 = () => {
  const { palette } = useTheme();
  const [totalOrder, setTotalOrder] = useState(0);
  const textError = palette.error.main;
  const bgError = lighten(palette.error.main, 0.85);

  function formatCurrency(number) {
    if (typeof number === "number") {
      return number.toLocaleString("en-US", {
        currency: "VND",
      });
    }
  }

  return (
    <Grid container spacing={3} sx={{ mt: 1, ml: 0.5 }}>
      <Grid item xs={12} md={6} style={{ paddingLeft: '0px', paddingTop: '0px' }}>
        <Card
          elevation={3}
          style={{ height: "150px", width: "150px" }} // Đặt chiều cao và chiều rộng thành hình vuông, không padding
        >
          <ContentBox>
            <H3 textcolor={"#08ad6c"}>Tổng user</H3>
          </ContentBox>
          <ContentBox sx={{ pt: 1 }}>
            <H1>10.8k</H1>
          </ContentBox>
        </Card>
      </Grid>

      <Grid item xs={12} md={6} style={{ paddingLeft: '0px', paddingTop: '0px' }}>
        <Card
          elevation={3}
          style={{ height: "150px", width: "150px" }} // Đặt chiều cao và chiều rộng thành hình vuông, không padding
        >
          <ContentBox>
            <H3 textcolor={"#08ad6c"}>Tổng user</H3>
          </ContentBox>
          <ContentBox sx={{ pt: 1 }}>
            <H1>10.8k</H1>
          </ContentBox>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatCards2;



