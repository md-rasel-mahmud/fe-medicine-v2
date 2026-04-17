import type { RouteObject } from "react-router";

import DashboardPage from "@/pages/private/dashboard/DashboardPage";
import MedicinePage from "@/pages/private/medicine/MedicinePage";
import PurchasePage from "@/pages/private/purchase/PurchasePage";
import SalePage from "@/pages/private/sale/SalePage";
import StockPage from "@/pages/private/stock/StockPage";
import SupplierPage from "@/pages/private/supplier/SupplierPage";
import UnitPage from "@/pages/private/unit/UnitPage";
import UserPage from "@/pages/private/user/UserPage";

import { RolesEnum } from "@/enum/role.enum";
import { ProtectedRoute } from "./ProtectedRoute";
import PurchaseCreatePage from "@/pages/private/purchase/PurchaseCreatePage";
import SaleCreatePage from "@/pages/private/sale/SaleCreatePage";

import SaleInvoicePage from "@/pages/private/sale/SaleInvoicePage";
import PurchaseInvoicePage from "@/pages/private/purchase/PurchaseInvoicePage";

export const privateRoutes: RouteObject[] = [
  {
    index: true,
    element: (
      <ProtectedRoute allowedRoles={[RolesEnum.ADMIN]}>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "dashboard",
    element: (
      <ProtectedRoute allowedRoles={[RolesEnum.ADMIN]}>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "medicines",
    element: (
      <ProtectedRoute allowedRoles={[RolesEnum.ADMIN, RolesEnum.STAFF]}>
        <MedicinePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "units",
    element: (
      <ProtectedRoute allowedRoles={[RolesEnum.ADMIN, RolesEnum.STAFF]}>
        <UnitPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "suppliers",
    element: (
      <ProtectedRoute allowedRoles={[RolesEnum.ADMIN, RolesEnum.STAFF]}>
        <SupplierPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "stocks",
    element: (
      <ProtectedRoute allowedRoles={[RolesEnum.ADMIN, RolesEnum.STAFF]}>
        <StockPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "purchases",
    element: (
      <ProtectedRoute allowedRoles={[RolesEnum.ADMIN]}>
        <PurchasePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "purchases/create",
    element: (
      <ProtectedRoute allowedRoles={[RolesEnum.ADMIN]}>
        <PurchaseCreatePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "sales",
    element: (
      <ProtectedRoute allowedRoles={[RolesEnum.ADMIN, RolesEnum.STAFF]}>
        <SalePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "sales/create",
    element: (
      <ProtectedRoute allowedRoles={[RolesEnum.ADMIN, RolesEnum.STAFF]}>
        <SaleCreatePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "sales/invoice/:id",
    element: (
      <ProtectedRoute allowedRoles={[RolesEnum.ADMIN, RolesEnum.STAFF]}>
        <SaleInvoicePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "purchases/invoice/:id",
    element: (
      <ProtectedRoute allowedRoles={[RolesEnum.ADMIN]}>
        <PurchaseInvoicePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "users",
    element: (
      <ProtectedRoute allowedRoles={[RolesEnum.ADMIN]}>
        <UserPage />
      </ProtectedRoute>
    ),
  },
];
