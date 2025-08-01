"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';
import Link from "next/link";
import { Formik, Form, Field } from "formik";
import PasswordInputField from "@/components/PasswordInputField";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import * as Yup from 'yup';
import { MutatingDots } from 'react-loader-spinner';

export default function LoginForm({ userType, onSubmit, isLoggingIn }) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  const [rememberMe, setRememberMe] = useState(false);
  const [initialValues] = useState({
    email: '',
    password: '',
    remember: false
  });

  // Remove pre-fill logic for credentials

  const formikRef = React.useRef(null);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await onSubmit(values);
    } catch (error) {
      if (error.message === 'Invalid email or password') {
        // Set error message for both fields to ensure red underline.
        setErrors({
          email: 'Invalid email or password',
          password: 'Invalid email or password'
        });

        // Mark both fields as touched so the red style is applied.
        if (formikRef.current) {
          formikRef.current.setFieldTouched('email', true, false);
          formikRef.current.setFieldTouched('password', true, false);
        }
      } else {
        console.error('Login error:', error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRememberMeChange = (e, setFieldValue, values) => {
    const isChecked = e.target.checked;
    setRememberMe(isChecked);
    setFieldValue('remember', isChecked);
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(safeT('validation.emailInvalid'))
      .required(safeT('validation.emailRequired')),
    password: Yup.string()
      .required(safeT('validation.passwordRequired'))
  });

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting, setFieldValue, isValid, dirty, values }) => (
        <Form className="space-y-12 w-full">
          <div className="relative">
            <FloatingLabelInput
              name="email"
              type="email"
              label={safeT('login.emailLabel')}
              errors={errors}
              touched={touched}
            />
          </div>

          <PasswordInputField
            name="password"
            label={safeT('login.passwordLabel')}
            error={errors.password}
            touched={touched.password}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <Field
                type="checkbox"
                name="remember"
                checked={rememberMe}
                onChange={(e) => handleRememberMeChange(e, setFieldValue, values)}
                className="w-4 h-4 accent-[#4C798B] border-gray-300 rounded focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-600 select-none cursor-pointer">{safeT('login.rememberMe')}</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-metallica-blue-off-charts hover:underline">
              {safeT('login.forgotPassword')}
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isValid || !dirty || isLoggingIn}
            className="font-bold w-full py-3 px-4 bg-metallica-blue-off-charts text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed 
            enabled:hover:bg-metallica-blue-950 flex items-center justify-center cursor-pointer"
          >
            {isLoggingIn ? (
              <div className="flex items-center space-x-2">
                <MutatingDots
                  height={20}
                  width={20}
                  color="#ffffff"
                  secondaryColor="#ffffff"
                  radius={2}
                  ariaLabel="mutating-dots-loading"
                  visible={true}
                />
                <span>{safeT('login.loggingIn')}</span>
              </div>
            ) : isSubmitting ? (
              safeT('login.loggingIn')
            ) : (
              safeT('login.logIn')
            )}
          </button>

          {/* <div className="text-center text-sm text-gray-600">
            Not registered yet?{' '}
            <Link href="/signup" className="text-metallica-blue-off-charts hover:underline">
              Sign up!
            </Link>
          </div> */}
        </Form>
      )}
    </Formik>
  );
}