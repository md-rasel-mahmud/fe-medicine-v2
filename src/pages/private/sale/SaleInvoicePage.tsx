/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate, useLocation } from "react-router";
import { useGetSaleByIdQuery } from "@/lib/redux/api-services/sale.api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PrintButton } from "@/components/PrintButton";
import { formatDate, formatMoney } from "../utils";
import type { MedicineType } from "@/lib/redux/api-services/types";
import { useGetMedicinesByIdsQuery } from "@/lib/redux/api-services/medicine.api";
import { arrayToObjectById } from "@/lib/utils";

export default function SaleInvoicePage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isPos = searchParams.get("type") === "pos";

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetSaleByIdQuery(id || "", {
    skip: !id,
  });

  const { data: medicinesData } = useGetMedicinesByIdsQuery(
    data?.result?.medicines?.map((item) => item?.medicine) as string[],
    { skip: !data?.result },
  );

  const medicinesMap = arrayToObjectById(medicinesData?.result || [], "_id", [
    "name",
    "price",
  ]) as Record<string, MedicineType>;

  if (isLoading) {
    return <div className="p-8 text-center">Loading invoice...</div>;
  }

  if (isError || !data?.result) {
    return (
      <div className="p-8 text-center text-red-500">
        Invoice not found or failed to load.
      </div>
    );
  }

  const sale = data.result;

  return (
    <div className="min-h-screen py-8">
      {/* Non-printable controls */}
      <div className="max-w-4xl mx-auto mb-4 flex justify-between print:hidden px-4 md:px-0">
        <Button variant="outline" onClick={() => navigate("/sales")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sales
        </Button>
      </div>
      {isPos ? (
        // POS Invoice
        <PrintButton
          printTitle={`Sale Invoice #${sale.invoiceNo}`}
          buttonLabel="Print POS Invoice"
        >
          <div className="w-85 mx-auto bg-white p-4 shadow-sm rounded-md print:shadow-none print:p-0 text-xs font-mono">
            <div className="text-center border-b pb-2 mb-2">
              <h1 className="text-lg font-bold tracking-tight text-gray-900">
                POS INVOICE
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Invoice No: {sale.invoiceNo}
              </p>
            </div>
            <div className="flex justify-between mb-2">
              <div>
                <span className="font-semibold">Customer:</span>{" "}
                {sale.customerName || "Walk-in Customer"}
              </div>
              <div className="text-right">
                <span className="font-semibold">Date:</span>{" "}
                {formatDate(
                  (sale as any).createdAt || new Date().toISOString(),
                )}
              </div>
            </div>
            <table className="w-full text-left border-collapse mb-2">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-1 px-1 text-xs font-semibold text-gray-700">
                    Medicine
                  </th>
                  <th className="py-1 px-1 text-right text-xs font-semibold text-gray-700">
                    Qty
                  </th>
                  <th className="py-1 px-1 text-right text-xs font-semibold text-gray-700">
                    Rate
                  </th>
                  <th className="py-1 px-1 text-right text-xs font-semibold text-gray-700">
                    Amt
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sale.medicines?.map((item, idx) => {
                  const med = medicinesMap?.[item?.medicine as string];
                  const price = med?.price?.unitPrice || 0;
                  const total = item.saleQuantity * price;
                  return (
                    <tr key={idx}>
                      <td className="py-1 px-1 text-xs text-gray-800">
                        {med?.name}
                      </td>
                      <td className="py-1 px-1 text-xs text-gray-800 text-right">
                        {item.saleQuantity}
                      </td>
                      <td className="py-1 px-1 text-xs text-gray-800 text-right">
                        {formatMoney(price)}
                      </td>
                      <td className="py-1 px-1 text-xs text-gray-800 text-right">
                        {formatMoney(total)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex justify-between py-1 border-t mt-2">
              <span className="font-bold">Subtotal:</span>
              <span>
                {formatMoney(sale.totalAmount + (sale.discount || 0))}
              </span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between py-1">
                <span className="font-bold">Discount:</span>
                <span className="text-red-600">
                  -{formatMoney(sale.discount)}
                </span>
              </div>
            )}
            <div className="flex justify-between py-2 border-t-2 border-gray-200 mt-2">
              <span className="font-bold text-base">Total:</span>
              <span className="font-bold text-base">
                {formatMoney(sale.totalAmount)}
              </span>
            </div>
            {sale.description && (
              <div className="mt-2 border-t pt-2 text-xs text-gray-500">
                <strong>Note:</strong> {sale.description}
              </div>
            )}
            <div className="text-center mt-2 text-xs text-gray-400">
              Thank you for your purchase!
            </div>
          </div>
        </PrintButton>
      ) : (
        // Normal Invoice
        <PrintButton
          printTitle={`Sale Invoice #${sale.invoiceNo}`}
          buttonLabel="Print Invoice"
        >
          <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-sm rounded-md print:shadow-none print:p-0">
            <div className="flex justify-between items-start border-b pb-6 mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  INVOICE
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Invoice No: {sale.invoiceNo}
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-semibold text-gray-800">
                  Pharmacy Name
                </h2>
                <p className="text-sm text-gray-500">123 Pharmacy St, City</p>
                <p className="text-sm text-gray-500">Phone: 123-456-7890</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">
                  Billed To:
                </h3>
                <p className="text-base font-medium text-gray-800">
                  {sale.customerName || "Walk-in Customer"}
                </p>
              </div>
              <div className="text-right">
                <h3 className="text-sm font-semibold text-gray-500 mb-1">
                  Date of Issue:
                </h3>
                <p className="text-base font-medium text-gray-800">
                  {formatDate(
                    (sale as any).createdAt || new Date().toISOString(),
                  )}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto mb-8">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-3 px-2 text-sm font-semibold text-gray-700">
                      Medicine
                    </th>
                    <th className="py-3 px-2 text-right text-sm font-semibold text-gray-700">
                      Quantity
                    </th>
                    <th className="py-3 px-2 text-right text-sm font-semibold text-gray-700">
                      Unit Price
                    </th>
                    <th className="py-3 px-2 text-right text-sm font-semibold text-gray-700">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sale.medicines?.map((item, idx) => {
                    const med = medicinesMap?.[item?.medicine as string];
                    const price = med?.price?.unitPrice || 0;
                    const total = item.saleQuantity * price;
                    return (
                      <tr key={idx}>
                        <td className="py-3 px-2 text-sm text-gray-800">
                          {med?.name}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-800 text-right">
                          {item.saleQuantity}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-800 text-right">
                          {formatMoney(price)}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-800 text-right">
                          {formatMoney(total)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end border-t pt-6">
              <div className="w-1/2 md:w-1/3">
                <div className="flex justify-between py-2">
                  <span className="text-sm font-medium text-gray-600">
                    Subtotal:
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatMoney(sale.totalAmount + (sale.discount || 0))}
                  </span>
                </div>
                {sale.discount > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-sm font-medium text-gray-600">
                      Discount:
                    </span>
                    <span className="text-sm font-medium text-red-600">
                      -{formatMoney(sale.discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-3 border-t-2 border-gray-200 mt-2">
                  <span className="text-lg font-bold text-gray-900">
                    Total:
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatMoney(sale.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {sale.description && (
              <div className="mt-8 border-t pt-6 text-sm text-gray-500">
                <strong>Note:</strong> {sale.description}
              </div>
            )}
          </div>
        </PrintButton>
      )}
    </div>
  );
}
