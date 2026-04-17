import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDashboardQuery } from "@/lib/redux/api-services/dashboard.api";
import { formatMoney } from "../utils";

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isFetching, error } = useGetDashboardQuery("daily");
  const result = data?.result;

  const stats = [
    {
      title: "Medicines",
      value: String(result?.totalMedicines ?? 0),
      description: "Total active medicine records",
    },
    {
      title: "Sales",
      value: String(result?.totalSaleToCustomer ?? 0),
      description: "Total sales transactions",
    },
    {
      title: "Purchases",
      value: String(result?.totalPurchaseFromSupplier ?? 0),
      description: "Total supplier purchases",
    },
    {
      title: "Stock Value",
      value: formatMoney(result?.totalStock?.total ?? 0),
      description: "Quantity aggregated from stock",
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Live overview from the backend analytics endpoint.
        </p>
      </div>

      {error ? (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle>Dashboard unavailable</CardTitle>
            <CardDescription>
              The backend did not return dashboard data. Check auth and server
              logs.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isLoading || isFetching
          ? Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-36 rounded-xl" />
            ))
          : stats.map((item) => (
              <StatCard
                key={item.title}
                title={item.title}
                value={item.value}
                description={item.description}
              />
            ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Activity Snapshot</CardTitle>
            <CardDescription>
              Sales, purchase, and stock report returned by the API.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Sales</p>
              <p className="text-2xl font-semibold">
                {formatMoney(result?.report?.sale?.total ?? 0)}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Purchases</p>
              <p className="text-2xl font-semibold">
                {formatMoney(result?.report?.purchase?.total ?? 0)}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Stock Amount</p>
              <p className="text-2xl font-semibold">
                {formatMoney(result?.report?.stockAmount?.total ?? 0)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Total users in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border p-4">
              <p className="text-4xl font-semibold">{result?.totalUser ?? 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
