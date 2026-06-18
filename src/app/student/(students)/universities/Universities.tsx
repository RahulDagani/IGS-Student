"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Building2, MapPin, BookOpen, ChevronDown, ChevronUp, X, Search, Globe, ExternalLink, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const WIZARD_BASE = "https://api.applystore.org/api";
const PAGE_SIZE = 10;
const UNI_STATE_KEY = 'igs_student_universities_state';

function loadUniState(): Filters | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = sessionStorage.getItem(UNI_STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveUniState(filters: Filters) {
  try { sessionStorage.setItem(UNI_STATE_KEY, JSON.stringify(filters)); } catch {}
}

// ─── Interfaces ─────────────────────────────────────────────────────────────

interface WizardCountry { country_id: number; country_name: string; iso_code: string; }
interface WizardStudyLevel { id: number; name: string; slug: string; }
interface WizardDiscipline { id: number; name: string; slug: string; }

interface University {
  id: number;
  university: string;
  university_slug: string;
  description: string | null;
  address: string | null;
  website_url: string | null;
  logo_url: string | null;
  country_name: string;
  country_code: string;
  matching_courses: number;
  courses: { id: number; course_name: string; discipline_name: string; study_level_name: string; }[];
}

interface UniversitySearchResult {
  id: number;
  university: string;
  university_slug: string;
  country_name: string;
  country_code: string;
  logo_url: string | null;
  total_courses: number;
}

interface Filters {
  countries: number[];
  studyLevels: number[];
  disciplines: number[];   // IDs — so we can pass to courses page
}

const emptyFilters = (): Filters => ({ countries: [], studyLevels: [], disciplines: [] });

// ─── Filter Section ───────────────────────────────────────────────────────────

const SidebarSection = ({ title, count, expanded, onToggle, children }: {
  title: string; count?: number; expanded: boolean;
  onToggle: () => void; children: React.ReactNode;
}) => (
  <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
    <button type="button" onClick={onToggle}
      className="flex items-center justify-between w-full py-2 text-left">
      <span className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-white">
        {title}
        {count ? <span className="bg-brand-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">{count}</span> : null}
      </span>
      {expanded ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
    </button>
    {expanded && <div className="mt-2">{children}</div>}
  </div>
);

// ─── University Card ──────────────────────────────────────────────────────────

const UniversityCard: React.FC<{
  university: University;
  onViewPrograms: (universityId: number) => void;
}> = ({ university, onViewPrograms }) => {
  const initials = university.university.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            {university.logo_url ? (
              <Image src={university.logo_url} alt={university.university}
                width={64} height={64}
                className="rounded-xl object-contain border border-gray-100 dark:border-gray-700 bg-white p-1" />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-base">
                {initials}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-tight">
                  {university.university}
                </h3>
                <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{university.address ? `${university.address}, ` : ''}{university.country_name}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onViewPrograms(university.id)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 dark:hover:bg-brand-900/40 text-brand-600 dark:text-brand-400 transition-colors whitespace-nowrap">
                  View Courses
                </button>
                {university.website_url && (
                  <a href={university.website_url} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                    title="Visit website">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full font-medium">
                <BookOpen className="w-3 h-3" />
                {university.matching_courses} {university.matching_courses === 1 ? 'program' : 'programs'}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full font-medium">
                <Globe className="w-3 h-3" />
                {university.country_name}
              </span>
            </div>

            {university.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2.5 line-clamp-2 leading-relaxed">
                {university.description.replace(/<[^>]*>/g, '')}
              </p>
            )}

            {university.courses && university.courses.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {[...new Set(university.courses.map(c => c.discipline_name))].slice(0, 4).map(d => (
                  <span key={d}
                    className="text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-800 px-2 py-0.5 rounded-full">
                    {d}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Universities() {
  const router = useRouter();

  const [countries, setCountries] = useState<WizardCountry[]>([]);
  const [studyLevels, setStudyLevels] = useState<WizardStudyLevel[]>([]);
  const [disciplines, setDisciplines] = useState<WizardDiscipline[]>([]);

  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filtersLoading, setFiltersLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [filters, setFilters] = useState<Filters>(() => loadUniState() ?? emptyFilters());

  const [selectedUniversityId, setSelectedUniversityId] = useState<number | null>(null);
  const [uniSearch, setUniSearch] = useState('');
  const [uniSearchResults, setUniSearchResults] = useState<UniversitySearchResult[]>([]);
  const [uniSearchLoading, setUniSearchLoading] = useState(false);
  const [uniSearchFocused, setUniSearchFocused] = useState(false);
  const uniSearchRef = useRef<HTMLDivElement>(null);
  const uniSearchTimeout = useRef<NodeJS.Timeout | null>(null);

  const [countrySearch, setCountrySearch] = useState('');
  const [disciplineSearch, setDisciplineSearch] = useState('');

  const [expanded, setExpanded] = useState({ destination: true, studyLevel: true, discipline: true });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggle = (key: keyof typeof expanded) =>
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  // ── Build API query string ────────────────────────────────────────────────

  const buildParams = useCallback((f: Filters, page: number) => {
    const p = new URLSearchParams();
    if (f.countries.length)    p.set('country_id',    String(f.countries[0]));
    if (f.studyLevels.length)  p.set('study_level_id', String(f.studyLevels[0]));
    f.disciplines.forEach(id => p.append('discipline_id[]', String(id)));
    p.set('page',  String(page));
    p.set('limit', String(PAGE_SIZE));
    return p.toString();
  }, []);

  // ── Fetch universities ────────────────────────────────────────────────────

  const fetchUniversities = useCallback(async (f: Filters, page: number, append = false) => {
    if (!f.countries.length) {
      setUniversities([]);
      setTotal(0);
      setTotalPages(1);
      setHasNextPage(false);
      return;
    }
    append ? setLoadingMore(true) : setLoading(true);
    try {
      const res = await fetch(`${WIZARD_BASE}/wizard/universities?${buildParams(f, page)}`);
      const data = await res.json();
      if (data.success) {
        setUniversities(prev => append ? [...prev, ...data.data] : data.data);
        setCurrentPage(data.page ?? page);
        setTotalPages(data.totalPages ?? 1);
        setTotal(data.total ?? 0);
        setHasNextPage(data.hasNextPage ?? false);
      } else {
        if (!append) setUniversities([]);
      }
    } catch {
      if (!append) setUniversities([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [buildParams]);

  // ── Load filter data ──────────────────────────────────────────────────────

  useEffect(() => {
    (async () => {
      setFiltersLoading(true);
      try {
        const res = await fetch(`${WIZARD_BASE}/wizard/countries`);
        const data = await res.json();
        if (data.success) setCountries(data.data);
      } catch { /* silent */ }
      finally { setFiltersLoading(false); }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const qs = filters.countries.length ? `?country_id=${filters.countries[0]}` : '';
        const res = await fetch(`${WIZARD_BASE}/wizard/study-levels${qs}`);
        const data = await res.json();
        if (data.success) setStudyLevels(data.data);
      } catch { /* silent */ }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.countries]);

  useEffect(() => {
    if (!filters.countries.length || !filters.studyLevels.length) {
      setDisciplines([]);
      return;
    }
    (async () => {
      try {
        const qs = `?country_id=${filters.countries[0]}&study_level_id=${filters.studyLevels[0]}`;
        const res = await fetch(`${WIZARD_BASE}/wizard/disciplines${qs}`);
        const data = await res.json();
        if (data.success) setDisciplines(data.data);
      } catch { /* silent */ }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.countries, filters.studyLevels]);

  // Persist filters to sessionStorage so back-navigation restores them
  useEffect(() => {
    saveUniState(filters);
  }, [filters]);

  // Fetch when filters change (reset to page 1)
  useEffect(() => {
    setCurrentPage(1);
    fetchUniversities(filters, 1, false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // ── University autocomplete ───────────────────────────────────────────────

  useEffect(() => {
    if (uniSearchTimeout.current) clearTimeout(uniSearchTimeout.current);
    if (!uniSearch.trim() || uniSearch.length < 2) { setUniSearchResults([]); return; }
    uniSearchTimeout.current = setTimeout(async () => {
      setUniSearchLoading(true);
      try {
        const res = await fetch(`${WIZARD_BASE}/universities/search?q=${encodeURIComponent(uniSearch)}&limit=8`);
        const data = await res.json();
        if (data.success) setUniSearchResults(data.data ?? []);
      } catch { /* silent */ }
      finally { setUniSearchLoading(false); }
    }, 300);
  }, [uniSearch]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (uniSearchRef.current && !uniSearchRef.current.contains(e.target as Node))
        setUniSearchFocused(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ── Filter helpers ────────────────────────────────────────────────────────

  const toggleCountry = (id: number, checked: boolean) => {
    setSelectedUniversityId(null);
    setUniSearch('');
    setFilters(prev => ({
      countries: checked ? [id] : prev.countries.filter(c => c !== id),
      studyLevels: [],
      disciplines: [],
    }));
  };

  const toggleStudyLevel = (id: number, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      studyLevels: checked ? [id] : prev.studyLevels.filter(s => s !== id),
      disciplines: [],
    }));
  };

  const toggleDiscipline = (id: number, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      disciplines: checked ? [...prev.disciplines, id] : prev.disciplines.filter(d => d !== id),
    }));
  };

  const clearFilters = () => { setFilters(emptyFilters()); setUniSearch(''); setSelectedUniversityId(null); };

  // ── Navigate to courses with all active filters ───────────────────────────

  const handleViewPrograms = (universityId: number) => {
    const p = new URLSearchParams();
    p.set('university_id', String(universityId));
    if (filters.countries.length)   p.set('country_id',    String(filters.countries[0]));
    if (filters.studyLevels.length) p.set('study_level_id', String(filters.studyLevels[0]));
    filters.disciplines.forEach(id => p.append('discipline_id', String(id)));
    router.push(`/student/courses?${p.toString()}`);
  };

  const handleAutoCompleteSelect = (u: UniversitySearchResult) => {
    setUniSearchFocused(false);
    setUniSearch(u.university);
    setSelectedUniversityId(u.id);
    const matched = countries.find(c => c.iso_code === u.country_code);
    if (matched) {
      setFilters({ countries: [matched.country_id], studyLevels: [], disciplines: [] });
    }
  };

  // ── Load more ─────────────────────────────────────────────────────────────

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchUniversities(filters, nextPage, true);
  };

  const hasFilters = filters.countries.length > 0 || filters.studyLevels.length > 0 || filters.disciplines.length > 0;
  const filterCount = filters.countries.length + filters.studyLevels.length + filters.disciplines.length;

  const filteredCountries = countrySearch
    ? countries.filter(c => c.country_name.toLowerCase().includes(countrySearch.toLowerCase()))
    : countries;

  const filteredDisciplines = disciplineSearch
    ? disciplines.filter(d => d.name.toLowerCase().includes(disciplineSearch.toLowerCase()))
    : disciplines;

  // ── Sidebar ───────────────────────────────────────────────────────────────

  const sidebar = (
    <div className="space-y-4">
      {/* University autocomplete */}
      <div>
        <p className="text-sm font-semibold text-gray-800 dark:text-white mb-2">Search University</p>
        <div className="relative" ref={uniSearchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input type="text" placeholder="Search by university name..."
              value={uniSearch} onChange={e => setUniSearch(e.target.value)}
              onFocus={() => setUniSearchFocused(true)}
              className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300" />
            {uniSearch && (
              <button onClick={() => { setUniSearch(''); setUniSearchResults([]); setSelectedUniversityId(null); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {uniSearchFocused && (uniSearchResults.length > 0 || uniSearchLoading) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
              {uniSearchLoading ? (
                <div className="p-3 text-sm text-gray-400 text-center">Searching...</div>
              ) : (
                <ul>
                  {uniSearchResults.map(u => (
                    <li key={u.id}>
                      <button type="button"
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                        onClick={() => handleAutoCompleteSelect(u)}>
                        <div className="shrink-0">
                          {u.logo_url ? (
                            <Image src={u.logo_url} alt={u.university} width={32} height={32}
                              className="rounded-lg object-contain border border-gray-100 dark:border-gray-700 bg-white p-0.5" />
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                              {u.university.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{u.university}</p>
                          <p className="text-xs text-gray-400">{u.country_name} · {u.total_courses} programs</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-4">
        {/* Study Destination */}
        <SidebarSection title="Study Destination" count={filters.countries.length || undefined}
          expanded={expanded.destination} onToggle={() => toggle('destination')}>
          <input type="text" placeholder="Search destination..."
            value={countrySearch} onChange={e => setCountrySearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 mb-2" />
          {filtersLoading ? (
            <div className="text-sm text-gray-400 py-2">Loading...</div>
          ) : (
            <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
              {filteredCountries.map(c => (
                <label key={c.country_id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <input type="checkbox"
                    checked={filters.countries.includes(c.country_id)}
                    onChange={e => toggleCountry(c.country_id, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{c.country_name}</span>
                </label>
              ))}
              {filteredCountries.length === 0 && (
                <p className="text-sm text-gray-400 py-2">No destinations found</p>
              )}
            </div>
          )}
        </SidebarSection>

        {/* Study Level */}
        <SidebarSection title="Study Level" count={filters.studyLevels.length || undefined}
          expanded={expanded.studyLevel} onToggle={() => toggle('studyLevel')}>
          {studyLevels.length === 0 ? (
            <p className="text-sm text-gray-400 py-1">
              {filters.countries.length ? 'No study levels available' : 'Select a destination or search a university first'}
            </p>
          ) : (
            <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
              {studyLevels.map(sl => (
                <label key={sl.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <input type="checkbox"
                    checked={filters.studyLevels.includes(sl.id)}
                    onChange={e => toggleStudyLevel(sl.id, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{sl.name}</span>
                </label>
              ))}
            </div>
          )}
        </SidebarSection>

        {/* Discipline */}
        <SidebarSection title="Discipline" count={filters.disciplines.length || undefined}
          expanded={expanded.discipline} onToggle={() => toggle('discipline')}>
          {!filters.countries.length || !filters.studyLevels.length ? (
            <p className="text-sm text-gray-400 py-1">
              {!filters.countries.length ? 'Select a destination first' : 'Select a study level first'}
            </p>
          ) : disciplines.length === 0 ? (
            <p className="text-sm text-gray-400 py-1">No disciplines available</p>
          ) : (
            <div>
              <input type="text" placeholder="Search disciplines..."
                value={disciplineSearch} onChange={e => setDisciplineSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 mb-2" />
              <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                {filteredDisciplines.map(d => (
                  <label key={d.id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                    <input type="checkbox"
                      checked={filters.disciplines.includes(d.id)}
                      onChange={e => toggleDiscipline(d.id, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{d.name}</span>
                  </label>
                ))}
                {filteredDisciplines.length === 0 && (
                  <p className="text-sm text-gray-400 py-2">No disciplines found</p>
                )}
              </div>
            </div>
          )}
        </SidebarSection>
      </div>

    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Browse Universities</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Discover universities that match your academic goals
          </p>
        </div>
        <button onClick={() => setSidebarOpen(prev => !prev)}
          className="flex lg:hidden items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Filter className="w-4 h-4" />
          Filters
          {hasFilters && (
            <span className="bg-brand-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {filterCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className={`
          ${sidebarOpen ? 'flex' : 'hidden'} lg:flex flex-col
          w-full lg:w-72 shrink-0
          lg:sticky lg:top-4 lg:self-start
          bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700
          max-h-[calc(100vh-6rem)]
        `}>
          {/* Mobile sidebar header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0 lg:hidden border-b border-gray-100 dark:border-gray-800">
            <span className="text-sm font-semibold text-gray-800 dark:text-white">Filters</span>
            <button onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable filter content */}
          <div className="flex-1 overflow-y-auto p-5">
            {sidebar}
          </div>

          {/* Sticky footer — always visible */}
          <div className="shrink-0 px-5 pb-5 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
            {hasFilters && (
              <button onClick={clearFilters}
                className="w-full py-2.5 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Clear All Filters
              </button>
            )}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden w-full py-3 text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-colors">
              Apply Filters &amp; View Results
              {hasFilters && <span className="ml-1.5 bg-white/20 text-white text-xs rounded-full px-1.5 py-0.5">{filterCount}</span>}
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Active filter chips */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              {filters.countries.map(id => {
                const c = countries.find(x => x.country_id === id);
                return c ? (
                  <span key={id} className="inline-flex items-center gap-1.5 text-xs font-medium bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 px-2.5 py-1 rounded-full">
                    {c.country_name}
                    <button onClick={() => toggleCountry(id, false)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                  </span>
                ) : null;
              })}
              {filters.studyLevels.map(id => {
                const sl = studyLevels.find(x => x.id === id);
                return sl ? (
                  <span key={id} className="inline-flex items-center gap-1.5 text-xs font-medium bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 px-2.5 py-1 rounded-full">
                    {sl.name}
                    <button onClick={() => toggleStudyLevel(id, false)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                  </span>
                ) : null;
              })}
              {filters.disciplines.map(id => {
                const d = disciplines.find(x => x.id === id);
                return d ? (
                  <span key={id} className="inline-flex items-center gap-1.5 text-xs font-medium bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 px-2.5 py-1 rounded-full">
                    {d.name}
                    <button onClick={() => toggleDiscipline(id, false)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                  </span>
                ) : null;
              })}
            </div>
          )}

          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <svg className="animate-spin h-8 w-8 text-brand-500 mx-auto" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading universities...</p>
              </div>
            </div>
          ) : !filters.countries.length ? (
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Select a study destination to explore universities
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {countries.slice(0, 12).map(c => (
                  <button key={c.country_id} onClick={() => toggleCountry(c.country_id, true)}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors text-left group">
                    <div className="w-9 h-9 bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/40 dark:to-brand-800/40 rounded-lg flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 truncate transition-colors">
                      {c.country_name}
                    </p>
                  </button>
                ))}
              </div>
              {countries.length > 12 && (
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-4 text-center">
                  + {countries.length - 12} more destinations — use the sidebar to search
                </p>
              )}
            </div>
          ) : universities.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">No universities found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Try adjusting your filters</p>
              <button onClick={clearFilters}
                className="mt-4 px-4 py-2 text-sm font-medium bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-colors">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedUniversityId
                  ? `Showing 1 university`
                  : `Showing ${universities.length} of ${total} ${total === 1 ? 'university' : 'universities'}`}
              </p>

              {(selectedUniversityId
                ? universities.filter(u => u.id === selectedUniversityId)
                : universities
              ).map(u => (
                <UniversityCard key={u.id} university={u} onViewPrograms={handleViewPrograms} />
              ))}

              {/* Load More */}
              {hasNextPage && (
                <div className="flex justify-center pt-2">
                  <button onClick={handleLoadMore} disabled={loadingMore}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
                    {loadingMore ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-brand-500" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Loading...
                      </>
                    ) : (
                      <>Load More <ChevronRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              )}

              {!hasNextPage && universities.length > 0 && (
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 pt-2">
                  All {total} {total === 1 ? 'university' : 'universities'} loaded
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
