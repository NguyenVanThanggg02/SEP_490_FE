import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Row } from "react-bootstrap";
import {
  Box,
  Card,
  Grid,
  CardContent,
  Typography,
  TextField,
} from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import "../style/h3.css";
import { Button, Alert, toaster, Pane, Spinner } from "evergreen-ui";

const UserNeedsForm = () => {
  const [needs, setNeeds] = useState({
    productPreferences: [],
    goals: "",
  });
  const nav = useNavigate();
  const [productOptions, setProductOptions] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:9999/categories");
        if (response.status === 200) {
          setProductOptions(response.data);
        }
      } catch (err) {
        setError("Lỗi khi tải sản phẩm. Vui lòng thử lại.");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCategoryClick = (categoryId) => {
    setNeeds((prevNeeds) => {
      const isAlreadySelected =
        prevNeeds.productPreferences.includes(categoryId);
      const newPreferences = isAlreadySelected
        ? prevNeeds.productPreferences.filter((id) => id !== categoryId)
        : [...prevNeeds.productPreferences, categoryId];

      return { ...prevNeeds, productPreferences: newPreferences };
    });
  };

  const handleCheckAll = () => {
    if (allSelected) {
      setNeeds((prevNeeds) => ({ ...prevNeeds, productPreferences: [] }));
    } else {
      const allCategoryIds = productOptions.map((category) => category._id);
      setNeeds((prevNeeds) => ({
        ...prevNeeds,
        productPreferences: allCategoryIds,
      }));
    }
    setAllSelected(!allSelected);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNeeds({ ...needs, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    if (!userId) {
      setError("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }
    try {
      console.log("Sending data:", {
        ...needs,
      });
      const response = await axios.post(
        `http://localhost:9999/userNeed/${userId}/needs`,
        {
          ...needs,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setSuccess(true);
        nav("/");
        setNeeds({ productPreferences: [], goals: "" });
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi gửi thông tin. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect for notifications
  useEffect(() => {
    if (success) {
      toaster.success("Gửi thông tin thành công!!!");
    } else if (error) {
      toaster.danger(error);
    }
  }, [success, error]);

  if (loadingProducts) {
    return (
      <Pane
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={400}
      >
        <Spinner />
      </Pane>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="container">
      <div>
        <Row>
          <h3 className="heading">Bạn đang quan tâm đến không gian nào?</h3>
        </Row>
        <Button
          variant="contained"
          intent={allSelected ? "danger" : "success"}
          onClick={handleCheckAll}
          sx={{ mb: 2 }}
        >
          {allSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
        </Button>
      </div>
      <div>
        {productOptions.length > 0 ? (
          <Grid container spacing={2}>
            {productOptions.map((category) => {
              const Icon = MuiIcons[category.iconName];
              const isSelected = needs.productPreferences.includes(
                category._id
              );

              return (
                <Grid item xs={12} sm={3} md={3} key={category._id}>
                  <Card
                    className={`text-center add-space ${
                      isSelected ? "selected" : ""
                    }`}
                    sx={{
                      cursor: "pointer",
                      boxShadow: isSelected
                        ? "0 0 10px rgba(0, 123, 255, 0.5)"
                        : "none",
                      backgroundColor: isSelected
                        ? "rgba(0, 123, 255, 0.1)"
                        : "white",
                      border: isSelected
                        ? "2px solid #007bff"
                        : "1px solid rgba(0, 0, 0, 0.125)",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => handleCategoryClick(category._id)}
                  >
                    <CardContent>
                      <Box sx={{ fontSize: "2rem" }}>
                        {Icon ? <Icon /> : null}
                      </Box>
                      <Typography variant="h6">{category.name}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <p>Không có sản phẩm nào để chọn.</p>
        )}
      </div>

      <div>
        <label className="mb-2">Có điều gì khiến bạn bận tâm?</label>
        <TextField
          label="Điều bạn cần nói....."
          name="goals"
          value={needs.goals}
          onChange={handleInputChange}
          sx={{ width: "100%" }}
        />
      </div>

      <Button
        type="submit"
        variant="contained"
        intent="success"
        marginRight={16}
        sx={{ mt: 2 }}
        disabled={loading} // Disable during submission
      >
        {loading ? "Đang gửi..." : "Gửi"}
      </Button>
    </form>
  );
};

export default UserNeedsForm;
