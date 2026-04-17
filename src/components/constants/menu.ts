import {
  Boxes,
  Package,
  Pill,
  ReceiptText,
  Shield,
  Truck,
  Users,
} from "lucide-react";

import { RolesEnum } from "@/enum/role.enum";

export const menuitems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Shield,
    isActive: true,
    roles: [RolesEnum.ADMIN],
  },
  {
    title: "Medicines",
    url: "/medicines",
    icon: Pill,
    roles: [RolesEnum.ADMIN, RolesEnum.STAFF],
  },
  {
    title: "Units",
    url: "/units",
    icon: Boxes,
    roles: [RolesEnum.ADMIN, RolesEnum.STAFF],
  },
  {
    title: "Suppliers",
    url: "/suppliers",
    icon: Truck,
    roles: [RolesEnum.ADMIN, RolesEnum.STAFF],
  },
  {
    title: "Stocks",
    url: "/stocks",
    icon: Package,
    roles: [RolesEnum.ADMIN, RolesEnum.STAFF],
  },
  {
    title: "Purchases",
    url: "/purchases",
    icon: ReceiptText,
    roles: [RolesEnum.ADMIN],
  },
  {
    title: "Sales",
    url: "/sales",
    icon: ReceiptText,
    roles: [RolesEnum.ADMIN, RolesEnum.STAFF],
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
    roles: [RolesEnum.ADMIN],
  },
];
