export interface FormValues {
  readonly name: string;
  readonly age: number;
  readonly email: string;
  readonly password: string;
  readonly confPassword: string;
  readonly gender: string;
  readonly country: string;
  readonly agreement: boolean;
  readonly avatar: File;
}

export interface UniversalFormProps {
  readonly defaultValues?: Partial<FormValues>;
  readonly onSubmit: (data: FormValues) => void;
  readonly mode?: 'controlled' | 'uncontrolled';
}
