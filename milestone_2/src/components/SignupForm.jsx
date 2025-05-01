'use client';

import { Formik, Form } from 'formik';
import { signupValidationSchema } from '../../utils/validationSchemas';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import { INDUSTRIES, COMPANY_SIZES, VERIFICATION_TYPES, ACCEPTED_FILE_TYPES } from '../../constants/index';
import { capitalizeWords } from '../../utils/index';

export default function SignupForm() {
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // TODO: Implement signup logic
      console.log('Form values:', values);
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setSubmitting(false);
    }
  };

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
      validationSchema={signupValidationSchema}
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
                label="Company Name *"
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
                label="Company Email *"
                errors={errors}
                touched={touched}
                tooltip="Please enter an official company email address that you use for business communications. Free email providers (Gmail, Yahoo, etc.) are not accepted."
              />
            </div>

            {/* Industry */}
            <div className="w-full md:w-[calc(50%-16px)]">
              <div className="relative">
                <select
                  name="industry"
                  onChange={(e) => setFieldValue('industry', e.target.value)}
                  onBlur={(e) => setFieldValue('industry', e.target.value)}
                  value={values.industry}
                  className={`w-full h-14 px-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-metallica-blue-off-charts transition-colors peer appearance-none ${!values.industry ? 'text-transparent' : ''} ${errors.industry && touched.industry ? 'border-red-500' : ''}`}
                >
                  <option value=""></option>
                  {INDUSTRIES.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
                <label
                  className={`absolute left-0 transition-all duration-200 pointer-events-none ${values.industry ? '-top-2.5 text-sm text-metallica-blue-off-charts' : 'top-4 text-gray-400'
                    } ${errors.industry && touched.industry ? 'text-red-500' : ''}`}
                >
                  Industry *
                </label>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {errors.industry && touched.industry && (
                  <div className="text-red-500 text-sm mt-1">{errors.industry}</div>
                )}
              </div>
            </div>

            {/* Company Size */}
            <div className="w-full md:w-[calc(50%-16px)]">
              <div className="relative">
                <select
                  name="companySize"
                  onChange={(e) => setFieldValue('companySize', e.target.value)}
                  onBlur={(e) => setFieldValue('companySize', e.target.value)}
                  value={values.companySize}
                  className={`w-full h-14 px-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-metallica-blue-off-charts transition-colors peer appearance-none ${!values.companySize ? 'text-transparent' : ''} ${errors.companySize && touched.companySize ? 'border-red-500' : ''}`}
                >
                  <option value=""></option>
                  {COMPANY_SIZES.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
                <label
                  className={`absolute left-0 transition-all duration-200 pointer-events-none ${values.companySize ? '-top-2.5 text-sm text-metallica-blue-off-charts' : 'top-4 text-gray-400'
                    } ${errors.companySize && touched.companySize ? 'text-red-500' : ''}`}
                >
                  Company Size *
                </label>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {errors.companySize && touched.companySize && (
                  <div className="text-red-500 text-sm mt-1">{errors.companySize}</div>
                )}
              </div>
            </div>

            {/* Verification and Logo Section */}
            <div className="flex flex-wrap gap-8 w-full">
              {/* Verification Type */}
              <div className="w-full md:w-[calc(50%-16px)] space-y-3">
                <label className="block text-lg font-medium text-metallica-blue-off-charts">
                  Company Verification Type *
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
                      <span className="text-sm text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
                {errors.verificationType && touched.verificationType && (
                  <div className="text-red-500 text-sm">{errors.verificationType}</div>
                )}
              </div>

              {/* Company Logo */}
              <div className="w-full md:w-[calc(50%-16px)] space-y-3">
                <label className="block text-lg font-medium text-metallica-blue-off-charts">
                  Company Logo *
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
                      {values.companyLogo?.name || 'Choose file...'}
                    </span>
                    <span className="ml-auto bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-700">
                      Browse
                    </span>
                  </label>
                </div>
                <div className="text-sm text-gray-500">
                  Accepted formats: JPG, PNG, SVG (Preferred dimensions: 200x200px)
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
                      label="Tax ID"
                      placeholder="XXX-XXX-XXX"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                ) : (
                  <div className="w-full md:w-[calc(50%-16px)] space-y-3 animate-slideIn">
                    <label className="block text-lg font-medium text-metallica-blue-off-charts">
                      {values.verificationType === 'taxId' ? 'Tax Card *' : 'Company Registration Document *'}
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
                          {values.verificationDocument?.name || 'Choose file...'}
                        </span>
                        <span className="ml-auto bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-700">
                          Browse
                        </span>
                      </label>
                    </div>
                    <div className="text-sm text-gray-500">
                      Accepted formats: JPG, PNG, PDF
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
                    {isSubmitting ? 'Processing...' : 'Complete Registration'}
                  </button>
                </div>
              </div>
            )}

            {!values.verificationType && (
              <button
                type="submit"
                disabled={isSubmitting || !isValid || !dirty}
                className="font-bold w-full py-3 px-4 bg-metallica-blue-off-charts text-white rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-metallica-blue-950"
              >
                {isSubmitting ? 'Processing...' : 'Complete Registration'}
              </button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
} 