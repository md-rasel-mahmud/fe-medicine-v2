export type InputFieldsType = {
  id: string;
  label: string;
  required: boolean;
  disabled?: boolean;
  visibility?: boolean;
  size?: 'small' | 'medium';
  column?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  name?: string;
  type: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  startAdornment?: boolean;
  startAdornmentIcon?: JSX.Element;
  endAdornment?: boolean;
  endAdornmentIcon?: JSX.Element;
};

export type InputFieldsPropType = {
  formData: InputFieldsType[];
  column?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  control: any;
};
