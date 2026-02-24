'use client';

import React, { useEffect, useState } from 'react';
import { University } from '../types';
import { Building2, Search, Loader2, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface UniversityListProps {
  onSelectUniversity: (universityId: number) => void;
  selectedUniversityId: number | null;
}

export default function UniversityList({ onSelectUniversity, selectedUniversityId }: UniversityListProps) {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const {token} = useAuth();
  const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/tenant/invoice/universities`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        setUniversities(data.data);
      } else {
        setError('Failed to fetch universities');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching universities:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUniversities = universities.filter(university =>
    university.university_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button 
          onClick={fetchUniversities}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search universities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Universities Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  University
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUniversities.length > 0 ? (
                filteredUniversities.map((university) => (
                  <tr 
                    key={university.university_id}
                    onClick={() => onSelectUniversity(university.university_id)}
                    className={`cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                      selectedUniversityId === university.university_id 
                        ? 'bg-blue-50 dark:bg-blue-900/20' 
                        : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          selectedUniversityId === university.university_id
                            ? 'bg-blue-100 dark:bg-blue-900/30'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          <Building2 className={`w-5 h-5 ${
                            selectedUniversityId === university.university_id
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {university.university_name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {university.university_id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                        {university.total_applications}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        university.total_applications > 0
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          university.total_applications > 0
                            ? 'bg-green-500'
                            : 'bg-gray-400'
                        }`}></span>
                        {university.total_applications > 0 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectUniversity(university.university_id);
                        }}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow"
                      >
                        View Applications
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg font-medium mb-1">
                      No universities found
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {searchTerm ? 'Try adjusting your search term' : 'Check back later for updates'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      {filteredUniversities.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg px-6 py-4 flex items-center justify-between text-sm">
          <div className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-medium text-gray-900 dark:text-gray-100">{filteredUniversities.length}</span> of{' '}
            <span className="font-medium text-gray-900 dark:text-gray-100">{universities.length}</span> universities
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Total Applications:{' '}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {filteredUniversities.reduce((sum, uni) => sum + uni.total_applications, 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}