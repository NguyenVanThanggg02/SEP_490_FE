import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Box, Card, Grid, IconButton, styled, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Small } from "../Chart/Typography";
import axios from "axios";
import TopSpace from "../TopSpace";
import StatCards2 from "./StatCards2";

// Styled Card component
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexWrap: "nowrap", // Không ngắt dòng, giúp các thẻ nằm trên một hàng
  alignItems: "center",
  justifyContent: "space-between",
  background: theme.palette.background.paper,
  [theme.breakpoints.down("sm")]: { padding: "12px !important" },
  width: "150px", // Đặt chiều rộng cố định
  height: "150px", // Đặt chiều cao cố định để hình vuông
  maxWidth: "150px", // Đảm bảo giới hạn kích thước tối đa
}));


// Content Box for styling card content
const ContentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  "& small": { color: theme.palette.text.secondary },
  "& .icon": {
    opacity: 0.6,
    fontSize: "44px",
    color: theme.palette.primary.main,
  },
}));

// Heading component for card heading
const Heading = styled("h6")(({ theme }) => ({
  margin: 0,
  marginTop: "4px",
  fontSize: "14px",
  fontWeight: "500",
  color: theme.palette.primary.main,
}));

const StatCards = (props) => {
  const { index } = props;
  const [sumWeekSale, setSumWeekSale] = useState(0);
  const [order, setListOrder] = useState(0);
  const [totalOfProducts, setTotalProducts] = useState(0);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const handleArrowClick = (index) => {
    console.log(index);
    navigate("/dashboard", { state: { selectedTab: index } });
  };

  useEffect(() => {
    axios.get("http://localhost:9999/users").then((response) => setUsers(response.data));
  }, []);

  function formatCurrency(number) {
    if (typeof number === "number") {
      return number.toLocaleString("en-US", {
        currency: "VND",
      });
    }
  }

  useEffect(() => {
    fetch("http://localhost:9999/payment/calculate-total-amount-weekly")
      .then((resp) => resp.json())
      .then((data) => {
        setSumWeekSale(data.totalAmount);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:9999/payment/totalproducts")
      .then((resp) => resp.json())
      .then((data) => {
        setTotalProducts(data.totalProducts);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:9999/payment")
      .then((response) => {
        setListOrder(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const cardList = [
    {
      name: "Tổng khách hàng",
      amount: `2 users`,
      icon: "pi pi-user",
      index: 0,
    },
    {
      name: "Tổng đơn hàng",
      amount: `2 Orders`,
      icon: "pi pi-shopping-cart",
      index: 3,
    },
    {
      name: "Doanh thu trong tuần",
      amount: `4 ₫`,
      icon: "pi pi-money-bill",
      index: 0,
    },
    {
      name: "Tổng sản phẩm đã bán",
      amount: `3 products`,
      icon: "pi pi-shopping-cart",
      index: 1,
    },
  ];

  return (
    <Grid container spacing={1} sx={{ mt: "24px", display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
      {/* Card 1 */}
      <TopSpace />
      <Grid item xs={12} sm={2} key={index}style={{marginLeft:'50px'}} >
        <StyledCard elevation={6}>
          <ContentBox>
            <i style={{ fontSize: "2.5rem" }}></i>
            <Box ml="12px">
              <Small>abc</Small>
              <Heading>22</Heading>
            </Box>
          </ContentBox>
          <Tooltip title="View Details" placement="top">
            <IconButton>
              <ArrowRightAltIcon>arrow_right_alt</ArrowRightAltIcon>
            </IconButton>
          </Tooltip>
        </StyledCard>
      </Grid>

      {/* Card 2 (StatCards2) */}
      <Grid item xs={12} sm={8}>
        <StatCards2 />
      </Grid>

      {/* Other Components */}
      
    </Grid>
  );
};

export default StatCards;
