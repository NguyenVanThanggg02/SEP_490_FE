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
import Home from "./screens/Home";
import Favorites from "./screens/Favorites";
function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/host_profile" element={<HostProfile />} />
        <Route path="/chang_pass" element={<ChangePass />} />
        <Route path="/reset-password/:id/:token" element={<ResetPass />} />
        <Route path="/forgot_pass" element={<Forgot_Pass />} />
        <Route path="/spaces/:id" element={<BookingDetails />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
