import { useMemo, useState } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { FileText } from "lucide-react";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/table/DataTable";
import { useGetPurchasesQuery } from "@/lib/redux/api-services/purchase.api";
import type { PurchaseType } from "@/lib/redux/api-services/types";
import { formatDate, formatMoney } from "../utils";
import { useNavigate } from "react-router";

export default function PurchasePage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading } = useGetPurchasesQuery({ page, limit });
  const navigate = useNavigate();

  const columns: DataTableColumn<PurchaseType>[] = useMemo(
    () => [
      { header: "Date", cell: (row) => formatDate(row.purchaseDate) },
      { header: "No", cell: (row) => row.purchaseNo },
      {
        header: "Supplier",
        cell: (row) =>
          typeof row.supplier === "string" ? row.supplier : row.supplier.name,
      },
      { header: "Shipping", cell: (row) => formatMoney(row.shippingCost) },
      { header: "Discount", cell: (row) => formatMoney(row.globalDiscount) },
      { header: "Total", cell: (row) => formatMoney(row.totalAmount) },
    ],
    [],
  );

  const navigateToCreate = () => {
    navigate("/purchases/create");
  };

  const onExportCsv = () => {
    if (!data?.result?.length) return;
    const csv = Papa.unparse(
      data.result.map((row) => ({
        Date: formatDate(row.purchaseDate),
        No: row.purchaseNo,
        Supplier:
          typeof row.supplier === "string"
            ? row.supplier
            : row.supplier?.name || "N/A",
        Shipping: row.shippingCost,
        Discount: row.globalDiscount,
        Total: row.totalAmount,
      })),
    );
    const blob = new Blob([csv], { type: "text/csv" });
    saveAs(blob, `purchase_report_page_${page}.csv`);
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div>
        <DataTable
          title="Purchase list"
          description="Purchase history from /purchase/all"
          columns={columns}
          rows={data?.result}
          loading={isLoading}
          getRowKey={(row) => row._id || row.purchaseNo}
          emptyMessage="No purchases have been created yet."
          onCreate={navigateToCreate}
          createLabel="Create new purchase"
          pagination={data?.pagination}
          onPageChange={setPage}
          onExportCsv={onExportCsv}
          renderActions={(row) => (
            <button
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-medium"
              onClick={() => navigate(`/purchases/invoice/${row._id}`)}
              title="View Invoice"
            >
              <FileText className="w-4 h-4" /> Invoice
            </button>
          )}
        />
      </div>
    </div>
  );
}
