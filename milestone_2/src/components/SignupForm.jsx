"use client";

import { Formik, Form } from "formik";
import { signupValidationSchema } from "../../utils/validationSchemas";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import { INDUSTRIES, COMPANY_SIZES, VERIFICATION_TYPES, ACCEPTED_FILE_TYPES } from "../../constants/index";
import { capitalizeWords } from "../../utils/index";
import SearchableSelect from "@/components/SearchableSelect";

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
              <SearchableSelect
                name="industry"
                label="Industry *"
                value={values.industry}
                options={INDUSTRIES.map(i => ({ label: i, value: i }))}
                onChange={e => setFieldValue('industry', e.target.value)}
                onBlur={e => setFieldValue('industry', e.target.value)}
                error={errors.industry}
                touched={touched.industry}
                placeholder="Select industry"
              />
            </div>

            {/* Company Size */}
            <div className="w-full md:w-[calc(50%-16px)]">
              <SearchableSelect
                name="companySize"
                label="Company Size *"
                value={values.companySize}
                options={COMPANY_SIZES.map(s => ({ label: s.label, value: s.value }))}
                onChange={e => setFieldValue('companySize', e.target.value)}
                onBlur={e => setFieldValue('companySize', e.target.value)}
                error={errors.companySize}
                touched={touched.companySize}
                placeholder="Select size"
              />
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
                      {values.verificationType === 'registration' ? 'Company Registration Document *' : 'Tax Card Document *'}
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
                {isSubmitting ? 'Processing...' : 'Complete Registration'}
              </button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
} 