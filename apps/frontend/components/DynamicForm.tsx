'use client';

import React, { useState, FormEvent } from 'react';
import PhoneInputWithFlags from './PhoneInputWithFlags';

interface FormFieldOption {
  value: string;
  label: { en: string; ar: string };
}

interface FormField {
  fieldType: string;
  fieldLabel: { en: string; ar: string };
  fieldName: string;
  placeholder?: { en: string; ar: string };
  helpText?: { en: string; ar: string };
  required?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
  };
  options?: FormFieldOption[];
  width?: 'full' | 'half' | 'third';
}

interface FormFieldItem {
  itemType?: 'field' | 'group';
  // For single fields
  fieldType?: string;
  fieldLabel?: { en: string; ar: string };
  fieldName?: string;
  placeholder?: { en: string; ar: string };
  helpText?: { en: string; ar: string };
  required?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
  };
  options?: FormFieldOption[];
  width?: 'full' | 'half' | 'third';
  // For field groups
  groupFields?: FormField[];
}

interface DynamicFormProps {
  formId: string;
  formTitle?: { en: string; ar: string };
  formDescription?: { en: string; ar: string };
  fields: FormFieldItem[];
  submitButtonText?: { en: string; ar: string };
  successMessage?: { en: string; ar: string };
  locale?: 'en' | 'ar';
  containerStyle?: 'default' | 'card' | 'bordered' | 'minimal';
  showLabels?: boolean;
  compactMode?: boolean;
  onSubmitSuccess?: () => void;
}

export default function DynamicForm({
  formId,
  formTitle,
  formDescription,
  fields,
  submitButtonText = { en: 'Submit', ar: 'إرسال' },
  successMessage = { en: 'Thank you! Your submission has been received.', ar: 'شكراً! تم استلام طلبك.' },
  locale = 'en',
  containerStyle = 'default',
  showLabels = true,
  compactMode = false,
  onSubmitSuccess,
}: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isRTL = locale === 'ar';

  // Handle field value change
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Validate a single field
  const validateField = (field: FormField, value: any): string | null => {
    const label = field.fieldLabel[locale];

    // Required validation
    if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${label} ${locale === 'en' ? 'is required' : 'مطلوب'}`;
    }

    if (!value) return null; // Skip other validations if field is empty and not required

    const validation = field.validation;
    if (!validation) return null;

    // Min/Max length validation
    if (validation.minLength && value.length < validation.minLength) {
      return `${label} ${locale === 'en' ? `must be at least ${validation.minLength} characters` : `يجب أن يكون على الأقل ${validation.minLength} حرفًا`}`;
    }
    if (validation.maxLength && value.length > validation.maxLength) {
      return `${label} ${locale === 'en' ? `must be at most ${validation.maxLength} characters` : `يجب ألا يتجاوز ${validation.maxLength} حرفًا`}`;
    }

    // Min/Max value validation (for numbers)
    if (field.fieldType === 'number') {
      const numValue = Number(value);
      if (validation.min !== undefined && numValue < validation.min) {
        return `${label} ${locale === 'en' ? `must be at least ${validation.min}` : `يجب أن يكون على الأقل ${validation.min}`}`;
      }
      if (validation.max !== undefined && numValue > validation.max) {
        return `${label} ${locale === 'en' ? `must be at most ${validation.max}` : `يجب ألا يتجاوز ${validation.max}`}`;
      }
    }

    // Email validation
    if (field.fieldType === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return `${label} ${locale === 'en' ? 'must be a valid email' : 'يجب أن يكون بريدًا إلكترونيًا صالحًا'}`;
      }
    }

    // Pattern validation
    if (validation.pattern) {
      const regex = new RegExp(validation.pattern);
      if (!regex.test(value)) {
        return `${label} ${locale === 'en' ? 'format is invalid' : 'التنسيق غير صالح'}`;
      }
    }

    return null;
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((item) => {
      // Handle field groups
      if (item.itemType === 'group' && item.groupFields) {
        item.groupFields.forEach((field) => {
          const error = validateField(field, formData[field.fieldName]);
          if (error) {
            newErrors[field.fieldName] = error;
          }
        });
      } else {
        // Handle single fields
        const field = item as FormField;
        if (field.fieldName) {
          const error = validateField(field, formData[field.fieldName]);
          if (error) {
            newErrors[field.fieldName] = error;
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/form-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId,
          formName: formTitle?.[locale] || formId,
          data: formData,
          locale,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }

      // Success
      setIsSubmitted(true);
      setFormData({});

      // Google Tag Manager - Track form submission
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'form_submit',
          formType: 'dynamic',
          formName: formTitle?.[locale] || formId,
          formId: formId,
          formLocale: locale,
          value: formId.includes('enquiry') ? 2000 : 1000, // Higher value for enquiry forms
          currency: 'AED',
        });
      }

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(
        locale === 'en'
          ? 'An error occurred while submitting the form. Please try again.'
          : 'حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render field based on type
  const renderField = (field: FormField) => {
    const label = field.fieldLabel[locale];
    const placeholder = field.placeholder?.[locale] || '';
    const helpText = field.helpText?.[locale];
    const value = formData[field.fieldName] || '';
    const error = errors[field.fieldName];

    const commonInputClasses = `w-full px-4 py-3 ${
      compactMode ? 'py-2' : 'py-3'
    } border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      isRTL ? 'text-right' : 'text-left'
    }`;

    switch (field.fieldType) {
      case 'text':
      case 'email':
        return (
          <input
            type={field.fieldType}
            name={field.fieldName}
            value={value}
            onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
            placeholder={placeholder}
            required={field.required}
            className={commonInputClasses}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        );

      case 'phone':
        return (
          <PhoneInputWithFlags
            value={value}
            onChange={(phoneNumber) => handleFieldChange(field.fieldName, phoneNumber)}
            placeholder={placeholder}
            required={field.required}
            locale={locale}
          />
        );

      case 'textarea':
        return (
          <textarea
            name={field.fieldName}
            value={value}
            onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
            placeholder={placeholder}
            required={field.required}
            rows={compactMode ? 3 : 5}
            className={commonInputClasses}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            name={field.fieldName}
            value={value}
            onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
            placeholder={placeholder}
            required={field.required}
            min={field.validation?.min}
            max={field.validation?.max}
            className={commonInputClasses}
          />
        );

      case 'select':
        return (
          <select
            name={field.fieldName}
            value={value}
            onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
            required={field.required}
            className={commonInputClasses}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <option value="">
              {locale === 'en' ? 'Select an option' : 'اختر خيارًا'}
            </option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label[locale]}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {field.options?.map((option) => (
              <label
                key={option.value}
                className={`flex items-center ${isRTL ? 'flex-row-reverse justify-end' : ''} cursor-pointer`}
              >
                <input
                  type="radio"
                  name={field.fieldName}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
                  required={field.required}
                  className={`${isRTL ? 'ml-2' : 'mr-2'}`}
                />
                <span>{option.label[locale]}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <label
            className={`flex items-center ${isRTL ? 'flex-row-reverse justify-end' : ''} cursor-pointer`}
          >
            <input
              type="checkbox"
              name={field.fieldName}
              checked={!!value}
              onChange={(e) => handleFieldChange(field.fieldName, e.target.checked)}
              required={field.required}
              className={`${isRTL ? 'ml-2' : 'mr-2'}`}
            />
            <span>{label}</span>
          </label>
        );

      case 'checkboxGroup':
        return (
          <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {field.options?.map((option) => (
              <label
                key={option.value}
                className={`flex items-center ${isRTL ? 'flex-row-reverse justify-end' : ''} cursor-pointer`}
              >
                <input
                  type="checkbox"
                  name={field.fieldName}
                  value={option.value}
                  checked={(value || []).includes(option.value)}
                  onChange={(e) => {
                    const currentValues = value || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v: string) => v !== option.value);
                    handleFieldChange(field.fieldName, newValues);
                  }}
                  className={`${isRTL ? 'ml-2' : 'mr-2'}`}
                />
                <span>{option.label[locale]}</span>
              </label>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            name={field.fieldName}
            value={value}
            onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
            required={field.required}
            className={commonInputClasses}
          />
        );

      case 'file':
        return (
          <input
            type="file"
            name={field.fieldName}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFieldChange(field.fieldName, file);
              }
            }}
            required={field.required}
            className={commonInputClasses}
          />
        );

      default:
        return null;
    }
  };

  // Get width class based on field width setting
  const getWidthClass = (width?: string) => {
    switch (width) {
      case 'half':
        return 'w-full md:w-1/2';
      case 'third':
        return 'w-full md:w-1/3';
      default:
        return 'w-full';
    }
  };

  // Container styles
  const containerClasses = {
    default: 'bg-white p-8 rounded-lg',
    card: 'bg-white p-8 rounded-lg shadow-lg',
    bordered: 'bg-white p-8 rounded-lg border-2 border-gray-200',
    minimal: 'bg-transparent p-0',
  };

  // Show success message
  if (isSubmitted) {
    return (
      <div className={containerClasses[containerStyle]}>
        <div className="text-center py-12">
          <div className="mb-4 text-green-500 text-6xl">✓</div>
          <h3 className="text-2xl font-bold mb-2 text-gray-800">
            {locale === 'en' ? 'Success!' : 'نجح!'}
          </h3>
          <p className="text-gray-600">{successMessage[locale]}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses[containerStyle]} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Form Header */}
      {formTitle && (
        <h2 className={`text-3xl font-bold mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          {formTitle[locale]}
        </h2>
      )}
      {formDescription && (
        <p className={`text-gray-600 mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
          {formDescription[locale]}
        </p>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className={`space-y-${compactMode ? '4' : '6'}`}>
        {fields.map((item, itemIndex) => {
          // Check if this is a field group
          if (item.itemType === 'group' && item.groupFields && item.groupFields.length > 0) {
            const numFields = item.groupFields.length;
            const colSpan = Math.floor(12 / numFields);

            return (
              <div key={`group-${itemIndex}`} className="grid grid-cols-12 gap-4 mb-6">
                {item.groupFields.map((field, fieldIndex) => (
                  <div
                    key={field.fieldName || `field-${fieldIndex}`}
                    className={`col-span-12 md:col-span-${colSpan}`}
                  >
                    {showLabels && field.fieldType !== 'checkbox' && (
                      <label
                        htmlFor={field.fieldName}
                        className={`block mb-2 font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}
                      >
                        {field.fieldLabel[locale]}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                    )}

                    {renderField(field)}

                    {field.helpText && !errors[field.fieldName] && (
                      <p className={`mt-1 text-sm text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {field.helpText[locale]}
                      </p>
                    )}

                    {errors[field.fieldName] && (
                      <p className={`mt-1 text-sm text-red-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {errors[field.fieldName]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            );
          }

          // Single field (backward compatible)
          const field = item as FormField;
          return (
            <div
              key={field.fieldName || `field-${itemIndex}`}
              className={`mb-${compactMode ? '4' : '6'} ${getWidthClass(field.width)}`}
            >
              {showLabels && field.fieldType !== 'checkbox' && (
                <label
                  htmlFor={field.fieldName}
                  className={`block mb-2 font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {field.fieldLabel?.[locale]}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              )}

              {renderField(field)}

              {field.helpText && !errors[field.fieldName] && (
                <p className={`mt-1 text-sm text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {field.helpText[locale]}
                </p>
              )}

              {errors[field.fieldName] && (
                <p className={`mt-1 text-sm text-red-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {errors[field.fieldName]}
                </p>
              )}
            </div>
          );
        })}

        {/* Submit Error */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {submitError}
          </div>
        )}

        {/* Submit Button */}
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed ${
              compactMode ? 'px-6 py-2' : 'px-8 py-3'
            }`}
          >
            {isSubmitting
              ? locale === 'en'
                ? 'Submitting...'
                : 'جارٍ الإرسال...'
              : submitButtonText[locale]}
          </button>
        </div>
      </form>
    </div>
  );
}
