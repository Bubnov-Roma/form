import { useState } from 'react';
import { ValidationSchema } from './validation-schema';
import type { FormValues, UniversalFormProps } from '../interfaces';
import styles from './form.module.css';
import { ValidationError } from 'yup';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';

export function UncontrolledForm({
  defaultValues,
  onSubmit,
}: UniversalFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const countries = useSelector(
    (state: RootState) => state.countries.allCountries
  );

  const handleUncontrolledSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const rawData: FormValues = {
      name: formData.get('name') as string,
      age: Number(formData.get('age')),
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confPassword: formData.get('confPassword') as string,
      gender: formData.get('gender') as string,
      country: formData.get('country') as string,
      agreement: formData.get('agreement') === 'on',
      avatar: (formData.get('avatar') as File) ?? ({} as File),
    };

    try {
      const validated = await ValidationSchema.validate(rawData, {
        abortEarly: false,
      });
      setErrors({});
      onSubmit(validated);
    } catch (err) {
      if (err instanceof ValidationError) {
        const fieldErrors: Record<string, string> = {};
        err.inner.forEach((e) => {
          if (e.path) {
            fieldErrors[e.path] = e.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error(err);
      }
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  return (
    <form onSubmit={handleUncontrolledSubmit} className={styles.form}>
      <div className={styles.formAvatarBlock}>
        <label className={styles.label}>Avatar</label>
        <label className={styles.avatarUpload}>
          <input
            name="avatar"
            type="file"
            accept="image/png,image/jpeg"
            className={styles.fileInput}
            onChange={handleAvatarChange}
          />
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="avatar"
              className={styles.avatarPreview}
            />
          ) : (
            <span className={styles.avatarIcon}>👤</span>
          )}
        </label>
        {errors.avatar && <p className={styles.errorText}>{errors.avatar}</p>}
      </div>
      <div className={styles.formBlock}>
        <div className={styles.field}>
          <label className={styles.label}>Name</label>
          <input
            name="name"
            type="text"
            defaultValue={defaultValues?.name}
            className={`${styles.input} ${errors.name ? styles.errorInput : ''}`}
          />
          {errors.name && <p className={styles.errorText}>{errors.name}</p>}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Age</label>
          <input
            name="age"
            type="number"
            defaultValue={defaultValues?.age}
            className={`${styles.input} ${errors.age ? styles.errorInput : ''}`}
          />
          {errors.age && <p className={styles.errorText}>{errors.age}</p>}
        </div>
      </div>
      <div className={styles.formBlock}>
        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input
            name="email"
            type="text"
            defaultValue={defaultValues?.email}
            className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
          />
          {errors.email && <p className={styles.errorText}>{errors.email}</p>}
        </div>
      </div>
      <div className={styles.formBlock}>
        <div className={styles.field}>
          <label className={styles.label}>Password</label>
          <input
            name="password"
            type="password"
            className={`${styles.input} ${errors.password ? styles.errorInput : ''}`}
          />
          {errors.password && (
            <p className={styles.errorText}>{errors.password}</p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Confirm Password</label>
          <input
            name="confPassword"
            type="password"
            className={`${styles.input} ${errors.confPassword ? styles.errorInput : ''}`}
          />
          {errors.confPassword && (
            <p className={styles.errorText}>{errors.confPassword}</p>
          )}
        </div>
      </div>

      <div className={styles.formBlock}>
        <div className={styles.field}>
          <label className={styles.label}>Gender</label>
          <select
            name="gender"
            defaultValue={defaultValues?.gender}
            className={`${styles.select} ${errors.gender ? styles.errorInput : ''}`}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className={styles.errorText}>{errors.gender}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Country</label>
          <input
            name="country"
            list="country-list"
            defaultValue={defaultValues?.country}
            className={`${styles.input} ${
              errors.country ? styles.errorInput : ''
            }`}
          />
          <datalist id="country-list">
            {countries.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </datalist>
          {errors.country && (
            <p className={styles.errorText}>{errors.country}</p>
          )}
        </div>
      </div>

      <div className={styles.formBlock}>
        <div className={styles.fieldCheckbox}>
          <div className={styles.checkboxWrapper}>
            <input
              name="agreement"
              type="checkbox"
              defaultChecked={defaultValues?.agreement}
              className={styles.checkbox}
            />
            <label>Accept Terms and Conditions Agreement</label>
          </div>
          {errors.agreement && (
            <p className={styles.errorText}>{errors.agreement}</p>
          )}
        </div>
      </div>
      <button type="submit" className={styles.button}>
        Submit
      </button>
    </form>
  );
}
