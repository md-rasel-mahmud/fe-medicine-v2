import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, type FieldValues } from "react-hook-form";
import * as z from "zod";
import FormModalComponent from "@/components/common/forms/FormModalComponent";

type CategoryCreateUpdateModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const defaultValues = {
  name: "",
  email: "",
  note: "",
};

const CategoryCreateUpdateModal = ({
  open,
  setOpen,
}: CategoryCreateUpdateModalProps) => {
  const formInputFields = [
    {
      type: "text",
      name: "name",
      label: "Name",
      placeholder: "Enter your Name",
      required: true,
      disabled: false,
      // className: "md:col-span-2 lg:col-span-3",
    },
    {
      type: "email",
      name: "email",
      label: "Email",
      placeholder: "Enter your Email",
      required: true,
      disabled: false,
      // className: "md:col-span-2 lg:col-span-3",
    },
    {
      type: "textarea",
      name: "note",
      label: "Note",
      placeholder: "Enter your Note",
      required: true,
      disabled: false,
      className: "col-span-1 md:col-span-2 lg:col-span-2",
    },
  ];

  const schemaResolver = z.object({
    name: z.string().min(1, "Name is required"),
    email: z
      .email({
        message: "Invalid email address",
      })
      .min(1, "Email is required"),
    note: z.string().min(1, "Note is required"),
  });
  type FormValues = z.infer<typeof schemaResolver>;

  const methods = useForm<FormValues>({
    defaultValues: defaultValues,
    resolver: zodResolver(schemaResolver),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const {
    reset,
    formState: { errors },
  } = methods;

  console.log("errors :>> ", errors);

  const onSubmit = (data: FieldValues) => {
    console.log("Form data:", data);
  };

  return (
    <FormProvider {...methods}>
      <FormModalComponent
        {...{
          open,
          setOpen,
          createLoading: false,
          updateLoading: false,
          formInputFields,
          defaultValues,
          reset,
          onSubmit,
          formTitle: "Create Category",
          submitButtonText: "Create",
          modalSizeClassName: "lg:max-w-md",
          containerClassName: "grid-cols-1 md:grid-cols-2 lg:grid-cols-2",
        }}
      />
    </FormProvider>
  );
};

export default CategoryCreateUpdateModal;
