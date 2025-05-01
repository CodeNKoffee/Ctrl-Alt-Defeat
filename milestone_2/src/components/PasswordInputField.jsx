import { useState } from 'react';
import { Field } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function PasswordInputField({ name, label, error, touched }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <Field
        type={showPassword ? "text" : "password"}
        name={name}
        className={`w-full px-4 py-3 rounded-lg border ${error && touched ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:border-[#2A5F74] bg-transparent`}
        placeholder=" "
      />
      <label
        className={`absolute left-4 -top-2.5 bg-white px-1 text-sm transition-all
          ${error && touched ? 'text-red-500' : 'text-gray-600'}`}
      >
        {label}
      </label>
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
      </button>
      {error && touched && (
        <div className="text-red-500 text-sm mt-1">{error}</div>
      )}
    </div>
  );
}