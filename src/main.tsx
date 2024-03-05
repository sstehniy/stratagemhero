import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { registerSW } from "virtual:pwa-register";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

if ("serviceWorker" in navigator) {
  // && !/localhost/.test(window.location) && !/lvh.me/.test(window.location)) {
  const updateSW = registerSW({
    onNeedRefresh() {
      toast(
        <>
          <h4 style={{ display: "inline" }}>An update is available!</h4>
          <br />
          <br />
          <a className="do-sw-update">Click to update and reload</a>
        </>,
        {
          onClick: () => {
            updateSW(true);
          },
          autoClose: false,
        },
      );
    },
    onOfflineReady() {
      toast(
        <>
          <h4 style={{ display: "inline" }}>
            You can now use the app offline!
          </h4>
        </>,
        {
          autoClose: 5000,
          closeButton: false,
        },
      );
    },
    immediate: true,
  });
}
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <ToastContainer
      position="top-left"
      hideProgressBar
      newestOnTop
      closeOnClick
      toastStyle={{
        background: "var(--yellow)",
        color: "var(--dark)",
      }}
    />
  </React.StrictMode>,
);
