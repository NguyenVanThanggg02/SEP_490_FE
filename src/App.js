import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import Header from "./components/Header";
import LoginForm from "./screens/LoginForm";
import RegisterForm from "./screens/RegisterForm";
import UserNeedsForm from "./screens/UserNeed";
import HostProfile from "./screens/HostProfile";
import ResetPass from "./screens/ResetPass";
import Forgot_Pass from "./screens/Forgot_Pass";
import Message from "./screens/Message";
import SpaceDetails from "./screens/SpaceDetails";
import NotFound from "./screens/NotFound";
import ChangePassAdmin from "./Admin/profile/ChangePassAdmin";
import Favorites from "./screens/Favorites";
import Compare from "./screens/Compare";
import DetailForAdmin from "./Admin/DetailForAdmin";
import DashBoard from "./Admin/DashBoard";
import Landing from "./screens/Landing";
import BookingDate from "./screens/BookingDate";
import ListSpace from "./screens/ListSpace";
import AddSpaceFlow from "./screens/AddSpaces/AllAdd";
import Footer from "./components/Footer";
import ManaPost from "./screens/ManaPost";
import ChatBox from "./screens/Chat.";
import Payment from "./screens/Payment";
import History from "./screens/OrderHistory/History";
import AddFunds from "./screens/AddFunds";
import SpacePosted from "./screens/ManaSpaceHost/SpacePosted";
import EditSpacePosted from "./screens/ManaSpaceHost/EditSpacePosted";
import {ToastContainer} from "react-toastify";

import Blog from "./screens/Blog";
import Profile from "./screens/Profile";
import StartToUp from "./screens/AddSpaces/StartToUp";
import OrderMana from "./screens/OrderMana";
import CreateReview from './screens/CreateReview';
import AddFundsResult from "./screens/AddFundsResult";
import Statistics from "./screens/Statistics";
import { Box } from '@mui/material';
import { AdminLayout } from './Admin/AdminLayout';
import ManaReport from "./screens/ManaReport";

function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const role = localStorage.getItem("role");
  const [selectedChat, setSelectedChat] = useState(null);
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };
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
    "/alladd",
    "/welcome"
    
  ];
  const shouldShowHeader = !hiddenPaths.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && (
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      )}
      <Box component={'main'} sx={{ mt: 4 }}>
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
          <Route path="/chat" element={<ChatBox selectedChat={selectedChat} />}/>
          <Route path="/manaspace" element={<ManaPost />} />
          <Route path="/list_space" element={<ListSpace />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/host_profile/:id" element={<HostProfile />} />
          <Route path="/reset-password/:id/:token" element={<ResetPass />} />
          <Route path="/forgot_pass" element={<Forgot_Pass />} />
          <Route path="/mess" element={<Message />} />
          <Route path="/spaces/:id" element={<SpaceDetails onSelectChat={handleSelectChat} />} />
          <Route path="/notfound" element={<NotFound />} />
          <Route path="/changepassadm" element={<ChangePassAdmin />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/detail-admin" element={<DetailForAdmin />} />
          <Route path="/alladd" element={<AddSpaceFlow />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/history" element={<History />} />
          <Route path="/addfund" element={<AddFunds />} />
          <Route path="/addfund/result" element={<AddFundsResult />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/admin"
            element={
              role === '1' ? <AdminLayout /> : <Navigate to="/notfound" />
            }
          />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/posted" element={<SpacePosted />} />
          <Route path="/editposted" element={<EditSpacePosted />} />
          <Route path="/booking/:id" element={<BookingDate />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/welcome" element={<StartToUp />} />
          <Route path="/order" element={<OrderMana />} />
          <Route path="/reviews/create/:spaceId" element={<CreateReview />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/report" element={<ManaReport />} />
        </Routes>
        </Box>
        {shouldShowHeader && (
        <Footer isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      )}
    </>
  );
}
function App() {
  return (
    <BrowserRouter>
      <Layout />
      <ToastContainer />
    </BrowserRouter>
  );
}
export default App;