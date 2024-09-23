import React from "react";
import "../style/login.css";

const RegisterForm = () => {
  return (
    <form className="form_container">
      <div className="title_container">
        <p className="title">Create an Account</p>
        <span className="subtitle">
          Get started with our app, just create an account and enjoy the
          experience.
        </span>
      </div>

      <div className="input_container">
        <label className="input_label" htmlFor="username_field">
          Username
        </label>
        <input
          type="text"
          id="username_field"
          placeholder="Your Username"
          className="input_field"
        />
      </div>

      <div className="input_container">
        <label className="input_label" htmlFor="email_field">
          Email
        </label>
        <input
          type="email"
          id="email_field"
          placeholder="name@mail.com"
          className="input_field"
        />
      </div>

      <div className="input_container">
        <label className="input_label" htmlFor="password_field">
          Password
        </label>
        <input
          type="password"
          id="password_field"
          placeholder="Password"
          className="input_field"
        />
      </div>

      <div className="input_container">
        <label className="input_label" htmlFor="confirm_password_field">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirm_password_field"
          placeholder="Confirm Password"
          className="input_field"
        />
      </div>

      <button title="Sign In" type="submit" className="sign-in_btn">
        <span>Đăng ký</span>
      </button>
    </form>
  );
};

export default RegisterForm;
