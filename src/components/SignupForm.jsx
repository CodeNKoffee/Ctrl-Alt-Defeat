"use client";

import { Formik, Form } from "formik";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import { INDUSTRIES, COMPANY_SIZES, VERIFICATION_TYPES, ACCEPTED_FILE_TYPES, FREE_EMAIL_DOMAINS } from "../../constants/index";
import { capitalizeWords } from "../../utils/index";
import SearchableSelect from "@/components/SearchableSelect";
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';
import * as Yup from 'yup';

export default function SignupForm() {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // TODO: Implement signup logic
      console.log('Form values:', values);

      // Show success toast notification
      toast.success(safeT('signup.messages.success'), {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });

      // For demo purposes, you can uncomment this to show an error toast
      // toast.error('Application has been rejected. Please check your email.', {
      //   position: 'top-right',
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true
      // });
    } catch (error) {
      console.error('Signup error:', error);

      // Show error toast notification
      toast.error(safeT('signup.messages.error'), {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Dynamic validation schema with translations
  const validationSchema = Yup.object().shape({
    companyName: Yup.string()
      .required(safeT('validation.companyNameRequired'))
      .min(2, safeT('validation.companyNameMin')),
    industry: Yup.string()
      .required(safeT('validation.industryRequired'))
      .oneOf(INDUSTRIES, safeT('validation.industryInvalid')),
    companyEmail: Yup.string()
      .email(safeT('validation.emailInvalid'))
      .required(safeT('validation.companyEmailRequired'))
      .test('is-company-email', safeT('validation.companyEmailInvalid'), value => {
        if (!value) return false;
        const domain = value.split('@')[1];
        return !FREE_EMAIL_DOMAINS.includes(domain?.toLowerCase());
      }),
    companySize: Yup.string()
      .required(safeT('validation.companySizeRequired'))
      .oneOf(COMPANY_SIZES.map(size => size.value), safeT('validation.companySizeInvalid')),
    verificationType: Yup.string()
      .required(safeT('validation.verificationTypeRequired'))
      .oneOf(VERIFICATION_TYPES.map(type => type.value), safeT('validation.verificationTypeInvalid')),
    companyLogo: Yup.mixed()
      .required(safeT('validation.companyLogoRequired'))
      .test('fileFormat', safeT('validation.fileFormatUnsupported'), value => {
        if (!value) return false;
        return [...ACCEPTED_FILE_TYPES.images].includes(value.type);
      })
      .test('fileSize', safeT('validation.fileTooLarge'), value => {
        if (!value) return false;
        return value.size <= 5 * 1024 * 1024;
      }),
    verificationDocument: Yup.mixed()
      .when('verificationType', {
        is: (value) => value === 'registration' || value === 'taxCard',
        then: (schema) => schema
          .required(safeT('validation.verificationDocumentRequired'))
          .test('fileFormat', safeT('validation.fileFormatUnsupported'), value => {
            if (!value) return false;
            return [...ACCEPTED_FILE_TYPES.images, ...ACCEPTED_FILE_TYPES.documents].includes(value.type);
          })
          .test('fileSize', safeT('validation.fileTooLarge'), value => {
            if (!value) return false;
            return value.size <= 5 * 1024 * 1024;
          }),
        otherwise: (schema) => schema.notRequired()
      }),
    taxId: Yup.string()
      .when('verificationType', {
        is: 'taxId',
        then: (schema) => schema
          .required(safeT('validation.taxIdRequired'))
          .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{3}$/, safeT('validation.taxIdFormat')),
        otherwise: (schema) => schema.notRequired()
      }),
  });

  return (
    <Formik
      initialValues={{
        companyName: '',
        industry: '',
        companyEmail: '',
        companySize: '',
        verificationType: '',
        companyLogo: null,
        verificationDocument: null,
        taxId: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting, setFieldValue, isValid, dirty, values }) => (
        <Form className="space-y-6 w-full mx-auto">
          <div className="flex flex-wrap gap-x-8 gap-y-12">
            {/* Company Name */}
            <div className="w-full md:w-[calc(50%-16px)]">
              <FloatingLabelInput
                name="companyName"
                type="text"
                label={safeT('signup.labels.companyName')}
                errors={errors}
                touched={touched}
                onChange={(e) => {
                  const capitalizedValue = capitalizeWords(e.target.value);
                  setFieldValue('companyName', capitalizedValue);
                }}
              />
            </div>

            {/* Company Email */}
            <div className="w-full md:w-[calc(50%-16px)]">
              <FloatingLabelInput
                name="companyEmail"
                type="email"
                label={safeT('signup.labels.companyEmail')}
                errors={errors}
                touched={touched}
                tooltip={safeT('signup.tooltips.companyEmail')}
              />
            </div>

            {/* Industry */}
            <div className="w-full md:w-[calc(50%-16px)]">
              <SearchableSelect
                name="industry"
                label={safeT('signup.labels.industry')}
                value={values.industry}
                options={INDUSTRIES.map(i => ({ label: i, value: i }))}
                onChange={e => setFieldValue('industry', e.target.value)}
                onBlur={e => setFieldValue('industry', e.target.value)}
                error={errors.industry}
                touched={touched.industry}
                placeholder={safeT('signup.placeholders.industry')}
              />
            </div>

            {/* Company Size */}
            <div className="w-full md:w-[calc(50%-16px)]">
              <SearchableSelect
                name="companySize"
                label={safeT('signup.labels.companySize')}
                value={values.companySize}
                options={COMPANY_SIZES.map(s => ({ label: safeT(`signup.companySizes.${s.value}`), value: s.value }))}
                onChange={e => setFieldValue('companySize', e.target.value)}
                onBlur={e => setFieldValue('companySize', e.target.value)}
                error={errors.companySize}
                touched={touched.companySize}
                placeholder={safeT('signup.placeholders.companySize')}
              />
            </div>

            {/* Verification and Logo Section */}
            <div className="flex flex-wrap gap-8 w-full">
              {/* Verification Type */}
              <div className="w-full md:w-[calc(50%-16px)] space-y-3">
                <label className="block text-lg font-medium text-metallica-blue-off-charts rtl:text-right ltr:text-left">
                  {safeT('signup.labels.verificationType')}
                </label>
                <div className="space-y-2">
                  {VERIFICATION_TYPES.map((type) => (
                    <label key={type.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="verificationType"
                        value={type.value}
                        onChange={(e) => setFieldValue('verificationType', e.target.value)}
                        className="h-4 w-4 text-metallica-blue-off-charts focus:ring-metallica-blue-off-charts"
                      />
                      <span className="text-sm text-gray-700">{safeT(`signup.verificationTypes.${type.value}`)}</span>
                    </label>
                  ))}
                </div>
                {errors.verificationType && touched.verificationType && (
                  <div className="text-red-500 text-sm">{errors.verificationType}</div>
                )}
              </div>

              {/* Company Logo */}
              <div className="w-full md:w-[calc(50%-16px)] space-y-3">
                <label className="block text-lg font-medium text-metallica-blue-off-charts rtl:text-right ltr:text-left">
                  {safeT('signup.labels.companyLogo')}
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="companyLogo"
                    accept={[...ACCEPTED_FILE_TYPES.images].join(',')}
                    onChange={(event) => {
                      setFieldValue('companyLogo', event.currentTarget.files[0]);
                    }}
                    className="hidden"
                    id="companyLogo"
                  />
                  <label
                    htmlFor="companyLogo"
                    className={`w-full px-4 py-2 border rounded-lg cursor-pointer flex items-center ${errors.companyLogo && touched.companyLogo ? 'border-red-500' : 'border-gray-300'
                      }`}
                  >
                    <span className="text-gray-500">
                      {values.companyLogo?.name || safeT('signup.labels.chooseFile')}
                    </span>
                    <span className="ml-auto bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-700">
                      {safeT('signup.labels.browse')}
                    </span>
                  </label>
                </div>
                <div className="text-sm text-gray-500 rtl:text-right ltr:text-left">
                  {safeT('signup.labels.acceptedLogoFormats')}
                </div>
                {errors.companyLogo && touched.companyLogo && (
                  <div className="text-red-500 text-sm">{errors.companyLogo}</div>
                )}
              </div>
            </div>

            {/* Conditional Fields */}
            {values.verificationType && (
              <div className="flex flex-wrap gap-8 w-full md:items-end">
                {values.verificationType === 'taxId' ? (
                  <div className="w-full md:w-[calc(50%-16px)] animate-slideIn">
                    <FloatingLabelInput
                      name="taxId"
                      type="text"
                      label={safeT('signup.labels.taxId')}
                      placeholder={safeT('signup.placeholders.taxId')}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                ) : (
                  <div className="w-full md:w-[calc(50%-16px)] space-y-3 animate-slideIn">
                    <label className="block text-lg font-medium text-metallica-blue-off-charts rtl:text-right ltr:text-left">
                      {values.verificationType === 'registration' ? safeT('signup.labels.companyRegistrationDocument') : safeT('signup.labels.taxCardDocument')}
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        name="verificationDocument"
                        accept={[...ACCEPTED_FILE_TYPES.images, ...ACCEPTED_FILE_TYPES.documents].join(',')}
                        onChange={(event) => {
                          setFieldValue('verificationDocument', event.currentTarget.files[0]);
                        }}
                        className="hidden"
                        id="verificationDocument"
                      />
                      <label
                        htmlFor="verificationDocument"
                        className={`w-full px-4 py-2 border rounded-lg cursor-pointer flex items-center ${errors.verificationDocument && touched.verificationDocument ? 'border-red-500' : 'border-gray-300'
                          }`}
                      >
                        <span className="text-gray-500">
                          {values.verificationDocument?.name || safeT('signup.labels.chooseFile')}
                        </span>
                        <span className="ml-auto bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-700">
                          {safeT('signup.labels.browse')}
                        </span>
                      </label>
                    </div>
                    <div className="text-sm text-gray-500 rtl:text-right ltr:text-left">
                      {safeT('signup.labels.acceptedDocFormats')}
                    </div>
                    {errors.verificationDocument && touched.verificationDocument && (
                      <div className="text-red-500 text-sm">{errors.verificationDocument}</div>
                    )}
                  </div>
                )}
                <div className={`transition-all duration-300 ease-in-out ${values.verificationType ? 'w-full md:w-[calc(50%-16px)]' : 'w-full'}`}>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid || !dirty}
                    className="font-bold w-full py-3 px-4 bg-metallica-blue-off-charts text-white rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-metallica-blue-950"
                  >
                    {isSubmitting ? safeT('signup.labels.processing') : safeT('signup.labels.submit')}
                  </button>
                  {/* <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto">{JSON.stringify({ isValid, dirty, errors, values }, null, 2)}</pre> */}
                </div>
              </div>
            )}

            {!values.verificationType && (
              <button
                type="submit"
                disabled={isSubmitting || !isValid || !dirty}
                className="font-bold w-full py-3 px-4 bg-metallica-blue-off-charts text-white rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-metallica-blue-950"
              >
                {isSubmitting ? safeT('signup.labels.processing') : safeT('signup.labels.submit')}
              </button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
} 