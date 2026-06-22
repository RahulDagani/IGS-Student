"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import {
  Settings,
  BookOpen,
  Video,
  Newspaper,
  CreditCard,
  HandCoins,
  GraduationCap,
  Languages,
  X,
  Calendar,
  ExternalLink,
  Search,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "igs-services" | "training-resources" | "university-webinars" | "university-news";

interface FilterOption { id?: number | string; country_id?: number | string; name?: string; university?: string; country_name?: string; intake?: string; intake_year?: number; intake_id?: number; intake_name?: string; }
interface CourseOption { id: number; course_name: string; }
interface IntakeOption { id: number; intake_id: number; intake_year: number; intake_name: string; }

// ─── Static Data ──────────────────────────────────────────────────────────────

interface ResourceItem {
  id: number;
  title: string;
  description: string | null;
  resource_type: "video" | "news" | "guide" | "link";
  audience_type: string;
  url: string;
  thumbnail: string | null;
  thumbnail_url: string | null;
  created_at: string;
}

interface WebinarItem {
  id: number;
  title: string;
  description: string | null;
  scheduled_at: string;
  duration_minutes: number;
  platform: string;
  recording_url: string;
  status: string;
  university_name: string | null;
  university_logo_url: string | null;
}

const universityWebinars = [
  {
    id: 1,
    title: "University of Toronto – Info Session 2025",
    university: "University of Toronto",
    date: "2025-02-15",
    time: "10:00 AM EST",
    status: "Upcoming",
    description: "Join representatives from U of T to learn about admission requirements, campus life, and scholarship opportunities.",
    registrationUrl: "#",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Utoronto_coa.svg/120px-Utoronto_coa.svg.png",
  },
  {
    id: 2,
    title: "Monash University Open Day Webinar",
    university: "Monash University",
    date: "2025-02-20",
    time: "02:00 PM AEST",
    status: "Upcoming",
    description: "Explore courses, meet faculty, and discover student support services at Monash University.",
    registrationUrl: "#",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Monash_University_logo.svg/120px-Monash_University_logo.svg.png",
  },
  {
    id: 3,
    title: "University of Birmingham – Postgraduate Programmes",
    university: "University of Birmingham",
    date: "2025-01-28",
    time: "11:00 AM GMT",
    status: "Recorded",
    description: "A recorded session covering postgraduate admission timelines, funding options, and course highlights.",
    registrationUrl: "#",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/University_of_Birmingham_shield.svg/120px-University_of_Birmingham_shield.svg.png",
  },
];

interface NewsItem {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  category_name: string | null;
  created_at: string;
}

// ─── Location autocomplete components (used in LoanModal) ─────────────────────

interface LocCountry { id: number; name: string; iso_code: string; flag?: string; }
interface LocState { id: number; name: string; state_code: string; }
interface LocCity { id: number; name: string; }

function LocCountryAC({ value, displayName, onChange, baseUrl, token, placeholder = "Search country..." }: {
  value: number | null; displayName: string; onChange: (c: LocCountry | null) => void; baseUrl: string; token: string | null; placeholder?: string;
}) {
  const [query, setQuery] = useState(""); const [options, setOptions] = useState<LocCountry[]>([]); const [busy, setBusy] = useState(false); const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null); const wrapRef = useRef<HTMLDivElement>(null);
  const fetchOptions = useCallback(async (q: string) => { if (!q.trim()) { setOptions([]); return; } setBusy(true); try { const r = await fetch(`${baseUrl}/location/countries?search=${encodeURIComponent(q)}&limit=10`, { headers: { Authorization: `Bearer ${token}` } }); const d = await r.json(); if (d.success) setOptions(d.data); } finally { setBusy(false); } }, [baseUrl, token]);
  useEffect(() => { if (timerRef.current) clearTimeout(timerRef.current); timerRef.current = setTimeout(() => fetchOptions(query), 280); return () => { if (timerRef.current) clearTimeout(timerRef.current); }; }, [query, fetchOptions]);
  useEffect(() => { const fn = (e: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) { setOpen(false); setQuery(""); } }; document.addEventListener("mousedown", fn); return () => document.removeEventListener("mousedown", fn); }, []);
  const label = value && displayName ? displayName : null;
  return (
    <div ref={wrapRef} className="relative">
      <div className="h-10 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 flex items-center gap-2 cursor-text focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/10" onClick={() => setOpen(true)}>
        {open ? <input autoFocus type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder={label ?? placeholder} className="flex-1 bg-transparent text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none" />
          : <span className={`flex-1 text-sm truncate ${label ? "text-gray-800 dark:text-white" : "text-gray-400"}`}>{label ?? placeholder}</span>}
        {value ? <button type="button" onClick={e => { e.stopPropagation(); onChange(null); setQuery(""); setOptions([]); setOpen(false); }} className="text-gray-400 hover:text-gray-600 flex-shrink-0"><X size={13} /></button>
          : <Search size={13} className="text-gray-400 flex-shrink-0 pointer-events-none" />}
      </div>
      {open && <div className="absolute z-[200] mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl">
        {busy ? <div className="px-3 py-2.5 text-sm text-gray-400">Searching...</div>
          : !query.trim() ? <div className="px-3 py-2.5 text-sm text-gray-400">Type to search countries...</div>
          : options.length === 0 ? <div className="px-3 py-2.5 text-sm text-gray-400">No results</div>
          : options.map(c => <button key={c.id} type="button" onClick={() => { onChange(c); setOpen(false); setQuery(""); setOptions([]); }} className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 ${c.id === value ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600" : "text-gray-800 dark:text-white"}`}>
            {c.flag && <span>{c.flag}</span>}<span>{c.name}</span><span className="ml-auto text-xs text-gray-400">{c.iso_code}</span>
          </button>)}
      </div>}
    </div>
  );
}

function LocStateAC({ countryId, value, displayName, onChange, baseUrl, token, disabled = false }: {
  countryId: number | null; value: number | null; displayName: string; onChange: (s: LocState | null) => void; baseUrl: string; token: string | null; disabled?: boolean;
}) {
  const [query, setQuery] = useState(""); const [options, setOptions] = useState<LocState[]>([]); const [busy, setBusy] = useState(false); const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null); const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setQuery(""); setOptions([]); setOpen(false); }, [countryId]);
  const fetchOptions = useCallback(async (q: string) => { if (!countryId || !q.trim()) { setOptions([]); return; } setBusy(true); try { const r = await fetch(`${baseUrl}/location/states?country_id=${countryId}&search=${encodeURIComponent(q)}&limit=10`, { headers: { Authorization: `Bearer ${token}` } }); const d = await r.json(); if (d.success) setOptions(d.data); } finally { setBusy(false); } }, [baseUrl, token, countryId]);
  useEffect(() => { if (timerRef.current) clearTimeout(timerRef.current); timerRef.current = setTimeout(() => fetchOptions(query), 280); return () => { if (timerRef.current) clearTimeout(timerRef.current); }; }, [query, fetchOptions]);
  useEffect(() => { const fn = (e: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) { setOpen(false); setQuery(""); } }; document.addEventListener("mousedown", fn); return () => document.removeEventListener("mousedown", fn); }, []);
  const label = value && displayName ? displayName : null;
  if (disabled) return <div className="h-10 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 flex items-center opacity-40 cursor-not-allowed"><span className="text-sm text-gray-400">Search state...</span></div>;
  return (
    <div ref={wrapRef} className="relative">
      <div className="h-10 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 flex items-center gap-2 cursor-text focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/10" onClick={() => setOpen(true)}>
        {open ? <input autoFocus type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder={label ?? "Search state..."} className="flex-1 bg-transparent text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none" />
          : <span className={`flex-1 text-sm truncate ${label ? "text-gray-800 dark:text-white" : "text-gray-400"}`}>{label ?? "Search state..."}</span>}
        {value ? <button type="button" onClick={e => { e.stopPropagation(); onChange(null); setQuery(""); setOptions([]); setOpen(false); }} className="text-gray-400 hover:text-gray-600 flex-shrink-0"><X size={13} /></button>
          : <Search size={13} className="text-gray-400 flex-shrink-0 pointer-events-none" />}
      </div>
      {open && <div className="absolute z-[200] mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl">
        {busy ? <div className="px-3 py-2.5 text-sm text-gray-400">Searching...</div>
          : !query.trim() ? <div className="px-3 py-2.5 text-sm text-gray-400">Type to search states...</div>
          : options.length === 0 ? <div className="px-3 py-2.5 text-sm text-gray-400">No results</div>
          : options.map(s => <button key={s.id} type="button" onClick={() => { onChange(s); setOpen(false); setQuery(""); setOptions([]); }} className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 ${s.id === value ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600" : "text-gray-800 dark:text-white"}`}>
            <span>{s.name}</span>{s.state_code && <span className="ml-auto text-xs text-gray-400">{s.state_code}</span>}
          </button>)}
      </div>}
    </div>
  );
}

function LocCityAC({ stateId, value, displayName, onChange, baseUrl, token, disabled = false }: {
  stateId: number | null; value: number | null; displayName: string; onChange: (c: LocCity | null) => void; baseUrl: string; token: string | null; disabled?: boolean;
}) {
  const [query, setQuery] = useState(""); const [options, setOptions] = useState<LocCity[]>([]); const [busy, setBusy] = useState(false); const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null); const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setQuery(""); setOptions([]); setOpen(false); }, [stateId]);
  const fetchOptions = useCallback(async (q: string) => { if (!stateId || !q.trim()) { setOptions([]); return; } setBusy(true); try { const r = await fetch(`${baseUrl}/location/cities?state_id=${stateId}&search=${encodeURIComponent(q)}&limit=10`, { headers: { Authorization: `Bearer ${token}` } }); const d = await r.json(); if (d.success) setOptions(d.data); } finally { setBusy(false); } }, [baseUrl, token, stateId]);
  useEffect(() => { if (timerRef.current) clearTimeout(timerRef.current); timerRef.current = setTimeout(() => fetchOptions(query), 280); return () => { if (timerRef.current) clearTimeout(timerRef.current); }; }, [query, fetchOptions]);
  useEffect(() => { const fn = (e: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) { setOpen(false); setQuery(""); } }; document.addEventListener("mousedown", fn); return () => document.removeEventListener("mousedown", fn); }, []);
  const label = value && displayName ? displayName : null;
  if (disabled) return <div className="h-10 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 flex items-center opacity-40 cursor-not-allowed"><span className="text-sm text-gray-400">Search city...</span></div>;
  return (
    <div ref={wrapRef} className="relative">
      <div className="h-10 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 flex items-center gap-2 cursor-text focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/10" onClick={() => setOpen(true)}>
        {open ? <input autoFocus type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder={label ?? "Search city..."} className="flex-1 bg-transparent text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none" />
          : <span className={`flex-1 text-sm truncate ${label ? "text-gray-800 dark:text-white" : "text-gray-400"}`}>{label ?? "Search city..."}</span>}
        {value ? <button type="button" onClick={e => { e.stopPropagation(); onChange(null); setQuery(""); setOptions([]); setOpen(false); }} className="text-gray-400 hover:text-gray-600 flex-shrink-0"><X size={13} /></button>
          : <Search size={13} className="text-gray-400 flex-shrink-0 pointer-events-none" />}
      </div>
      {open && <div className="absolute z-[200] mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl">
        {busy ? <div className="px-3 py-2.5 text-sm text-gray-400">Searching...</div>
          : !query.trim() ? <div className="px-3 py-2.5 text-sm text-gray-400">Type to search cities...</div>
          : options.length === 0 ? <div className="px-3 py-2.5 text-sm text-gray-400">No results</div>
          : options.map(c => <button key={c.id} type="button" onClick={() => { onChange(c); setOpen(false); setQuery(""); setOptions([]); }} className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 ${c.id === value ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600" : "text-gray-800 dark:text-white"}`}>{c.name}</button>)}
      </div>}
    </div>
  );
}

function UniversitySearch({ options, value, displayName, onSelect, disabled = false }: {
  options: FilterOption[]; value: string; displayName: string; onSelect: (id: string, name: string) => void; disabled?: boolean;
}) {
  const [query, setQuery] = useState(""); const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => { const fn = (e: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) { setOpen(false); setQuery(""); } }; document.addEventListener("mousedown", fn); return () => document.removeEventListener("mousedown", fn); }, []);
  const filtered = options.filter(o => (o.university || o.name || "").toLowerCase().includes(query.toLowerCase()));
  const label = value && displayName ? displayName : null;
  if (disabled) return <div className="h-10 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 flex items-center opacity-40 cursor-not-allowed"><span className="text-sm text-gray-400">Search university...</span></div>;
  return (
    <div ref={wrapRef} className="relative">
      <div className="h-10 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 flex items-center gap-2 cursor-text focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/10" onClick={() => setOpen(true)}>
        {open ? <input autoFocus type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder={label ?? "Search university..."} className="flex-1 bg-transparent text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none" />
          : <span className={`flex-1 text-sm truncate ${label ? "text-gray-800 dark:text-white" : "text-gray-400"}`}>{label ?? "Search university..."}</span>}
        {value ? <button type="button" onClick={e => { e.stopPropagation(); onSelect("", ""); setQuery(""); setOpen(false); }} className="text-gray-400 hover:text-gray-600 flex-shrink-0"><X size={13} /></button>
          : <Search size={13} className="text-gray-400 flex-shrink-0 pointer-events-none" />}
      </div>
      {open && <div className="absolute z-[200] mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl">
        {filtered.length === 0 ? <div className="px-3 py-2.5 text-sm text-gray-400">{options.length === 0 ? "No universities available" : "No match found"}</div>
          : filtered.map(u => <button key={u.id} type="button" onClick={() => { onSelect(String(u.id), u.university ?? u.name ?? ""); setOpen(false); setQuery(""); }} className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 ${String(u.id) === value ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600" : "text-gray-800 dark:text-white"}`}>{u.university ?? u.name}</button>)}
      </div>}
    </div>
  );
}

// ─── Loan Modal ───────────────────────────────────────────────────────────────

const STUDY_LEVELS = ["Grade 9","Grade 10","Grade 11","Grade 12","Diploma","Undergraduate","Postgraduate","Doctorate","Other"];
const GRADING_SYSTEMS = ["Percentage","CGPA","GPA","Grade","Marks"];
const LANGUAGES = ["English","Hindi","Spanish","French","German","Chinese","Arabic","Other"];

interface AddrState { address: string; country_id: number | null; country_name: string; state_id: number | null; state_name: string; city_id: number | null; city_name: string; postal_code: string; }
interface AcadState { institution_name: string; level_of_study: string; qualification_awarded: string; grading_system: string; score: string; country_id: number | null; country_name: string; state_id: number | null; state_name: string; city_id: number | null; city_name: string; primary_language: string; start_date: string; end_date: string; }

function LoanModal({ isOpen, onClose, onSubmitted }: { isOpen: boolean; onClose: () => void; onSubmitted?: () => void }) {
  const { token } = useAuth();
  const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;
  const LOC_BASE = `${BASE_URL}/student`;

  // Profile (read-only)
  const [profile, setProfile] = useState({ fullName: "", email: "", phone: "" });

  // Address (pre-filled, editable)
  const [addr, setAddr] = useState<AddrState>({ address: "", country_id: null, country_name: "", state_id: null, state_name: "", city_id: null, city_name: "", postal_code: "" });

  // Academic qualification (pre-filled, editable)
  const emptyAcad: AcadState = { institution_name: "", level_of_study: "", qualification_awarded: "", grading_system: "", score: "", country_id: null, country_name: "", state_id: null, state_name: "", city_id: null, city_name: "", primary_language: "", start_date: "", end_date: "" };
  const [acad, setAcad] = useState<AcadState>(emptyAcad);
  const [hasAcadRecord, setHasAcadRecord] = useState(false);

  // Course selection
  const [allUniversities, setAllUniversities] = useState<FilterOption[]>([]);
  const [selUniversityName, setSelUniversityName] = useState("");
  const [studyLevels, setStudyLevels] = useState<FilterOption[]>([]);
  const [disciplines, setDisciplines] = useState<FilterOption[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [intakes, setIntakes] = useState<IntakeOption[]>([]);
  const [selUniversity, setSelUniversity] = useState("");
  const [selStudyLevel, setSelStudyLevel] = useState("");
  const [selDiscipline, setSelDiscipline] = useState("");
  const [selCourse, setSelCourse] = useState("");
  const [selIntake, setSelIntake] = useState("");

  const [loadingInit, setLoadingInit] = useState(true);
  const [loadingStudyLevels, setLoadingStudyLevels] = useState(false);
  const [loadingDisciplines, setLoadingDisciplines] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingIntakes, setLoadingIntakes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const headers = { Authorization: `Bearer ${token}` };
  const fetchFilters = (params: Record<string, string>) =>
    fetch(`${BASE_URL}/student/course/filters/dynamic?${new URLSearchParams(params)}`, { headers }).then(r => r.json());

  // Load everything on modal open
  useEffect(() => {
    if (!isOpen || !token) return;
    setLoadingInit(true);
    Promise.all([
      fetch(`${BASE_URL}/student`, { headers }).then(r => r.json()),
      fetch(`${BASE_URL}/student/student/academic/records`, { headers }).then(r => r.json()),
      fetchFilters({}),
    ]).then(([pRes, aRes, fRes]) => {
      if (pRes.success && pRes.data) {
        const p = pRes.data;
        setProfile({ fullName: [p.first_name, p.last_name].filter(Boolean).join(" "), email: p.email || "", phone: p.phone || "" });
        setAddr({ address: p.address || "", country_id: p.country_id || null, country_name: p.country_name || "", state_id: p.state_id || null, state_name: p.state_name || "", city_id: p.city_id || null, city_name: p.city_name || "", postal_code: p.postal_code || "" });
      }
      if (aRes.success && aRes.data?.length > 0) {
        const r = aRes.data[0];
        setAcad({ institution_name: r.institution_name || "", level_of_study: r.level_of_study || "", qualification_awarded: r.qualification_awarded || "", grading_system: r.grading_system || "", score: String(r.score || ""), country_id: r.country_id || null, country_name: r.country_name || "", state_id: r.state_id || null, state_name: r.state_name || "", city_id: r.city_id || null, city_name: r.city_name || "", primary_language: r.primary_language_of_instruction || "", start_date: r.start_date ? r.start_date.split("T")[0] : "", end_date: r.end_date ? r.end_date.split("T")[0] : "" });
        setHasAcadRecord(true);
      }
      if (fRes.success) setAllUniversities(fRes.data.filters.universities || []);
    }).catch(console.error).finally(() => setLoadingInit(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, token]);

  // University → study levels
  useEffect(() => {
    if (!selUniversity) { setStudyLevels([]); setDisciplines([]); setCourses([]); setIntakes([]); return; }
    setLoadingStudyLevels(true);
    fetchFilters({ university_id: selUniversity }).then(d => {
      if (d.success) setStudyLevels(d.data.filters.studyLevels || []);
    }).catch(console.error).finally(() => setLoadingStudyLevels(false));
    setSelStudyLevel(""); setSelDiscipline(""); setSelCourse(""); setSelIntake("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selUniversity]);

  // Study level → disciplines
  useEffect(() => {
    if (!selStudyLevel) { setDisciplines([]); setCourses([]); setIntakes([]); return; }
    setLoadingDisciplines(true);
    fetchFilters({ university_id: selUniversity, study_level_id: selStudyLevel }).then(d => {
      if (d.success) setDisciplines(d.data.filters.disciplines || []);
    }).catch(console.error).finally(() => setLoadingDisciplines(false));
    setSelDiscipline(""); setSelCourse(""); setSelIntake("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selStudyLevel]);

  // Discipline → courses
  useEffect(() => {
    if (!selDiscipline) { setCourses([]); setIntakes([]); return; }
    setLoadingCourses(true);
    fetch(`${BASE_URL}/student/courses?university_id=${selUniversity}&study_level_id=${selStudyLevel}&discipline_id=${selDiscipline}&limit=200`, { headers })
      .then(r => r.json()).then(d => { if (d.success) setCourses(d.data || []); })
      .catch(console.error).finally(() => setLoadingCourses(false));
    setSelCourse(""); setSelIntake("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selDiscipline]);

  // Course → intakes
  useEffect(() => {
    if (!selCourse) { setIntakes([]); return; }
    setLoadingIntakes(true);
    fetch(`${BASE_URL}/student/course/intake/${selCourse}`, { headers })
      .then(r => r.json()).then(d => { if (d.success) setIntakes(d.data || []); })
      .catch(console.error).finally(() => setLoadingIntakes(false));
    setSelIntake("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selCourse]);

  const handleClose = () => {
    if (submitting) return;
    setSubmitted(false); setError(null);
    setSelUniversity(""); setSelUniversityName(""); setSelStudyLevel(""); setSelDiscipline(""); setSelCourse(""); setSelIntake("");
    setAddr({ address: "", country_id: null, country_name: "", state_id: null, state_name: "", city_id: null, city_name: "", postal_code: "" });
    setAcad(emptyAcad); setHasAcadRecord(false);
    onClose();
  };

  useEffect(() => { document.body.style.overflow = isOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [isOpen]);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    if (isOpen) document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selCourse) { setError("Please select a course."); return; }
    setError(null); setSubmitting(true);
    try {
      const intake = intakes.find(i => String(i.id) === selIntake);
      const res = await fetch(`${BASE_URL}/student/loan/enquiry`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          // address
          address: addr.address || null,
          address_country_id: addr.country_id || null,
          address_state_id: addr.state_id || null,
          address_city_id: addr.city_id || null,
          postal_code: addr.postal_code || null,
          // academic
          institution_name: acad.institution_name || null,
          level_of_study: acad.level_of_study || null,
          qualification_awarded: acad.qualification_awarded || null,
          grading_system: acad.grading_system || null,
          score: acad.score || null,
          acad_country_id: acad.country_id || null,
          acad_state_id: acad.state_id || null,
          acad_city_id: acad.city_id || null,
          primary_language: acad.primary_language || null,
          acad_start_date: acad.start_date || null,
          acad_end_date: acad.end_date || null,
          // course
          university_id: selUniversity || null,
          study_level_id: selStudyLevel || null,
          discipline_id: selDiscipline || null,
          course_id: selCourse,
          intake_id: intake?.intake_id || null,
          intake_year: intake?.intake_year || null,
          intake_name: intake?.intake_name || null,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const iCls = "w-full h-10 rounded-lg border border-gray-300 px-3 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 disabled:opacity-50";
  const lCls = "block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5";
  const sCls = "text-sm font-semibold text-gray-800 dark:text-white pb-2 mb-3 border-b border-gray-200 dark:border-gray-700";
  const roCls = `${iCls} bg-gray-50 dark:bg-gray-800/60 cursor-default`;

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-2xl my-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Education Loan Enquiry</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">We&apos;ll connect you with the right lender based on your profile.</p>
          </div>
          <button onClick={handleClose} className="ml-4 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-14 px-6">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Enquiry Submitted!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Our loan advisor will contact you within 2 business days.</p>
            <button onClick={handleClose} className="px-6 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600">Done</button>
          </div>
        ) : loadingInit ? (
          <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="px-6 py-5 space-y-6 overflow-y-auto max-h-[70vh]">

              {/* ── Personal Info ── */}
              <div>
                <p className={sCls}>Personal Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className={lCls}>Full Name</label><input type="text" value={profile.fullName} readOnly className={roCls} /></div>
                  <div><label className={lCls}>Email</label><input type="email" value={profile.email} readOnly className={roCls} /></div>
                  <div className="sm:col-span-2"><label className={lCls}>Phone</label><input type="text" value={profile.phone} readOnly className={roCls} /></div>
                </div>
              </div>

              {/* ── Current Address ── */}
              <div>
                <p className={sCls}>Current Address</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={lCls}>Address *</label>
                    <input required type="text" value={addr.address} onChange={e => setAddr(p => ({ ...p, address: e.target.value }))} placeholder="Street address" className={iCls} />
                  </div>
                  <div>
                    <label className={lCls}>Country *</label>
                    <LocCountryAC value={addr.country_id} displayName={addr.country_name} baseUrl={LOC_BASE} token={token}
                      onChange={c => setAddr(p => ({ ...p, country_id: c?.id ?? null, country_name: c?.name ?? "", state_id: null, state_name: "", city_id: null, city_name: "" }))} />
                  </div>
                  <div>
                    <label className={lCls}>State / Province *</label>
                    <LocStateAC countryId={addr.country_id} value={addr.state_id} displayName={addr.state_name} baseUrl={LOC_BASE} token={token} disabled={!addr.country_id}
                      onChange={s => setAddr(p => ({ ...p, state_id: s?.id ?? null, state_name: s?.name ?? "", city_id: null, city_name: "" }))} />
                  </div>
                  <div>
                    <label className={lCls}>City *</label>
                    <LocCityAC stateId={addr.state_id} value={addr.city_id} displayName={addr.city_name} baseUrl={LOC_BASE} token={token} disabled={!addr.state_id}
                      onChange={c => setAddr(p => ({ ...p, city_id: c?.id ?? null, city_name: c?.name ?? "" }))} />
                  </div>
                  <div>
                    <label className={lCls}>Postal Code *</label>
                    <input required type="text" value={addr.postal_code} onChange={e => setAddr(p => ({ ...p, postal_code: e.target.value }))} placeholder="Postal / ZIP code" className={iCls} />
                  </div>
                </div>
              </div>

              {/* ── Academic Qualification ── */}
              <div>
                <p className={sCls}>
                  Academic Qualification{!hasAcadRecord && <span className="text-xs font-normal text-amber-500 ml-2">(not in profile — please fill)</span>}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={lCls}>Institution Name *</label>
                    <input required type="text" value={acad.institution_name} onChange={e => setAcad(p => ({ ...p, institution_name: e.target.value }))} placeholder="Enter institution name" className={iCls} />
                  </div>
                  <div>
                    <label className={lCls}>Level of Study *</label>
                    <select required value={acad.level_of_study} onChange={e => setAcad(p => ({ ...p, level_of_study: e.target.value }))} className={iCls}>
                      <option value="">Select Level</option>
                      {STUDY_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={lCls}>Qualification Awarded *</label>
                    <input required type="text" value={acad.qualification_awarded} onChange={e => setAcad(p => ({ ...p, qualification_awarded: e.target.value }))} placeholder="e.g., Bachelor of Science" className={iCls} />
                  </div>
                  <div>
                    <label className={lCls}>Grading System *</label>
                    <select required value={acad.grading_system} onChange={e => setAcad(p => ({ ...p, grading_system: e.target.value }))} className={iCls}>
                      <option value="">Select Grading System</option>
                      {GRADING_SYSTEMS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={lCls}>Score / GPA *</label>
                    <input required type="text" value={acad.score} onChange={e => setAcad(p => ({ ...p, score: e.target.value }))} placeholder="Enter score" className={iCls} />
                  </div>
                  <div>
                    <label className={lCls}>Country of Study *</label>
                    <LocCountryAC value={acad.country_id} displayName={acad.country_name} baseUrl={LOC_BASE} token={token}
                      onChange={c => setAcad(p => ({ ...p, country_id: c?.id ?? null, country_name: c?.name ?? "", state_id: null, state_name: "", city_id: null, city_name: "" }))} />
                  </div>
                  <div>
                    <label className={lCls}>State / Province *</label>
                    <LocStateAC countryId={acad.country_id} value={acad.state_id} displayName={acad.state_name} baseUrl={LOC_BASE} token={token} disabled={!acad.country_id}
                      onChange={s => setAcad(p => ({ ...p, state_id: s?.id ?? null, state_name: s?.name ?? "", city_id: null, city_name: "" }))} />
                  </div>
                  <div>
                    <label className={lCls}>City of Study *</label>
                    <LocCityAC stateId={acad.state_id} value={acad.city_id} displayName={acad.city_name} baseUrl={LOC_BASE} token={token} disabled={!acad.state_id}
                      onChange={c => setAcad(p => ({ ...p, city_id: c?.id ?? null, city_name: c?.name ?? "" }))} />
                  </div>
                  <div>
                    <label className={lCls}>Primary Language *</label>
                    <select required value={acad.primary_language} onChange={e => setAcad(p => ({ ...p, primary_language: e.target.value }))} className={iCls}>
                      <option value="">Select Language</option>
                      {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={lCls}>Start Date *</label>
                    <input required type="date" value={acad.start_date} onChange={e => setAcad(p => ({ ...p, start_date: e.target.value }))} className={iCls} />
                  </div>
                  <div>
                    <label className={lCls}>End Date *</label>
                    <input required type="date" value={acad.end_date} onChange={e => setAcad(p => ({ ...p, end_date: e.target.value }))} className={iCls} />
                  </div>
                </div>
              </div>

              {/* ── Course Applying For ── */}
              <div>
                <p className={sCls}>Course Applying For</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={lCls}>University *</label>
                    <UniversitySearch options={allUniversities} value={selUniversity} displayName={selUniversityName}
                      onSelect={(id, name) => { setSelUniversity(id); setSelUniversityName(name); }} />
                  </div>
                  <div>
                    <label className={lCls}>Study Level *</label>
                    <select required value={selStudyLevel} onChange={e => setSelStudyLevel(e.target.value)} className={iCls} disabled={!selUniversity || loadingStudyLevels}>
                      <option value="">{loadingStudyLevels ? "Loading..." : "Select study level"}</option>
                      {studyLevels.map(s => <option key={s.id} value={String(s.id)}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={lCls}>Discipline *</label>
                    <select required value={selDiscipline} onChange={e => setSelDiscipline(e.target.value)} className={iCls} disabled={!selStudyLevel || loadingDisciplines}>
                      <option value="">{loadingDisciplines ? "Loading..." : "Select discipline"}</option>
                      {disciplines.map(d => <option key={d.id} value={String(d.id)}>{d.name}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={lCls}>Course *</label>
                    <select required value={selCourse} onChange={e => setSelCourse(e.target.value)} className={iCls} disabled={!selDiscipline || loadingCourses}>
                      <option value="">{loadingCourses ? "Loading..." : "Select course"}</option>
                      {courses.map(c => <option key={c.id} value={String(c.id)}>{c.course_name}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={lCls}>Intake <span className="text-gray-400 font-normal">(future intakes only)</span></label>
                    <select value={selIntake} onChange={e => setSelIntake(e.target.value)} className={iCls} disabled={!selCourse || loadingIntakes}>
                      <option value="">{loadingIntakes ? "Loading..." : intakes.length === 0 && selCourse ? "No upcoming intakes" : "Select intake"}</option>
                      {intakes.map(i => <option key={i.id} value={String(i.id)}>{i.intake_name} {i.intake_year}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button type="button" onClick={handleClose} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">Cancel</button>
              <button type="submit" disabled={submitting} className="flex-1 px-4 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                {submitting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting...</> : "Submit Enquiry"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Tab: IGS Services ────────────────────────────────────────────────────────

const ENQUIRY_STATUS: Record<string, { label: string; cls: string }> = {
  pending:   { label: "Pending",   cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  in_review: { label: "In Review", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  processed: { label: "Processed", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  rejected:  { label: "Rejected",  cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

interface MyEnquiry {
  id: number;
  status: "pending" | "in_review" | "processed" | "rejected";
  admin_notes: string | null;
  university_name: string;
  study_level_name: string;
  course_name: string;
  intake_name: string;
  intake_year: number;
  created_at: string;
}

function LoanEnquiriesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { token } = useAuth();
  const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;
  const [enquiries, setEnquiries] = useState<MyEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !token) return;
    setLoading(true);
    fetch(`${BASE_URL}/student/loan/enquiries`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setEnquiries(d.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isOpen, token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg my-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <HandCoins className="w-5 h-5 text-green-600" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">My Loan Enquiries</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-3 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-7 h-7 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : enquiries.length === 0 ? (
            <div className="text-center py-10">
              <HandCoins className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No loan enquiries submitted yet.</p>
            </div>
          ) : enquiries.map(enq => {
            const st = ENQUIRY_STATUS[enq.status] ?? ENQUIRY_STATUS.pending;
            return (
              <div key={enq.id} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug">
                    {enq.course_name || "Course not specified"}
                  </p>
                  <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${st.cls}`}>
                    {st.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {[enq.university_name, enq.study_level_name].filter(Boolean).join(" · ")}
                  {enq.intake_name && enq.intake_year ? ` · ${enq.intake_name} ${enq.intake_year}` : ""}
                </p>
                {enq.admin_notes && (
                  <p className="text-xs text-gray-600 dark:text-gray-300 italic border-t border-gray-200 dark:border-gray-600 pt-1.5 mt-1">
                    {enq.admin_notes}
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  Submitted {new Date(enq.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function IgsServicesTab() {
  const [loanModalOpen, setLoanModalOpen] = useState(false);
  const [loanEnquiriesOpen, setLoanEnquiriesOpen] = useState(false);

  const services = [
    {
      id: "flywire",
      icon: <CreditCard className="w-6 h-6 text-blue-600" />,
      title: "Fee Payment via Flywire",
      description: "Pay your tuition and university fees securely and conveniently using Flywire's global payment platform.",
      action: (
        <a
          href="https://agents.demo.flywire.com/services/C4W3RQ/edu-payments?referrer=fe4bec9d-469f-c0bf-9ae2-c95bc4e0baf7"
          className="flywire-button inline-flex items-center px-4 py-2 border-2 border-blue-600 rounded-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="text-black dark:text-white mr-2 text-sm font-medium">Pay Fees via</span>
          <Image
            alt="Flywire"
            width={74}
            height={36}
            src="https://payment.flywire.com/assets/media/defaultLogo.964f0bfc5c799f25ebae43430aee0506.svg"
            className="flywire-logo"
          />
        </a>
      ),
    },
    {
      id: "loan",
      icon: <HandCoins className="w-6 h-6 text-green-600" />,
      title: "Education Loan",
      description: "Get connected with trusted education loan partners to fund your studies abroad. Quick processing and competitive interest rates.",
      action: (
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setLoanModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <HandCoins className="w-4 h-4" />
            Apply for Loan
          </button>
          <button
            onClick={() => setLoanEnquiriesOpen(true)}
            className="inline-flex items-center gap-1.5 text-sm text-green-700 dark:text-green-400 hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            My Enquiries
          </button>
        </div>
      ),
    },
    {
      id: "ece",
      icon: <GraduationCap className="w-6 h-6 text-purple-600" />,
      title: "ECE Evaluation",
      description: "Get your international credentials evaluated by Educational Credential Evaluators (ECE) for Canadian universities and immigration purposes.",
      action: (
        <a
          href="https://www.ece.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-purple-600 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Visit ECE Website
        </a>
      ),
    },
    {
      id: "duolingo",
      icon: <Languages className="w-6 h-6 text-green-500" />,
      title: "Duolingo English Test",
      description: "Take the Duolingo English Test — an affordable, convenient, and fast English proficiency test accepted by thousands of universities worldwide.",
      action: (
        <a
          href="https://englishtest.duolingo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-green-500 text-green-600 rounded-lg text-sm font-medium hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Take the Test
        </a>
      ),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-4 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                {service.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{service.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{service.description}</p>
              </div>
            </div>
            <div>{service.action}</div>
          </div>
        ))}
      </div>

      <LoanModal isOpen={loanModalOpen} onClose={() => setLoanModalOpen(false)} />
      <LoanEnquiriesModal isOpen={loanEnquiriesOpen} onClose={() => setLoanEnquiriesOpen(false)} />
    </>
  );
}

// ─── Tab: Training Resources ──────────────────────────────────────────────────

function toEmbedUrl(url: string): string {
  try {
    // Already an embed URL
    if (url.includes("youtube.com/embed/") || url.includes("player.vimeo.com")) return url;
    // youtu.be/ID
    const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (short) return `https://www.youtube.com/embed/${short[1]}`;
    // youtube.com/watch?v=ID
    const watch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
    // Vimeo: vimeo.com/ID
    const vimeo = url.match(/vimeo\.com\/(\d+)/);
    if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
    return url;
  } catch {
    return url;
  }
}

function TrainingResourcesTab() {
  const [videos, setVideos] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("https://api.applystore.org/api/front/resources?resource_type=video&limit=100")
      .then(r => r.json())
      .then(d => { if (d.success) setVideos(d.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200 dark:bg-gray-700" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <Video className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-sm text-gray-500 dark:text-gray-400">No training videos available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {videos.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-sm text-gray-400">No videos available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {videos.map((r) => (
            <div key={r.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <iframe
                  src={toEmbedUrl(r.url)}
                  title={r.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1 leading-snug">{r.title}</h3>
                {r.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{r.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab: University Webinars ─────────────────────────────────────────────────

function UniversityWebinarsTab() {
  const [webinars, setWebinars] = useState<WebinarItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.applystore.org/api/front/webinars?limit=12")
      .then((r) => r.json())
      .then((d) => { if (d.success) setWebinars(d.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const platformLabel: Record<string, string> = {
    zoom: "Zoom", google_meet: "Google Meet", teams: "Teams", other: "Other",
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 animate-pulse flex gap-4">
            <div className="w-14 h-14 rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
            <div className="flex-grow space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (webinars.length === 0) {
    return (
      <div className="text-center py-12">
        <Video className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-sm text-gray-500 dark:text-gray-400">No recorded webinars available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Watch recorded university webinar sessions.
      </p>
      <div className="flex flex-col gap-4">
        {webinars.map((w) => (
          <div key={w.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center overflow-hidden">
              {w.university_logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={w.university_logo_url} alt={w.university_name || ""} className="w-full h-full object-contain p-1" />
              ) : (
                <Video className="w-6 h-6 text-red-500" />
              )}
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{w.title}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  Recorded
                </span>
              </div>
              {w.university_name && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{w.university_name}</p>
              )}
              <div className="flex items-center gap-3 mb-2 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(w.scheduled_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </span>
                {w.duration_minutes && (
                  <span>{w.duration_minutes} min</span>
                )}
                <span className="capitalize">{platformLabel[w.platform] || w.platform}</span>
              </div>
              {w.description && (
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">
                  {w.description.replace(/<[^>]*>/g, "")}
                </p>
              )}
              <a
                href={w.recording_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                <Video className="w-3.5 h-3.5" />
                Watch Recording
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: University News ─────────────────────────────────────────────────────

function UniversityNewsTab() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.applystore.org/api/front/news?news_type=student&limit=6")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setNews(d.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden animate-pulse">
            <div className="h-40 bg-gray-200 dark:bg-gray-700" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500 dark:text-gray-400">No news available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {news.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm flex flex-col">
            {item.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image_url} alt={item.title} className="w-full h-40 object-cover" />
            ) : (
              <div className="w-full h-40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Newspaper className="w-8 h-8 text-gray-300 dark:text-gray-600" />
              </div>
            )}
            <div className="p-4 flex flex-col flex-grow">
              <div className="flex items-center gap-2 mb-2">
                {item.category_name && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    {item.category_name}
                  </span>
                )}
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </span>
              </div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-2 leading-snug">{item.title}</h3>
              {item.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-grow line-clamp-3">
                  {item.description.replace(/<[^>]*>/g, "")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "igs-services", label: "IGS Services", icon: <Settings className="w-4 h-4" /> },
  { id: "training-resources", label: "Training Resources", icon: <BookOpen className="w-4 h-4" /> },
  { id: "university-webinars", label: "University Webinars", icon: <Video className="w-4 h-4" /> },
  { id: "university-news", label: "University News", icon: <Newspaper className="w-4 h-4" /> },
];

export default function IgsServicesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("igs-services");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Information Hub</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Access all services and resources offered by IndoGlobal Studies.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-5 min-h-[600px]">
        {/* Vertical Tab Sidebar */}
        <div className="md:w-56 flex-shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-left transition-colors whitespace-nowrap md:whitespace-normal w-full ${
                  activeTab === tab.id
                    ? "bg-brand-500 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 p-5 md:p-6 min-h-full">
            {activeTab === "igs-services" && <IgsServicesTab />}
            {activeTab === "training-resources" && <TrainingResourcesTab />}
            {activeTab === "university-webinars" && <UniversityWebinarsTab />}
            {activeTab === "university-news" && <UniversityNewsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
