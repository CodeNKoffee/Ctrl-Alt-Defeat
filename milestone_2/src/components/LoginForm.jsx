"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Formik, Form, Field } from "formik";
import PasswordInputField from "@/components/PasswordInputField";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import { loginValidationSchema } from "../../utils/validationSchemas";

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [initialValues, setInitialValues] = useState({
    email: '',
    password: '',
    remember: false
  });

  // Load saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    const wasRemembered = localStorage.getItem('rememberMe') === 'true';

    if (wasRemembered && savedEmail && savedPassword) {
      setRememberMe(true);
      setInitialValues({
        email: savedEmail,
        password: savedPassword,
        remember: true
      });
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

  const handleRememberMeChange = (e, setFieldValue, values) => {
    const isChecked = e.target.checked;
    setRememberMe(isChecked);
    setFieldValue('remember', isChecked);
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={loginValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting, setFieldValue, isValid, dirty, values }) => (
        <Form className="space-y-12 w-full">
          <div className="relative">
            <FloatingLabelInput
              name="email"
              type="email"
              label="Email *"
              errors={errors}
              touched={touched}
            />
          </div>

          <PasswordInputField
            name="password"
            label="Password *"
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
              <span className="ml-2 text-sm text-gray-600 select-none cursor-pointer">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-metallica-blue-off-charts hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isValid || !dirty}
            className="font-bold w-full py-3 px-4 bg-metallica-blue-off-charts text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-metallica-blue-950"
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