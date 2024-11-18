import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import "@radix-ui/themes/styles.css";

import "@fortawesome/fontawesome-free/css/all.min.css";
import { SpaceProvider } from "./Context/SpaceContext ";
import { Provider } from "react-redux";
import store from "./store/store.js";
import "react-toastify/dist/ReactToastify.css";
import { SocketProvider } from './Context/SocketContext.js';
import { UserProvider } from './Context/UserContext.js';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <ThemeProvider
        theme={createTheme({
          palette: {
            primary: {
              main: '#0f5a4f', // Set the primary color to #0f5a4f
            },
          },
        })}
      >
        <SocketProvider>
          <UserProvider>
            <SpaceProvider>
              <App />
            </SpaceProvider>
          </UserProvider>
        </SocketProvider>
      </ThemeProvider>
    </React.StrictMode>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
