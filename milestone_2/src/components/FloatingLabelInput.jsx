import { useState } from "react";
import { Field } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

export default function FloatingLabelInput({ name, type, label, errors, touched, tooltip }) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="relative">
      <Field name={name}>
        {({ field }) => (
          <>
            <div className="flex items-center gap-2">
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
              {tooltip && (
                <>
                  <FontAwesomeIcon
                    icon={faCircleQuestion}
                    className="h-4 w-4 text-gray-400 cursor-help"
                    data-tooltip-id={`tooltip-${name}`}
                  />
                  <Tooltip
                    id={`tooltip-${name}`}
                    content={tooltip}
                    className="!bg-gray-900 !text-white !opacity-100 !py-2 !px-4 !rounded-lg !max-w-md !text-sm !shadow-lg"
                    place="top"
                  />
                </>
              )}
            </div>
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