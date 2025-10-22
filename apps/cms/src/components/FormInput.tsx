'use client';

import { InputHTMLAttributes, TextareaHTMLAttributes, useState } from 'react';

interface BaseProps {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

interface InputProps extends BaseProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'required'> {
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel';
}

interface TextareaProps extends BaseProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'required'> {
  type: 'textarea';
  rows?: number;
}

interface SelectProps extends BaseProps, Omit<InputHTMLAttributes<HTMLSelectElement>, 'required'> {
  type: 'select';
  options: { value: string; label: string }[];
}

type FormInputProps = InputProps | TextareaProps | SelectProps;

export default function FormInput(props: FormInputProps) {
  const { label, error, helperText, required, className, ...rest } = props;
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const baseClasses = `
    mt-1 block w-full rounded-md px-3 py-2 text-sm text-gray-900
    border transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${error && isTouched
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
    }
    ${className || ''}
  `;

  const labelClasses = `
    block text-sm font-medium mb-1
    ${error && isTouched ? 'text-red-700' : 'text-gray-700'}
  `;

  const renderField = () => {
    const commonProps = {
      className: baseClasses,
      onFocus: () => setIsFocused(true),
      onBlur: () => {
        setIsFocused(false);
        setIsTouched(true);
      },
      'aria-invalid': error && isTouched ? 'true' : 'false',
      'aria-describedby': error && isTouched ? `${rest.name}-error` : helperText ? `${rest.name}-helper` : undefined,
      required,
    };

    if (props.type === 'textarea') {
      const { type, options, ...textareaProps } = rest as TextareaProps;
      return (
        <textarea
          {...textareaProps}
          {...commonProps}
          rows={props.rows || 4}
        />
      );
    }

    if (props.type === 'select') {
      const { type, options, ...selectProps } = props as SelectProps;
      return (
        <select {...selectProps} {...commonProps}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    const { type = 'text', ...inputProps } = rest as InputProps;
    return <input type={type} {...inputProps} {...commonProps} />;
  };

  return (
    <div>
      <label htmlFor={props.name} className={labelClasses}>
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>
      {renderField()}
      {error && isTouched && (
        <p
          id={`${props.name}-error`}
          className="mt-1 text-sm text-red-600 flex items-center"
          role="alert"
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${props.name}-helper`} className="mt-1 text-xs text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
