import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Screens and Components
import {
  Home,
  LoginForm,
  RegisterForm,
  UserNeedsForm,
  HostProfile,
  ChangePass,
  ResetPass,
  Forgot_Pass,
  Message,
  SpaceDetails,
  NotFound,
  Favorites,
  Compare,
  Landing,
  ListSpace,
  Addfuns,
} from "./screens";
import {
  AddSpaceCategories,
  AddSpaceLocation,
  AddSpaceInforSpace,
  AllAdd as AddSpaceFlow,
} from "./screens/AddSpaces";
import { ChangePassAdmin, DetailForAdmin, DashBoard } from "./Admin";

function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const role = localStorage.getItem("role");

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
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
          <Route path="/list_space" element={<ListSpace />} />
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
          <Route path="/alladd" element={<AddSpaceFlow />} />
          <Route path="/addfunds" element={<Addfuns />} />
          <Route
            path="/admin"
            element={role === "1" ? <DashBoard /> : <Navigate to="/notfound" />}
          />
        </Routes>
      </main>
      <Footer />
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
