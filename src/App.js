import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import BookingDetails from "./screens/BookingDetails";
import RegisterForm from "./screens/RegisterForm";
import HostProfile from "./screens/HostProfile";

import LoginForm from "./screens/LoginForm";
import ChangePass from "./screens/ChangePass";
import ResetPass from "./screens/ResetPass";
import Forgot_Pass from "./screens/Forgot_Pass";
import Message from "./screens/Message";
import DashBoard from "./screens/Admin/Dashboard";
import UserManagement from "./screens/Admin/UserManagement";
import Home from "./screens/Home";
import { useEffect, useState } from "react";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);
  return (
    <BrowserRouter>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <LoginForm isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          }
        />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/host_profile" element={<HostProfile />} />
        <Route path="/chang_pass" element={<ChangePass />} />
        <Route path="/reset-password/:id/:token" element={<ResetPass />} />
        <Route path="/forgot_pass" element={<Forgot_Pass />} />
        {/* <Route path="/:id" element={<BookingDetails />} /> */}
        <Route path="/mess" element={<Message />} />
        <Route path="/spaces/:id" element={<BookingDetails />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/usermana" element={<UserManagement />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
