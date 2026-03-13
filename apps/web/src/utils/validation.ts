import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase, and number'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const addressSchema = z.object({
  line1: z.string().min(1, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  country: z.string().min(1, 'Country is required'),
});

export const businessDetailsSchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  businessType: z.string().min(1, 'Business type is required'),
  registeredAddress: addressSchema,
  tradingAddress: addressSchema,
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

export const directorSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  ownershipPercentage: z
    .number()
    .min(0, 'Must be 0 or greater')
    .max(100, 'Cannot exceed 100%'),
  address: addressSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type BusinessDetailsFormData = z.infer<typeof businessDetailsSchema>;
export type DirectorFormData = z.infer<typeof directorSchema>;
