/* eslint-disable react-refresh/only-export-components */
// All components mapping with path for internal routes
import { lazy } from "react";
import Loadable from "../components/Loadable";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../containers/Layout";
import RenderedTable from "../components/utils/table/RenderedTable";
import Login from "../features/user/Login";

// const Layout = Loadable(lazy(() => import("../containers/Layout")));
const Dashboard = Loadable(lazy(() => import("../pages/protected/Dashboard")));
const Welcome = Loadable(lazy(() => import("../pages/protected/Welcome")));
const Page404 = Loadable(lazy(() => import("../pages/protected/404")));
const Blank = Loadable(lazy(() => import("../pages/protected/Blank")));
const Charts = Loadable(lazy(() => import("../pages/protected/Charts")));
const Leads = Loadable(lazy(() => import("../pages/protected/Leads")));
const Integration = Loadable(
  lazy(() => import("../pages/protected/Integration"))
);
const Calendar = Loadable(lazy(() => import("../pages/protected/Calendar")));
const Team = Loadable(lazy(() => import("../pages/protected/Team")));
const Transactions = Loadable(
  lazy(() => import("../pages/protected/Transactions"))
);
const Bills = Loadable(lazy(() => import("../pages/protected/Bills")));
const ProfileSettings = Loadable(
  lazy(() => import("../pages/protected/ProfileSettings"))
);
const GettingStarted = Loadable(lazy(() => import("../pages/GettingStarted")));
const DocFeatures = Loadable(lazy(() => import("../pages/DocFeatures")));
const DocComponents = Loadable(lazy(() => import("../pages/DocComponents")));

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Page404 />,
    children: [
      {
        path: "table",
        element: <RenderedTable />,
      },
      {
        path: "dashboard", // the url
        element: <Dashboard />, // view rendered
      },
      {
        path: "welcome", // the url
        element: <Welcome />, // view rendered
      },
      {
        path: "leads",
        element: <Leads />,
      },
      {
        path: "settings-team",
        element: <Team />,
      },
      {
        path: "calendar",
        element: <Calendar />,
      },
      {
        path: "transactions",
        element: <Transactions />,
      },
      {
        path: "settings-profile",
        element: <ProfileSettings />,
      },
      {
        path: "settings-billing",
        element: <Bills />,
      },
      {
        path: "getting-started",
        element: <GettingStarted />,
      },
      {
        path: "features",
        element: <DocFeatures />,
      },
      {
        path: "components",
        element: <DocComponents />,
      },
      {
        path: "integration",
        element: <Integration />,
      },
      {
        path: "charts",
        element: <Charts />,
      },
      {
        path: "404",
        element: <Page404 />,
      },
      {
        path: "blank",
        element: <Blank />,
      },
      {
        path: "blank",
        element: <Blank />,
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
]);

export default routes;
