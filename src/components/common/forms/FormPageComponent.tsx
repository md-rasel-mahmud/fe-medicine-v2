import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import CustomInput from "./CustomInput";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";

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
  formTitle: string;
  submitButtonText?: string;
  createLoading?: boolean;
  updateLoading?: boolean;
  defaultValues?: object;
  onSubmit: (data: object) => void;
  reset: (values?: object) => void;
  formInputFields: inputFieldType[];
  containerClassName?: string;
  backButtonLink?: string;
  backButtonText?: string;
};

const FormPageComponent = ({
  formTitle,
  submitButtonText,
  createLoading = false,
  updateLoading = false,
  onSubmit,
  formInputFields = [],
  defaultValues = {},
  containerClassName,
  backButtonLink,
  backButtonText,
  reset,
}: FormModalComponentProps) => {
  const { handleSubmit } = useFormContext();
  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-lg">
          {backButtonLink && (
            <div className="flex mb-3">
              <Link
                role="button"
                to={backButtonLink || "#"}
                className="flex items-center gap-1 text-xs font-medium 
               hover:text-primary/80 transition-colors duration-200 
                py-1 rounded-md text-emerald-800"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="uppercase">{backButtonText}</span>
              </Link>
            </div>
          )}
          {formTitle}
        </CardTitle>
        <CardDescription>
          {`The field levels marked with `}
          <span style={{ color: "red" }}>( * )</span>
          {` are required input fields.`}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent>
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
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end md:mt-5">
          <Button
            variant="outline"
            type="button"
            onClick={() => reset(defaultValues)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="default"
            disabled={createLoading || updateLoading}
            className="w-full sm:w-auto"
          >
            {(createLoading || updateLoading) && (
              <Spinner data-icon="inline-start" />
            )}
            {submitButtonText}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FormPageComponent;
