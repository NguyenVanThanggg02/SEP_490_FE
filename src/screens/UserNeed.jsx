import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Grid, TextField } from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import { Button, Pane, Spinner, toaster } from "evergreen-ui";
import { Tag } from "antd";
import "../style/UserNeedsForm.css";
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
          setProductOptions(response.data); // Đổ dữ liệu thật từ API
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
    const allCategoryIds = productOptions.map((category) => category._id);
    if (allSelected) {
      setNeeds((prevNeeds) => ({ ...prevNeeds, productPreferences: [] }));
    } else {
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
        setAllSelected(false); // Reset the select all state
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Đã xảy ra lỗi khi gửi thông tin. Vui lòng thử lại.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

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
    <form onSubmit={handleSubmit} className="containerr">
      <div className="center-container">
        <h3 className="heading">
          Bạn đang tìm kiếm không gian lý tưởng nào cho sự kiện của mình?
        </h3>
        <Button
          className="button"
          variant="contained"
          intent={allSelected ? "danger" : "success"}
          onClick={handleCheckAll}
          sx={{ mb: 2 }}
          type="button"
        >
          {allSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
        </Button>
      </div>

      <div>
        <Grid container justifyContent="center" spacing={3} sx={{ mb: 3 }}>
          {productOptions.map((category) => {
            const Icon = MuiIcons[category.iconName];
            const isSelected = needs.productPreferences.includes(category._id);
            return (
              <Grid item key={category._id} xs={12} sm={4} md={3}>
                <Pane
                  className={`grid-item ${isSelected ? "selected" : ""}`} // Sử dụng class CSS
                  onClick={() => handleCategoryClick(category._id)}
                >
                  {Icon ? <Icon /> : null}
                  <p>{category.name}</p>
                </Pane>
              </Grid>
            );
          })}
        </Grid>
      </div>

      <div className="container-fluid d-flex flex-column align-items-center">
        <label className="mb-2 text-center">
          Có điều gì khiến bạn bận tâm?
        </label>
        <TextField
          className="text-input"
          label="Điều bạn cần nói....."
          name="goals"
          value={needs.goals}
          onChange={handleInputChange}
          InputProps={{
            style: {
              borderRadius: "25px",
            },
          }}
          style={{ width: "100%" }}
        />
      </div>

      <Button
        className="submit-btn mt-3"
        type="submit"
        variant="contained"
        intent="success"
        disabled={loading}
      >
        {loading ? "Đang gửi..." : "Gửi"}
      </Button>
    </form>
  );
};

export default UserNeedsForm;
