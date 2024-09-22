import React from "react";
import "../style/login.css";

const LoginForm = () => {
  return (
    <form className="form_container">
      <div className="title_container">
        <p className="title">Login to your Account</p>
        <span className="subtitle">
          Get started with our app, just create an account and enjoy the
          experience.
        </span>
      </div>

      <div className="input_container">
        <label className="input_label" htmlFor="email_field">
          Email
        </label>
        <input
          placeholder="name@mail.com"
          type="text"
          className="input_field"
          id="email_field"
        />
      </div>

      <div className="input_container">
        <label className="input_label" htmlFor="password_field">
          Password
        </label>
        <input
          placeholder="Password"
          type="password"
          className="input_field"
          id="password_field"
        />
      </div>

      <button title="Sign In" type="submit" className="sign-in_btn">
        <span>Sign In</span>
      </button>

      <p className="note">Terms of use & Conditions</p>
    </form>
  );
};

export default LoginForm;
