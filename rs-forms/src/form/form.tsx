import type { UniversalFormProps } from '../interfaces';
import { UncontrolledForm } from './uncontrolled';
import { ControlledForm } from './controlled';

export const UniversalForm = ({
  defaultValues,
  onSubmit,
  mode = 'controlled',
}: UniversalFormProps) => {
  return mode === 'controlled' ? (
    <ControlledForm {...{ defaultValues, onSubmit }} />
  ) : (
    <UncontrolledForm {...{ defaultValues, onSubmit }} />
  );
};
