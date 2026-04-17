import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Plus, FileText, Printer } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { useReactToPrint } from "react-to-print";

export type DataTableColumn<T> = {
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
};

export type DataTableProps<T> = {
  title?: string;
  description?: string;
  columns: DataTableColumn<T>[];
  rows?: T[];
  loading?: boolean;
  emptyMessage?: string;
  getRowKey: (row: T, index: number) => string;
  renderActions?: (row: T) => ReactNode;
  onCreate?: () => void;
  createLabel?: string;
};

function TableSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-14 w-full" />
      ))}
    </div>
  );
}

export function DataTable<T>({
  title,
  description,
  columns,
  rows = [],
  loading = false,
  emptyMessage = "No records found.",
  getRowKey,
  renderActions,
  onCreate,
  createLabel = "Create new",
  pagination,
  onPageChange,
  onExportCsv,
  hasPrint = true,
}: DataTableProps<T> & {
  pagination?: { currentPage: number; totalPages: number; totalData: number };
  onPageChange?: (page: number) => void;
  onExportCsv?: () => void;
  hasPrint?: boolean;
}) {
  // Print handler using react-to-print
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `stock_report_page_${pagination?.currentPage || 1}`,
  });
  const onPrint = handlePrint;

  return (
    <div>
      <Card className="border-border/60 shadow-sm print:shadow-none print:border-none">
        {(title || description || onCreate || onExportCsv || hasPrint) && (
          <div className="flex flex-col gap-4 border-b px-6 py-5 sm:flex-row sm:items-center sm:justify-between print:hidden">
            <div className="space-y-1">
              {title && <h2 className="text-xl font-semibold">{title}</h2>}
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {onExportCsv && (
                <Button variant="outline" onClick={onExportCsv} size="sm">
                  <FileText className="w-4 h-4 mr-1" /> CSV Export
                </Button>
              )}
              {hasPrint && (
                <Button variant="outline" onClick={onPrint} size="sm">
                  <Printer className="w-4 h-4 mr-1" /> Print
                </Button>
              )}
              {onCreate && (
                <Button
                  onClick={onCreate}
                  className="w-full sm:w-auto"
                  size="sm"
                >
                  <Plus className="mr-1 h-4 w-4" /> {createLabel}
                </Button>
              )}
            </div>
          </div>
        )}

        <CardContent className="p-0 print:p-0">
          {loading ? (
            <div className="p-6 print:hidden">
              <TableSkeleton />
            </div>
          ) : rows.length ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-left text-muted-foreground print:bg-transparent print:border-b-2 print:border-black">
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        className={cn(
                          "px-4 py-3 font-medium",
                          column.className,
                        )}
                      >
                        {column.header}
                      </th>
                    ))}
                    {renderActions && (
                      <th className="px-4 py-3 font-medium print:hidden">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr
                      key={getRowKey(row, index)}
                      className="border-b last:border-0 print:border-b print:border-gray-200"
                    >
                      {columns.map((column, columnIndex) => (
                        <td
                          key={columnIndex}
                          className={cn(
                            "px-4 py-4 align-top",
                            column.className,
                          )}
                        >
                          {column.cell(row)}
                        </td>
                      ))}
                      {renderActions && (
                        <td className="px-4 py-4 align-top print:hidden">
                          {renderActions(row)}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8 text-center print:hidden">
              <p className="text-lg font-medium">{emptyMessage}</p>
              <p className="max-w-md text-sm text-muted-foreground">
                Start by creating your first record from the action button
                above.
              </p>
            </div>
          )}

          {/* Server Pagination */}
          {pagination && pagination.totalPages > 1 && onPageChange && (
            <div className="flex items-center justify-between border-t px-6 py-4 print:hidden">
              <p className="text-sm text-muted-foreground">
                Total {pagination.totalData} records
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.currentPage <= 1}
                  onClick={() => onPageChange(pagination.currentPage - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm font-medium">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.currentPage >= pagination.totalPages}
                  onClick={() => onPageChange(pagination.currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* print view  */}
      <div ref={printRef} className="hidden print:block">
        <h1 className="mb-4 text-2xl font-bold text-center">
          {title || "Data Table"}
        </h1>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-transparent text-left text-muted-foreground">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={cn("px-4 py-3 font-medium", column.className)}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={getRowKey(row, index)}
                className="border-b last:border-0 print:border-b print:border-gray-200"
              >
                {columns.map((column, columnIndex) => (
                  <td
                    key={columnIndex}
                    className={cn("px-4 py-4 align-top", column.className)}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Server Pagination */}
        {pagination && pagination.totalPages > 1 && onPageChange && (
          <div className="flex items-center justify-between border-t px-6 py-4 print:hidden">
            <p className="text-sm text-muted-foreground">
              Total {pagination.totalData} records
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage <= 1}
                onClick={() => onPageChange(pagination.currentPage - 1)}
              >
                Previous
              </Button>
              <span className="text-sm font-medium">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage >= pagination.totalPages}
                onClick={() => onPageChange(pagination.currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
