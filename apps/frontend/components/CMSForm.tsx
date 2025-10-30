'use client';

import { useEffect, useState } from 'react';
import DynamicForm from './DynamicForm';

interface CMSFormProps {
  formId: string;                              // Form blueprint instance ID
  locale?: 'en' | 'ar';
  containerStyle?: 'default' | 'card' | 'bordered' | 'minimal';
  showLabels?: boolean;
  compactMode?: boolean;
  className?: string;
  onSubmitSuccess?: () => void;
}

interface FormDefinition {
  id: string;
  formTitle: { en: string; ar: string };
  formDescription?: { en: string; ar: string };
  fields: any[];
  submitButtonText?: { en: string; ar: string };
  successMessage?: { en: string; ar: string };
}

export default function CMSForm({
  formId,
  locale = 'en',
  containerStyle = 'default',
  showLabels = true,
  compactMode = false,
  className = '',
  onSubmitSuccess,
}: CMSFormProps) {
  const [formDefinition, setFormDefinition] = useState<FormDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFormDefinition();
  }, [formId, locale]);

  const fetchFormDefinition = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch form from GraphQL
      const graphqlEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL || '/api/graphql';

      const query = `
        query GetForm($id: ID!, $locale: Locale) {
          form(id: $id, locale: $locale) {
            id
            formTitleEn
            formTitleAr
            formDescriptionEn
            formDescriptionAr
            submitButtonTextEn
            submitButtonTextAr
            successMessageEn
            successMessageAr
            fields
          }
        }
      `;

      const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: {
            id: formId,
            locale: locale.toUpperCase(),
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Failed to fetch form');
      }

      const formData = result.data?.form;

      if (!formData) {
        throw new Error('Form not found');
      }

      // Transform to DynamicForm format
      const definition: FormDefinition = {
        id: formData.id,
        formTitle: {
          en: formData.formTitleEn || 'Form',
          ar: formData.formTitleAr || 'نموذج',
        },
        formDescription: {
          en: formData.formDescriptionEn || '',
          ar: formData.formDescriptionAr || '',
        },
        fields: formData.fields || [],
        submitButtonText: {
          en: formData.submitButtonTextEn || 'Submit',
          ar: formData.submitButtonTextAr || 'إرسال',
        },
        successMessage: {
          en: formData.successMessageEn || 'Thank you! Your submission has been received.',
          ar: formData.successMessageAr || 'شكراً! تم استلام طلبك.',
        },
      };

      setFormDefinition(definition);
    } catch (err: any) {
      console.error('Error fetching form:', err);
      setError(err.message || 'Failed to load form');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Form</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchFormDefinition}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // No form found
  if (!formDefinition) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-6 ${className}`}>
        <p className="text-gray-600">Form not found</p>
      </div>
    );
  }

  // Render dynamic form
  return (
    <div className={className}>
      <DynamicForm
        formId={formDefinition.id}
        formTitle={formDefinition.formTitle}
        formDescription={formDefinition.formDescription}
        fields={formDefinition.fields}
        submitButtonText={formDefinition.submitButtonText}
        successMessage={formDefinition.successMessage}
        locale={locale}
        containerStyle={containerStyle}
        showLabels={showLabels}
        compactMode={compactMode}
        onSubmitSuccess={onSubmitSuccess}
      />
    </div>
  );
}
