import SidebarPage from "@/layout/sidebar/SidebarPage";
import { createBrowserRouter } from "react-router";
import { publicRoutes } from "./public";
import { privateRoutes } from "./private";
import ErrorPage from "@/pages/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SidebarPage,
    errorElement: <ErrorPage />,
    children: privateRoutes,
  },

  // public routes
  ...publicRoutes.map((route) => ({
    ...route,
    errorElement: <ErrorPage />,
  })),
]);
