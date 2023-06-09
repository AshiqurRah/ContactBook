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
import Contact, {loader as contactLoader, action as contactAction,} from "./routes/contact";
import EditContact, {action as editAction} from "./routes/edit";
import { action as destroyAction } from "./routes/destroy";
import Index from "./routes/index";


const router = createBrowserRouter([
  {
    path: "/ContactBook/",
    element: <Root/>,
    errorElement: <ErrorPage/>,
    // Import and set the action from the FORM on the route
    action: rootAction,
    // Configure the loader on the route
    loader: rootLoader,
    // children route, nested routes
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Index /> },
          {
            path: "/ContactBook/contacts/:contactId",
            element: <Contact />,
            loader: contactLoader,
            action: contactAction,
          },
          {
            path: "/ContactBook/contacts/:contactId/edit",
            element: <EditContact />,
            loader: contactLoader,
            action: editAction,
          },
          {
            path: "/ContactBook/contacts/:contactId/destroy",
            action: destroyAction,
            errorElement: <div>Oops! There was an error.</div>,
          },
        ],
      },
    ],
  },
  
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
