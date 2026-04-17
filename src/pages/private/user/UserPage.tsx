import { useMemo } from "react";

import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/table/DataTable";
import { Button } from "@/components/ui/button";
import {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useApproveUserMutation,
} from "@/lib/redux/api-services/user.api";
import type { UserType } from "@/lib/redux/api-services/auth/user.type";
import { useAppSelector } from "@/lib/redux/hooks";
import { RolesEnum } from "@/enum/role.enum";
import { Badge } from "@/components/ui/badge";

export default function UserPage() {
  const { data, isLoading } = useGetUsersQuery();
  const [updateUserRole, updateState] = useUpdateUserRoleMutation();
  const [approveUser, approveState] = useApproveUserMutation();
  const currentUser = useAppSelector((state) => state.auth.user);

  const columns: DataTableColumn<UserType>[] = useMemo(
    () => [
      { header: "Name", cell: (row) => row.name },
      { header: "Phone", cell: (row) => row.phone },
      { header: "Email", cell: (row) => row.email || "-" },
      { header: "Address", cell: (row) => row.address || "-" },
      {
        header: "Role",
        cell: (row) => {
          return (
            <Badge
              variant={row.role === RolesEnum.ADMIN ? "default" : "outline"}
            >
              {row.role === RolesEnum.ADMIN ? "Admin" : "Staff"}
            </Badge>
          );
        },
      },
      {
        header: "Status",
        cell: (row) =>
          row.approved ? (
            <Badge className="bg-green-500 text-white">Approved</Badge>
          ) : (
            <Badge variant="destructive">Pending</Badge>
          ),
      },
    ],
    [],
  );

  const rows = data?.result || [];

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-semibold">Users</h1>
        <p className="text-muted-foreground">
          Review users and toggle their role.
        </p>
      </div>

      <DataTable
        title="User list"
        description="Admin-only user management from /user/all"
        columns={columns}
        rows={rows}
        loading={isLoading}
        getRowKey={(row) => row._id || row.phone}
        emptyMessage="No users found."
        renderActions={(row) => {
          const isCurrentUser = row._id === currentUser?._id;
          return (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={row.role === RolesEnum.ADMIN ? "secondary" : "outline"}
                disabled={updateState.isLoading || isCurrentUser}
                onClick={() =>
                  void updateUserRole({
                    id: row._id || "",
                    role:
                      row.role === RolesEnum.ADMIN
                        ? RolesEnum.STAFF
                        : RolesEnum.ADMIN,
                  })
                }
              >
                {isCurrentUser
                  ? "You (Admin)"
                  : row.role === RolesEnum.ADMIN
                    ? "Make staff"
                    : "Make admin"}
              </Button>
              {!row.approved && (
                <Button
                  size="sm"
                  className="bg-green-500 text-white hover:bg-green-600"
                  disabled={approveState.isLoading}
                  onClick={() => approveUser({ id: row._id || "" })}
                >
                  Approve
                </Button>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
