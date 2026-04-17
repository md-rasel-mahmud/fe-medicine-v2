import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";

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
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  useCreateUnitMutation,
  useGetUnitsQuery,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} from "@/lib/redux/api-services/unit.api";
import type { UnitType } from "@/lib/redux/api-services/types";
import { toast } from "sonner";

const defaultValues = {
  name: "",
  description: "",
};

const schema = z.object({
  name: z.string().min(1, "Unit name is required"),
  description: z.string().optional(),
});

export default function UnitPage() {
  const { data, isLoading } = useGetUnitsQuery();
  const [createUnit, createState] = useCreateUnitMutation();
  const [updateUnit, updateState] = useUpdateUnitMutation();
  const [deleteUnit] = useDeleteUnitMutation();
  const [open, setOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitType | null>(null);

  const methods = useForm<z.infer<typeof schema>>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const { reset } = methods;

  const columns: DataTableColumn<UnitType>[] = useMemo(
    () => [
      {
        header: "MongoDB ID (Copy)",
        cell: (row: UnitType) => {
          // click to copy full _id to clipboard
          return (
            <Button
              variant="outline"
              size="xs"
              onClick={() => {
                navigator.clipboard.writeText(row._id || "");
                toast.success("MongoDB ID copied to clipboard");
              }}
            >
              {row._id}
            </Button>
          );
        },
      },
      { header: "Name", cell: (row) => row.name },
      { header: "Description", cell: (row) => row.description || "-" },
    ],
    [],
  );

  useEffect(() => {
    if (!open) {
      setEditingUnit(null);
      reset(defaultValues);
    } else if (editingUnit) {
      reset({
        name: editingUnit.name,
        description: editingUnit.description || "",
      });
    }
  }, [open, editingUnit, reset]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (editingUnit && editingUnit._id) {
      await updateUnit({ id: editingUnit._id, body: values }).unwrap();
    } else {
      await createUnit(values).unwrap();
    }
    setOpen(false);
  };

  const handleEdit = (unit: UnitType) => {
    setEditingUnit(unit);
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
      await deleteUnit(deletingId).unwrap();
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Units</h1>
          <p className="text-muted-foreground">Manage medicine unit records.</p>
        </div>
        <Button onClick={() => setOpen(true)}>Add unit</Button>
      </div>

      <DataTable
        title="Unit list"
        description="CRUD data from /unit/all"
        columns={columns}
        rows={data?.result}
        loading={isLoading}
        getRowKey={(row) => row._id || row.name}
        emptyMessage="No units are available yet."
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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Unit</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete this unit?</div>
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
          formTitle={editingUnit ? "Edit Unit" : "Create Unit"}
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
              placeholder: "Unit name",
              required: true,
            },
            {
              type: "textarea",
              name: "description",
              label: "Description",
              placeholder: "Optional description",
            },
          ]}
          defaultValues={defaultValues}
          reset={reset}
          onSubmit={(values) => void onSubmit(values as z.infer<typeof schema>)}
          containerClassName="grid-cols-1 md:grid-cols-1 lg:grid-cols-1"
          modalSizeClassName="lg:max-w-lg"
        />
      </FormProvider>
    </div>
  );
}
