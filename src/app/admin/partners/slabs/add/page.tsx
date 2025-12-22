"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Percent, Users, Tag, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SlabFormData {
  slab_name: string;
  min_students: string;
  max_students: string;
  commission_percentage: string;
  description: string;
}

export default function AddSlab() {
  const router = useRouter();
  const [formData, setFormData] = useState<SlabFormData>({
    slab_name: "",
    min_students: "",
    max_students: "",
    commission_percentage: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Validate numeric fields
    if (name === "min_students" || name === "max_students" || name === "commission_percentage") {
      // Allow only numbers and decimals for commission_percentage
      if (name === "commission_percentage") {
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
          setFormData(prev => ({
            ...prev,
            [name]: value
          }));
        }
      } else {
        // Allow only integers for min/max students
        if (value === "" || /^\d*$/.test(value)) {
          setFormData(prev => ({
            ...prev,
            [name]: value
          }));
        }
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form data
      if (!formData.slab_name || !formData.min_students || !formData.max_students || !formData.commission_percentage) {
        setError("Please fill in all required fields");
        return;
      }

      // Validate numeric values
      const minStudents = parseInt(formData.min_students);
      const maxStudents = parseInt(formData.max_students);
      const commissionPercentage = parseFloat(formData.commission_percentage);

      if (isNaN(minStudents) || isNaN(maxStudents) || isNaN(commissionPercentage)) {
        setError("Please enter valid numbers for all fields");
        return;
      }

      if (minStudents < 0 || maxStudents < 0) {
        setError("Number of students cannot be negative");
        return;
      }

      if (minStudents >= maxStudents) {
        setError("Minimum students must be less than maximum students");
        return;
      }

      if (commissionPercentage < 0 || commissionPercentage > 100) {
        setError("Commission percentage must be between 0 and 100");
        return;
      }

      // Prepare data for API
      const apiData = {
        slab_name: formData.slab_name,
        min_students: minStudents,
        max_students: maxStudents,
        commission_percentage: commissionPercentage,
        description: formData.description || ""
      };

      console.log("Submitting slab data:", apiData);

      // Make API call
      const response = await fetch(`${BASE_URL}/tenant/slabs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(apiData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `API error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Slab created successfully:", result);
      
      // Redirect back to slabs list
      router.push('/admin/partners/slabs');
      router.refresh();
      
    } catch (error) {
      console.error('Error adding slab:', error);
      setError(error instanceof Error ? error.message : "Failed to create slab");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-brand-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading form...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 py-4 sm:px-6 sm:py-5">
        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
          Add New Slab
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create a new commission slab structure for agents.
        </p>
      </div>
      
      <div className="space-y-6 border-t border-gray-100 p-5 sm:p-6 dark:border-gray-800">
        {error && (
          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="-mx-2.5 flex flex-wrap gap-y-5">
            {/* Slab Name Field */}
            <div className="w-full px-2.5">
              <label htmlFor="slab_name" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                Slab Name *
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  <Tag size={18} />
                </span>
                <input
                  type="text"
                  id="slab_name"
                  name="slab_name"
                  value={formData.slab_name}
                  onChange={handleChange}
                  placeholder="e.g., Bronze, Silver, Gold"
                  required
                  className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
              </div>
            </div>

            {/* Minimum Students Field */}
            <div className="w-full px-2.5">
              <label htmlFor="min_students" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                Minimum Students *
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  <Users size={18} />
                </span>
                <input
                  type="text"
                  id="min_students"
                  name="min_students"
                  value={formData.min_students}
                  onChange={handleChange}
                  placeholder="e.g., 0, 10, 50"
                  required
                  className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Inclusive lower bound of student count
              </p>
            </div>

            {/* Maximum Students Field */}
            <div className="w-full px-2.5">
              <label htmlFor="max_students" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                Maximum Students *
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  <Users size={18} />
                </span>
                <input
                  type="text"
                  id="max_students"
                  name="max_students"
                  value={formData.max_students}
                  onChange={handleChange}
                  placeholder="e.g., 10, 50, 100"
                  required
                  className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Inclusive upper bound of student count
              </p>
            </div>

            {/* Commission Percentage Field */}
            <div className="w-full px-2.5">
              <label htmlFor="commission_percentage" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                Commission Percentage *
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  <Percent size={18} />
                </span>
                <input
                  type="text"
                  id="commission_percentage"
                  name="commission_percentage"
                  value={formData.commission_percentage}
                  onChange={handleChange}
                  placeholder="e.g., 10.5, 15, 20.75"
                  required
                  className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
                <span className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  %
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Enter percentage value (0-100)
              </p>
            </div>

            {/* Description Field */}
            <div className="w-full px-2.5">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                Description
              </label>
              <div className="relative">
                <span className="absolute top-4 left-4 text-gray-500 dark:text-gray-400">
                  <FileText size={18} />
                </span>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Additional details about this slab (optional)"
                  rows={4}
                  className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="w-full px-2.5">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
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
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Slab
                      <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M17.4175 9.9986C17.4178 10.1909 17.3446 10.3832 17.198 10.53L12.2013 15.5301C11.9085 15.8231 11.4337 15.8233 11.1407 15.5305C10.8477 15.2377 10.8475 14.7629 11.1403 14.4699L14.8604 10.7472L3.33301 10.7472C2.91879 10.7472 2.58301 10.4114 2.58301 9.99715C2.58301 9.58294 2.91879 9.24715 3.33301 9.24715L14.8549 9.24715L11.1403 5.53016C10.8475 5.23717 10.8477 4.7623 11.1407 4.4695C11.4336 4.1767 11.9085 4.17685 12.2013 4.46984L17.1588 9.43049C17.3173 9.568 17.4175 9.77087 17.4175 9.99715C17.4175 9.99763 17.4175 9.99812 17.4175 9.9986Z" fill="white"/>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}