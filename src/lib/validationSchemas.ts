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

export const CreateFlyerSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().oneOf(['Jobs', 'Internships', 'Volunteer', 'Events', 'Academics', 'Social', 'Clubs_Organizations', 'Other']).required('Category is required'),
  date: Yup.string().required('Date is required'),
  location: Yup.string().required('Location is required'),
  contactInfo: Yup.string().required('Contact information is required'),
});

export const CompleteProfileSchema = Yup.object({
  fullName: Yup.string().required(),
  email: Yup.string().email().nullable(),
  major: Yup.string().oneOf(Object.values(Major)).required(),
  image: Yup.string().nullable(),
});
