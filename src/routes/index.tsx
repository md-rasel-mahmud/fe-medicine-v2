import SidebarPage from "@/layout/sidebar/SidebarPage";
import { createBrowserRouter } from "react-router";
import { publicRoutes } from "./public";
import { privateRoutes } from "./private";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SidebarPage,
    children: privateRoutes,
  },

  // public routes
  ...publicRoutes,
]);
