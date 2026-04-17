import { useMemo, useRef, useState } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { useReactToPrint } from "react-to-print";
import { FileText, Printer, Receipt } from "lucide-react";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/table/DataTable";
import { useGetSalesQuery } from "@/lib/redux/api-services/sale.api";
import type { SaleType } from "@/lib/redux/api-services/types";
import { formatDate, formatMoney } from "../utils";
import { useNavigate } from "react-router";

export default function SalePage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading } = useGetSalesQuery({ page, limit });
  const navigate = useNavigate();

  const columns: DataTableColumn<SaleType>[] = useMemo(
    () => [
      { header: "Invoice", cell: (row) => row.invoiceNo },
      { header: "Customer", cell: (row) => row.customerName },
      { header: "Discount", cell: (row) => formatMoney(row.discount) },
      { header: "Total", cell: (row) => formatMoney(row.totalAmount) },
      {
        header: "Created",
        cell: (row) =>
          formatDate((row as SaleType & { createdAt?: string }).createdAt),
      },
    ],
    [],
  );

  const navigateToCreate = () => {
    navigate("/sales/create");
  };

  const onExportCsv = () => {
    if (!data?.result?.length) return;
    const csv = Papa.unparse(
      data.result.map((row) => ({
        Invoice: row.invoiceNo,
        Customer: row.customerName || "N/A",
        Discount: row.discount,
        Total: row.totalAmount,
        Created: (row as any).createdAt
          ? new Date((row as any).createdAt).toLocaleDateString()
          : "",
        Medicines:
          row.medicines
            ?.map((m) =>
              typeof m.medicine === "string" ? m.medicine : m.medicine?.name,
            )
            .join("; ") || "",
      })),
    );
    const blob = new Blob([csv], { type: "text/csv" });
    saveAs(blob, `sales_report_page_${page}.csv`);
  };

  // Print handler using react-to-print
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `sales_report_page_${page}`,
  });

  const onPrint = handlePrint;

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div ref={printRef}>
        <DataTable
          title="Sale list"
          description="CRUD data from /sale/all"
          columns={columns}
          rows={data?.result}
          loading={isLoading}
          getRowKey={(row) => row._id || row.invoiceNo}
          emptyMessage="No sale transactions found."
          onCreate={navigateToCreate}
          createLabel="Create new sale"
          pagination={data?.pagination}
          onPageChange={setPage}
          onExportCsv={onExportCsv}
          onPrint={onPrint}
          renderActions={(row) => (
            <div className="flex gap-2">
              <button
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-medium"
                onClick={() => navigate(`/sales/invoice/${row._id}`)}
                title="Normal Invoice"
              >
                <FileText className="w-4 h-4" /> Invoice
              </button>
              <button
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-600 rounded hover:bg-green-100 font-medium"
                onClick={() => navigate(`/sales/invoice/${row._id}?type=pos`)}
                title="POS Invoice"
              >
                <Receipt className="w-4 h-4" /> POS
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
}
