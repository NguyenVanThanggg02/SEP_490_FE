import React, { useState } from "react";
import "../style/register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import newlogo2 from "../assets/images/newlogo_2.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    gmail: "",
    fullname: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: "",
    }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,11}$/;
    const newErrors = {};
    if (!formData.fullname.trim()) {
      newErrors.fullname = "Họ và tên không được để trống!";
    }
    if (!formData.username.trim()) {
      newErrors.username = "Tên đăng nhập không được để trống!";
    }
    if (!emailRegex.test(formData.gmail)) {
      newErrors.gmail = "Email không hợp lệ!";
    }
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Số điện thoại phải có 10-11 chữ số!";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự!";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp!";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin đăng ký!");
      return;
    }
    const { username, gmail, password, fullname, phone } = formData;
    const formDataToSend = {
      username,
      gmail,
      password,
      fullname,
      phone,
    };
    try {
      setIsSubmitting(true);
      const res = await axios.post(
        "http://localhost:9999/users/register",
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { accessToken } = res.data;
      try {
        localStorage.setItem("accessToken", accessToken);
      } catch (e) {
        console.error("Không thể lưu accessToken vào localStorage:", e);
      }
      toast.success(
        "Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập..."
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      if (!error.response) {
        toast.error(
          "Không thể kết nối tới server. Vui lòng kiểm tra lại kết nối!"
        );
      } else {
        const errorMessage =
          error.response?.data?.message || "Đăng ký không thành công!";
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="form_containers" onSubmit={handleRegister}>
      <ToastContainer />
      <div
        className="logo_container d-flex justify-content-center"
        style={{ width: "100%" }}
      >
        <img
          src={newlogo2}
          height={80}
          alt="logo"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="title_container">
        <p className="title">Đăng kí tài khoản với thông tin của bạn</p>
        <span className="subtitle">
          Bắt đầu với ứng dụng của chúng tôi, chỉ cần tạo một tài khoản và
          thưởng thức trải nghiệm.
        </span>
      </div>

      {/* Nhóm các trường nhập */}
      <div className="input_groups">
        {[
          {
            label: "Họ và tên",
            id: "fullname",
            type: "text",
            placeholder: "Nguyễn Văn A",
          },
          {
            label: "Tên đăng nhập",
            id: "username",
            type: "text",
            placeholder: "Tên đăng nhập của bạn",
          },
          {
            label: "Email",
            id: "gmail",
            type: "email",
            placeholder: "name@mail.com",
          },
          {
            label: "Số điện thoại",
            id: "phone",
            type: "tel",
            placeholder: "0123456789",
          },

          {
            label: "Mật khẩu",
            id: "password",
            type: "password",
            placeholder: "Mật khẩu",
          },
          {
            label: "Xác nhận mật khẩu",
            id: "confirmPassword",
            type: "password",
            placeholder: "Xác nhận mật khẩu",
          },
        ].map((field) => (
          <div className="input_containers" key={field.id}>
            <label className="input_label" htmlFor={field.id}>
              {field.label}
            </label>
            <input
              type={field.type}
              id={field.id}
              value={formData[field.id]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className={`input_field ${errors[field.id] ? "input_error" : ""}`}
            />
            {errors[field.id] && (
              <span className="error_text">{errors[field.id]}</span>
            )}
          </div>
        ))}
      </div>

      <button
        title="Đăng ký"
        type="submit"
        className="sign-in_btn"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
      </button>

      <div>
        <Link
          to="/login"
          className="text-danger text-opacity-75"
          style={{ textDecoration: "none" }}
        >
          Tôi đã có tài khoản ...
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
