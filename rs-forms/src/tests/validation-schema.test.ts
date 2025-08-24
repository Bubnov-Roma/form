import { describe, it, expect } from 'vitest';
import { ValidationSchema } from '../form/validation-schema';

describe('ValidationSchema', () => {
  const baseValidData = {
    name: 'John',
    age: 25,
    email: 'john@example.com',
    password: 'Strong1@',
    confPassword: 'Strong1@',
    gender: 'Male',
    country: 'US',
    agreement: true,
    avatar: new File(['avatar'], 'avatar.png', { type: 'image/png' }),
  };

  it('accepts valid data', async () => {
    await expect(
      ValidationSchema.validate(baseValidData)
    ).resolves.toBeTruthy();
  });

  it('rejects invalid name', async () => {
    const data = { ...baseValidData, name: 'john' };
    await expect(ValidationSchema.validate(data)).rejects.toThrow(
      /Must start with a capital letter/
    );
  });

  it('rejects invalid age', async () => {
    const data = { ...baseValidData, age: 150 };
    await expect(ValidationSchema.validate(data)).rejects.toThrow(
      /Age cannot be more than 100/
    );
  });

  it('rejects invalid email', async () => {
    const data = { ...baseValidData, email: 'not-an-email' };
    await expect(ValidationSchema.validate(data)).rejects.toThrow(
      /Incorrect email/
    );
  });

  it('rejects mismatched passwords', async () => {
    const data = { ...baseValidData, confPassword: 'Different1@' };
    await expect(ValidationSchema.validate(data)).rejects.toThrow(
      /Passwords must match/
    );
  });

  it('rejects missing gender', async () => {
    const data = { ...baseValidData, gender: '' };
    await expect(ValidationSchema.validate(data)).rejects.toThrow(
      /Gender is required/
    );
  });

  it('rejects invalid country', async () => {
    const data = { ...baseValidData, country: 'INVALID' };
    await expect(ValidationSchema.validate(data)).rejects.toThrow(
      /Please select a valid country/
    );
  });

  it('rejects unchecked agreement', async () => {
    const data = { ...baseValidData, agreement: false };
    await expect(ValidationSchema.validate(data)).rejects.toThrow(
      /You must accept the agreement/
    );
  });

  it('rejects large file', async () => {
    const bigFile = new File([new ArrayBuffer(3 * 1024 * 1024)], 'big.png', {
      type: 'image/png',
    });
    const data = { ...baseValidData, avatar: bigFile };
    await expect(ValidationSchema.validate(data)).rejects.toThrow(
      /File is too large/
    );
  });

  it('rejects unsupported file type', async () => {
    const wrongFile = new File(['pdf'], 'file.pdf', {
      type: 'application/pdf',
    });
    const data = { ...baseValidData, avatar: wrongFile };
    await expect(ValidationSchema.validate(data)).rejects.toThrow(
      /Unsupported file format/
    );
  });

  it('rejects missing avatar', async () => {
    const data = { ...baseValidData, avatar: null };
    await expect(ValidationSchema.validate(data)).rejects.toThrow(
      /Avatar is required/
    );
  });
});
