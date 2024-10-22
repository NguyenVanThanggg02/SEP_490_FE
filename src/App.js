import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import Header from "./components/Header";
import Home from "./screens/Home";
import LoginForm from "./screens/LoginForm";
import RegisterForm from "./screens/RegisterForm";
import UserNeedsForm from "./screens/UserNeed";
import HostProfile from "./screens/HostProfile";
import ChangePass from "./screens/ChangePass";
import ResetPass from "./screens/ResetPass";
import Forgot_Pass from "./screens/Forgot_Pass";
import Message from "./screens/Message";
import SpaceDetails from "./screens/SpaceDetails";
import NotFound from "./screens/NotFound";
import ChangePassAdmin from "./Admin/profile/ChangePassAdmin";
import Favorites from "./screens/Favorites";
import AddSpaceCategories from "./screens/AddSpaces/AddSpaceCategories";
import AddSpaceLocation from "./screens/AddSpaces/AddSpaceLocation";
import AddSpaceInforSpace from "./screens/AddSpaces/AddSpaceInforSpace";
import AllAdd from "./screens/AddSpaces/AllAdd";
import Compare from "./screens/Compare";
import DetailForAdmin from "./Admin/DetailForAdmin";
import DashBoard from "./Admin/DashBoard";
import Landing from "./screens/Landing";
import ListSpace from "./screens/ListSpace";
import AddSpaceFlow from "./screens/AddSpaces/AllAdd";
import ManaPost from "./screens/ManaPost";
import ChatBox from "./screens/Chat.";
import Payment from "./screens/Payment";
import History from "./screens/OrderHistory/History";
import AddFunds from "./screens/AddFunds";

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

  const hiddenPaths = [
    "/notfound",
    "/admin",
    "/changepassadm",
    "/userneed",
    "/login",
    "/register",
  ];
  const shouldShowHeader = !hiddenPaths.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && (
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      )}
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Landing isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            }
          />
          <Route
            path="/login"
            element={
              <LoginForm
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          />
          <Route path="/userneed" element={<UserNeedsForm />} />
          <Route path="/chat" element={<ChatBox />} />
          <Route path="/manaspace" element={<ManaPost />} />
          <Route path="/list_space" element={<ListSpace />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/host_profile/:id" element={<HostProfile />} />
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
          <Route path="/alladd" element={<AddSpaceFlow />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/history" element={<History />} />
          <Route path="/addfund" element={<AddFunds />} />
          <Route
            path="/admin"
            element={role === "1" ? <DashBoard /> : <Navigate to="/notfound" />}
          />
        </Routes>
      </main>
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
