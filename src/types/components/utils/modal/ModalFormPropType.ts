export interface ModalFormPropType {
  handleModalClose: () => void;
  open: boolean;
  title: string;
  children?: React.ReactNode;
  actionIcon?: React.ReactNode;
  actionText?: string;
  isLoading: boolean;
  subActionIcon?: React.ReactNode;
  subActionText?: string;
  subActionHandler?: () => void;
  subActionType?: 'button' | 'reset';
  formSubmit?: () => void;
}
