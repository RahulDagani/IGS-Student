'use client';

import { useSearchParams } from 'next/navigation';
import UniversitySearchComponent from './UniversitySearchComponent';
import { Suspense } from 'react';

interface UniversitySearchWrapperProps {
  initialData?: {
    universities: any[];
    news: any[];
    webinars: any[];
    disciplines: any[];
    courses: any[];
    countries: any[];
    states: any[];
    intakes: any[];
    current_page: number;
    total_pages: number;
    limit: number;
  };
}

function UniversitySearchWrapperContent({ initialData }: UniversitySearchWrapperProps) {
  const searchParams = useSearchParams();
  
  const studyLevel = searchParams.get('study_level');
  const discipline = searchParams.get('discipline');
  const country = searchParams.get('country');
  const courses = searchParams.getAll('course');
  
  const initialParams = {
    study_level: studyLevel || undefined,
    discipline: discipline || undefined,
    country: country || undefined,
    course: courses
  };
  
  return <UniversitySearchComponent initialData={initialData} initialParams={initialParams} />;
}

export default function UniversitySearchWrapper({ initialData }: UniversitySearchWrapperProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 animate-spin mb-4">
            <i className="ri-loader-line ri-2x text-blue-600"></i>
          </div>
          <p className="text-gray-600">Loading universities...</p>
        </div>
      </div>
    }>
      <UniversitySearchWrapperContent initialData={initialData} />
    </Suspense>
  );
}