import { ModalFormPropType } from '../modal/ModalFormPropType';
import { InputFieldsPropType } from './InputFieldsType';

type InputFieldAndModalFormPropType = ModalFormPropType & InputFieldsPropType;

export interface FormComponentProps extends InputFieldAndModalFormPropType {
  formType: 'MODAL' | 'PAGE';
}
