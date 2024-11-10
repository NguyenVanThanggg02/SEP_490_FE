import React, { useState } from "react";
import "../style/reset-forgotPass.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPass = () => {
  const [password, setPassword] = useState("");
  const { id, token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:9999/users/reset-password/${id}/${token}`, { password });
      
      if (response.data.Status === "Success") {
        toast.success("Mật khẩu được cập nhật thành công!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Password reset failed:", error);
      toast.error("Cập nhật mật khẩu thất bại");
    }
  };

  return (
    <div className="form-container">
      <div className="logo-container">Cập nhật lại mật khẩu</div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu mới</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="form-submit-btn" type="submit">
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default ResetPass;
