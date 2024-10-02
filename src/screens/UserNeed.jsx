import React, { useState, useEffect } from "react";
import axios from "axios";
import Send from "../model/Button/Send";
import "../style/UserNeedsForm.css";
const UserNeedsForm = () => {
  const [needs, setNeeds] = useState({
    productPreferences: [],
    goals: "",
  });
  const [productOptions, setProductOptions] = useState([]);
  const [userId, setUserId] = useState(null); // Lưu trữ userId
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
        <h3>Chọn sở thích sản phẩm:</h3>
        {productOptions.length > 0 ? (
          productOptions.map((option, index) => (
            <div key={index}>
              <label>
                <input
                  type="checkbox"
                  value={option.name}
                  checked={needs.productPreferences.includes(option.name)}
                  onChange={handleCheckboxChange}
                />
                {option.name}
              </label>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm nào để chọn.</p>
        )}
      </div>
      <div>
        <label>Mục tiêu cá nhân</label>
        <input
          type="text"
          name="goals"
          value={needs.goals}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit">{loading ? "Đang gửi..." : "Gửi"} </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Gửi thành công!</p>}
    </form>
  );
};

export default UserNeedsForm;
