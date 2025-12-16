"use client"
import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Badge from "@/components/ui/badge/Badge";
import { DockIcon, DollarSign, GraduationCap, MapPin, Calendar, Book, Building2, Star } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useParams } from "next/navigation";
import Link from "next/link";
import { Country, State } from "country-state-city";
import Image from "next/image";

// Interfaces matching the API response structure
interface Intake {
  intake_id: number;
  course_id: number;
  start_date: string;
  open_date: string;
  submission_deadline: string;
  seat_availability: string;
  turnaround_time: string;
  conversion_rate: string;
  overall_score_label: string;
  overall_score_intent: string;
  intake_created_at: string;
}

interface Course {
  id: number;
  tenant_id: number;
  university_id: number;
  study_level_id: number;
  discipline_id: number;
  partner_type_id: number;
  collaboration_type_id: number;
  university_type_id: number;
  course_name: string;
  course_slug: string;
  is_popular: number;
  duration_min: number;
  duration_max: number;
  duration_unit: string;
  tuition_fee: string;
  currency_code: string;
  application_fee: string;
  gre_score: string | null;
  gmat_score: string | null;
  ielts_score: string | null;
  toefl_score: string | null;
  pte_score: string | null;
  sat_score: string | null;
  act_score: string | null;
  duolingo_score: string | null;
  gpa_score: string | null;
  about_course: string;
  admission_requirements: string;
  created_at: string;
  updated_at: string;
  university_name: string;
  study_level_name: string;
  discipline_name: string;
  partner_type_name: string;
  university_type_name: string;
  collaboration_type_name: string;
  intakes: Intake[];
  country_code: string;
  state_code: string;
  city_code: string;
  university_logo: string;
  university_logo_url: string;
}

interface ApiResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  data: Course[];
  filters: {
    studyLevels: Array<{
      id: number;
      name: string;
    }>;
    disciplines: Array<{
      id: number;
      name: string;
    }>;
    universities: Array<{
      id: number;
      university: string;
      country_code: string;
      state_code: string;
      city_code: string;
    }>;
    locations: {
      countries: Array<{ country_code: string }>;
      states: Array<{ state_code: string }>;
      cities: Array<{ city_code: string }>;
    };
    tuitionRange: {
      min: string;
      max: string;
    };
  };
}

interface Student {
  user_id: number;
  email: string;
  phone: string;
  status: string;
  first_name: string;
  last_name: string;
  passport_number: string;
  dob: string;
  created_at: string;
}

interface StudentsResponse {
  success: boolean;
  data: Student[];
}

// Filter Options Interface
interface FilterOptions {
  discipline_ids: number[];
  study_level_id: number | null;
  university_ids: number[];
  country_codes: string[];
  state_codes: string[];
  city_codes: string[];
  search?: string;
}

// Filter Modal Component
interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: FilterOptions) => void;
  filtersData: ApiResponse['filters'] | null;
  appliedFilters: FilterOptions;
}

const getCountryName = (code: string | undefined | null) => {
  if (!code) return '';
  const country = Country.getCountryByCode(code);
  return country ? country.name : code;
};

const getStateName = (code: string | undefined | null) => {
  if (!code) return '';
  const state = State.getStateByCode(code);
  return state ? state.name : code;
};

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onFilterChange,
  filtersData,
  appliedFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(appliedFilters);

  // Initialize local filters when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(appliedFilters);
    }
  }, [isOpen, appliedFilters]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDisciplineChange = (disciplineId: number) => {
    const newDisciplineIds = localFilters.discipline_ids.includes(disciplineId)
      ? localFilters.discipline_ids.filter(id => id !== disciplineId)
      : [...localFilters.discipline_ids, disciplineId];
    
    handleFilterChange({
      ...localFilters,
      discipline_ids: newDisciplineIds
    });
  };

  const handleStudyLevelChange = (studyLevelId: number | null) => {
    handleFilterChange({
      ...localFilters,
      study_level_id: studyLevelId
    });
  };

  const handleUniversityChange = (universityId: number) => {
    const newUniversityIds = localFilters.university_ids.includes(universityId)
      ? localFilters.university_ids.filter(id => id !== universityId)
      : [...localFilters.university_ids, universityId];
    
    handleFilterChange({
      ...localFilters,
      university_ids: newUniversityIds
    });
  };

  const handleCountryChange = (countryCode: string) => {
    const newCountryCodes = localFilters.country_codes.includes(countryCode)
      ? localFilters.country_codes.filter(code => code !== countryCode)
      : [...localFilters.country_codes, countryCode];
    
    handleFilterChange({
      ...localFilters,
      country_codes: newCountryCodes
    });
  };

  const handleStateChange = (stateCode: string) => {
    const newStateCodes = localFilters.state_codes.includes(stateCode)
      ? localFilters.state_codes.filter(code => code !== stateCode)
      : [...localFilters.state_codes, stateCode];
    
    handleFilterChange({
      ...localFilters,
      state_codes: newStateCodes
    });
  };

  const handleCityChange = (cityCode: string) => {
    const newCityCodes = localFilters.city_codes.includes(cityCode)
      ? localFilters.city_codes.filter(code => code !== cityCode)
      : [...localFilters.city_codes, cityCode];
    
    handleFilterChange({
      ...localFilters,
      city_codes: newCityCodes
    });
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      discipline_ids: [],
      study_level_id: null,
      university_ids: [],
      country_codes: [],
      state_codes: [],
      city_codes: [],
    };
    handleFilterChange(resetFilters);
  };

  if (!isOpen || !filtersData) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex z-999999 justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-[700px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Filter Courses
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Study Levels Filter */}
          <div>
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
              Study Levels
            </label>
            <select
              value={localFilters.study_level_id ?? ""}
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : null;
                handleStudyLevelChange(value);
              }}
              className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="">Select study level</option>
              {filtersData.studyLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          {/* Disciplines Filter */}
          <div>
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
              Disciplines
            </label>
            <div className="grid grid-cols-2 gap-6 max-h-40 overflow-y-auto">
              {filtersData.disciplines.map((discipline) => (
                <div key={discipline.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`discipline-${discipline.id}`}
                    checked={localFilters.discipline_ids.includes(discipline.id)}
                    onChange={() => handleDisciplineChange(discipline.id)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
                  />
                  <label
                    htmlFor={`discipline-${discipline.id}`}
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {discipline.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Countries Filter */}
          <div>
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
              Countries
            </label>
            <div className="grid grid-cols-2 gap-6 max-h-40 overflow-y-auto">
              {filtersData.locations.countries.map((country) => (
                <div key={country.country_code} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`country-${country.country_code}`}
                    checked={localFilters.country_codes.includes(country.country_code)}
                    onChange={() => handleCountryChange(country.country_code)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
                  />
                  <label
                    htmlFor={`country-${country.country_code}`}
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {getCountryName(country.country_code)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* States Filter */}
          <div>
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
              States
            </label>
            <div className="grid grid-cols-2 gap-6 max-h-40 overflow-y-auto">
              {filtersData.locations.states.map((state) => (
                <div key={state.state_code} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`state-${state.state_code}`}
                    checked={localFilters.state_codes.includes(state.state_code)}
                    onChange={() => handleStateChange(state.state_code)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
                  />
                  <label
                    htmlFor={`state-${state.state_code}`}
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {state.state_code}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Cities Filter */}
          <div>
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
              Cities
            </label>
            <div className="grid grid-cols-2 gap-6 max-h-40 overflow-y-auto">
              {filtersData.locations.cities.map((city) => (
                <div key={city.city_code} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`city-${city.city_code}`}
                    checked={localFilters.city_codes.includes(city.city_code)}
                    onChange={() => handleCityChange(city.city_code)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
                  />
                  <label
                    htmlFor={`city-${city.city_code}`}
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {city.city_code}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Universities Filter */}
          <div>
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
              Universities
            </label>
            <div className="grid grid-cols-2 gap-6 max-h-40 overflow-y-auto">
              {filtersData.universities.map((university) => (
                <div key={university.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`university-${university.id}`}
                    checked={localFilters.university_ids.includes(university.id)}
                    onChange={() => handleUniversityChange(university.id)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
                  />
                  <label
                    htmlFor={`university-${university.id}`}
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {university.university}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Reset All
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500/10"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

// Application Confirmation Modal Component
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedStudentId: number) => void;
  course: Course | null;
  loading: boolean;
  students: Student[];
  isFetchingStudents: boolean;
  studentError: string | null;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  course,
  loading,
  students,
  isFetchingStudents,
  studentError
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<number>(0);

  const formatFee = (fee: string, currency: string) => {
    if (!fee || fee === "0.00") return "Free";
    return `${currency} ${parseFloat(fee).toLocaleString()}`;
  };

  const handleSubmit = () => {
    if (selectedStudentId === 0) {
      alert("Please select a student");
      return;
    }
    onConfirm(selectedStudentId);
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-99999 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Confirm Application
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Please review your application details before submitting:
          </p>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Course:</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white">{course.course_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">University:</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white">{course.university_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Study Level:</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white">{course.study_level_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Application Fee:</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                {formatFee(course.application_fee, course.currency_code)}
              </span>
            </div>
          </div>

          {/* Student Selection Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Student
            </label>
            {isFetchingStudents ? (
              <div className="flex items-center justify-center p-4">
                <svg className="animate-spin h-5 w-5 text-brand-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-400">Loading students...</span>
              </div>
            ) : studentError ? (
              <div className="text-sm text-red-600 dark:text-red-400 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                Error loading students: {studentError}
              </div>
            ) : students.length === 0 ? (
              <div className="text-sm text-yellow-600 dark:text-yellow-400 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                No students found. Please add students first.
              </div>
            ) : (
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/10 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                disabled={loading}
              >
                <option value={0}>-- Select a student --</option>
                {students.map((student) => (
                  <option key={student.user_id} value={student.user_id}>
                    {student.first_name} {student.last_name} - {student.email}
                  </option>
                ))}
              </select>
            )}
            {students.length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {students.length} student(s) available
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || isFetchingStudents || students.length === 0 || selectedStudentId === 0}
              className="flex-1 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-hidden focus:ring-2 focus:ring-green-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Applying...
                </>
              ) : (
                'Confirm Application'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Success/Error Alert Component
interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  message: string;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, type, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-99999 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-md">
        <div className="p-6">
          <div className={`flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-4 ${
            type === 'success' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
          }`}>
            {type === 'success' ? (
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h3 className={`text-lg font-semibold text-center mb-2 ${
            type === 'success' ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'
          }`}>
            {type === 'success' ? 'Application Submitted!' : 'Application Failed'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
            {message}
          </p>
          <button
            onClick={onClose}
            className={`w-full px-4 py-2 text-sm text-white rounded-lg ${
              type === 'success' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            } focus:outline-hidden focus:ring-2 focus:ring-opacity-50`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Course Card Component
const CourseCard: React.FC<{ 
  course: Course;
  onApply: (course: Course) => void;
}> = ({ course, onApply }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 3);
  };

  const formatDuration = () => {
    if (course.duration_min === course.duration_max) {
      return `${course.duration_min} ${course.duration_unit}`;
    }
    return `${course.duration_min} - ${course.duration_max} ${course.duration_unit}`;
  };

  const formatFee = (fee: string, currency: string) => {
    if (!fee || fee === "0.00") return "N/A";
    return `${currency} ${parseFloat(fee).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability.toLowerCase()) {
      case 'very high':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'high':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'very low':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
      {/* Top Section */}
      <div className="flex items-start justify-between">
        {/* University Info */}
        <div className="flex items-start gap-3">
          <div className="logo w-20 h-20">
            <Image 
            src={course.university_logo_url} 
            alt={`${course.university_name} logo`}
            height={80}
            width={80}
            />
          </div>
          {/* <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center text-white font-bold text-sm">
            {getInitials(course.university_name)}
          </div> */}
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white leading-snug">
              {course.course_name}
            </h2>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {course.university_name}
            </p>
            {course.is_popular === 1 && (
              <Badge size="sm" color="warning">
                <Star size={12} className="mr-1" />
                Popular
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-700 mt-4 pt-4 space-y-3">
        {/* Degree */}
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <GraduationCap size={18}/>
          <div>
            <span className="block">Study Level</span>
            <strong className="block font-semibold text-gray-800 dark:text-white">{course.study_level_name}</strong>
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <DockIcon size={18}/>
          <div>
            <span className="block">Duration</span>
            <strong className="block font-semibold text-gray-800 dark:text-white">{formatDuration()}</strong>
          </div>
        </div>

        {/* Fees */}
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <DollarSign size={18}/>
          <div>
            <span className="block">Fees</span>
            <div className="space-y-1">
              <strong className="block font-semibold text-gray-800 dark:text-white">
                Tuition: {formatFee(course.tuition_fee, course.currency_code)}
              </strong>
              <strong className="block font-semibold text-gray-800 dark:text-white">
                Application: {formatFee(course.application_fee, course.currency_code)}
              </strong>
            </div>
          </div>
        </div>

        {/* Discipline */}
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <MapPin size={18}/>
          <div>
            <span className="block">Discipline</span>
            <strong className="block font-semibold text-gray-800 dark:text-white">{course.discipline_name}</strong>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <Building2 size={18}/>
          <div>
            <span className="block">Location</span>
            <strong className="block font-semibold text-gray-800 dark:text-white">
              {getCountryName(course.country_code)}, {getStateName(course.state_code)}
            </strong>
          </div>
        </div>

        {/* Intakes */}
        {course.intakes && course.intakes.length > 0 && (
          <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Calendar size={18}/>
            <div className="flex-1">
              <span className="block">Available Intakes</span>
              <div className="mt-1 space-y-1">
                {course.intakes.slice(0, 2).map((intake) => (
                  <div key={intake.intake_id} className="flex justify-between items-center">
                    <span className="font-medium text-gray-800 dark:text-white">
                      {formatDate(intake.start_date)}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getAvailabilityColor(intake.seat_availability)}`}>
                      {intake.seat_availability}
                    </span>
                  </div>
                ))}
                {course.intakes.length > 2 && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    +{course.intakes.length - 2} more intakes
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Entry Requirements */}
      <div className="mt-5">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
          ENTRY REQUIREMENTS
        </h3>
        <div className="flex gap-2 flex-wrap">
          {course.ielts_score && (
            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full font-semibold text-gray-700 dark:text-gray-300">
              IELTS: <span className="text-gray-900 dark:text-white">{course.ielts_score}</span>
            </span>
          )}
          {course.pte_score && (
            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full font-semibold text-gray-700 dark:text-gray-300">
              PTE: <span className="text-gray-900 dark:text-white">{course.pte_score}</span>
            </span>
          )}
          {course.duolingo_score && (
            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full font-semibold text-gray-700 dark:text-gray-300">
              Duolingo: <span className="text-gray-900 dark:text-white">{course.duolingo_score}</span>
            </span>
          )}
          {course.toefl_score && (
            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full font-semibold text-gray-700 dark:text-gray-300">
              TOEFL: <span className="text-gray-900 dark:text-white">{course.toefl_score}</span>
            </span>
          )}
          {course.gre_score && (
            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full font-semibold text-gray-700 dark:text-gray-300">
              GRE: <span className="text-gray-900 dark:text-white">{course.gre_score}</span>
            </span>
          )}
          {course.gmat_score && (
            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full font-semibold text-gray-700 dark:text-gray-300">
              GMAT: <span className="text-gray-900 dark:text-white">{course.gmat_score}</span>
            </span>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-3">
        <Link
          href={`/partner/programs/${course.id}`}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-center dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg text-sm transition-all"
        >
          View Course Details
        </Link>
      </div>
    </div>
  );
};

const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;

export default function ProgramCards() {
  const { token, logout } = useAuth();
  const { id: student_user_id } = useParams();   
  const [courses, setCourses] = useState<Course[]>([]);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [fetchingStudents, setFetchingStudents] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studentError, setStudentError] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Application states
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  // Filters and pagination
  const [filters, setFilters] = useState<FilterOptions>({
    discipline_ids: [],
    study_level_id: null,
    university_ids: [],
    country_codes: [],
    state_codes: [],
    city_codes: [],
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Infinite scroll ref
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Build query string from filters
  const buildQueryString = useCallback((page: number = 1) => {
    const params = new URLSearchParams();
    
    // Add pagination
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    // Add search term
    if (searchTerm) {
      params.append('search', searchTerm);
    }
    
    // Add array parameters
    filters.discipline_ids.forEach(id => params.append('discipline_id', id.toString()));
    
    // Add single study level parameter
    if (filters.study_level_id) {
      params.append('study_level_id', filters.study_level_id.toString());
    }
    
    filters.university_ids.forEach(id => params.append('university_id', id.toString()));
    filters.country_codes.forEach(code => params.append('country_code', code));
    filters.state_codes.forEach(code => params.append('state_code', code));
    filters.city_codes.forEach(code => params.append('city_code', code));
    
    return params.toString();
  }, [filters, limit, searchTerm]);

  // Fetch courses from API
  const fetchCourses = useCallback(async (page: number = 1, append: boolean = false) => {
    if (!token) {
      setError("Authentication token not found");
      setLoading(false);
      return;
    }

    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const queryString = buildQueryString(page);
      const url = `${BASE_URL}/agent/courses${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          logout();
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();
      
      if (result.success && result.data) {
        if (append) {
          // Append new courses to existing ones
          setCourses(prev => [...prev, ...result.data]);
        } else {
          // Replace courses for first page
          setCourses(result.data);
        }
        setApiResponse(result);
        setCurrentPage(result.page);
        setHasMore(result.hasNextPage);
      } else {
        if (!append) {
          setCourses([]);
        }
        setApiResponse(null);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please try again.');
      if (!append) {
        setCourses([]);
        setApiResponse(null);
      }
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [token, buildQueryString, logout]);

  // Initial fetch
  useEffect(() => {
    fetchCourses(1, false);
  }, []);

  // Handle search with debounce
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      setCurrentPage(1);
      fetchCourses(1, false);
    }, 500); // 500ms debounce

    setSearchTimeout(timeout);

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTerm]);

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Type-safe filter removal functions
  const handleRemoveDisciplineFilter = (id: number) => {
    setFilters(prev => ({
      ...prev,
      discipline_ids: prev.discipline_ids.filter(disciplineId => disciplineId !== id)
    }));
    setCurrentPage(1);
  };

  const handleRemoveStudyLevelFilter = () => {
    setFilters(prev => ({
      ...prev,
      study_level_id: null
    }));
    setCurrentPage(1);
  };

  const handleRemoveUniversityFilter = (id: number) => {
    setFilters(prev => ({
      ...prev,
      university_ids: prev.university_ids.filter(universityId => universityId !== id)
    }));
    setCurrentPage(1);
  };

  const handleRemoveCountryFilter = (code: string) => {
    setFilters(prev => ({
      ...prev,
      country_codes: prev.country_codes.filter(countryCode => countryCode !== code)
    }));
    setCurrentPage(1);
  };

  const handleRemoveStateFilter = (code: string) => {
    setFilters(prev => ({
      ...prev,
      state_codes: prev.state_codes.filter(stateCode => stateCode !== code)
    }));
    setCurrentPage(1);
  };

  const handleRemoveCityFilter = (code: string) => {
    setFilters(prev => ({
      ...prev,
      city_codes: prev.city_codes.filter(cityCode => cityCode !== code)
    }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    const resetFilters: FilterOptions = {
      discipline_ids: [],
      study_level_id: null,
      university_ids: [],
      country_codes: [],
      state_codes: [],
      city_codes: [],
    };
    setFilters(resetFilters);
    setCurrentPage(1);
  };

  // Fetch courses when filters or page change
  useEffect(() => {
    fetchCourses(currentPage, currentPage > 1);
  }, [filters, currentPage]);

  // Infinite scroll setup
  useEffect(() => {
    if (!hasMore || isLoadingMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore]);

  const loadNextPage = () => {
    if (hasMore && !isLoadingMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Fetch students when confirmation modal opens
  const fetchStudents = async () => {
    try {
      setFetchingStudents(true);
      setStudentError(null);
      
      const response = await fetch(`${BASE_URL}/agent/student`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const data: StudentsResponse = await response.json();
      
      if (data.success) {
        setStudents(data.data);
      } else {
        throw new Error('Failed to load students');
      }
    } catch (err) {
      setStudentError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setFetchingStudents(false);
    }
  };

  // Handle Apply button click
  const handleApplyClick = async (course: Course) => {
    setSelectedCourse(course);
    // Fetch students before opening confirmation modal
    await fetchStudents();
    setIsConfirmModalOpen(true);
  };

  // Handle application submission
  const handleConfirmApplication = async (selectedStudentId: number) => {
    if (!selectedCourse) return;

    setIsApplying(true);
    try {
      const payload = {
        student_user_id: selectedStudentId,
        course_id: selectedCourse.id,
        study_level_id: selectedCourse.study_level_id,
        remarks: "Student wants Jan 2025 intake"
      };

      const response = await fetch(`${BASE_URL}/agent/student/application/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      const result = await response.json();
      
      if (result.success) {
        setAlertType('success');
        setAlertMessage(`Your application for ${selectedCourse.course_name} at ${selectedCourse.university_name} has been submitted successfully for the selected student!`);
      } else {
        throw new Error(result.message || 'Application failed');
      }
    } catch (err) {
      setAlertType('error');
      setAlertMessage(err instanceof Error ? err.message : 'Failed to submit application. Please try again.');
    } finally {
      setIsApplying(false);
      setIsConfirmModalOpen(false);
      setIsAlertModalOpen(true);
    }
  };

  // Close alert modal
  const handleCloseAlert = () => {
    setIsAlertModalOpen(false);
    setSelectedCourse(null);
  };

  // Helper function to get filter name by ID
  const getFilterName = (type: 'discipline' | 'studyLevel' | 'university', id: number): string => {
    if (!apiResponse?.filters) return '';
    
    switch (type) {
      case 'discipline':
        return apiResponse.filters.disciplines.find(d => d.id === id)?.name || '';
      case 'studyLevel':
        return apiResponse.filters.studyLevels.find(s => s.id === id)?.name || '';
      case 'university':
        return apiResponse.filters.universities.find(u => u.id === id)?.university || '';
      default:
        return '';
    }
  };

  const hasActiveFilters = 
    filters.discipline_ids.length > 0 ||
    filters.study_level_id !== null ||
    filters.university_ids.length > 0 ||
    filters.country_codes.length > 0 ||
    filters.state_codes.length > 0 ||
    filters.city_codes.length > 0;

  // if (loading && currentPage === 1) {
  //   return (
  //     <div className="flex justify-center items-center h-64">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
  //     </div>
  //   );
  // }

  if (error && currentPage === 1) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
        <button 
          onClick={() => fetchCourses(1, false)}
          className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Available Programs
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Select a course to apply.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          {/* <div className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500/10"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div> */}

          {/* Filter Button */}
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="h-11 px-4 rounded-lg border border-gray-200 bg-transparent text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Filter Courses
              {hasActiveFilters && (
                <span className="ml-1 bg-brand-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {filters.discipline_ids.length + 
                   (filters.study_level_id ? 1 : 0) + 
                   filters.university_ids.length + 
                   filters.country_codes.length + 
                   filters.state_codes.length + 
                   filters.city_codes.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          {filters.discipline_ids.map(id => (
            <Badge key={`discipline-${id}`} size="sm" color="primary">
              Discipline: {getFilterName('discipline', id)}
              <button 
                onClick={() => handleRemoveDisciplineFilter(id)}
                className="ml-1 text-xs hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          ))}
          {filters.study_level_id !== null && (
            <Badge key={`study-level-${filters.study_level_id}`} size="sm" color="primary">
              Study Level: {getFilterName('studyLevel', filters.study_level_id)}
              <button 
                onClick={handleRemoveStudyLevelFilter}
                className="ml-1 text-xs hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          )}
          {filters.university_ids.map(id => (
            <Badge key={`university-${id}`} size="sm" color="primary">
              University: {getFilterName('university', id)}
              <button 
                onClick={() => handleRemoveUniversityFilter(id)}
                className="ml-1 text-xs hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          ))}
          {filters.country_codes.map(code => (
            <Badge key={`country-${code}`} size="sm" color="primary">
              Country: {getCountryName(code)}
              <button 
                onClick={() => handleRemoveCountryFilter(code)}
                className="ml-1 text-xs hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          ))}
          {filters.state_codes.map(code => (
            <Badge key={`state-${code}`} size="sm" color="primary">
              State: {getStateName(code)}
              <button 
                onClick={() => handleRemoveStateFilter(code)}
                className="ml-1 text-xs hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          ))}
          {filters.city_codes.map(code => (
            <Badge key={`city-${code}`} size="sm" color="primary">
              City: {code}
              <button 
                onClick={() => handleRemoveCityFilter(code)}
                className="ml-1 text-xs hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onApply={handleApplyClick}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              No courses found matching your criteria.
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>

      {/* Loading More Indicator */}
      {isLoadingMore && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      )}

      {/* Infinite Scroll Sentinel */}
      <div ref={loadMoreRef} className="h-1" />

      {/* Results Count and Pagination Info */}
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div>
          Showing {courses.length} of {apiResponse?.total || 0} courses
          {apiResponse && (
            <span className="ml-2">
              (Page {apiResponse.page} of {apiResponse.totalPages})
            </span>
          )}
        </div>
        {apiResponse && apiResponse.totalPages > 1 && (
          <div className="text-sm">
            {currentPage < apiResponse.totalPages ? 'Scroll to load more' : 'All courses loaded'}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onFilterChange={handleFilterChange}
        filtersData={apiResponse?.filters || null}
        appliedFilters={filters}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmApplication}
        course={selectedCourse}
        loading={isApplying}
        students={students}
        isFetchingStudents={fetchingStudents}
        studentError={studentError}
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={handleCloseAlert}
        type={alertType}
        message={alertMessage}
      />
    </div>
  );
}