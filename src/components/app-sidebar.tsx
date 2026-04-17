"use client";

import * as React from "react";
import {
  Boxes,
  Package,
  Pill,
  ReceiptText,
  Truck,
  TrendingUp,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { SidebarTopInfo } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { menuitems } from "@/components/constants/menu";
import { useAppSelector } from "@/lib/redux/hooks";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAppSelector((state) => state.auth.user);

  const navItems = menuitems.length
    ? menuitems.filter((item) =>
        user?.role ? item.roles?.includes(user.role) : false
      )
    : [
        { title: "Dashboard", url: "/", icon: TrendingUp, isActive: true },
        { title: "Units", url: "/units", icon: Boxes },
        { title: "Medicines", url: "/medicines", icon: Pill },
        { title: "Suppliers", url: "/suppliers", icon: Truck },
        { title: "Stocks", url: "/stocks", icon: Package },
        { title: "Purchases", url: "/purchases", icon: ReceiptText },
        { title: "Sales", url: "/sales", icon: TrendingUp },
        { title: "Users", url: "/users", icon: Users },
      ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarTopInfo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name || "Signed in user",
            email: user?.email || "user@example.com",
            avatar: "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
