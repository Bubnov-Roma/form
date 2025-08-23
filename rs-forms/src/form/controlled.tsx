import { Input } from './input';
import { yupResolver } from '@hookform/resolvers/yup';
import { ValidationSchema } from './validation-schema';
import { useForm } from 'react-hook-form';
import type { FormValues, UniversalFormProps } from '../interfaces';
import styles from './form.module.css';

export function ControlledForm({
  defaultValues,
  onSubmit,
}: UniversalFormProps) {
  const { handleSubmit, control, formState } = useForm<FormValues>({
    mode: 'onChange',
    resolver: yupResolver(ValidationSchema),
    defaultValues: {
      name: '',
      age: 0,
      email: '',
      password: '',
      confPassword: '',
      gender: '',
      country: '',
      agreement: false,
      avatar: null as unknown as File,
      ...defaultValues,
    },
  });

  const handleControlledSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleControlledSubmit)}
      className={styles.form}
    >
      <div className={styles.formAvatarBlock}>
        <Input
          control={control}
          name="avatar"
          type="file"
          label="Avatar"
          error={formState.errors.avatar?.message}
        />
      </div>

      <div className={styles.formBlock}>
        <Input
          control={control}
          name="name"
          type="text"
          label="Name"
          error={formState.errors.name?.message}
        />
        <Input
          control={control}
          name="age"
          type="number"
          label="Age"
          error={formState.errors.age?.message}
        />
      </div>

      <div className={styles.formBlock}>
        <Input
          control={control}
          name="email"
          type="text"
          label="Email"
          error={formState.errors.email?.message}
        />
      </div>

      <div className={styles.formBlock}>
        <Input
          control={control}
          name="password"
          type="password"
          label="Password"
          error={formState.errors.password?.message}
        />
        <Input
          control={control}
          name="confPassword"
          type="password"
          label="Confirm Password"
          error={formState.errors.confPassword?.message}
        />
      </div>

      <div className={styles.formBlock}>
        <Input
          control={control}
          name="gender"
          type="select"
          label="Gender"
          options={['Male', 'Female', 'Other']}
          error={formState.errors.gender?.message}
        />
        <Input
          control={control}
          name="country"
          type="autocomplete"
          label="Country"
          error={formState.errors.country?.message}
        />
      </div>

      <div className={styles.formBlock}>
        <Input
          control={control}
          name="agreement"
          type="checkbox"
          label="Accept Terms and Conditions Agreement"
          error={formState.errors.agreement?.message}
        />
      </div>

      <button
        type="submit"
        disabled={!formState.isValid}
        className={styles.button}
      >
        Submit
      </button>
    </form>
  );
}
