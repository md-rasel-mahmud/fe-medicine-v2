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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SearchableMultiSelect } from "@/components/common/forms/SearchableMultiSelect";
import { useGetMedicinesQuery } from "@/lib/redux/api-services/medicine.api";
import { useCreatePurchaseMutation } from "@/lib/redux/api-services/purchase.api";
import { useGetSuppliersQuery } from "@/lib/redux/api-services/supplier.api";
import type {
  MedicineType,
  SupplierType,
} from "@/lib/redux/api-services/types";
import { formatMoney } from "../utils";

type PurchaseCartItem = {
  key: string;
  medicineId: string;
  medicineName: string;
  unitPrice: number;
  quantity: number;
  expireDate: string;
};

const createPurchaseNo = () => `PUR-${Date.now().toString().slice(-8)}`;

const getDefaultExpireDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().slice(0, 10);
};

const PurchaseCreatePage = () => {
  const { data: medicineData, isLoading: medicineLoading } =
    useGetMedicinesQuery();
  const { data: supplierData, isLoading: supplierLoading } =
    useGetSuppliersQuery();
  const [createPurchase, createState] = useCreatePurchaseMutation();

  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [purchaseNo, setPurchaseNo] = useState(createPurchaseNo());
  const [supplier, setSupplier] = useState("");
  const [description, setDescription] = useState("");
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [globalDiscount, setGlobalDiscount] = useState<number>(0);

  const [selectedMedicineIds, setSelectedMedicineIds] = useState<string[]>([]);
  const [purchaseCart, setPurchaseCart] = useState<PurchaseCartItem[]>([]);

  const medicineOptions = useMemo(
    () => medicineData?.result || [],
    [medicineData?.result],
  );

  const supplierOptions = useMemo(
    () => supplierData?.result || [],
    [supplierData?.result],
  );
  const selectedChipItems = useMemo(
    () => purchaseCart.slice(0, 3),
    [purchaseCart],
  );
  const selectedPurchaseQuantity = useMemo(
    () => purchaseCart.reduce((sum, item) => sum + item.quantity, 0),
    [purchaseCart],
  );

  const medicineMapById = useMemo(() => {
    return new Map(
      medicineOptions
        .filter((medicine) => medicine._id)
        .map((medicine) => [medicine._id as string, medicine] as const),
    );
  }, [medicineOptions]);

  const subtotal = useMemo(
    () =>
      purchaseCart.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0,
      ),
    [purchaseCart],
  );

  const totalAmount = Math.max(subtotal + shippingCost - globalDiscount, 0);

  const resetPurchaseForm = () => {
    setPurchaseDate(new Date().toISOString().slice(0, 10));
    setPurchaseNo(createPurchaseNo());
    setSupplier("");
    setDescription("");
    setShippingCost(0);
    setGlobalDiscount(0);
    setSelectedMedicineIds([]);
    setPurchaseCart([]);
  };

  const handleMedicineSelectionChange = (nextIds: string[]) => {
    setSelectedMedicineIds(nextIds);

    setPurchaseCart((prev) =>
      nextIds
        .map((medicineId) => {
          const existingItem = prev.find(
            (item) => item.medicineId === medicineId,
          );
          if (existingItem) {
            return existingItem;
          }

          const medicine = medicineMapById.get(medicineId);
          if (!medicine) {
            return null;
          }

          return {
            key: medicineId,
            medicineId,
            medicineName: medicine.name,
            unitPrice: medicine.price?.unitPrice || 0,
            quantity: 1,
            expireDate: getDefaultExpireDate(),
          };
        })
        .filter((item): item is PurchaseCartItem => item !== null),
    );
  };

  const removeCartItem = (key: string) => {
    const nextCart = purchaseCart.filter((item) => item.key !== key);
    const nextIds = nextCart.map((item) => item.medicineId);

    setPurchaseCart(nextCart);
    setSelectedMedicineIds(nextIds);
  };

  const updateCartQuantity = (key: string, value: number) => {
    setPurchaseCart((prev) =>
      prev.map((item) =>
        item.key === key
          ? { ...item, quantity: Math.max(value || 1, 1) }
          : item,
      ),
    );
  };

  const updateCartExpireDate = (key: string, value: string) => {
    setPurchaseCart((prev) =>
      prev.map((item) =>
        item.key === key
          ? { ...item, expireDate: value || getDefaultExpireDate() }
          : item,
      ),
    );
  };

  const submitPurchase = async () => {
    if (!purchaseDate) {
      alert("Purchase date is required.");
      return;
    }

    if (!purchaseNo.trim()) {
      alert("Purchase number is required.");
      return;
    }

    if (!supplier) {
      alert("Please select a supplier.");
      return;
    }

    if (!description.trim()) {
      alert("Description is required.");
      return;
    }

    if (!purchaseCart.length) {
      alert("Please add at least one medicine.");
      return;
    }

    await createPurchase({
      purchaseDate,
      purchaseNo,
      totalAmount,
      description,
      supplier,
      shippingCost,
      globalDiscount,
      stocks: purchaseCart.map((item) => ({
        medicine: item.medicineId,
        quantity: item.quantity,
        expireDate: item.expireDate,
      })),
    }).unwrap();

    resetPurchaseForm();
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Purchases</h1>
          <p className="text-muted-foreground">
            Page-based purchase flow with medicine selection, no modal.
          </p>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          <p>
            {medicineLoading
              ? "Loading medicines..."
              : `${medicineOptions.length} medicines`}
          </p>
          <p>
            {supplierLoading
              ? "Loading suppliers..."
              : `${supplierOptions.length} suppliers`}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Purchase</CardTitle>
          <CardDescription>
            Multi-select medicines; selected items appear in table for quantity
            and expiry edits.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={purchaseDate}
                onChange={(event) => setPurchaseDate(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchaseNo">Purchase No</Label>
              <Input
                id="purchaseNo"
                value={purchaseNo}
                onChange={(event) => setPurchaseNo(event.target.value)}
                placeholder="Purchase number"
              />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label>Supplier</Label>
              <Select value={supplier} onValueChange={setSupplier}>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {supplierOptions.map((item: SupplierType) => (
                    <SelectItem
                      key={item._id || item.name}
                      value={item._id || ""}
                    >
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="shippingCost">Shipping Cost</Label>
              <Input
                id="shippingCost"
                type="number"
                min={0}
                value={shippingCost}
                onChange={(event) =>
                  setShippingCost(Number(event.target.value) || 0)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="globalDiscount">Global Discount</Label>
              <Input
                id="globalDiscount"
                type="number"
                min={0}
                value={globalDiscount}
                onChange={(event) =>
                  setGlobalDiscount(Number(event.target.value) || 0)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Totals</Label>
              <div className="rounded-md border px-3 py-2 text-sm">
                <p>Subtotal: {formatMoney(subtotal)}</p>
                <p>Grand Total: {formatMoney(totalAmount)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Purchase note"
              className="resize-none"
            />
          </div>

          <div className="rounded-md border p-3">
            <div className="space-y-2">
              <Label>Medicine</Label>
              <p className="text-xs text-muted-foreground">
                {selectedMedicineIds.length} item(s), total qty{" "}
                {selectedPurchaseQuantity}
              </p>
              <SearchableMultiSelect<MedicineType>
                options={medicineOptions}
                selectedIds={selectedMedicineIds}
                onSelectionChange={handleMedicineSelectionChange}
                placeholder={
                  selectedMedicineIds.length
                    ? `${selectedMedicineIds.length} medicine selected, qty ${selectedPurchaseQuantity}`
                    : "Select medicines"
                }
                searchPlaceholder="Search medicine"
                getOptionKey={(medicine) => medicine._id || medicine.name}
                getOptionLabel={(medicine) => medicine.name}
                getOptionSecondaryLabel={(medicine) =>
                  `Price ${medicine.price?.unitPrice || 0}`
                }
                getSearchText={(medicine) =>
                  [
                    medicine.name,
                    medicine.groupName,
                    medicine.brandName,
                    medicine.selfNo,
                  ]
                    .filter(Boolean)
                    .join(" ")
                }
                emptyText="No medicine matched."
              />
              {!!purchaseCart.length && (
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
                  {purchaseCart.length > selectedChipItems.length && (
                    <span className="rounded-full border bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                      +{purchaseCart.length - selectedChipItems.length} more
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
                  <th className="px-3 py-2 text-left">Line Total</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {purchaseCart.length ? (
                  purchaseCart.map((item) => (
                    <tr key={item.key} className="border-t">
                      <td className="px-3 py-2">{item.medicineName}</td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(event) =>
                            updateCartQuantity(
                              item.key,
                              Number(event.target.value) || 1,
                            )
                          }
                          className="h-8 w-24"
                        />
                      </td>
                      <td className="px-3 py-2">
                        {formatMoney(item.unitPrice)}
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="date"
                          value={item.expireDate?.slice(0, 10)}
                          onChange={(event) =>
                            updateCartExpireDate(item.key, event.target.value)
                          }
                          className="h-8 min-w-36"
                        />
                      </td>
                      <td className="px-3 py-2">
                        {formatMoney(item.unitPrice * item.quantity)}
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
                      No medicine added yet.
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
              onClick={resetPurchaseForm}
              disabled={createState.isLoading}
            >
              Reset
            </Button>
            <Button
              type="button"
              onClick={() => void submitPurchase()}
              disabled={createState.isLoading}
            >
              {createState.isLoading ? "Saving..." : "Save Purchase"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseCreatePage;
