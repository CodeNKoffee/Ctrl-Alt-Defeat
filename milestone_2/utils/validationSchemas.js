import * as Yup from "yup";
import { INDUSTRIES, COMPANY_SIZES, VERIFICATION_TYPES, ACCEPTED_FILE_TYPES, FREE_EMAIL_DOMAINS } from "../constants/index";
import i18next from 'i18next';

export const signupValidationSchema = Yup.object().shape({
  companyName: Yup.string()
    .required(i18next.t('validation.companyNameRequired'))
    .min(2, i18next.t('validation.companyNameMin')),
  industry: Yup.string()
    .required(i18next.t('validation.industryRequired'))
    .oneOf(INDUSTRIES, i18next.t('validation.industryInvalid')),
  companyEmail: Yup.string()
    .email(i18next.t('validation.emailInvalid'))
    .required(i18next.t('validation.companyEmailRequired'))
    .test('is-company-email', i18next.t('validation.companyEmailInvalid'), value => {
      if (!value) return false;
      const domain = value.split('@')[1];
      return !FREE_EMAIL_DOMAINS.includes(domain?.toLowerCase());
    }),
  companySize: Yup.string()
    .required(i18next.t('validation.companySizeRequired'))
    .oneOf(COMPANY_SIZES.map(size => size.value), i18next.t('validation.companySizeInvalid')),
  verificationType: Yup.string()
    .required(i18next.t('validation.verificationTypeRequired'))
    .oneOf(VERIFICATION_TYPES.map(type => type.value), i18next.t('validation.verificationTypeInvalid')),
  companyLogo: Yup.mixed()
    .required(i18next.t('validation.companyLogoRequired'))
    .test('fileFormat', i18next.t('validation.fileFormatUnsupported'), value => {
      if (!value) return false;
      return [...ACCEPTED_FILE_TYPES.images, ...ACCEPTED_FILE_TYPES.documents].includes(value.type);
    })
    .test('fileSize', i18next.t('validation.fileTooLarge'), value => {
      if (!value) return false;
      return value.size <= 5 * 1024 * 1024; // 5MB max
    }),
  verificationDocument: Yup.mixed()
    .when('verificationType', {
      is: (value) => value === 'registration' || value === 'taxCard',
      then: (schema) => schema
        .required(i18next.t('validation.verificationDocumentRequired'))
        .test('fileFormat', i18next.t('validation.fileFormatUnsupported'), value => {
          if (!value) return false;
          return [...ACCEPTED_FILE_TYPES.images, ...ACCEPTED_FILE_TYPES.documents].includes(value.type);
        })
        .test('fileSize', i18next.t('validation.fileTooLarge'), value => {
          if (!value) return false;
          return value.size <= 5 * 1024 * 1024; // 5MB max
        }),
      otherwise: (schema) => schema.notRequired()
    }),
  taxId: Yup.string()
    .when('verificationType', {
      is: 'taxId',
      then: (schema) => schema
        .required(i18next.t('validation.taxIdRequired'))
        .matches(/^\d{3}-\d{3}-\d{3}$/, i18next.t('validation.taxIdFormat')),
      otherwise: (schema) => schema.notRequired()
    }),
});

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email(i18next.t('validation.emailInvalid'))
    .required(i18next.t('validation.emailRequired')),
  password: Yup.string()
    .required(i18next.t('validation.passwordRequired'))
});