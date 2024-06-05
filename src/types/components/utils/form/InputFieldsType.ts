export type InputFieldsType = {
  id: string;
  label: string;
  required: boolean;
  disabled?: boolean;
  visibility?: boolean;
  column?: { xs: number; sm: number; md: number; lg: number; xl: number };
  name?: string;
  type: string;
  placeholder?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type InputFieldsPropType = {
  formData: InputFieldsType[];
  column: number;
  control: any;
};
