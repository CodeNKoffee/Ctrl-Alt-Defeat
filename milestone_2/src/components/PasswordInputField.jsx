import { useState } from 'react';
import { Field } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function PasswordInputField({ name, label, error, touched }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="relative w-full space-y-1">
      <div className="relative">
        <Field name={name}>
          {({ field }) => (
            <>
              <input
                {...field}
                type={showPassword ? "text" : "password"}
                className={`w-full text-metallica-blue-950 px-0 pr-8 py-2 bg-transparent border-0 border-b-2 border-metallica-blue-off-charts focus:ring-0 ${error && touched ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:border-metallica-blue-off-charts`}
                onFocus={() => setIsFocused(true)}
                onBlur={(e) => {
                  setIsFocused(false);
                  setHasValue(!!e.target.value);
                  field.onBlur(e);
                }}
                onChange={(e) => {
                  setHasValue(!!e.target.value);
                  field.onChange(e);
                }}
              />
              <label
                className={`absolute left-0 transition-all duration-200 ease-in-out pointer-events-none ${isFocused || hasValue
                    ? 'text-xs -top-4 text-metallica-blue-off-charts'
                    : 'top-2 text-gray-400'
                  }`}
              >
                {label}
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </>
          )}
        </Field>
      </div>
      {error && touched && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
}