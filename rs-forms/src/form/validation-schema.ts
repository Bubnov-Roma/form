import * as yup from 'yup';
import { countries } from './countries';

const FILE_SIZE = 2 * 1024 * 1024;
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png'];

export const ValidationSchema = yup.object({
  name: yup
    .string()
    .matches(
      /^[A-ZА-ЯЁ][a-zа-яёA-ZА-ЯЁ ]*$/,
      'Must start with a capital letter and contain only letters or spaces'
    )
    .required('Name is required'),
  age: yup
    .number()
    .typeError('Age must be a number')
    .required('Age is required')
    .positive('Age must be positive')
    .integer('Age must be an integer')
    .max(100, 'Age cannot be more than 100'),
  email: yup
    .string()
    .email('Incorrect email')
    .matches(
      /^((([\dA-Za-z][\d.A-z-]+[\dA-Za-z])|([\dА-я][\d.А-я-]+[\dА-я]))@([A-Za-z-]+\.){1,2}[A-Za-z-]{2,})$/,
      'Incorrect email'
    )
    .required('Required email'),
  password: yup
    .string()
    .min(8, 'Password must be 8 or more characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/^[^#]*$/, 'Password must not contain a hash symbol')
    .matches(/^[^%]*$/, 'Password must not contain a percent symbol')
    .matches(
      /[!$&?@]/,
      'Password must contain at least 1 special character - !$&?@'
    )
    .matches(/^[^ ]{2,}$/, 'The password must not contain spaces')
    .required('Password is required'),
  confPassword: yup
    .string()
    .min(8, 'Password must be 8 or more characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/^[^#]*$/, 'Password must not contain a hash symbol')
    .matches(/^[^%]*$/, 'Password must not contain a percent symbol')
    .matches(
      /[!$&?@]/,
      'Password must contain at least 1 special character - !$&?@'
    )
    .matches(/^[^ ]{2,}$/, 'The password must not contain spaces')
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  gender: yup.string().required('Gender is required'),
  country: yup
    .string()
    .oneOf(
      countries.map((c) => c.value),
      'Please select a valid country'
    )
    .required('Country is required'),
  agreement: yup
    .bool()
    .oneOf([true], 'You must accept the agreement')
    .required('You must accept the agreement'),
  avatar: yup
    .mixed<File>()
    .nullable()
    .test(
      'fileSize',
      'File is too large (max 2MB)',
      (file) => !file || file.size <= FILE_SIZE
    )
    .test(
      'fileFormat',
      'Unsupported file format',
      (file) => !file || SUPPORTED_FORMATS.includes(file.type)
    )
    .required('Avatar is required'),
});
