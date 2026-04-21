import * as Yup from 'yup';
import { Major } from '@prisma/client';

export const AddStuffSchema = Yup.object({
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const EditStuffSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const CreateAccountSchema = Yup.object({
  fullName: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  major: Yup.string().nullable(),
  image: Yup.string().nullable(),
});

export const CompleteProfileSchema = Yup.object({
  fullName: Yup.string().required(),
  email: Yup.string().email().nullable(),
  major: Yup.string().oneOf(Object.values(Major)).required(),
  image: Yup.string().nullable(),
});
