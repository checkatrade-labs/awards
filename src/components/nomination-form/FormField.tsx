'use client';

import { ReactNode, useEffect, useState } from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface FormFieldProps {
  name: string;
  label: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  children?: ReactNode;
  maxLength?: number;
  showCount?: boolean;
  isValid?: boolean;
  helperText?: string;
  infoTooltip?: string;
}

export default function FormField({
  name,
  label,
  register,
  error,
  type = 'text',
  placeholder = '',
  required = false,
  className = '',
  children,
  maxLength,
  showCount = false,
  isValid = false,
  helperText,
  infoTooltip
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [touched, setTouched] = useState(false);

  // Calculate the border color based on error and valid states
  const getBorderClass = () => {
    if (error && touched) return 'border-red-500 focus:border-red-500 focus:ring-red-500';
    if (isValid && touched) return 'border-green-500 focus:border-green-500 focus:ring-green-500';
    if (isFocused) return 'border-blue-500 focus:border-blue-500 focus:ring-blue-500';
    return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  };

  // Handle input change for character count
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setCharacterCount(newValue.length);
    if (!touched) setTouched(true);
  };

  // Initialize with default value if provided
  useEffect(() => {
    // Since UseFormRegisterReturn doesn't expose the value directly,
    // we rely on the initial value being provided through props or defaultValue
    const initialValue = '';
    setCharacterCount(initialValue.length);
  }, [register.name]);

  const inputId = `field-${name}`;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex justify-between items-baseline">
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
          
          {/* Info tooltip */}
          {infoTooltip && (
            <span className="ml-1 group relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 inline text-gray-400 hover:text-gray-600 cursor-help"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="absolute left-full ml-2 -top-1 w-48 px-2 py-1 bg-gray-700 rounded-md text-center text-white text-xs transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none z-10">
                {infoTooltip}
              </span>
            </span>
          )}
        </label>
        
        {/* Character count */}
        {maxLength && showCount && (
          <span className={`text-xs ${characterCount > maxLength ? 'text-red-500' : 'text-gray-500'}`}>
            {characterCount}/{maxLength}
          </span>
        )}
      </div>

      {/* Input field */}
      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            id={inputId}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={errorId}
            placeholder={placeholder}
            maxLength={maxLength}
            className={`mt-1 block w-full p-3 border rounded-md shadow-sm focus:outline-none ${getBorderClass()} ${error && touched ? 'bg-red-50' : ''} ${isValid && touched ? 'bg-green-50' : ''}`}
            {...register}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false); 
              setTouched(true);
            }}
            onChange={(e) => {
              handleChange(e);
            }}
          />
        ) : (
          <input
            id={inputId}
            type={type}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={errorId}
            placeholder={placeholder}
            maxLength={maxLength}
            className={`mt-1 block w-full p-3 border rounded-md shadow-sm focus:outline-none ${getBorderClass()} ${error && touched ? 'bg-red-50' : ''} ${isValid && touched ? 'bg-green-50' : ''}`}
            {...register}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              setTouched(true);
            }}
            onChange={(e) => {
              handleChange(e);
            }}
          />
        )}
        
        {/* Validation icons */}
        {touched && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {error ? (
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : isValid ? (
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : null}
          </div>
        )}
      </div>

      {/* Error or helper text */}
      {error && touched ? (
        <p className="mt-1 text-sm text-red-600" id={errorId}>
          {error.message}
        </p>
      ) : helperText ? (
        <p className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      ) : null}

      {children}
    </div>
  );
}
