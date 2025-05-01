import { useState } from 'react';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'react-tooltip';

const baseInputStyles = "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-metallica-blue-off-charts focus:border-transparent bg-white";
const labelStyles = "block text-sm font-medium text-gray-700 mb-1";
const errorStyles = "text-red-500 text-sm mt-1";

export const TextInput = ({ label, error, tooltip, ...props }) => (
  <div className="mb-4">
    <div className="flex items-center gap-2">
      <label className={labelStyles}>{label}</label>
      {tooltip && (
        <>
          <FontAwesomeIcon
            icon={faCircleQuestion}
            className="h-5 w-5 text-gray-400 cursor-help"
            data-tooltip-id={`tooltip-${props.id}`}
          />
          <Tooltip id={`tooltip-${props.id}`} content={tooltip} />
        </>
      )}
    </div>
    <input
      className={`${baseInputStyles} ${error ? 'border-red-500' : 'border-gray-300'}`}
      {...props}
    />
    {error && <p className={errorStyles}>{error}</p>}
  </div>
);

export const SelectInput = ({ label, options, error, ...props }) => (
  <div className="mb-4">
    <label className={labelStyles}>{label}</label>
    <select
      className={`${baseInputStyles} ${error ? 'border-red-500' : 'border-gray-300'}`}
      {...props}
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option.value || option} value={option.value || option}>
          {option.label || option}
        </option>
      ))}
    </select>
    {error && <p className={errorStyles}>{error}</p>}
  </div>
);

export const RadioGroup = ({ label, options, error, ...props }) => (
  <div className="mb-4">
    <label className={labelStyles}>{label}</label>
    <div className="space-y-2">
      {options.map((option) => (
        <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            value={option.value}
            className="h-4 w-4 text-metallica-blue-off-charts focus:ring-metallica-blue-off-charts"
            {...props}
          />
          <span className="text-sm text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
    {error && <p className={errorStyles}>{error}</p>}
  </div>
);

export const FileInput = ({ label, error, accept, ...props }) => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className="mb-4">
      <label className={labelStyles}>{label}</label>
      <div className="relative">
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
          id={props.id}
          {...props}
        />
        <label
          htmlFor={props.id}
          className={`${baseInputStyles} cursor-pointer flex items-center ${error ? 'border-red-500' : 'border-gray-300'
            }`}
        >
          <span className={`${fileName ? 'text-gray-900' : 'text-gray-500'}`}>
            {fileName || 'Choose file...'}
          </span>
          <span className="ml-auto bg-gray-100 px-4 py-2 rounded-r-lg text-sm text-gray-700">
            Browse
          </span>
        </label>
      </div>
      {error && <p className={errorStyles}>{error}</p>}
    </div>
  );
}; 