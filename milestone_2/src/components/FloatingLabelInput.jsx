import { useState } from 'react';
import { Field } from 'formik';

export default function FloatingLabelInput({ name, type, label, errors, touched }) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="relative">
      <Field name={name}>
        {({ field }) => (
          <>
            <input
              {...field}
              type={type}
              className={`w-full text-metallica-blue-950 px-0 py-2 bg-transparent border-0 border-b-2 border-metallica-blue-off-charts focus:ring-0 ${errors[name] && touched[name] ? 'border-red-500' : 'border-gray-300'
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
          </>
        )}
      </Field>
      {errors[name] && touched[name] && (
        <div className="text-red-500 text-sm mt-1">{errors[name]}</div>
      )}
    </div>
  );
};