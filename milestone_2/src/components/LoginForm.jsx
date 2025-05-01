'use client';

import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import PasswordInputField from '@/components/PasswordInputField';
import Link from 'next/link';
import React from 'react';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    const wasRemembered = localStorage.getItem('rememberMe') === 'true';

    if (wasRemembered && savedEmail && savedPassword) {
      setRememberMe(true);
      // Set the initial values in the form
      if (formikRef.current) {
        formikRef.current.setValues({
          email: savedEmail,
          password: savedPassword,
          remember: true
        });
      }
    }
  }, []);

  const formikRef = React.useRef(null);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // If remember me is checked, save credentials
      if (values.remember) {
        localStorage.setItem('rememberedEmail', values.email);
        localStorage.setItem('rememberedPassword', values.password);
        localStorage.setItem('rememberMe', 'true');
      } else {
        // Clear saved credentials if remember me is unchecked
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
        localStorage.removeItem('rememberMe');
      }

      // Handle login logic here
      console.log(values);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRememberMeChange = (e, setFieldValue) => {
    const isChecked = e.target.checked;
    setRememberMe(isChecked);
    setFieldValue('remember', isChecked);
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{
        email: '',
        password: '',
        remember: rememberMe
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ errors, touched, isSubmitting, setFieldValue }) => (
        <Form className="space-y-12 w-full">
          <div className="relative">
            <Field
              type="email"
              name="email"
              className={`w-full text-metallica-blue-950 px-0 py-2 bg-transparent border-0 border-b-2 border-metallica-blue-off-charts focus:ring-0 ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:border-metallica-blue-off-charts`}
              placeholder="Email"
            />
            {errors.email && touched.email && (
              <div className="text-red-500 text-sm mt-1">{errors.email}</div>
            )}
          </div>

          <PasswordInputField
            name="password"
            label="Password"
            error={errors.password}
            touched={touched.password}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <Field
                type="checkbox"
                name="remember"
                checked={rememberMe}
                onChange={(e) => handleRememberMeChange(e, setFieldValue)}
                className="w-4 h-4 accent-[#4C798B] border-gray-300 rounded focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-600 select-none cursor-pointer">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-metallica-blue-off-charts hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="font-bold w-full py-3 px-4 bg-metallica-blue-off-charts text-white rounded-full hover:bg-metallica-blue-950 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Logging in...' : 'Log in'}
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