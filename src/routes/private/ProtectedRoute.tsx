import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAppSelector } from "@/lib/redux/hooks";

import { RolesEnum } from "@/enum/role.enum";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, token } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  if (user && user.role && !allowedRoles.includes(user.role)) {
    // Redirect STAFF away from restricted pages like dashboard to /sales fallback
    if (user.role === RolesEnum.STAFF) {
      return <Navigate to="/sales" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
