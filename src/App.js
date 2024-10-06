import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import SpaceDetails from "./screens/SpaceDetails";
import RegisterForm from "./screens/RegisterForm";
import HostProfile from "./screens/HostProfile";

import LoginForm from "./screens/LoginForm";
import ChangePass from "./screens/ChangePass";
import ResetPass from "./screens/ResetPass";
import Forgot_Pass from "./screens/Forgot_Pass";
import Message from "./screens/Message";
import UserNeedsForm from "./screens/UserNeed";
import Home from "./screens/Home";
import { useEffect, useState } from "react";
import DashBoard from "./Admin/DashBoard";
import NotFound from "./screens/NotFound";
import ChangePassAdmin from "./Admin/profile/ChangePassAdmin";
import Favorites from "./screens/Favorites";
import Compare from "./screens/Compare";
import DetailForAdmin from "./Admin/DetailForAdmin";

function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const role = localStorage.getItem("role");
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);
  const shouldShowHeader =
    location.pathname !== "/notfound" &&
    location.pathname !== "/admin" &&
    location.pathname !== "/changepassadm";

  return (
    <>
      {shouldShowHeader && (
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <LoginForm isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          }
        />
        <Route path="/userneed" element={<UserNeedsForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/host_profile" element={<HostProfile />} />
        <Route path="/chang_pass" element={<ChangePass />} />
        <Route path="/reset-password/:id/:token" element={<ResetPass />} />
        <Route path="/forgot_pass" element={<Forgot_Pass />} />
        <Route path="/mess" element={<Message />} />
        <Route path="/spaces/:id" element={<SpaceDetails />} />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="/changepassadm" element={<ChangePassAdmin />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/detail-admin" element={<DetailForAdmin />} />
        <Route
          path="/admin"
          element={role === "1" ? <DashBoard /> : <Navigate to="/notfound" />}
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
