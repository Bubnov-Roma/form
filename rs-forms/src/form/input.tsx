import { Controller, type Control } from 'react-hook-form';
import styles from './form.module.css';
import type { FormValues } from '../interfaces';
import { useSelector } from 'react-redux';
import { type RootState } from '../store';

interface BaseProps {
  label: string;
  error?: string;
  options?: string[];
}

type ControlledProps = BaseProps & {
  control: Control<FormValues>;
  name: keyof FormValues;
  type?: string;
};

export function Input(props: ControlledProps) {
  const countries = useSelector(
    (state: RootState) => state.countries.allCountries
  );

  const { control, name, label, type = 'text', error, options } = props;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        if (type === 'autocomplete') {
          return (
            <div className={styles.field}>
              <label htmlFor={name} className={styles.label}>
                {label}
              </label>
              <input
                id={name}
                list={`${name}-list`}
                value={`${field.value}`}
                onChange={field.onChange}
                className={`${styles.input} ${error ? styles.errorInput : ''}`}
              />
              <datalist id={`${name}-list`}>
                {countries.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </datalist>
              {error && <p className={styles.errorText}>{error}</p>}
            </div>
          );
        }

        if (type === 'file') {
          return (
            <div className={styles.formAvatarBlock}>
              <label className={styles.label} htmlFor={name}>
                {label}
              </label>
              <label className={styles.avatarUpload} htmlFor={name}>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  id={name}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    field.onChange(file);
                  }}
                  className={styles.fileInput}
                />
                {field.value instanceof File ? (
                  <img
                    src={URL.createObjectURL(field.value)}
                    alt="avatar"
                    className={styles.avatarPreview}
                  />
                ) : (
                  <span className={styles.avatarIcon}>👤</span>
                )}
              </label>
              {error && <p className={styles.errorText}>{error}</p>}
            </div>
          );
        }

        if (type === 'checkbox') {
          return (
            <div className={styles.fieldCheckbox}>
              <div className={styles.checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={!!field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className={styles.checkbox}
                  id={name}
                />
                <label className={styles.label} htmlFor={name}>
                  {label}
                </label>
              </div>
              {error && <p className={styles.errorText}>{error}</p>}
            </div>
          );
        }

        if (type === 'select' && options) {
          return (
            <div className={styles.field}>
              <label className={styles.label} htmlFor={name}>
                {label}
              </label>
              <select
                id={name}
                value={`${field.value}`}
                onChange={field.onChange}
                className={`${styles.input} ${error ? styles.errorInput : ''}`}
              >
                <option value="">Select {label}</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {error && <p className={styles.errorText}>{error}</p>}
            </div>
          );
        }

        return (
          <div className={styles.field}>
            <label className={styles.label} htmlFor={name}>
              {label}
            </label>
            <input
              id={name}
              type={type}
              value={`${field.value}`}
              onChange={field.onChange}
              className={`${styles.input} ${error ? styles.errorInput : ''}`}
            />
            {error && <p className={styles.errorText}>{error}</p>}
          </div>
        );
      }}
    />
  );
}
