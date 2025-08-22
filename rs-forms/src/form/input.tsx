import { Controller, type Control } from 'react-hook-form';
import type { ReactElement } from 'react';
import type { FormValues } from '../interfaces';

interface FormInputProperties {
  name: keyof FormValues;
  control: Control<FormValues>;
  label: string;
  type: string;
  options?: string[];
}

export const Input = ({
  name,
  control,
  label,
  type,
  options,
}: FormInputProperties): ReactElement => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div style={{ marginBottom: '12px' }}>
          {type !== 'checkbox' && <label>{label}</label>}

          {type === 'checkbox' ? (
            <input
              type="checkbox"
              checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          ) : type === 'select' && options ? (
            <select
              value={(field.value as string) ?? ''}
              onChange={(e) => field.onChange(e.target.value)}
            >
              <option value="">Select {label}</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : type === 'file' ? (
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
            />
          ) : type === 'autocomplete' && options ? (
            <>
              <input
                list={`${name}-list`}
                value={(field.value as string) ?? ''}
                onChange={field.onChange}
              />
              <datalist id={`${name}-list`}>
                {options.map((opt) => (
                  <option key={opt} value={opt} />
                ))}
              </datalist>
            </>
          ) : (
            <input
              type={type}
              value={field.value as string | number}
              onChange={field.onChange}
            />
          )}
          {fieldState.error && (
            <p style={{ color: 'red' }}>{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
};
