// app/agent/account/page.tsx
"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Building, MessageCircle, CreditCard, Save, ArrowLeft, Loader } from "lucide-react";
import Link from "next/link";

interface Section {
  id: string;
  name: string;
  role: string;
  order: number;
  fields: Field[];
}

interface Field {
  id: string;
  field_name: string;
  field_label: string;
  field_type: string;
  is_required: boolean;
  order: number;
  options: string[] | null;
  section: Section;
}

interface FieldValue {
  id?: string;
  field_id: string;
  field_value: string | File | null;
  existing_value?: string;
}

interface FormData {
  [key: string]: FieldValue;
}

interface SavedFieldValue {
  id: string;
  field_id: string;
  field_value: string | null;
  field_definition: Field;
}

type Tab = Section;

export default function AgentAccountForm() {
  const router = useRouter();
  
  const [sections, setSections] = useState<Section[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [savedValues, setSavedValues] = useState<SavedFieldValue[]>([]);

  const userId = "1"; // Hardcoded for now
  const tenantId = "1"; // Hardcoded for now

  useEffect(() => {
    fetchSectionsAndFields();
  }, []);

  const fetchSectionsAndFields = async () => {
    try {
      // Fetch sections and fields for agent role
      const sectionsResponse = await fetch('/api/admin/sections?role=agent');
      if (sectionsResponse.ok) {
        const sectionsData = await sectionsResponse.json();
        setSections(sectionsData);
        
        if (sectionsData.length > 0) {
          setActiveTab(sectionsData[0].id);
        }

        // Initialize form data structure
        const initialFormData: FormData = {};
        sectionsData.forEach((section: Section) => {
          section.fields.forEach((field: Field) => {
            initialFormData[field.id] = {
              field_id: field.id,
              field_value: field.field_type === 'file' ? null : '',
            };
          });
        });
        setFormData(initialFormData);

        // Fetch existing saved values
        await fetchSavedValues(sectionsData);
      }
    } catch (error) {
      console.error('Error fetching sections and fields:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSavedValues = async (sectionsData: Section[]) => {
    try {
      const response = await fetch('/api/partner/account');
      if (response.ok) {
        const savedData = await response.json();
        setSavedValues(savedData);

        // Update form data with saved values
        setFormData(prev => {
          const updated = { ...prev };
          
          savedData.forEach((savedValue: SavedFieldValue) => {
            const fieldId = savedValue.field_id;
            if (updated[fieldId]) {
              updated[fieldId] = {
                ...updated[fieldId],
                field_value: savedValue.field_value || '',
                existing_value: savedValue.field_value || ''
              };
            }
          });
          
          return updated;
        });
      } else {
        console.log('No saved data found, starting with empty form');
      }
    } catch (error) {
      console.error('Error fetching saved values:', error);
    }
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: {
        ...prev[fieldId],
        field_value: value
      }
    }));
  };

  const handleFileChange = (fieldId: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: {
        ...prev[fieldId],
        field_value: file
      }
    }));
  };

  const handleRemoveFile = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: {
        ...prev[fieldId],
        field_value: null,
        existing_value: ""
      }
    }));
  };

  const getFieldIcon = (fieldType: string) => {
    switch (fieldType) {
      case 'text':
      case 'email':
      case 'number':
        return User;
      case 'phone':
        return MessageCircle;
      case 'file':
        return CreditCard;
      case 'select':
        return Building;
      default:
        return User;
    }
  };

  const renderField = (field: Field) => {
    const fieldValue = formData[field.id]?.field_value || '';
    const existingValue = formData[field.id]?.existing_value;
    const IconComponent = getFieldIcon(field.field_type);

    switch (field.field_type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              {field.field_label} {field.is_required && '*'}
            </label>
            <div className="relative">
              <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <IconComponent size={18} />
              </span>
              <input
                type={field.field_type}
                id={field.id}
                value={fieldValue as string}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                placeholder={`Enter ${field.field_label.toLowerCase()}`}
                required={field.is_required}
                className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              />
            </div>
          </div>
        );

      case 'select':
        return (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              {field.field_label} {field.is_required && '*'}
            </label>
            <div className="relative">
              <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <IconComponent size={18} />
              </span>
              <select
                id={field.id}
                value={fieldValue as string}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                required={field.is_required}
                className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 appearance-none"
              >
                <option value="">Select {field.field_label}</option>
                {field.options?.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'file':
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              {field.field_label} {field.is_required && '*'}
            </label>
            <div className="flex items-center gap-4">
              {(existingValue || fieldValue) ? (
                <div className="relative">
                  <div className="w-32 h-32 border-2 border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                    {fieldValue instanceof File ? (
                      <div className="text-center">
                        <CreditCard size={24} className="text-green-500 mb-2 mx-auto" />
                        <p className="text-xs text-green-600 dark:text-green-400">New file</p>
                        <p className="text-xs text-gray-500 truncate px-2">{(fieldValue as File).name}</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <CreditCard size={24} className="text-brand-500 mb-2 mx-auto" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {existingValue ? 'Current file' : 'File uploaded'}
                        </p>
                        {existingValue && (
                          <p className="text-xs text-gray-500 truncate px-2">
                            {existingValue.split('/').pop()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(field.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <ArrowLeft size={12} className="rotate-45" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-brand-300 dark:hover:border-brand-500 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <CreditCard size={24} className="text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Upload {field.field_label}</p>
                  </div>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(field.id, e.target.files?.[0] || null)}
                    className="hidden"
                    accept={field.field_label.toLowerCase().includes('image') ? "image/*" : "*"}
                  />
                </label>
              )}
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {field.field_label === 'Agency Logo' 
                    ? 'Recommended: JPG, PNG, SVG, min 200x200px'
                    : field.field_label === 'PAN Card'
                    ? 'Please make sure the document is in PNG or JPEG format and is not larger than 200kb in size'
                    : 'Upload your document (PDF, DOC, or image files)'}
                </p>
                {fieldValue instanceof File && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    New file selected: {(fieldValue as File).name}
                  </p>
                )}
                {existingValue && !(fieldValue instanceof File) && (
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    Current file: {existingValue.split('/').pop()}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              {field.field_label} {field.is_required && '*'}
            </label>
            <textarea
              id={field.id}
              value={fieldValue as string}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={`Enter ${field.field_label.toLowerCase()}`}
              required={field.is_required}
              rows={4}
              className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            />
          </div>
        );

      default:
        return (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              {field.field_label} {field.is_required && '*'}
            </label>
            <input
              type="text"
              id={field.id}
              value={fieldValue as string}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={`Enter ${field.field_label.toLowerCase()}`}
              required={field.is_required}
              className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            />
          </div>
        );
    }
  };

  const renderTabContent = (section: Section) => {
    const sortedFields = [...section.fields].sort((a, b) => (a.order || 0) - (b.order || 0));
    
    // Group fields for better layout
    const singleFields = sortedFields.filter(field => 
      !['country', 'city', 'state', 'postal_code', 'street_address'].includes(field.field_name)
    );
    
    const addressFields = sortedFields.filter(field => 
      ['street_address', 'city', 'state', 'postal_code', 'country'].includes(field.field_name)
    );

    return (
      <div className="space-y-6">
        {/* Single column fields */}
        <div className="space-y-5">
          {singleFields.map(field => renderField(field))}
        </div>

        {/* Address fields in grid */}
        {addressFields.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {addressFields.map(field => renderField(field))}
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSubmit = new FormData();
      
      // Add user_id and tenant_id to form data
      formDataToSubmit.append('user_id', userId);
      formDataToSubmit.append('tenant_id', tenantId);
      
      // Prepare data for submission
      Object.keys(formData).forEach(fieldId => {
        const fieldData = formData[fieldId];
        if (fieldData.field_value instanceof File) {
          formDataToSubmit.append(`file_${fieldId}`, fieldData.field_value);
        } else {
          formDataToSubmit.append(fieldId, fieldData.field_value as string);
        }
      });

      // Make API call to save the data
      const response = await fetch('/api/partner/account', {
        method: 'POST',
        body: formDataToSubmit,
      });

      if (response.ok) {
        const result = await response.json();
        alert("Profile updated successfully!");
        
        // Refresh the saved values
        await fetchSavedValues(sections);
      } else {
        const error = await response.json();
        alert(`Error updating profile: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert("Error updating profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSectionIcon = (sectionName: string) => {
    switch (sectionName.toLowerCase()) {
      case 'personal':
        return User;
      case 'business':
        return Building;
      case 'contact':
        return MessageCircle;
      case 'payment':
        return CreditCard;
      default:
        return User;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <Loader className="animate-spin h-8 w-8 text-brand-500 mx-auto" />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading form...</p>
          </div>
        </div>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-8 text-center">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No form sections found</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            No form sections have been configured for agents yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Agent Account Details
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your agent profile and business information.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="px-5 py-4 sm:px-6 sm:py-5">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            Agent Profile
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {savedValues.length > 0 
              ? "Update your agent profile information." 
              : "Complete your agent profile information."}
          </p>
          {savedValues.length > 0 && (
            <div className="mt-2 text-sm text-green-600 dark:text-green-400">
              ✓ You have saved data. Form is pre-filled with your existing information.
            </div>
          )}
        </div>
        
        {/* Tab Navigation */}
        <div className="border-t border-gray-100 dark:border-gray-800">
          <div className="flex overflow-x-auto">
            {sections.map((section) => {
              const IconComponent = getSectionIcon(section.name);
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === section.id
                      ? "border-brand-500 text-brand-600 dark:text-brand-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  <IconComponent size={16} />
                  {section.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <form onSubmit={handleSubmit}>
            {/* Tab Content */}
            <div className="mb-8">
              {sections.map(section => 
                section.id === activeTab && (
                  <div key={section.id}>
                    <h4 className="text-sm font-medium text-gray-800 dark:text-white/90 mb-4">
                      {section.name} Information
                    </h4>
                    {renderTabContent(section)}
                  </div>
                )
              )}
            </div>

            {/* Navigation and Submit Buttons */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex gap-3">
                {sections.findIndex(s => s.id === activeTab) > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = sections.findIndex(s => s.id === activeTab);
                      setActiveTab(sections[currentIndex - 1].id);
                    }}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Previous
                  </button>
                )}
                {sections.findIndex(s => s.id === activeTab) < sections.length - 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = sections.findIndex(s => s.id === activeTab);
                      setActiveTab(sections[currentIndex + 1].id);
                    }}
                    className="flex items-center gap-2 rounded-lg border border-brand-500 bg-brand-500 px-4 py-3 text-sm font-medium text-white hover:bg-brand-600"
                  >
                    Next
                    <svg className="fill-current" width="16" height="16" viewBox="0 0 16 16">
                      <path d="M8 4L12 8L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin h-4 w-4 text-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {savedValues.length > 0 ? 'Update Profile' : 'Save Profile'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}