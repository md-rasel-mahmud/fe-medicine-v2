import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { useLoginUserMutation } from "@/lib/redux/api-services/auth/api.service";
import { setCredential } from "@/lib/redux/redux-slice/auth.slice";
import { useAppDispatch } from "@/lib/redux/hooks";
import CustomInput from "./common/forms/CustomInput";
import { passwordRegex, phoneRegex, type inputFieldType } from "./signup-form";

const defaultValues = {
  emailOrPhone: "",
  password: "",
};

type LoginFormValues = typeof defaultValues;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const containerClassName = "grid-cols-1";
  const formInputFields: inputFieldType[] = [
    {
      type: "text",
      name: "emailOrPhone",
      label: "Email or mobile",
      placeholder: "Enter your email or mobile number",
      required: true,
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
  ];

  const schemaResolver = z.object({
    emailOrPhone: z
      .string()
      .min(1, "Email or mobile number is required")
      .refine(
        (val) => {
          // If it's a BD phone number, must match regex, otherwise allow any string (for email)
          if (/^01[3-9]\d{8}$/.test(val)) {
            return phoneRegex.test(val);
          }
          return true;
        },
        { message: "Please enter a valid BD mobile number or email" },
      ),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        passwordRegex,
        "Password must be 6–20 characters with at least one letter & one number, no spaces (e.g. Pass1234)",
      ),
  });

  const methods = useForm<LoginFormValues>({
    defaultValues,
    resolver: zodResolver(schemaResolver),
    mode: "all",
    reValidateMode: "onChange",
  });

  const { handleSubmit, reset } = methods;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const location = useLocation();

  const onSubmit = async (data: LoginFormValues) => {
    setSubmitError(null);

    try {
      const result = await loginUser(data).unwrap();
      if (result.result.approved === false) {
        setSubmitError("Your account is pending admin approval.");
        return;
      }
      dispatch(
        setCredential({
          token: result.token,
          user: result.result,
        }),
      );
      navigate("/");
    } catch (loginError) {
      setSubmitError(
        loginError instanceof Error ? loginError.message : "Login failed",
      );
    }
  };

  let errorMessage =
    submitError ||
    ((error as { data?: { message?: string } } | undefined)?.data?.message ??
      null);

  // Show pending approval message if redirected from signup
  if (location.state?.pendingApproval) {
    errorMessage =
      "Your account is pending admin approval. Please wait for approval before logging in.";
  }

  return (
    <FormProvider {...methods}>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Use your email or phone number to access the system.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardContent>
              <div
                className={cn(
                  "no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4 grid gap-4 py-2 mb-5",
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
                  <FieldDescription className="text-destructive">
                    {errorMessage}
                  </FieldDescription>
                )}
              </div>

              <FieldGroup>
                <Field>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Login"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => reset(defaultValues)}
                  >
                    Reset
                  </Button>

                  <FieldDescription className="text-center">
                    Don&apos;t have an account?{" "}
                    <Link to="/auth/sign-up">Sign up</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </CardContent>
          </form>
        </Card>
      </div>
    </FormProvider>
  );
}
