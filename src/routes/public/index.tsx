import FormPage from "@/pages/private/form/FormPage";
import SignInPage from "@/pages/public/auth/SignInPage";
import SignUpPage from "@/pages/public/auth/SignUpPage";
import type { RouteObject } from "react-router";

export const publicRoutes: RouteObject[] = [
  {
    path: "/auth/sign-in",
    Component: SignInPage,
  },
  {
    path: "/auth/sign-up",
    Component: SignUpPage,
  },
  {
    path: "/forms",
    Component: FormPage,
  },
];
