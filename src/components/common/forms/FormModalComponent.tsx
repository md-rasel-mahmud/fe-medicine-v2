import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import CustomInput from "./CustomInput";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

export type inputFieldType = {
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  inputFieldDescription?: string;
  className?: string;
  disabled?: boolean;
  inputFieldLegend?: string;
  options?: {
    value: string;
    label: string;
    defaultValue?: boolean;
    disabled?: boolean;
  }[];
  optionsWithLabel?: {
    selectLabel: string;
    options?: {
      value: string;
      label: string;
      defaultValue?: boolean;
      disabled?: boolean;
    }[];
  }[];
  radioItems?: {
    value: string;
    label: string;
    required?: boolean;
    disabled?: boolean;
  }[];
  checkboxItems?: {
    name: string;
    label: string;
    required?: boolean;
    disabled?: boolean;
  }[];
  extraOnChange?: (value: string) => void;
};
type FormModalComponentProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  formTitle: string;
  submitButtonText?: string;
  createLoading?: boolean;
  updateLoading?: boolean;
  defaultValues?: object;
  onSubmit: (data: object) => void;
  reset: (values?: object) => void;
  formInputFields: inputFieldType[];
  containerClassName?: string;
  modalSizeClassName?: string;
};

const FormModalComponent = ({
  open,
  setOpen,
  formTitle,
  submitButtonText,
  createLoading = false,
  updateLoading = false,
  onSubmit,
  formInputFields = [],
  defaultValues = {},
  containerClassName,
  modalSizeClassName,
  reset,
}: FormModalComponentProps) => {
  const { handleSubmit } = useFormContext();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={cn("sm:max-w-lg", modalSizeClassName)}>
        <DialogHeader>
          <DialogTitle>{formTitle}</DialogTitle>
          <DialogDescription>
            {`The field levels marked with `}
            <span style={{ color: "red" }}>( * )</span>
            {` are required input fields.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div
            className={cn(
              "no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4 grid gap-4 py-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
              containerClassName,
            )}
          >
            {/* Form content goes here */}
            {formInputFields.map((field: inputFieldType, index: number) => {
              const {
                type,
                name,
                label,
                placeholder,
                required,
                inputFieldDescription,
                disabled,
                className,
                ...rest
              } = field;

              return (
                <div className={cn(className)} key={index}>
                  <CustomInput
                    type={type}
                    name={name}
                    label={label}
                    placeholder={placeholder}
                    required={required}
                    inputFieldDescription={inputFieldDescription}
                    disabled={disabled}
                    {...rest}
                  />
                </div>
              );
            })}
          </div>

          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                type="button"
                onClick={() => reset(defaultValues)}
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              variant="default"
              disabled={createLoading || updateLoading}
            >
              {" "}
              {(createLoading || updateLoading) && (
                <Spinner data-icon="inline-start" />
              )}
              {submitButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormModalComponent;
