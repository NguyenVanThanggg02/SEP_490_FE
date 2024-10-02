import React, { useState, useEffect } from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import "../style/UserNeedsForm.css";
import { useNavigate } from "react-router-dom";
import "../style/list.css";
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

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const updatedPreferences = checked
      ? [...needs.productPreferences, value]
      : needs.productPreferences.filter((pref) => pref !== value);
    setNeeds({ ...needs, productPreferences: updatedPreferences });
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
      console.error("Error occurred:", err);
      setError("Đã xảy ra lỗi khi gửi thông tin. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingProducts) {
    return <p>Đang tải danh sách sản phẩm...</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h3>Bạn đang quan tâm đến không gian nào?</h3>
        <div id="checklist">
          {productOptions.length > 0 ? (
            productOptions.map((option, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  value={option.name}
                  checked={needs.productPreferences.includes(option.name)}
                  onChange={handleCheckboxChange}
                  id={`checklist-${index}`} // Thêm ID cho từng checkbox
                />
                <label htmlFor={`checklist-${index}`}>{option.name}</label>
              </div>
            ))
          ) : (
            <p>Không có sản phẩm nào để chọn.</p>
          )}
        </div>
      </div>
      <div>
        <label>Mong muốn của bạn</label>
        <input
          type="text"
          name="goals"
          value={needs.goals}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit" className="btn btn-primary mb-2">
        {loading ? "Đang gửi..." : "Gửi"}
      </button>

      {success && (
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
          Gửi thành công!
        </Alert>
      )}

      {/* Hiển thị thông báo lỗi */}
      {error && <Alert severity="error">{error}</Alert>}
    </form>
  );
};

export default UserNeedsForm;
