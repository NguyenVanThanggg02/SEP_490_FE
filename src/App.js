import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import BookingDetails from "./screens/BookingDetails";
import MapComponent from "./screens/mapComponent";
import RegisterForm from "./screens/RegisterForm";
import HostProfile from "./screens/HostProfile";
import Comment from "./screens/Comment";
import Home from "@mui/icons-material/Home";
import LoginForm from "./screens/LoginForm";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/host_profile" element={<HostProfile />} />
        <Route path="/:id" element={<BookingDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
