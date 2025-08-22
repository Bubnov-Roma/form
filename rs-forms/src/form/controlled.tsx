import { useEffect, useState } from 'react';
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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { handleSubmit, control, formState, watch } = useForm<FormValues>({
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

  const avatarFile = watch('avatar');

  useEffect(() => {
    if (avatarFile instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(avatarFile);
    } else {
      setAvatarPreview(null);
    }
  }, [avatarFile]);

  const handleControlledSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleControlledSubmit)}>
      <Input control={control} name="name" type="text" label="Name" />
      <Input control={control} name="age" type="number" label="Age" />
      <Input control={control} name="email" type="text" label="Email" />
      <Input
        control={control}
        name="password"
        type="password"
        label="Password"
      />
      <Input
        control={control}
        name="confPassword"
        type="password"
        label="Confirm Password"
      />
      <Input
        control={control}
        name="gender"
        type="select"
        label="Gender"
        options={['Male', 'Female', 'Other']}
      />
      <Input
        control={control}
        name="country"
        type="select"
        label="Country"
        options={['Germany', 'USA', 'Canada', 'UK', 'Australia']}
      />
      <Input
        control={control}
        name="agreement"
        type="checkbox"
        label="Accept T&C"
      />
      <Input control={control} name="avatar" type="file" label="Avatar" />

      {avatarPreview && (
        <img src={avatarPreview} alt="preview" width={80} height={80} />
      )}

      <button
        type="submit"
        disabled={!formState.isValid}
        className={styles.button}
      >
        Control
      </button>
    </form>
  );
}
