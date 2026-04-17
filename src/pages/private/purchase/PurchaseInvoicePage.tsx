import { useParams, useNavigate } from "react-router";
import { useGetPurchaseByIdQuery } from "@/lib/redux/api-services/purchase.api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PrintButton } from "@/components/PrintButton";
import { formatDate, formatMoney } from "../utils";
import type { MedicineType } from "@/lib/redux/api-services/types";
import { useGetMedicinesByIdsQuery } from "@/lib/redux/api-services/medicine.api";
import { arrayToObjectById } from "@/lib/utils";
import { useGetSupplierByIdQuery } from "@/lib/redux/api-services/supplier.api";

export default function PurchaseInvoicePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetPurchaseByIdQuery(id || "", {
    skip: !id,
  });

  const { data: medicinesData } = useGetMedicinesByIdsQuery(
    data?.result?.stocks?.map((item) => item?.medicine) as string[],
    { skip: !data?.result },
  );

  const { data: suppliersData } = useGetSupplierByIdQuery(
    (typeof data?.result?.supplier === "string"
      ? data?.result?.supplier
      : data?.result?.supplier?._id) || "",
    {
      skip: !data?.result,
    },
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

  const purchase = data.result;

  return (
    <div className=" min-h-screen py-8">
      {/* Non-printable controls */}
      <div className="max-w-4xl mx-auto mb-4 flex justify-between print:hidden px-4 md:px-0">
        <Button variant="outline" onClick={() => navigate("/purchases")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Purchases
        </Button>
      </div>

      {/* Invoice Document with PrintButton */}
      <PrintButton
        printTitle={`Purchase Invoice #${purchase.purchaseNo}`}
        buttonLabel="Print Invoice"
      >
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-sm rounded-md print:shadow-none print:p-0">
          <div className="flex justify-between items-start border-b pb-6 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                PURCHASE INVOICE
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Purchase No: {purchase.purchaseNo}
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
                Supplier:
              </h3>
              <p className="text-base font-medium text-gray-800">
                {suppliersData?.result?.name || "Unknown Supplier"}
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-sm font-semibold text-gray-500 mb-1">
                Date of Purchase:
              </h3>
              <p className="text-base font-medium text-gray-800">
                {formatDate(purchase.purchaseDate)}
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
                    Expire Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {purchase.stocks?.map((item, idx) => {
                  const med = medicinesMap?.[item?.medicine as string];
                  const price = med?.price?.unitPrice || 0;

                  return (
                    <tr key={idx}>
                      <td className="py-3 px-2 text-sm text-gray-800">
                        {med?.name}
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-800 text-right">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-800 text-right">
                        {formatMoney(price)}
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-800 text-right">
                        {formatDate(item.expireDate)}
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
                  Shipping:
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {formatMoney(purchase.shippingCost)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm font-medium text-gray-600">
                  Discount:
                </span>
                <span className="text-sm font-medium text-red-600">
                  -{formatMoney(purchase.globalDiscount)}
                </span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-gray-200 mt-2">
                <span className="text-lg font-bold text-gray-900">Total:</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatMoney(purchase.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {purchase.description && (
            <div className="mt-8 border-t pt-6 text-sm text-gray-500">
              <strong>Note:</strong> {purchase.description}
            </div>
          )}
        </div>
      </PrintButton>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          .max-w-4xl, .max-w-4xl * {
            visibility: visible;
          }
          .max-w-4xl {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
