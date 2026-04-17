import { useState, useMemo } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/table/DataTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteStockMutation } from "@/lib/redux/api-services/stock.api";
import { useGetStocksQuery } from "@/lib/redux/api-services/stock.api";
import { formatDate } from "../utils";

type FlattenedStockRow = {
  id: string;
  stockDate: string;
  medicineName: string;
  quantity: number;
  expireDate: string;
};

export default function StockPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading } = useGetStocksQuery({ page, limit });
  const [deleteStock] = useDeleteStockMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (deletingId) {
      // Find the stock _id from the row id
      const stockId = deletingId.split("-")[0];
      if (stockId && stockId !== "stock") {
        await deleteStock(stockId).unwrap();
      }
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const rows = useMemo<FlattenedStockRow[]>(() => {
    const stocks = data?.result || [];

    return stocks.flatMap((stock) => {
      return (stock.medicines || []).map((item, index) => {
        const medicineName =
          typeof item.medicine === "string"
            ? item.medicine
            : item.medicine?.name || "Unknown";

        return {
          id: `${stock._id || "stock"}-${index}`,
          stockDate: stock.stockAddedAt || "",
          medicineName,
          quantity: item.quantity || 0,
          expireDate: item.expireDate,
        };
      });
    });
  }, [data?.result]);

  const totalQuantity = useMemo(
    () => rows.reduce((sum, row) => sum + row.quantity, 0),
    [rows],
  );

  const columns: DataTableColumn<FlattenedStockRow>[] = useMemo(
    () => [
      { header: "Stock Date", cell: (row) => formatDate(row.stockDate) },
      { header: "Medicine", cell: (row) => row.medicineName },
      {
        header: "Quantity",
        cell: (row) => String(row.quantity),
      },
      { header: "Expire Date", cell: (row) => formatDate(row.expireDate) },
    ],
    [],
  );

  const onExportCsv = () => {
    if (!rows?.length) return;
    const csv = Papa.unparse(
      rows.map((row) => ({
        "Stock Date": formatDate(row.stockDate),
        Medicine: row.medicineName.replace(/,/g, ""),
        Quantity: row.quantity,
        "Expire Date": formatDate(row.expireDate),
      })),
    );
    const blob = new Blob([csv], { type: "text/csv" });
    saveAs(blob, `stock_report_page_${page}.csv`);
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-semibold">Stocks</h1>
        <p className="text-muted-foreground">
          Stock is auto-generated from purchases. Every row is a medicine batch
          so you can easily see quantity and expiry.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Batches: {rows.length} | Total Quantity: {totalQuantity}
        </p>
      </div>
      <div>
        <DataTable
          title="Stock list"
          description="Medicine-wise stock view"
          columns={columns}
          rows={rows}
          loading={isLoading}
          getRowKey={(row) => row.id}
          emptyMessage="No stock records found yet. Create a purchase to add stock."
          pagination={data?.pagination}
          onPageChange={setPage}
          onExportCsv={onExportCsv}
        />
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Stock</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete this stock entry?</div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete} autoFocus>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
