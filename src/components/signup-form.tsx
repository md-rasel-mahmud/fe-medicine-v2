import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import CustomInput from "./common/forms/CustomInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldDescription } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { useRegisterUserMutation } from "@/lib/redux/api-services/auth/api.service";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setCredential } from "@/lib/redux/redux-slice/auth.slice";

export type inputFieldType = {
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  inputFieldDescription?: string;
  className?: string;
  disabled?: boolean;
};

const defaultValues = {
  name: "",
  phone: "",
  email: "",
  password: "",
  address: "",
};

export const phoneRegex = /^(01[3-9]\d{8})$/;
export const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=\S+$).{6,20}$/;

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const containerClassName = "grid-cols-1 md:grid-cols-2";
  const formInputFields: inputFieldType[] = [
    {
      type: "text",
      name: "name",
      label: "Name",
      placeholder: "Enter your name",
      required: true,
      disabled: false,
    },
    {
      type: "text",
      name: "phone",
      label: "Mobile",
      placeholder: "Enter your mobile number",
      required: true,
      disabled: false,
    },
    {
      type: "email",
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
      required: false,
      disabled: false,
    },
    {
      type: "password",
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      required: true,
      disabled: false,
    },
    {
      type: "textarea",
      name: "address",
      label: "Address",
      placeholder: "Enter your address",
      required: true,
      disabled: false,
      className: "md:col-span-2 lg:col-span-2 xl:col-span-2",
    },
  ];

  const schemaResolver = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z
      .string()
      .min(1, "Mobile number is required")
      .regex(phoneRegex, "Please enter a valid BD mobile number"),
    email: z
      .email({
        message: "Invalid email address",
      })
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        passwordRegex,
        "Password must be 6–20 characters with at least one letter & one number, no spaces (e.g. Pass1234)",
      ),
    address: z.string().min(1, "Address is required"),
  });

  type FormValues = z.infer<typeof schemaResolver>;

  const methods = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(schemaResolver),
    mode: "all",
    reValidateMode: "onChange",
  });

  const { reset, handleSubmit } = methods;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [registerUser, { isLoading, error }] = useRegisterUserMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);

    try {
      const result = await registerUser(data).unwrap();
      if (result.result.approved === false) {
        // If not approved, redirect to login with message
        navigate("/auth/signin", { state: { pendingApproval: true } });
        return;
      }
      dispatch(
        setCredential({
          token: result.token,
          user: result.result,
        }),
      );
      navigate("/");
    } catch (registerError) {
      setSubmitError(
        registerError instanceof Error
          ? registerError.message
          : "Registration failed",
      );
    }
  };

  const errorMessage =
    submitError ||
    ((error as { data?: { message?: string } } | undefined)?.data?.message ??
      null);

  return (
    <FormProvider {...methods}>
      <Card {...props} className="mx-auto w-full">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Register a staff account to manage medicine data.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent>
            <div
              className={cn(
                "no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4 grid gap-4 py-2 grid-cols-1 md:grid-cols-2",
                containerClassName,
              )}
            >
              {formInputFields.map((field, index) => {
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

              {errorMessage && (
                <FieldDescription className="md:col-span-2 text-destructive">
                  {errorMessage}
                </FieldDescription>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end md:mt-5">
            <Button
              variant="outline"
              type="button"
              onClick={() => reset(defaultValues)}
              className="w-full sm:w-auto"
            >
              Reset
            </Button>

            <Button
              type="submit"
              variant="default"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Creating..." : "Create Account"}
            </Button>
          </CardFooter>
          <FieldDescription className="px-6 text-center sm:mt-3">
            Already have an account? <Link to="/auth/sign-in">Sign in</Link>
          </FieldDescription>
        </form>
      </Card>
    </FormProvider>
  );
}
