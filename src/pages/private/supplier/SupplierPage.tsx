import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import FormModalComponent from "@/components/common/forms/FormModalComponent";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/table/DataTable";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} from "@/lib/redux/api-services/supplier.api";
import {
  useCreateSupplierMutation,
  useGetSuppliersQuery,
} from "@/lib/redux/api-services/supplier.api";
import type { SupplierType } from "@/lib/redux/api-services/types";

const defaultValues = {
  name: "",
  phone: "",
  email: "",
  address: "",
  description: "",
};

const bdPhoneRegex = /^(01[3-9]\d{8})$/;
const schema = z.object({
  name: z.string().min(1, "Supplier name is required"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(bdPhoneRegex, "Please enter a valid BD phone number"),
  email: z.email().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
});

export default function SupplierPage() {
  const { data, isLoading } = useGetSuppliersQuery();
  const [createSupplier, createState] = useCreateSupplierMutation();
  const [updateSupplier] = useUpdateSupplierMutation();
  const [deleteSupplier] = useDeleteSupplierMutation();
  const [open, setOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierType | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const methods = useForm<z.infer<typeof schema>>({
    defaultValues,
    resolver: zodResolver(schema),
  });
  const { reset } = methods;

  const columns: DataTableColumn<SupplierType>[] = useMemo(
    () => [
      { header: "Name", cell: (row) => row.name },
      { header: "Phone", cell: (row) => row.phone },
      { header: "Email", cell: (row) => row.email || "-" },
      { header: "Address", cell: (row) => row.address || "-" },
    ],
    [],
  );

  const handleEdit = (supplier: SupplierType) => {
    setEditingSupplier(supplier);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      await deleteSupplier(deletingId).unwrap();
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (!open) {
      setEditingSupplier(null);
      reset(defaultValues);
    } else if (editingSupplier) {
      reset({
        name: editingSupplier.name,
        phone: editingSupplier.phone,
        email: editingSupplier.email || "",
        address: editingSupplier.address || "",
        description: editingSupplier.description || "",
      });
    }
  }, [open, editingSupplier, reset]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    await createSupplier(values).unwrap();
    setOpen(false);
    reset(defaultValues);
  };

  // Helper to clean empty optional fields
  function cleanSupplierPayload(values: z.infer<typeof schema>) {
    const cleaned: Record<string, any> = { ...values };
    if (!cleaned.email) delete cleaned.email;
    if (!cleaned.address) delete cleaned.address;
    if (!cleaned.description) delete cleaned.description;
    return cleaned;
  }

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Suppliers</h1>
          <p className="text-muted-foreground">Manage supplier records.</p>
        </div>
        <Button onClick={() => setOpen(true)}>Add supplier</Button>
      </div>

      <DataTable
        title="Supplier list"
        description="CRUD data from /supplier/all"
        columns={columns}
        rows={data?.result}
        loading={isLoading}
        getRowKey={(row) => row._id || row.name}
        emptyMessage="No suppliers have been created yet."
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
            <DialogTitle>Delete Supplier</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete this supplier?</div>
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
          formTitle={editingSupplier ? "Edit Supplier" : "Create Supplier"}
          submitButtonText={createState.isLoading ? "Saving..." : "Save"}
          createLoading={createState.isLoading}
          formInputFields={[
            {
              type: "text",
              name: "name",
              label: "Name",
              placeholder: "Supplier name",
              required: true,
            },
            {
              type: "text",
              name: "phone",
              label: "Phone",
              placeholder: "Phone number",
              required: true,
            },
            {
              type: "email",
              name: "email",
              label: "Email",
              placeholder: "Email address",
            },
            {
              type: "text",
              name: "address",
              label: "Address",
              placeholder: "Address",
            },
            {
              type: "textarea",
              name: "description",
              label: "Description",
              placeholder: "Description",
              className: "col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2",
            },
          ]}
          defaultValues={defaultValues}
          reset={reset}
          onSubmit={async (values) => {
            const cleaned = cleanSupplierPayload(
              values as z.infer<typeof schema>,
            );
            if (editingSupplier && editingSupplier._id) {
              await updateSupplier({
                id: editingSupplier._id,
                body: cleaned,
              }).unwrap();
            } else {
              await createSupplier(cleaned).unwrap();
            }
            setOpen(false);
            reset(defaultValues);
          }}
          containerClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2"
          modalSizeClassName="lg:max-w-2xl"
        />
      </FormProvider>
    </div>
  );
}
