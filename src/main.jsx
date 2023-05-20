import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
// Export a loader from root.jsx
import Root, { loader as rootLoader, action as rootAction, }  from "./routes/root";
import ErrorPage from "./error-page";
import Contact, {loader as contactLoader,} from "./routes/contact";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    errorElement: <ErrorPage/>,
    // Import and set the action from the FORM on the route
    action: rootAction,
    // Configure the loader on the route
    loader: rootLoader,
    // children route, nested routes
    children: [
      {
        path: "contacts/:contactId",
        element: <Contact />,
        loader: contactLoader,
      },
    ],
  },
  
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);