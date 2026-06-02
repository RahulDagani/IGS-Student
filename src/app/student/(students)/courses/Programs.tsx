"use client"
import React, { useState, useEffect, useCallback, useRef } from "react";
import Badge from "@/components/ui/badge/Badge";
import { DockIcon, DollarSign, GraduationCap, Book, Building2, Star, X, ChevronDown, ChevronUp, Heart } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Country, State } from "country-state-city";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;

// ─── Interfaces ────────────────────────────────────────────────────────────────

interface StudyLevel { id: number; name: string; }
interface Discipline { id: number; name: string; }
interface University { id: number; university: string; country_code?: string; }
interface LocationCountry { country_id: number; country_name: string; iso_code: string; }
interface IntakeOption { id: number; intake: string; }
interface IntakeYear { intake_year: number; }

interface FiltersData {
  studyLevels: StudyLevel[];
  disciplines: Discipline[];
  universities: University[];
  locations: { countries: LocationCountry[]; };
  intakes: IntakeOption[];
  intakeYears: IntakeYear[];
}

interface Course {
  id: number;
  university_id: number;
  study_level_id: number;
  discipline_id: number;
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
  university_name: string;
  country_code: string;
  state_code: string;
  study_level_name: string;
  discipline_name: string;
  university_logo_url: string;
  is_shortlisted?: number | null;
  intakes?: { intake_id: number; intake_year: number; intake_name: string; }[];
}

interface FilterOptions {
  disciplines: number[];
  studyLevels: number[];
  universities: number[];
  countries: number[];
  intakes: number[];
  intakeYears: number[];
}

const emptyFilters = (): FilterOptions => ({
  disciplines: [], studyLevels: [], universities: [], countries: [], intakes: [], intakeYears: [],
});

// ─── Helpers ────────────────────────────────────────────────────────────────────

const getCountryName = (code: string | undefined | null) => {
  if (!code) return '';
  const c = Country.getCountryByCode(code);
  return c ? c.name : code;
};

const getStateName = (code: string | undefined | null) => {
  if (!code) return '';
  const s = State.getStateByCode(code);
  return s ? s.name : code;
};

// ─── Filter Modal ───────────────────────────────────────────────────────────────

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterApply: (filters: FilterOptions) => void;
  filterOptions: FiltersData | null;
  appliedFilters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen, onClose, onFilterApply, filterOptions, appliedFilters, onFiltersChange,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(appliedFilters);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    disciplines: true, locations: true, universities: true, studyLevels: true, intakes: true, intakeYears: true,
  });
  const [disciplineSearch, setDisciplineSearch] = useState('');
  const [universitySearch, setUniversitySearch] = useState('');

  const matchesSearch = (name: string, query: string) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return name.toLowerCase().split(/\s+/).some(word => word.startsWith(q));
  };

  useEffect(() => {
    if (isOpen) setLocalFilters(appliedFilters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const toggleSection = (s: string) =>
    setExpandedSections(prev => ({ ...prev, [s]: !prev[s] }));

  const handleCheckboxChange = (key: keyof FilterOptions, value: number, checked: boolean) => {
    setLocalFilters(prev => {
      const arr = prev[key] as number[];
      const next = checked ? [...arr, value] : arr.filter(v => v !== value);
      const nf = { ...prev, [key]: next };
      onFiltersChange(nf);
      return nf;
    });
  };

  const isSelected = (key: keyof FilterOptions, value: number) =>
    (localFilters[key] as number[]).includes(value);

  const totalSelected = Object.values(localFilters).reduce((s, v) => s + (Array.isArray(v) ? v.length : 0), 0);

  const handleReset = () => {
    const reset = emptyFilters();
    setLocalFilters(reset);
    onFiltersChange(reset);
  };

  const handleApply = () => { onFilterApply(localFilters); onClose(); };

  if (!isOpen || !filterOptions) return null;

  const Section = ({ title, sectionKey, count, children }: {
    title: string; sectionKey: string; count?: number; children: React.ReactNode;
  }) => (
    <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
      <button type="button" onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full py-2 text-left">
        <span className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-white">
          {title}
          {count ? <span className="bg-brand-500 text-white text-xs rounded-full px-1.5 py-0.5">{count}</span> : null}
        </span>
        {expandedSections[sectionKey]
          ? <ChevronUp className="w-4 h-4 text-gray-400" />
          : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {expandedSections[sectionKey] && <div className="mt-2">{children}</div>}
    </div>
  );

  const CheckboxList = ({ items, filterKey, getLabel, getId }: {
    items: any[]; filterKey: keyof FilterOptions;
    getLabel: (item: any) => string; getId: (item: any) => number;
  }) => (
    <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto pr-1">
      {items.map(item => (
        <label key={getId(item)}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
          <input type="checkbox"
            checked={isSelected(filterKey, getId(item))}
            onChange={e => handleCheckboxChange(filterKey, getId(item), e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 shrink-0"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{getLabel(item)}</span>
        </label>
      ))}
    </div>
  );

  const searchInputCls = "w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300 mb-2";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-99999 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-[680px] max-h-[90vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Programs</h3>
            {totalSelected > 0 && (
              <p className="text-xs text-brand-500 mt-0.5">{totalSelected} filter{totalSelected > 1 ? 's' : ''} selected</p>
            )}
          </div>
          <button onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">

          <Section title="Study Destination" sectionKey="locations" count={localFilters.countries.length || undefined}>
            <CheckboxList
              items={filterOptions.locations.countries}
              filterKey="countries"
              getLabel={c => c.country_name}
              getId={c => c.country_id}
            />
          </Section>

          <Section title="Study Level" sectionKey="studyLevels" count={localFilters.studyLevels.length || undefined}>
            <CheckboxList
              items={filterOptions.studyLevels}
              filterKey="studyLevels"
              getLabel={l => l.name}
              getId={l => l.id}
            />
          </Section>

          <Section title="Discipline" sectionKey="disciplines" count={localFilters.disciplines.length || undefined}>
            <input type="text" placeholder="Search disciplines..." value={disciplineSearch}
              onChange={e => setDisciplineSearch(e.target.value)} className={searchInputCls} />
            <CheckboxList
              items={filterOptions.disciplines
                .filter((d, i, arr) => arr.findIndex(x => x.name === d.name) === i)
                .filter(d => matchesSearch(d.name, disciplineSearch))}
              filterKey="disciplines"
              getLabel={d => d.name}
              getId={d => d.id}
            />
          </Section>

          <Section title="University" sectionKey="universities" count={localFilters.universities.length || undefined}>
            <input type="text" placeholder="Search universities..." value={universitySearch}
              onChange={e => setUniversitySearch(e.target.value)} className={searchInputCls} />
            <CheckboxList
              items={filterOptions.universities
                .filter((u, i, arr) => arr.findIndex(x => x.id === u.id) === i)
                .filter(u => matchesSearch(u.university, universitySearch))}
              filterKey="universities"
              getLabel={u => u.university}
              getId={u => u.id}
            />
          </Section>

        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 shrink-0 bg-white dark:bg-gray-900 rounded-b-2xl">
          <button onClick={handleReset}
            className="flex-1 px-4 py-2.5 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Reset All
          </button>
          <button onClick={handleApply}
            className="flex-1 px-4 py-2.5 text-sm font-medium bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-colors">
            Apply Filters {totalSelected > 0 && `(${totalSelected})`}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Confirm Modal ──────────────────────────────────────────────────────────────

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (intakeId: number, appLogin: string, appPassword: string) => void;
  course: Course | null;
  loading: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, course, loading }) => {
  const [selectedIntakeId, setSelectedIntakeId] = useState<number>(0);
  const [appLogin, setAppLogin] = useState('');
  const [appPassword, setAppPassword] = useState('');

  const formatFee = (fee: string, currency: string) => {
    if (!fee || fee === '0.00') return 'Free';
    return `${currency} ${parseFloat(fee).toLocaleString()}`;
  };

  useEffect(() => {
    if (course?.intakes?.length) setSelectedIntakeId(course.intakes[0].intake_id);
    else setSelectedIntakeId(0);
    setAppLogin('');
    setAppPassword('');
  }, [course]);

  if (!isOpen || !course) return null;
  const hasIntakes = !!course.intakes?.length;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-99999 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">

        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirm Application</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Review your details before submitting</p>
            </div>
            <button onClick={onClose} disabled={loading}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Course summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div className="flex items-start gap-3 mb-3">
              {course.university_logo_url ? (
                <Image src={course.university_logo_url} alt={course.university_name} width={48} height={48} className="rounded-lg object-contain shrink-0" />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {course.university_name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{course.course_name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{course.university_name}</p>
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
            {!hasIntakes ? (
              <div className="text-sm text-amber-700 dark:text-amber-400 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                No intakes are currently available for this program.
              </div>
            ) : (
              <div className="space-y-2">
                {course.intakes?.map(intake => {
                  const sel = selectedIntakeId === intake.intake_id;
                  return (
                    <label key={intake.intake_id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        sel ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}>
                      <input type="radio" name="intake" value={intake.intake_id} checked={sel}
                        onChange={() => setSelectedIntakeId(intake.intake_id)}
                        className="h-4 w-4 text-brand-500 focus:ring-brand-500 border-gray-300" />
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
                <input type="text" value={appLogin} onChange={e => setAppLogin(e.target.value)}
                  placeholder="Enter login"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Password</label>
                <input type="text" value={appPassword} onChange={e => setAppPassword(e.target.value)}
                  placeholder="Enter password"
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
            disabled={loading || !hasIntakes || selectedIntakeId === 0}
            className="flex-1 px-4 py-2.5 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </>
            ) : 'Confirm Application'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Alert Modal ────────────────────────────────────────────────────────────────

const AlertModal: React.FC<{ isOpen: boolean; onClose: () => void; type: 'success' | 'error'; message: string }> = ({
  isOpen, onClose, type, message,
}) => {
  if (!isOpen) return null;
  const ok = type === 'success';
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-99999 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl p-6 text-center">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${ok ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
          {ok ? (
            <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-7 h-7 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <h3 className={`text-lg font-semibold mb-2 ${ok ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'}`}>
          {ok ? 'Application Submitted!' : 'Application Failed'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">{message}</p>
        <button onClick={onClose}
          className={`w-full py-2.5 text-sm font-medium text-white rounded-xl ${ok ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} transition-colors`}>
          Close
        </button>
      </div>
    </div>
  );
};

// ─── Course Card ────────────────────────────────────────────────────────────────

const CourseCard: React.FC<{ course: Course; onApply: (course: Course) => void }> = ({ course, onApply }) => {
  const { token } = useAuth();
  const [isShortlisted, setIsShortlisted] = useState(!!course.is_shortlisted);
  const [isShortlisting, setIsShortlisting] = useState(false);

  const formatDuration = () => {
    if (course.duration_min === course.duration_max) return `${course.duration_min} ${course.duration_unit}`;
    return `${course.duration_min}–${course.duration_max} ${course.duration_unit}`;
  };

  const formatFee = (fee: string, currency: string) => {
    if (!fee || fee === '0.00') return 'N/A';
    return `${currency} ${parseFloat(fee).toLocaleString()}`;
  };

  const handleShortlist = async () => {
    if (!token || isShortlisting) return;
    setIsShortlisting(true);
    try {
      if (isShortlisted) {
        const res = await fetch(`${BASE_URL}/student/shortlist/courses/${course.id}`, {
          method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
        });
        if ((await res.json()).success) setIsShortlisted(false);
      } else {
        const res = await fetch(`${BASE_URL}/student/shortlist/courses`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ course_id: course.id }),
        });
        if ((await res.json()).success) setIsShortlisted(true);
      }
    } catch { /* silent */ }
    finally { setIsShortlisting(false); }
  };

  const InfoRow = ({ icon: Icon, label, value }: { icon: React.FC<any>; label: string; value: React.ReactNode }) => (
    <div className="flex items-start gap-2 text-sm">
      <Icon size={16} className="text-gray-400 mt-0.5 shrink-0" />
      <div>
        <span className="text-gray-500 dark:text-gray-400">{label}</span>
        <span className="block font-semibold text-gray-800 dark:text-white">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            {course.university_logo_url ? (
              <Image src={course.university_logo_url} alt={course.university_name}
                height={80} width={80} className="rounded-xl object-contain shrink-0 border border-gray-100 dark:border-gray-700 bg-white p-1" priority />
            ) : (
              <div className="w-[80px] h-[80px] bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0">
                {course.university_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
              </div>
            )}
            <div>
              <h2 className="text-base font-semibold text-gray-800 dark:text-white leading-tight line-clamp-2">{course.course_name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{course.university_name}</p>
              {course.is_popular === 1 && (
                <div className="mt-1">
                  <Badge size="sm" color="warning" startIcon={<Star size={11} />}>Popular</Badge>
                </div>
              )}
            </div>
          </div>
          <button onClick={handleShortlist} disabled={isShortlisting}
            title={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shrink-0 disabled:opacity-50">
            {isShortlisting ? (
              <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <Heart size={19} className={isShortlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'} />
            )}
          </button>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2.5">
          <InfoRow icon={GraduationCap} label="Study Level" value={course.study_level_name} />
          <InfoRow icon={DockIcon} label="Duration" value={formatDuration()} />
          <InfoRow icon={DollarSign} label="Fees" value={
            <span className="space-y-0.5">
              <span className="block">Tuition: {formatFee(course.tuition_fee, course.currency_code)}</span>
              <span className="block">Application: {formatFee(course.application_fee, course.currency_code)}</span>
            </span>
          } />
          <InfoRow icon={Book} label="Discipline" value={course.discipline_name} />
          <InfoRow icon={Building2} label="Location" value={`${getCountryName(course.country_code)}${course.state_code ? `, ${getStateName(course.state_code)}` : ''}`} />
        </div>

        {(course.ielts_score || course.pte_score || course.toefl_score || course.duolingo_score || course.gre_score || course.gmat_score) && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Entry Requirements</p>
            <div className="flex flex-wrap gap-1.5">
              {course.ielts_score && <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full font-medium">IELTS {course.ielts_score}</span>}
              {course.pte_score && <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full font-medium">PTE {course.pte_score}</span>}
              {course.toefl_score && <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full font-medium">TOEFL {course.toefl_score}</span>}
              {course.duolingo_score && <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full font-medium">Duolingo {course.duolingo_score}</span>}
              {course.gre_score && <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full font-medium">GRE {course.gre_score}</span>}
              {course.gmat_score && <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full font-medium">GMAT {course.gmat_score}</span>}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 p-4 border-t border-gray-100 dark:border-gray-700">
        <Link href={`/student/courses/${course.id}`}
          className="flex-1 text-center text-sm font-semibold py-2 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 dark:hover:bg-brand-900/40 text-brand-600 dark:text-brand-400 transition-colors">
          View Details
        </Link>
        <button onClick={() => onApply(course)}
          className="flex-1 text-sm font-semibold py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white transition-colors">
          Apply Now
        </button>
      </div>
    </div>
  );
};

// ─── Main Page ──────────────────────────────────────────────────────────────────

export default function StudentProgramsPage() {
  const router = useRouter();
  const { token, logout, user } = useAuth();
  const studentId = user?.id;

  const [courses, setCourses] = useState<Course[]>([]);
  const [filtersData, setFiltersData] = useState<FiltersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const [filters, setFilters] = useState<FilterOptions>(emptyFilters());
  const [modalFilters, setModalFilters] = useState<FilterOptions>(emptyFilters());
  const [filterLabels, setFilterLabels] = useState<Record<string, Record<number, string>>>({});

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const observerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const filterDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // ── Query builders ──────────────────────────────────────────────────────────

  const buildFilterQueryString = useCallback((f: FilterOptions, extra?: { search?: string }) => {
    const params = new URLSearchParams();
    const map: Record<string, string> = {
      studyLevels: 'study_level_id', disciplines: 'discipline_id',
      universities: 'university_id', countries: 'country_id',
      intakes: 'intake_id', intakeYears: 'intake_year',
    };
    Object.entries(f).forEach(([key, values]) => {
      if (Array.isArray(values)) values.forEach(v => v !== '' && params.append(map[key] ?? key, String(v)));
    });
    if (extra?.search) params.append('search', extra.search);
    return params.toString();
  }, []);

  const buildCoursesQueryString = useCallback((page: number, f: FilterOptions, search: string) => {
    const qs = buildFilterQueryString(f, { search });
    const params = new URLSearchParams(qs);
    params.set('page', String(page));
    params.set('limit', '10');
    return params.toString();
  }, [buildFilterQueryString]);

  // ── Fetch helpers ───────────────────────────────────────────────────────────

  const fetchFilters = useCallback(async (currentFilters?: FilterOptions) => {
    try {
      setLoadingFilters(true);
      const qs = buildFilterQueryString(currentFilters ?? filters);
      const res = await fetch(`${BASE_URL}/student/course/filters/dynamic${qs ? `?${qs}` : ''}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 403) { logout('student'); return; }
      const data = await res.json();
      if (data.success) setFiltersData(data.data.filters);
    } catch { /* silent */ }
    finally { setLoadingFilters(false); }
  }, [token, logout, buildFilterQueryString, filters]);

  const fetchCourses = useCallback(async (page: number, loadMore: boolean, f: FilterOptions, search: string) => {
    try {
      loadMore ? setIsLoadingMore(true) : setLoading(true);
      const qs = buildCoursesQueryString(page, f, search);
      const res = await fetch(`${BASE_URL}/student/courses?${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 403) { logout('student'); return; }
      const data = await res.json();
      if (data.success) {
        setCourses(prev => loadMore ? [...prev, ...data.data] : data.data);
        setCurrentPage(data.page ?? 1);
        setHasMore(data.hasNextPage ?? false);
        setTotalRecords(data.total ?? 0);
        setTotalPages(data.totalPages ?? 1);
      }
    } catch { /* silent */ }
    finally { setLoading(false); setIsLoadingMore(false); }
  }, [token, logout, buildCoursesQueryString]);

  // ── Effects ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchFilters();
    fetchCourses(1, false, filters, '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchCourses(1, false, filters, searchTerm);
    }, 500);
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading && !isLoadingMore) {
        fetchCourses(currentPage + 1, true, filters, searchTerm);
      }
    }, { threshold: 0.5 });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => { if (observerRef.current) observer.unobserve(observerRef.current); };
  }, [hasMore, loading, isLoadingMore, currentPage, fetchCourses, filters, searchTerm]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleModalFiltersChange = useCallback((newFilters: FilterOptions) => {
    setModalFilters(newFilters);
    if (filterDebounceRef.current) clearTimeout(filterDebounceRef.current);
    filterDebounceRef.current = setTimeout(() => fetchFilters(newFilters), 400);
  }, [fetchFilters]);

  const handleFilterApply = (newFilters: FilterOptions) => {
    // Snapshot labels from current filtersData while they're still available
    if (filtersData) {
      const labels: Record<string, Record<number, string>> = {};
      newFilters.studyLevels.forEach(id => { labels.studyLevels = { ...labels.studyLevels, [id]: filtersData.studyLevels.find(l => l.id === id)?.name ?? String(id) }; });
      newFilters.disciplines.forEach(id => { labels.disciplines = { ...labels.disciplines, [id]: filtersData.disciplines.find(d => d.id === id)?.name ?? String(id) }; });
      newFilters.universities.forEach(id => { labels.universities = { ...labels.universities, [id]: filtersData.universities.find(u => u.id === id)?.university ?? String(id) }; });
      newFilters.countries.forEach(id => { labels.countries = { ...labels.countries, [id]: filtersData.locations.countries.find(c => c.country_id === id)?.country_name ?? String(id) }; });
      setFilterLabels(prev => ({ ...prev, ...labels }));
    }
    setFilters(newFilters);
    setModalFilters(newFilters);
    setCurrentPage(1);
    fetchCourses(1, false, newFilters, searchTerm);
    setIsFilterModalOpen(false);
  };

  const handleModalOpen = () => {
    setModalFilters(filters);
    setIsFilterModalOpen(true);
  };

  const handleApplyClick = (course: Course) => {
    setSelectedCourse(course);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmApplication = async (intakeId: number, appLogin: string, appPassword: string) => {
    if (!selectedCourse) return;
    setIsApplying(true);
    try {
      const res = await fetch(`${BASE_URL}/student/application`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          course_id: selectedCourse.id,
          university_id: selectedCourse.university_id,
          study_level_id: selectedCourse.study_level_id,
          remarks: 'Student wants to apply for this course',
          student_user_id: studentId,
          course_intake_id: intakeId,
          application_login: appLogin,
          application_password: appPassword,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setAlertType('success');
        setAlertMessage(`Application for ${selectedCourse.course_name} at ${selectedCourse.university_name} submitted successfully!`);
        setTimeout(() => {
          if (result.application_id) router.push(`/student/editProfile?tab=applications&app=${result.application_id}`);
        }, 2000);
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

  const handleRemoveFilter = (key: keyof FilterOptions, value: number) => {
    const nf = { ...filters, [key]: (filters[key] as number[]).filter(v => v !== value) };
    setFilters(nf);
    setModalFilters(nf);
    setCurrentPage(1);
    fetchCourses(1, false, nf, searchTerm);
  };

  const clearAllFilters = () => {
    const reset = emptyFilters();
    setFilters(reset);
    setModalFilters(reset);
    setCurrentPage(1);
    fetchCourses(1, false, reset, searchTerm);
  };

  const hasActiveFilters = Object.values(filters).some(v => Array.isArray(v) && v.length > 0);
  const filterCount = Object.values(filters).reduce((s, v) => s + (Array.isArray(v) ? v.length : 0), 0);

  const getFilterDisplayName = (key: keyof FilterOptions, value: number): string => {
    // Use cached label first (survives after filtersData narrows)
    const cached = filterLabels[key]?.[value];
    if (cached) return cached;
    if (!filtersData) return String(value);
    switch (key) {
      case 'studyLevels': return filtersData.studyLevels.find(l => l.id === value)?.name ?? String(value);
      case 'disciplines': return filtersData.disciplines.find(d => d.id === value)?.name ?? String(value);
      case 'universities': return filtersData.universities.find(u => u.id === value)?.university ?? String(value);
      case 'countries': return filtersData.locations.countries.find(c => c.country_id === value)?.country_name ?? String(value);
      case 'intakeYears': return String(value);
      default: return String(value);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  if (loading && !isLoadingMore) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-brand-500 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading programs...</p>
        </div>
      </div>
    );
  }

  if (error && currentPage === 1) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg mb-2">Error loading programs</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{error}</p>
        <button onClick={() => { setError(null); fetchFilters(); fetchCourses(1, false, filters, ''); }}
          className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Browse Programs</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Discover and apply to programs that match your interests</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-800 dark:text-white">{totalRecords || 0}</div>
            <div className="text-gray-500 dark:text-gray-400">Total Programs</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
              {courses.filter(c => c.is_popular === 1).length}
            </div>
            <div className="text-gray-500 dark:text-gray-400">Popular</div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button onClick={clearAllFilters} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-2">
              Clear All
            </button>
          )}
          <button onClick={handleModalOpen} disabled={loadingFilters}
            className="h-11 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white flex items-center gap-2 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            Filter Programs
            {hasActiveFilters && (
              <span className="bg-brand-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {filterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          {Object.entries(filters).map(([key, values]) => {
            if (!Array.isArray(values) || !values.length) return null;
            return values.map(value => {
              const name = getFilterDisplayName(key as keyof FilterOptions, value as number);
              if (!name) return null;
              return (
                <span key={`${key}-${value}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 px-2.5 py-1 rounded-full">
                  {name}
                  <button onClick={() => handleRemoveFilter(key as keyof FilterOptions, value as number)} className="hover:text-red-500">
                    <X size={11} />
                  </button>
                </span>
              );
            });
          })}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 ? courses.map(course => (
          <CourseCard key={course.id} course={course} onApply={handleApplyClick} />
        )) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No programs found.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {hasActiveFilters ? 'Try adjusting your filters' : 'Start browsing programs'}
            </p>
          </div>
        )}
      </div>

      {isLoadingMore && (
        <div className="text-center py-4">
          <svg className="animate-spin h-5 w-5 text-brand-500 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      )}

      {hasMore && !isLoadingMore && courses.length > 0 && <div ref={observerRef} className="h-10" />}

      {courses.length > 0 && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {courses.length} of {totalRecords} programs
          {totalPages > 1 && <span className="ml-2">(Page {currentPage} of {totalPages})</span>}
        </div>
      )}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onFilterApply={handleFilterApply}
        filterOptions={filtersData}
        appliedFilters={modalFilters}
        onFiltersChange={handleModalFiltersChange}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmApplication}
        course={selectedCourse}
        loading={isApplying}
      />

      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => { setIsAlertModalOpen(false); setSelectedCourse(null); }}
        type={alertType}
        message={alertMessage}
      />
    </div>
  );
}
