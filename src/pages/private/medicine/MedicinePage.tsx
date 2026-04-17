import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import FormModalComponent from "@/components/common/forms/FormModalComponent";
import { Plus, Pencil, Trash } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import {
  useGetMedicinesQuery,
  useCreateMedicineMutation,
  useUpdateMedicineMutation,
  useDeleteMedicineMutation,
  useImportMedicinesMutation,
} from "@/lib/redux/api-services/medicine.api";
import { useGetUnitsQuery } from "@/lib/redux/api-services/unit.api";
import type { MedicineType } from "@/lib/redux/api-services/types";
import { formatMoney } from "../utils";

const defaultValues = {
  name: "",
  groupName: "",
  brandName: "",
  unit: "piece",
  selfNo: "",
  unitPrice: 0,
  boxPrice: 0,
};

import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/table/DataTable";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(1, "Medicine name is required"),
  groupName: z.string().min(1, "Group name is required"),
  brandName: z.string().optional(),
  unit: z.string().min(1, "Unit is required"),
  selfNo: z.string().optional(),
  unitPrice: z.coerce.number().min(0, "Unit price is required"),
  boxPrice: z.coerce.number().min(0).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function MedicinePage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading } = useGetMedicinesQuery({ page, limit });
  const { data: unitData } = useGetUnitsQuery();
  const [createMedicine, createState] = useCreateMedicineMutation();
  const [updateMedicine, updateState] = useUpdateMedicineMutation();
  const [deleteMedicine] = useDeleteMedicineMutation();
  const [importMedicines, importState] = useImportMedicinesMutation();
  const [open, setOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<MedicineType | null>(
    null,
  );

  const methods = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(schema) as never,
  });
  const { reset } = methods;

  // DataTable and Delete Confirmation Dialog

  const columns: DataTableColumn<MedicineType>[] = useMemo(
    () => [
      { header: "Name", cell: (row) => row.name },
      { header: "Group", cell: (row) => row.groupName },
      { header: "Brand", cell: (row) => row.brandName || "-" },
      { header: "Self No", cell: (row) => row.selfNo || "-" },
      { header: "Unit", cell: (row) => row.unit || "-" },
      { header: "Price", cell: (row) => formatMoney(row.price?.unitPrice) },
    ],
    [],
  );

  const onSubmit = async (values: FormValues) => {
    const payload: MedicineType = {
      name: values.name,
      groupName: values.groupName,
      brandName: values.brandName || undefined,
      unit: values.unit,
      selfNo: values.selfNo || undefined,
      price: {
        unitPrice: values.unitPrice,
        boxPrice: values.boxPrice || undefined,
      },
    };

    if (editingMedicine && editingMedicine._id) {
      await updateMedicine({ id: editingMedicine._id, body: payload }).unwrap();
    } else {
      await createMedicine(payload).unwrap();
    }
    setOpen(false);
  };

  useEffect(() => {
    if (!open) {
      setEditingMedicine(null);
      reset(defaultValues);
    } else if (editingMedicine) {
      reset({
        name: editingMedicine.name,
        groupName: editingMedicine.groupName,
        brandName: editingMedicine.brandName || "",
        unit: editingMedicine.unit || "piece",
        selfNo: editingMedicine.selfNo || "",
        unitPrice: editingMedicine.price.unitPrice,
        boxPrice: editingMedicine.price.boxPrice || 0,
      });
    }
  }, [open, editingMedicine, reset]);

  const handleEdit = (med: MedicineType) => {
    setEditingMedicine(med);
    setOpen(true);
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      await deleteMedicine(deletingId).unwrap();
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const handleDownloadDemoCsv = () => {
    const text =
      "name,groupName,brandName,unit_id,selfNo,unitPrice,boxPrice\nParacetamol,Painkillers,Square,paste_your_mongo_id_here,Shelf-A,10,100\nNapa,Painkillers,Beximco,paste_your_mongo_id_here,Shelf-B,5,50";
    const blob = new Blob([text], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "medicine_demo.csv";
    link.click();
  };

  const onExportCsv = () => {
    if (!data?.result?.length) return;
    const csvRows = [
      ["Name", "Group", "Brand", "Unit", "Price", "Self No"],
      ...data.result.map((row) => [
        row.name,
        row.groupName,
        row.brandName || "-",
        row.unit || "-",
        row.price.unitPrice,
        row.selfNo || "-",
      ]),
    ];
    const csvString = csvRows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `medicines_page_${page}.csv`;
    link.click();
  };

  const handleImportCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split("\n").filter((v) => v.trim() !== "");
        if (lines.length < 2) throw new Error("CSV has no data rows");
        const medicinesToImport: MedicineType[] = [];
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(",");
          if (row.length < 6) continue;
          medicinesToImport.push({
            name: row[0].trim(),
            groupName: row[1].trim(),
            brandName: row[2]?.trim(),
            unit: row[3]?.trim(),
            selfNo: row[4]?.trim(),
            price: {
              unitPrice: Number(row[5]),
              boxPrice: Number(row[6] || 0),
            },
          });
        }
        await importMedicines({ medicines: medicinesToImport }).unwrap();
        alert(`${medicinesToImport.length} Medicines imported successfully.`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        alert("Import failed: " + (err.message || JSON.stringify(err)));
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  console.log("data?.pagination :>> ", data?.pagination);

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Medicines</h1>
          <p className="text-muted-foreground">
            Manage master medicine records.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="secondary" onClick={handleDownloadDemoCsv}>
            Demo CSV
          </Button>
          <div>
            <input
              type="file"
              id="import-csv"
              accept=".csv"
              className="hidden"
              onChange={handleImportCsv}
            />
            <label
              htmlFor="import-csv"
              className="px-4 py-2 border rounded-md shadow-sm text-sm font-medium hover:bg-secondary cursor-pointer"
            >
              {importState.isLoading ? "Importing..." : "Import CSV"}
            </label>
          </div>
          <Button onClick={() => setOpen(true)}>
            <Plus /> Add medicine
          </Button>
        </div>
      </div>

      <DataTable<MedicineType>
        title="Medicine list"
        description="CRUD data from /medicine/all"
        columns={columns}
        rows={data?.result}
        loading={isLoading}
        getRowKey={(row) => row._id || row.name}
        emptyMessage="No medicines are available yet."
        pagination={data?.pagination}
        onPageChange={setPage}
        onExportCsv={onExportCsv}
        renderActions={(row) => (
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-sm"
                  variant="outline"
                  onClick={() => handleEdit(row)}
                  aria-label="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-sm"
                  variant="destructive"
                  onClick={() => handleDelete(row._id!)}
                  aria-label="Delete"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </div>
        )}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Medicine</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete this medicine?</div>
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

      <FormProvider {...methods}>
        <FormModalComponent
          open={open}
          setOpen={setOpen}
          formTitle={editingMedicine ? "Edit Medicine" : "Create Medicine"}
          submitButtonText={
            createState.isLoading || updateState.isLoading
              ? "Saving..."
              : "Save"
          }
          createLoading={createState.isLoading || updateState.isLoading}
          formInputFields={[
            {
              type: "text",
              name: "name",
              label: "Name",
              placeholder: "Medicine name",
              required: true,
            },
            {
              type: "text",
              name: "groupName",
              label: "Group name",
              placeholder: "Group name",
              required: true,
            },
            {
              type: "text",
              name: "brandName",
              label: "Brand name",
              placeholder: "Brand name",
            },
            {
              type: "select",
              name: "unit",
              label: "Unit",
              placeholder: "Select unit",
              required: true,
              options: (unitData?.result || []).map((unit) => ({
                label: unit.name,
                value: unit.name,
              })),
            },
            {
              type: "text",
              name: "selfNo",
              label: "Shelf number",
              placeholder: "Shelf number",
            },
            {
              type: "number",
              name: "unitPrice",
              label: "Unit price",
              placeholder: "0",
              required: true,
            },
            {
              type: "number",
              name: "boxPrice",
              label: "Box price",
              placeholder: "0",
            },
          ]}
          defaultValues={defaultValues}
          reset={reset}
          onSubmit={(values) => void onSubmit(values as FormValues)}
          containerClassName="grid-cols-1 md:grid-cols-2"
          modalSizeClassName="lg:max-w-3xl"
        />
      </FormProvider>
    </div>
  );
}
