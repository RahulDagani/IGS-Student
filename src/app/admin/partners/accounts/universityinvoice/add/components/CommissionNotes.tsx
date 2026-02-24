'use client';

import React, { useState } from 'react';
import { Application, GenerateInvoicePayload } from '../types';
import { DollarSign, AlertCircle, Loader2, CheckCircle, ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface CommissionNotesProps {
  applications: Application[];
  universityId: number;
  onBack: () => void;
  onSuccess: () => void;
}

export default function CommissionNotes({ applications, universityId, onBack, onSuccess }: CommissionNotesProps) {
  const [tuitionFees, setTuitionFees] = useState<Record<number, number>>(
    applications.reduce((acc, app) => {
      // Set default value based on commission if applicable
      const defaultValue = app.commission_type === 'fixed' 
        ? parseFloat(app.commission_value) * 10 // Rough estimate for demo
        : 50000; // Default value
      return { ...acc, [app.application_id]: defaultValue };
    }, {})
  );
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {token} = useAuth();
  const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;


  const handleFeeChange = (applicationId: number, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setTuitionFees(prev => ({ ...prev, [applicationId]: numValue }));
    }
  };

  const validateFees = (): boolean => {
    return applications.every(app => {
      const fee = tuitionFees[app.application_id];
      return fee !== undefined && fee > 0;
    });
  };

  const handleSubmit = async () => {
    if (!validateFees()) {
      setError('Please enter valid tuition fees for all applications');
      return;
    }

    setLoading(true);
    setError(null);

    const payload: GenerateInvoicePayload = {
      university_id: universityId,
      applications: applications.map(app => ({
        application_id: app.application_id,
        commissionable_tuition_fee: tuitionFees[app.application_id]
      }))
    };

    try {
      const response = await fetch(`${BASE_URL}/tenant/invoice/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.status === 'success') {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setError(data.message || 'Failed to generate invoice');
      }
    } catch (err) {
      setError('Error connecting to server. Please try again.');
      console.error('Error generating invoice:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalCommission = (app: Application) => {
    const fee = tuitionFees[app.application_id] || 0;
    if (app.commission_type === 'percentage') {
      return (fee * parseFloat(app.commission_value)) / 100;
    }
    return parseFloat(app.commission_value);
  };

  if (success) {
    return (
      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Invoice Generated Successfully!
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Redirecting you back to the university list...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Set Commissionable Tuition Fees
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Enter the tuition fee amount for each selected application
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((app) => (
          <div 
            key={app.application_id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      Application #{app.application_id}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Student ID: {app.student_id}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 uppercase">Commission</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {app.commission_type === 'percentage' 
                        ? `${app.commission_value}%` 
                        : `${app.currency} ${parseFloat(app.commission_value).toLocaleString()}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 uppercase">Installments</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {app.no_of_installments} ({app.total_installments_paid} paid)
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-64">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Commissionable Tuition Fee ({app.currency})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {app.currency}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={tuitionFees[app.application_id] || ''}
                    onChange={(e) => handleFeeChange(app.application_id, e.target.value)}
                    className="w-full pl-12 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter amount"
                  />
                </div>
                {tuitionFees[app.application_id] > 0 && (
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    Estimated commission: {app.currency} {calculateTotalCommission(app).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Selected Applications:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{applications.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Total Tuition Amount:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {applications[0]?.currency} {Object.values(tuitionFees).reduce((a, b) => a + (b || 0), 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Total Estimated Commission:</span>
            <span className="font-medium text-green-600 dark:text-green-400">
              {applications[0]?.currency} {applications.reduce((total, app) => total + calculateTotalCommission(app), 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading || !validateFees()}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Generate Invoice</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}