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
        className={`w-full text-metallica-blue-950 px-0 py-2 bg-transparent border-0 border-b-2 border-metallica-blue-off-charts focus:ring-0 ${error && touched ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:border-metallica-blue-off-charts`}
        placeholder="Password"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
      </button>
      {error && touched && (
        <div className="text-red-500 text-sm mt-1">{error}</div>
      )}
    </div>
  );
}