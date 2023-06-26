import React, { lazy, Suspense } from "react";
import App from "./App";
import { createBrowserRouter, Navigate, Route } from "react-router-dom";
// import Contacts from './views/contacts/Contacts';

const Favorites = lazy(() => import("./views/favorites/Favorites"));
const Contacts = lazy(() => import("./views/contacts/Contacts"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        path: "/",
        element: <Navigate to="/contacts" replace={true} />
      }, 
      {
        path: "contacts",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Contacts />
          </Suspense>
        ),
      },
      {
        path: "favorites",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Favorites />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
