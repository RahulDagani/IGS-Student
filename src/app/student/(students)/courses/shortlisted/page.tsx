"use client"
import React, { useState, useEffect, useCallback } from "react";
import Badge from "@/components/ui/badge/Badge";
import { DockIcon, DollarSign, GraduationCap, Book, Building2, Star, Heart, Trash2 } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Country, State } from "country-state-city";
import Image from "next/image";

// Interfaces for shortlisted courses
interface ShortlistedCourse {
  shortlist_id: number;
  shortlisted_at: string;
  id: number;
  university_id: number;
  study_level_id: number;
  discipline_id: number;
  course_name: string;
  course_slug: string;
  is_popular: number;
  duration_min: number | null;
  duration_max: number | null;
  duration_unit: string;
  tuition_fee: string | null;
  tuition_fee_url: string | null;
  currency_code: string;
  application_fee: string | null;
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
  external_evaluation: string | null;
  is_deleted: number;
  created_at: string;
  updated_at: string;
  university: string;
  university_slug: string;
  university_country: string;
  university_state: string;
  university_city: string;
  university_logo: string;
  university_website: string | null;
  study_level_name: string;
  discipline_name: string;
  university_logo_url: string;
}

interface ApiResponse {
  success: boolean;
  data: ShortlistedCourse[];
}

// Application Confirmation Modal — same as courses page
interface CourseIntake { id: number; intake_id: number; intake_name: string; intake_year: number; application_start_date: string | null; application_deadline: string | null; course_start_date: string | null; }

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (intakeId: number, appLogin: string, appPassword: string) => void;
  course: ShortlistedCourse | null;
  loading: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, course, loading }) => {
  const [selectedIntakeId, setSelectedIntakeId] = useState<number>(0);
  const [intakes, setIntakes] = useState<CourseIntake[]>([]);
  const [isFetchingIntakes, setIsFetchingIntakes] = useState(false);
  const [appLogin, setAppLogin] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const { token } = useAuth();
  const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;

  const formatFee = (fee: string | null, currency: string) => {
    if (!fee || fee === '0.00') return 'Free';
    return `${currency} ${parseFloat(fee).toLocaleString()}`;
  };

  useEffect(() => {
    if (!isOpen || !course || !token) return;
    setIsFetchingIntakes(true);
    setSelectedIntakeId(0);
    setIntakes([]);
    fetch(`${BASE_URL}/student/course/intake/${course.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data?.length > 0) {
          setIntakes(data.data);
          setSelectedIntakeId(data.data[0].id);
        }
      })
      .catch(() => {})
      .finally(() => setIsFetchingIntakes(false));
    setAppLogin('');
    setAppPassword('');
  }, [isOpen, course]);

  if (!isOpen || !course) return null;
  const hasIntakes = intakes.length > 0;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-99999 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">

        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirm Application</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Review your details before submitting</p>
          </div>
          <button onClick={onClose} disabled={loading} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Course summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div className="flex items-start gap-3 mb-3">
              {course.university_logo_url ? (
                <Image src={course.university_logo_url} alt={course.university} width={48} height={48} className="rounded-lg object-contain shrink-0" />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {course.university.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{course.course_name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{course.university}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-gray-500 dark:text-gray-400">Level:</span>
                <span className="font-medium text-gray-800 dark:text-white">{course.study_level_name}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-500 dark:text-gray-400">App. Fee:</span>
                <span className="font-medium text-gray-800 dark:text-white">{formatFee(course.application_fee, course.currency_code)}</span>
              </div>
            </div>
          </div>

          {/* Intake selection */}
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-white mb-2">Select Intake</p>
            {isFetchingIntakes ? (
              <div className="flex items-center gap-2 p-3 text-sm text-gray-500 dark:text-gray-400">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                Loading intakes...
              </div>
            ) : !hasIntakes ? (
              <div className="text-sm text-amber-700 dark:text-amber-400 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                No intakes are currently available for this program.
              </div>
            ) : (
              <div className="space-y-2">
                {intakes.map(intake => {
                  const sel = selectedIntakeId === intake.id;
                  return (
                    <label key={intake.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${sel ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                      <input type="radio" name="intake" value={intake.id} checked={sel} onChange={() => setSelectedIntakeId(intake.id)} className="h-4 w-4 text-brand-500 border-gray-300" />
                      <span className={`text-sm font-medium ${sel ? 'text-brand-700 dark:text-brand-300' : 'text-gray-700 dark:text-gray-300'}`}>
                        {intake.intake_name} {intake.intake_year}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Portal credentials */}
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
              Portal Credentials <span className="text-xs font-normal text-gray-400">(optional)</span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Login / Username</label>
                <input type="text" value={appLogin} onChange={e => setAppLogin(e.target.value)} placeholder="Enter login"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Password</label>
                <input type="text" value={appPassword} onChange={e => setAppPassword(e.target.value)} placeholder="Enter password"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 shrink-0 rounded-b-2xl bg-white dark:bg-gray-900">
          <button onClick={onClose} disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={() => onConfirm(selectedIntakeId, appLogin, appPassword)}
            disabled={loading || isFetchingIntakes || !hasIntakes || selectedIntakeId === 0}
            className="flex-1 px-4 py-2.5 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                Submitting...
              </>
            ) : 'Confirm Application'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Alert Modal Component
interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  message: string;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, type, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
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
            {type === 'success' ? 'Success!' : 'Error'}
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

// Helper functions
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

// Shortlisted Course Card Component
const ShortlistedCourseCard: React.FC<{ 
  course: ShortlistedCourse;
  onApply: (course: ShortlistedCourse) => void;
  onRemove: (courseId: number) => Promise<void>;
  isRemoving: boolean;
}> = ({ course, onApply, onRemove, isRemoving }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 3);
  };

  const formatDuration = () => {
    if (course.duration_min === null || course.duration_max === null) {
      return "N/A";
    }
    if (course.duration_min === course.duration_max) {
      return `${course.duration_min} ${course.duration_unit}`;
    }
    return `${course.duration_min} - ${course.duration_max} ${course.duration_unit}`;
  };

  const formatFee = (fee: string | null, currency: string) => {
    if (!fee || fee === "0.00") return "N/A";
    return `${currency} ${parseFloat(fee).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
      {/* Top Section */}
      <div className="flex items-start justify-between">
        {/* University Info */}
        <div className="flex items-start">
          <div className="logo w-24 h-24 flex shrink-0 justify-center items-center bg-white rounded-2xl">
            {course.university_logo_url ? (
              <Image 
                src={course.university_logo_url} 
                alt={`${course.university} logo`}
                height={100}
                width={100}
                className="rounded-md object-contain"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center text-white font-bold text-sm">
                {getInitials(course.university)}
              </div>
            )}
          </div>
          <div className="ml-2">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white leading-snug">
              {course.course_name}
            </h2>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {course.university}
            </p>
            {course.is_popular === 1 && (
              <Badge size="sm" color="warning">
                <Star size={12} className="mr-1" />
                Popular
              </Badge>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Shortlisted on {formatDate(course.shortlisted_at)}
            </p>
          </div>
        </div>
        
        {/* Remove Button */}
        <button
          onClick={() => onRemove(course.id)}
          disabled={isRemoving}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Remove from shortlist"
        >
          {isRemoving ? (
            <svg className="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Trash2 size={20} className="text-red-500 hover:text-red-600" />
          )}
        </button>
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
          <Book size={18}/>
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
              {getCountryName(course.university_country)}, {getStateName(course.university_state)}
            </strong>
          </div>
        </div>
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
          href={`/student/courses/${course.id}`}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-center dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg text-sm transition-all"
        >
          View Course Details
        </Link>
        <button
          onClick={() => onApply(course)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-center dark:bg-green-700 dark:hover:bg-green-600 text-white font-semibold py-2 rounded-lg text-sm transition-all"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;

export default function ShortlistedCoursesPage() {
  const router = useRouter();
  const { token, logout, user } = useAuth();
  const studentId = user?.id;
  
  const [shortlistedCourses, setShortlistedCourses] = useState<ShortlistedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Application states
  const [selectedCourse, setSelectedCourse] = useState<ShortlistedCourse | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [removingCourseId, setRemovingCourseId] = useState<number | null>(null);

  // Fetch shortlisted courses
  const fetchShortlistedCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${BASE_URL}/student/shortlist/courses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          logout("student");
          return;
        }
        throw new Error('Failed to fetch shortlisted courses');
      }

      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setShortlistedCourses(data.data || []);
      } else {
        throw new Error('Failed to load shortlisted courses');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  // Initial fetch
  useEffect(() => {
    fetchShortlistedCourses();
  }, [fetchShortlistedCourses]);

  // Handle Remove from shortlist
  const handleRemoveFromShortlist = async (courseId: number) => {
    if (!token) return;

    setRemovingCourseId(courseId);
    try {
      const response = await fetch(`${BASE_URL}/student/shortlist/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove from shortlist');
      }

      const result = await response.json();
      if (result.success) {
        // Remove the course from UI
        setShortlistedCourses(prev => prev.filter(course => course.id !== courseId));
        
        setAlertType('success');
        setAlertMessage('Course removed from shortlist successfully!');
        setIsAlertModalOpen(true);
      } else {
        throw new Error(result.message || 'Failed to remove from shortlist');
      }
    } catch (err) {
      setAlertType('error');
      setAlertMessage(err instanceof Error ? err.message : 'Failed to remove from shortlist');
      setIsAlertModalOpen(true);
    } finally {
      setRemovingCourseId(null);
    }
  };

  // Handle Apply button click
  const handleApplyClick = (course: ShortlistedCourse) => {
    setSelectedCourse(course);
    setIsConfirmModalOpen(true);
  };

  // Handle application submission
  const handleConfirmApplication = async (intakeId: number, appLogin: string, appPassword: string) => {
    if (!selectedCourse) return;

    setIsApplying(true);
    try {
      const payload = {
        course_id: selectedCourse.id,
        study_level_id: selectedCourse.study_level_id,
        remarks: "Student wants to apply for this course",
        course_intake_id: intakeId,
        student_user_id: studentId,
        application_login: appLogin,  
        application_password: appPassword
      };

      const response = await fetch(`${BASE_URL}/student/application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        const app_id = result.application_id;
        setAlertType('success');
        setAlertMessage(`Your application for ${selectedCourse.course_name} at ${selectedCourse.university} has been submitted successfully!`);

        setTimeout(() => {
          router.push(`/student/editProfile?tab=applications&app=${app_id}`);
        }, 2000);
      } else {
        throw new Error(result.message || 'Application failed');
      }
    } catch (err) {
      setAlertType('error');
      setAlertMessage(err instanceof Error ? err.message : 'Failed to submit application. Please try again.');
      setIsAlertModalOpen(true);
    } finally {
      setIsApplying(false);
      setIsConfirmModalOpen(false);
    }
  };

  // Close alert modal
  const handleCloseAlert = () => {
    setIsAlertModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-brand-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading shortlisted courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-2">Error loading shortlisted courses</div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
        <button 
          onClick={() => {
            setError(null);
            fetchShortlistedCourses();
          }}
          className="mt-4 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            My Wishlist
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your saved courses ready for application
          </p>
        </div>
        
        {/* Summary */}
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-800 dark:text-white">
              {shortlistedCourses.length || 0}
            </div>
            <div className="text-gray-500 dark:text-gray-400">Total Wishlisted</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
              {shortlistedCourses.filter(course => course.is_popular === 1).length}
            </div>
            <div className="text-gray-500 dark:text-gray-400">Popular</div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {shortlistedCourses.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            No wishlist courses yet
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Start browsing programs and click the heart icon to add them to your wishlist
          </p>
          <Link
            href="/student/courses"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      )}

      {/* Cards Grid */}
      {shortlistedCourses.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shortlistedCourses.map((course) => (
              <ShortlistedCourseCard 
                key={course.shortlist_id} 
                course={course}
                onApply={handleApplyClick}
                onRemove={handleRemoveFromShortlist}
                isRemoving={removingCourseId === course.id}
              />
            ))}
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {shortlistedCourses.length} wishlisted course(s)
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmApplication}
        course={selectedCourse}
        loading={isApplying}
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