import * as Yup from "yup";
import { INDUSTRIES, COMPANY_SIZES, VERIFICATION_TYPES, ACCEPTED_FILE_TYPES } from "../constants/index";
import { FREE_EMAIL_DOMAINS } from "../constants/index";

export const signupValidationSchema = Yup.object().shape({
  companyName: Yup.string()
    .required('Company name is required')
    .min(2, 'Company name must be at least 2 characters'),
  industry: Yup.string()
    .required('Industry is required')
    .oneOf(INDUSTRIES, 'Please select a valid industry'),
  companyEmail: Yup.string()
    .email('Invalid email address')
    .required('Company email is required')
    .test('is-company-email', 'Please use a valid company email address', value => {
      if (!value) return false;
      const domain = value.split('@')[1];
      return !FREE_EMAIL_DOMAINS.includes(domain?.toLowerCase());
    }),
  companySize: Yup.string()
    .required('Company size is required')
    .oneOf(COMPANY_SIZES.map(size => size.value), 'Please select a valid company size'),
  verificationType: Yup.string()
    .required('Verification type is required')
    .oneOf(VERIFICATION_TYPES.map(type => type.value), 'Please select a valid verification type'),
  companyLogo: Yup.mixed()
    .required('Company logo is required')
    .test('fileFormat', 'Unsupported file format', value => {
      if (!value) return false;
      return [...ACCEPTED_FILE_TYPES.images, ...ACCEPTED_FILE_TYPES.documents].includes(value.type);
    })
    .test('fileSize', 'File too large', value => {
      if (!value) return false;
      return value.size <= 5 * 1024 * 1024; // 5MB max
    }),
  verificationDocument: Yup.mixed()
    .when('verificationType', {
      is: (value) => value === 'registration' || value === 'taxCard',
      then: (schema) => schema
        .required('Verification document is required')
        .test('fileFormat', 'Unsupported file format', value => {
          if (!value) return false;
          return [...ACCEPTED_FILE_TYPES.images, ...ACCEPTED_FILE_TYPES.documents].includes(value.type);
        })
        .test('fileSize', 'File too large', value => {
          if (!value) return false;
          return value.size <= 5 * 1024 * 1024; // 5MB max
        }),
    }),
  taxId: Yup.string()
    .when('verificationType', {
      is: 'taxId',
      then: (schema) => schema
        .required('Tax ID is required')
        .matches(/^\d{3}-\d{3}-\d{3}$/, 'Tax ID must be in format XXX-XXX-XXX'),
    }),
});

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
});