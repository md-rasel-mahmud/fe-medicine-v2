import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

type CustomInputProps = {
  type?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  inputFieldDescription?: string;
  inputFieldLegend?: string;
  name?: string;
  id?: string;
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  otherProps?: any;
  disabled?: boolean;
  checked?: boolean;
  defaultValue?: string;
  checkboxItems?: {
    name: string;
    label: string;
    required?: boolean;
    disabled?: boolean;
  }[];
  radioItems?: {
    value: string;
    label: string;
    required?: boolean;
    disabled?: boolean;
  }[];
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

  extraOnChange?: (value: string) => void;
};

const CustomInput = ({
  type = "text",
  label = "",
  placeholder = "",
  required = false,
  inputFieldDescription = "",
  inputFieldLegend = "",
  name = "",
  disabled = false,
  checkboxItems = [],
  radioItems = [],
  options = [],
  optionsWithLabel = [],
  defaultValue = "",
  extraOnChange = () => {},
  ...otherProps
}: CustomInputProps) => {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const anchor = useComboboxAnchor();

  switch (type) {
    case "text":
      return (
        <FieldGroup>
          <Field>
            {label && (
              <FieldLabel htmlFor={name}>
                {label}{" "}
                {required && <span className="text-destructive">*</span>}
              </FieldLabel>
            )}

            <Controller
              name={name}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    {...field}
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    required={required}
                    aria-invalid={!!error}
                    className={error ? "border-destructive" : ""}
                    {...otherProps}
                    disabled={disabled}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      if (extraOnChange) {
                        extraOnChange(e.target.value);
                      }
                    }}
                  />
                  {error && (
                    <FieldDescription className="text-destructive">
                      {error.message}
                    </FieldDescription>
                  )}
                  {inputFieldDescription && (
                    <FieldDescription>{inputFieldDescription}</FieldDescription>
                  )}
                </>
              )}
            />
          </Field>
        </FieldGroup>
      );

    // textarea
    case "textarea":
      return (
        <FieldGroup>
          <Field>
            {label && (
              <FieldLabel htmlFor={name}>
                {label}{" "}
                {required && <span className="text-destructive">*</span>}
              </FieldLabel>
            )}

            {inputFieldDescription && (
              <FieldDescription>{inputFieldDescription}</FieldDescription>
            )}

            <Controller
              name={name}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Textarea
                    {...field}
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    required={required}
                    aria-invalid={!!error}
                    className={`${error ? "border-destructive" : ""} resize-none`}
                    {...otherProps}
                    disabled={disabled}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      if (extraOnChange) {
                        extraOnChange(e.target.value);
                      }
                    }}
                  />

                  {error && (
                    <FieldDescription className="text-destructive">
                      {error.message}
                    </FieldDescription>
                  )}
                </>
              )}
            />
          </Field>
        </FieldGroup>
      );
    case "password":
      return (
        <FieldGroup>
          <Field>
            {label && (
              <FieldLabel htmlFor={name}>
                {label}{" "}
                {required && <span className="text-destructive">*</span>}
              </FieldLabel>
            )}

            <Controller
              name={name}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <div className="relative">
                    <Input
                      {...field}
                      type={
                        type === "password"
                          ? showPassword
                            ? "text"
                            : "password"
                          : type
                      }
                      id={name}
                      name={name}
                      placeholder={placeholder}
                      required={required}
                      aria-invalid={!!error}
                      className={error ? "border-destructive pr-10" : "pr-10"}
                      {...otherProps}
                      disabled={disabled}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        if (extraOnChange) {
                          extraOnChange(e.target.value);
                        }
                      }}
                    />

                    {/* Eye button only for password */}
                    {type === "password" && (
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Error */}
                  {error && (
                    <FieldDescription className="text-destructive">
                      {error.message}
                    </FieldDescription>
                  )}

                  {/* Description */}
                  {inputFieldDescription && (
                    <FieldDescription>{inputFieldDescription}</FieldDescription>
                  )}
                </>
              )}
            />
          </Field>
        </FieldGroup>
      );

    case "email":
      return (
        <FieldGroup>
          <Field>
            {label && (
              <FieldLabel htmlFor={name}>
                {label}{" "}
                {required && <span className="text-destructive">*</span>}
              </FieldLabel>
            )}

            <Controller
              name={name}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    {...field}
                    id={name}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    required={required}
                    aria-invalid={!!error}
                    className={error ? "border-destructive" : ""}
                    {...otherProps}
                    disabled={disabled}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      if (extraOnChange) {
                        extraOnChange(e.target.value);
                      }
                    }}
                  />
                  {error && (
                    <FieldDescription className="text-destructive">
                      {error.message}
                    </FieldDescription>
                  )}
                  {inputFieldDescription && (
                    <FieldDescription>{inputFieldDescription}</FieldDescription>
                  )}
                </>
              )}
            />
          </Field>
        </FieldGroup>
      );

    case "file":
      return (
        <FieldGroup>
          <Field>
            {label && (
              <FieldLabel htmlFor={name}>
                {label}{" "}
                {required && <span className="text-destructive">*</span>}
              </FieldLabel>
            )}

            <Controller
              name={name}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    {...field}
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    required={required}
                    aria-invalid={!!error}
                    className={error ? "border-destructive" : ""}
                    {...otherProps}
                    disabled={disabled}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      if (extraOnChange) {
                        extraOnChange(e.target.value);
                      }
                    }}
                  />
                  {error && (
                    <FieldDescription className="text-destructive">
                      {error.message}
                    </FieldDescription>
                  )}
                  {inputFieldDescription && (
                    <FieldDescription>{inputFieldDescription}</FieldDescription>
                  )}
                </>
              )}
            />
          </Field>
        </FieldGroup>
      );

    case "number":
      return (
        <FieldGroup>
          <Field>
            {label && (
              <FieldLabel htmlFor={name}>
                {label}{" "}
                {required && <span className="text-destructive">*</span>}
              </FieldLabel>
            )}

            <Controller
              name={name}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    {...field}
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    required={required}
                    min={0}
                    aria-invalid={!!error}
                    className={error ? "border-destructive" : ""}
                    {...otherProps}
                    disabled={disabled}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? "" : Number(value));
                      if (extraOnChange) {
                        extraOnChange(value);
                      }
                    }}
                  />
                  {error && (
                    <FieldDescription className="text-destructive">
                      {error.message}
                    </FieldDescription>
                  )}
                  {inputFieldDescription && (
                    <FieldDescription>{inputFieldDescription}</FieldDescription>
                  )}
                </>
              )}
            />
          </Field>
        </FieldGroup>
      );

    case "date":
      return (
        <FieldGroup>
          <Field>
            {label && (
              <FieldLabel htmlFor={name}>
                {label}{" "}
                {required && <span className="text-destructive">*</span>}
              </FieldLabel>
            )}

            <Controller
              name={name}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start font-normal"
                      >
                        {field.value
                          ? new Date(field.value).toLocaleDateString()
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        defaultMonth={field.value}
                        captionLayout="dropdown"
                        onSelect={(selectedDate) => {
                          field.onChange(selectedDate);
                          setOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>

                  {error && (
                    <FieldDescription className="text-destructive">
                      {error.message}
                    </FieldDescription>
                  )}

                  {inputFieldDescription && (
                    <FieldDescription>{inputFieldDescription}</FieldDescription>
                  )}
                </>
              )}
            />
          </Field>
        </FieldGroup>
      );

    case "switch":
      return (
        <FieldGroup>
          <Field orientation="horizontal">
            <Controller
              name={name}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Switch
                    {...field}
                    id={name}
                    name={name}
                    required={required}
                    aria-invalid={!!error}
                    className={error ? "border-destructive" : ""}
                    {...otherProps}
                    disabled={disabled}
                    checked={field.value}
                    onCheckedChange={(checked: boolean) => {
                      field.onChange(checked);
                    }}
                  />
                  {label && (
                    <FieldLabel htmlFor={name}>
                      {label}{" "}
                      {required && <span className="text-destructive">*</span>}
                    </FieldLabel>
                  )}
                  {error && (
                    <FieldDescription className="text-destructive">
                      {error.message}
                    </FieldDescription>
                  )}
                </>
              )}
            />
          </Field>

          {inputFieldDescription && (
            <FieldDescription>{inputFieldDescription}</FieldDescription>
          )}
        </FieldGroup>
      );

    case "checkbox":
      return (
        <FieldGroup>
          <Field orientation="horizontal">
            <Controller
              name={name}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Checkbox
                    {...field}
                    id={name}
                    name={name}
                    required={required}
                    aria-invalid={!!error}
                    defaultChecked={field.value}
                    className={error ? "border-destructive" : ""}
                    {...otherProps}
                    disabled={disabled}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                    }}
                  />
                  <FieldContent>
                    {label && (
                      <FieldLabel htmlFor={name}>
                        {label}{" "}
                        {required && (
                          <span className="text-destructive">*</span>
                        )}
                      </FieldLabel>
                    )}
                    {inputFieldDescription && (
                      <FieldDescription>
                        {inputFieldDescription}
                      </FieldDescription>
                    )}
                  </FieldContent>
                  {error && (
                    <FieldDescription className="text-destructive">
                      {error.message}
                    </FieldDescription>
                  )}
                </>
              )}
            />
          </Field>
        </FieldGroup>
      );
    case "checkboxGroup":
      return (
        <FieldSet>
          {inputFieldLegend && (
            <FieldLegend variant="label">{inputFieldLegend}</FieldLegend>
          )}

          {inputFieldDescription && (
            <FieldDescription>{inputFieldDescription}</FieldDescription>
          )}

          <Controller
            name={name}
            control={control}
            defaultValue={[]}
            render={({ field, fieldState: { error } }) => (
              <>
                <FieldGroup className="gap-3">
                  {checkboxItems?.map((item) => {
                    const isChecked = field.value?.includes(item.name);

                    return (
                      <Field orientation="horizontal" key={item.name}>
                        <Checkbox
                          id={item.name}
                          checked={isChecked}
                          disabled={item.disabled}
                          onCheckedChange={(checked) => {
                            const updatedValue = checked
                              ? [...field.value, item.name]
                              : field.value.filter(
                                  (value: string) => value !== item.name,
                                );

                            field.onChange(updatedValue);
                          }}
                        />

                        <FieldLabel htmlFor={item.name}>
                          {item.label}
                        </FieldLabel>
                      </Field>
                    );
                  })}
                </FieldGroup>

                {error && (
                  <FieldDescription className="text-destructive">
                    {error.message}
                  </FieldDescription>
                )}
              </>
            )}
          />
        </FieldSet>
      );

    case "radio":
      return (
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                {radioItems?.map((item) => (
                  <Field orientation="horizontal" key={item.value}>
                    <RadioGroupItem
                      value={item.value ?? ""}
                      id={item.value}
                      disabled={item.disabled}
                    />

                    <FieldContent>
                      <FieldLabel htmlFor={item.value}>
                        {item.label}
                        {required && (
                          <span className="text-destructive">*</span>
                        )}
                      </FieldLabel>
                    </FieldContent>
                  </Field>
                ))}
              </RadioGroup>

              {/* {inputFieldDescription && (
                <FieldDescription>{inputFieldDescription}</FieldDescription>
              )} */}

              {error && (
                <FieldDescription className="text-destructive">
                  {error.message}
                </FieldDescription>
              )}
            </>
          )}
        />
      );

    case "select":
      return (
        <FieldGroup>
          <Field>
            {label && (
              <FieldLabel htmlFor={name}>
                {label}{" "}
                {required && <span className="text-destructive">*</span>}
              </FieldLabel>
            )}

            <Controller
              name={name}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Select
                    defaultValue={defaultValue}
                    onValueChange={field.onChange}
                    disabled={disabled}
                    {...field}
                    id={name}
                    name={name}
                    required={required}
                    {...otherProps}
                  >
                    <SelectTrigger
                      aria-invalid={!!error}
                      className={error ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectGroup>
                        {options.map((item) => (
                          <SelectItem
                            value={item.value}
                            key={item.value}
                            disabled={item.disabled}
                          >
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {error && (
                    <FieldDescription className="text-destructive">
                      {error.message}
                    </FieldDescription>
                  )}
                  {inputFieldDescription && (
                    <FieldDescription>{inputFieldDescription}</FieldDescription>
                  )}
                </>
              )}
            />
          </Field>
        </FieldGroup>
      );

    case "selectWithLabelInOptions":
      return (
        <FieldGroup>
          <Field>
            {label && (
              <FieldLabel htmlFor={name}>
                {label}{" "}
                {required && <span className="text-destructive">*</span>}
              </FieldLabel>
            )}

            <Controller
              name={name}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Select
                    defaultValue={defaultValue}
                    onValueChange={field.onChange}
                    disabled={disabled}
                    {...field}
                    id={name}
                    name={name}
                    required={required}
                    {...otherProps}
                  >
                    <SelectTrigger
                      aria-invalid={!!error}
                      className={
                        error
                          ? "border-destructive w-full max-w-64"
                          : "w-full max-w-64"
                      }
                    >
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {optionsWithLabel.map((item, index) => (
                        <SelectGroup key={`${item.selectLabel}-${index}`}>
                          <SelectLabel>{item?.selectLabel}</SelectLabel>
                          {item.options?.map((option) => (
                            <SelectItem
                              value={option.value}
                              key={option.value}
                              disabled={option.disabled}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                          <SelectSeparator />
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                  {error && (
                    <FieldDescription className="text-destructive">
                      {error.message}
                    </FieldDescription>
                  )}
                  {inputFieldDescription && (
                    <FieldDescription>{inputFieldDescription}</FieldDescription>
                  )}
                </>
              )}
            />
          </Field>
        </FieldGroup>
      );

    case "selectWithSearch":
      return (
        <FieldGroup>
          <Field>
            {label && (
              <FieldLabel htmlFor={name}>
                {label}{" "}
                {required && <span className="text-destructive">*</span>}
              </FieldLabel>
            )}

            <Controller
              name={name}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Combobox
                    defaultValue={defaultValue}
                    onValueChange={field.onChange}
                    disabled={disabled}
                    {...field}
                    id={name}
                    name={name}
                    required={required}
                    {...otherProps}
                    items={options}
                  >
                    <ComboboxTrigger
                      render={
                        <Button
                          variant="outline"
                          className="w-64 justify-between font-normal"
                        >
                          <ComboboxValue placeholder={placeholder} />
                        </Button>
                      }
                    ></ComboboxTrigger>
                    <ComboboxContent>
                      <ComboboxInput
                        showClear
                        aria-invalid={!!error}
                        className={error ? "border-destructive" : ""}
                        disabled={disabled}
                        showTrigger={false}
                        placeholder="Search"
                      />
                      <ComboboxEmpty>No items found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem
                            key={item.value}
                            value={item.value}
                            disabled={item.disabled}
                          >
                            {item.label}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  {error && (
                    <FieldDescription className="text-destructive">
                      {error.message}
                    </FieldDescription>
                  )}
                  {inputFieldDescription && (
                    <FieldDescription>{inputFieldDescription}</FieldDescription>
                  )}
                </>
              )}
            />
          </Field>
        </FieldGroup>
      );

    case "select-multiple":
      return (
        <FieldGroup>
          <Field>
            {label && (
              <FieldLabel htmlFor={name}>
                {label}{" "}
                {required && <span className="text-destructive">*</span>}
              </FieldLabel>
            )}

            <Controller
              name={name}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Combobox
                    highlightItemOnHover
                    multiple
                    autoHighlight
                    onValueChange={field.onChange}
                    disabled={disabled}
                    {...field}
                    id={name}
                    name={name}
                    required={required}
                    {...otherProps}
                    items={options}
                  >
                    <div className="relative w-full max-w-xs">
                      <ComboboxChips ref={anchor} className="w-full pr-8">
                        <ComboboxValue>
                          {(values) => (
                            <>
                              {values.map((value: string) => (
                                <ComboboxChip key={value}>{value}</ComboboxChip>
                              ))}
                              <ComboboxChipsInput
                                placeholder={
                                  values.length === 0 ? placeholder : ""
                                }
                              />
                            </>
                          )}
                        </ComboboxValue>
                      </ComboboxChips>

                      {/* Clear Button */}
                      {field.value?.length > 0 && (
                        <button
                          type="button"
                          onClick={() => field.onChange([])}
                          className="absolute right-2 top-1/2 -translate-y-1/2 
                 h-4 w-4 flex items-center justify-center
                 text-gray-500 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    <ComboboxContent anchor={anchor}>
                      <ComboboxEmpty>No items found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem
                            key={item.value}
                            value={item.value}
                            disabled={item.disabled}
                          >
                            {item.label}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>

                  {error && (
                    <FieldDescription className="text-destructive">
                      {error.message}
                    </FieldDescription>
                  )}
                  {inputFieldDescription && (
                    <FieldDescription>{inputFieldDescription}</FieldDescription>
                  )}
                </>
              )}
            />
          </Field>
        </FieldGroup>
      );
  }
};

export default CustomInput;
