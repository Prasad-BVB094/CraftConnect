import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./app/routes/AppRoutes";
import { CartProvider } from "./shared/context/CartContext";
import "./shared/styles/globals.css";

const root = createRoot(document.getElementById("root"));

root.render(
  React.createElement(
    CartProvider,
    null,
    React.createElement(RouterProvider, { router: router })
  )
);
