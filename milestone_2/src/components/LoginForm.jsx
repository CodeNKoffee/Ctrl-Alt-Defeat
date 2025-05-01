'use client';

import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import PasswordInputField from '@/components/PasswordInputField';
import Link from 'next/link';

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

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Handle login logic here
      console.log(values);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="space-y-6">
          <div className="relative">
            <Field
              type="email"
              name="email"
              className={`w-full px-4 py-3 rounded-lg border ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:border-[#2A5F74] bg-transparent`}
              placeholder=" "
            />
            <label
              className={`absolute left-4 -top-2.5 bg-white px-1 text-sm transition-all
                    ${errors.email && touched.email ? 'text-red-500' : 'text-gray-600'}`}
            >
              Email
            </label>
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
                className="w-4 h-4 text-[#2A5F74] border-gray-300 rounded focus:ring-[#2A5F74]"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-[#2A5F74] hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-[#2A5F74] text-white rounded-lg hover:bg-[#1e4554] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>

          <div className="text-center text-sm text-gray-600">
            Not registered yet?{' '}
            <Link href="/signup" className="text-[#2A5F74] hover:underline">
              Sign up!
            </Link>
          </div>
        </Form>
      )}
    </Formik>
  );
}