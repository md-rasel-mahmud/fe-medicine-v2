import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SearchableMultiSelect } from "@/components/common/forms/SearchableMultiSelect";
import { useCreateSaleMutation } from "@/lib/redux/api-services/sale.api";
import { useGetMedicinesQuery } from "@/lib/redux/api-services/medicine.api";
import { useGetStocksQuery } from "@/lib/redux/api-services/stock.api";
import type {
  MedicineType,
  StockMedicineType,
  StockType,
} from "@/lib/redux/api-services/types";
import { formatDate, formatMoney } from "../utils";
type PosStockOption = {
  key: string;
  medicineId: string;
  medicineName: string;
  unitPrice: number;
  availableQuantity: number;
  stockAddedAt: string;
  expireDate: string;
};

type CartItem = PosStockOption & {
  saleQuantity: number;
  selectedExpireDate: string;
};

const createInvoiceNo = () => `INV-${Date.now().toString().slice(-8)}`;

const getMedicineId = (medicine: StockMedicineType["medicine"]) =>
  typeof medicine === "string" ? medicine : medicine._id || "";

const getMedicineName = (
  medicine: StockMedicineType["medicine"],
  medicineMap: Record<string, MedicineType>,
) => {
  if (typeof medicine !== "string") {
    return medicine.name;
  }

  return medicineMap[medicine]?.name || medicine;
};

const getUnitPrice = (
  medicine: StockMedicineType["medicine"],
  medicineMap: Record<string, MedicineType>,
) => {
  if (typeof medicine !== "string") {
    return medicine.price?.unitPrice || 0;
  }

  return medicineMap[medicine]?.price?.unitPrice || 0;
};

const printInvoice = ({
  invoiceNo,
  customerName,
  description,
  discount,
  subtotal,
  total,
  items,
}: {
  invoiceNo: string;
  customerName: string;
  description: string;
  discount: number;
  subtotal: number;
  total: number;
  items: CartItem[];
}) => {
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return;

  const rows = items
    .map(
      (item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${item.medicineName}</td>
        <td>${item.saleQuantity}</td>
        <td>${item.unitPrice}</td>
        <td>${item.saleQuantity * item.unitPrice}</td>
      </tr>
    `,
    )
    .join("");

  printWindow.document.write(`
    <html>
      <head>
        <title>Invoice ${invoiceNo}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background: #f7f7f7; }
          .meta { margin-bottom: 12px; }
          .totals { margin-top: 16px; text-align: right; }
        </style>
      </head>
      <body>
        <h2>Medicine POS Invoice</h2>
        <div class="meta"><strong>Invoice:</strong> ${invoiceNo}</div>
        <div class="meta"><strong>Customer:</strong> ${customerName || "Unknown Customer"}</div>
        <div class="meta"><strong>Description:</strong> ${description || "-"}</div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Medicine</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Line Total</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="totals"><strong>Subtotal:</strong> ${subtotal}</div>
        <div class="totals"><strong>Discount:</strong> ${discount}</div>
        <div class="totals"><strong>Grand Total:</strong> ${total}</div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

const SaleCreatePage = () => {
  const { data: stockData, isLoading: stockLoading } = useGetStocksQuery();
  const { data: medicineData } = useGetMedicinesQuery();
  const [createSale, createState] = useCreateSaleMutation();
  const [invoiceNo, setInvoiceNo] = useState(createInvoiceNo());
  const [customerName, setCustomerName] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState<number>(0);
  const [selectedOptionKeys, setSelectedOptionKeys] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const medicineMap = useMemo(() => {
    const list = medicineData?.result || [];
    return list.reduce<Record<string, MedicineType>>((acc, medicine) => {
      if (medicine._id) {
        acc[medicine._id] = medicine;
      }
      return acc;
    }, {});
  }, [medicineData?.result]);

  const stockOptions = useMemo<PosStockOption[]>(() => {
    const stocks = stockData?.result || [];

    return stocks.flatMap((stock: StockType) => {
      return stock.medicines
        .filter((item) => item.quantity > 0)
        .map((item) => {
          const medicineId = getMedicineId(item.medicine);
          const stockAddedAt = stock.stockAddedAt || new Date().toISOString();

          return {
            key: `${stock._id || "stock"}-${medicineId}-${stockAddedAt}`,
            medicineId,
            medicineName: getMedicineName(item.medicine, medicineMap),
            unitPrice: getUnitPrice(item.medicine, medicineMap),
            availableQuantity: item.quantity,
            stockAddedAt,
            expireDate: item.expireDate,
          };
        });
    });
  }, [stockData?.result, medicineMap]);

  const stockOptionByKey = useMemo(() => {
    return new Map(stockOptions.map((option) => [option.key, option] as const));
  }, [stockOptions]);

  const selectedChipItems = useMemo(() => cartItems.slice(0, 3), [cartItems]);
  const selectedSaleQuantity = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.saleQuantity, 0),
    [cartItems],
  );

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.saleQuantity * item.unitPrice,
        0,
      ),
    [cartItems],
  );

  const total = Math.max(subtotal - discount, 0);

  const resetPos = () => {
    setInvoiceNo(createInvoiceNo());
    setCustomerName("");
    setDescription("");
    setDiscount(0);
    setSelectedOptionKeys([]);
    setCartItems([]);
  };

  const handleStockSelectionChange = (nextKeys: string[]) => {
    setSelectedOptionKeys(nextKeys);

    setCartItems((prev) =>
      nextKeys
        .map((key) => {
          const existingItem = prev.find((item) => item.key === key);
          if (existingItem) {
            return existingItem;
          }

          const option = stockOptionByKey.get(key);
          if (!option) {
            return null;
          }

          return {
            ...option,
            saleQuantity: 1,
            selectedExpireDate: option.expireDate,
          };
        })
        .filter((item): item is CartItem => item !== null),
    );
  };

  const removeCartItem = (key: string) => {
    const next = cartItems.filter((item) => item.key !== key);
    setCartItems(next);
    setSelectedOptionKeys(next.map((item) => item.key));
  };

  const updateSaleQuantity = (key: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.key === key
          ? {
              ...item,
              saleQuantity: Math.max(
                Math.min(quantity || 1, item.availableQuantity),
                1,
              ),
            }
          : item,
      ),
    );
  };

  const updateExpireDate = (key: string, value: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.key === key
          ? { ...item, selectedExpireDate: value || item.selectedExpireDate }
          : item,
      ),
    );
  };

  const submitSale = async (withPrint: boolean) => {
    if (!invoiceNo.trim()) {
      alert("Invoice number is required.");
      return;
    }

    if (!cartItems.length) {
      alert("Please add at least one medicine to cart.");
      return;
    }

    const payload = {
      invoiceNo,
      customerName: customerName.trim() || "Unknown Customer",
      totalAmount: total,
      discount,
      description: description.trim() || "POS Sale",
      medicines: cartItems.map((item) => ({
        medicine: item.medicineId,
        saleQuantity: item.saleQuantity,
        stockAddedAt: item.stockAddedAt,
      })),
    };

    await createSale(payload).unwrap();

    if (withPrint) {
      printInvoice({
        invoiceNo,
        customerName,
        description,
        discount,
        subtotal,
        total,
        items: cartItems,
      });
    }

    resetPos();
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Sales POS</h1>
          <p className="text-muted-foreground">
            Medicine POS sale with direct stock batch selection.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">
            Live from stock batches
          </p>
          <p className="text-sm font-medium">
            {stockLoading
              ? "Loading..."
              : `${stockOptions.length} selectable items`}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create POS Sale</CardTitle>
          <CardDescription>
            Multi-select stock items; selected rows appear below for inline
            quantity and expiry adjustments.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNo">Invoice No</Label>
              <Input
                id="invoiceNo"
                value={invoiceNo}
                onChange={(event) => setInvoiceNo(event.target.value)}
                placeholder="Invoice number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Walk-in customer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount</Label>
              <Input
                id="discount"
                type="number"
                min={0}
                value={discount}
                onChange={(event) =>
                  setDiscount(Number(event.target.value) || 0)
                }
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Totals</Label>
              <div className="rounded-md border px-3 py-2 text-sm">
                <p>Subtotal: {formatMoney(subtotal)}</p>
                <p>Grand Total: {formatMoney(total)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Sale note"
              className="resize-none"
            />
          </div>

          <div className="rounded-md border p-3">
            <div className="space-y-2">
              <Label>Medicine From Stock</Label>
              <p className="text-xs text-muted-foreground">
                {selectedOptionKeys.length} item(s), total qty{" "}
                {selectedSaleQuantity}
              </p>
              <SearchableMultiSelect
                options={stockOptions}
                selectedKeys={selectedOptionKeys}
                onChange={handleStockSelectionChange}
                placeholder={
                  selectedOptionKeys.length
                    ? `${selectedOptionKeys.length} stock item(s), qty ${selectedSaleQuantity}`
                    : "Select medicine batches"
                }
                searchPlaceholder="Search stock item"
                getOptionKey={(option) => option.key}
                getOptionLabel={(option) => option.medicineName}
                getOptionSecondaryLabel={(option) =>
                  `Qty ${option.availableQuantity} | Exp ${formatDate(option.expireDate)} | Price ${option.unitPrice}`
                }
                getSearchText={(option) =>
                  [
                    option.medicineName,
                    option.expireDate,
                    option.availableQuantity,
                  ].join(" ")
                }
                emptyText="No stock item matched."
              />
              {!!cartItems.length && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedChipItems.map((item) => (
                    <span
                      key={item.key}
                      className="flex items-center gap-1 rounded-full border bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {item.medicineName}
                      <button
                        type="button"
                        onClick={() => removeCartItem(item.key)}
                        className="rounded-full p-0.5 hover:bg-background hover:text-foreground"
                        aria-label={`Remove ${item.medicineName}`}
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                  {cartItems.length > selectedChipItems.length && (
                    <span className="rounded-full border bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                      +{cartItems.length - selectedChipItems.length} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-3 py-2 text-left">Medicine</th>
                  <th className="px-3 py-2 text-left">Qty</th>
                  <th className="px-3 py-2 text-left">Unit Price</th>
                  <th className="px-3 py-2 text-left">Expire</th>
                  <th className="px-3 py-2 text-left">Total</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.length ? (
                  cartItems.map((item) => (
                    <tr key={item.key} className="border-t">
                      <td className="px-3 py-2">{item.medicineName}</td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          min={1}
                          max={item.availableQuantity}
                          value={item.saleQuantity}
                          onChange={(event) =>
                            updateSaleQuantity(
                              item.key,
                              Number(event.target.value) || 1,
                            )
                          }
                          className="h-8 w-24"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          Max {item.availableQuantity}
                        </p>
                      </td>
                      <td className="px-3 py-2">
                        {formatMoney(item.unitPrice)}
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="date"
                          value={item.selectedExpireDate?.slice(0, 10)}
                          onChange={(event) =>
                            updateExpireDate(item.key, event.target.value)
                          }
                          className="h-8 min-w-36"
                          disabled
                        />
                      </td>
                      <td className="px-3 py-2">
                        {formatMoney(item.saleQuantity * item.unitPrice)}
                      </td>
                      <td className="px-3 py-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeCartItem(item.key)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="px-3 py-6 text-center text-muted-foreground"
                      colSpan={6}
                    >
                      No medicine added to cart yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={resetPos}
              disabled={createState.isLoading}
            >
              Reset
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={createState.isLoading}
              onClick={() => void submitSale(false)}
            >
              {createState.isLoading ? "Processing..." : "Sale"}
            </Button>
            <Button
              type="button"
              disabled={createState.isLoading}
              onClick={() => void submitSale(true)}
            >
              {createState.isLoading ? "Processing..." : "Sale & Print"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaleCreatePage;
