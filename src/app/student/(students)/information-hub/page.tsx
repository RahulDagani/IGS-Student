"use client";
import React, { useState, useEffect } from "react";
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

// ─── Loan Modal ───────────────────────────────────────────────────────────────

function LoanModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { token } = useAuth();
  const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;

  // Pre-filled profile
  const [profile, setProfile] = useState({ fullName: "", email: "", phone: "", country: "", address: "" });
  // Academic qualification (pre-filled or user-entered)
  const [academic, setAcademic] = useState({ levelOfStudy: "", institution: "", gradingSystem: "", score: "" });
  const [hasAcademicRecord, setHasAcademicRecord] = useState(false);

  // Cascading filter options
  const [countries, setCountries] = useState<FilterOption[]>([]);
  const [universities, setUniversities] = useState<FilterOption[]>([]);
  const [studyLevels, setStudyLevels] = useState<FilterOption[]>([]);
  const [disciplines, setDisciplines] = useState<FilterOption[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [intakes, setIntakes] = useState<IntakeOption[]>([]);

  // Selected IDs
  const [selCountry, setSelCountry] = useState("");
  const [selUniversity, setSelUniversity] = useState("");
  const [selStudyLevel, setSelStudyLevel] = useState("");
  const [selDiscipline, setSelDiscipline] = useState("");
  const [selCourse, setSelCourse] = useState("");
  const [selIntake, setSelIntake] = useState("");

  const [loadingInit, setLoadingInit] = useState(true);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
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

  // Load profile + academic + initial countries on open
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
        setProfile({
          fullName: [p.first_name, p.last_name].filter(Boolean).join(" "),
          email: p.email || "",
          phone: p.phone || "",
          country: p.country_name || "",
          address: p.address || "",
        });
      }
      if (aRes.success && aRes.data?.length > 0) {
        const r = aRes.data[0];
        setAcademic({ levelOfStudy: r.level_of_study || "", institution: r.institution_name || "", gradingSystem: r.grading_system || "", score: String(r.score || "") });
        setHasAcademicRecord(true);
      }
      if (fRes.success) setCountries(fRes.data.filters.locations.countries || []);
    }).catch(console.error).finally(() => setLoadingInit(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, token]);

  // Country → universities
  useEffect(() => {
    if (!selCountry) { setUniversities([]); setStudyLevels([]); setDisciplines([]); setCourses([]); setIntakes([]); return; }
    setLoadingUniversities(true);
    fetchFilters({ country_id: selCountry }).then(d => {
      if (d.success) setUniversities(d.data.filters.universities || []);
    }).catch(console.error).finally(() => setLoadingUniversities(false));
    setSelUniversity(""); setSelStudyLevel(""); setSelDiscipline(""); setSelCourse(""); setSelIntake("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selCountry]);

  // University → study levels
  useEffect(() => {
    if (!selUniversity) { setStudyLevels([]); setDisciplines([]); setCourses([]); setIntakes([]); return; }
    setLoadingStudyLevels(true);
    fetchFilters({ country_id: selCountry, university_id: selUniversity }).then(d => {
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
    fetch(`${BASE_URL}/student/courses?university_id=${selUniversity}&study_level_id=${selStudyLevel}&discipline_id=${selDiscipline}&limit=100`, { headers })
      .then(r => r.json())
      .then(d => { if (d.success) setCourses(d.data || []); })
      .catch(console.error).finally(() => setLoadingCourses(false));
    setSelCourse(""); setSelIntake("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selDiscipline]);

  // Course → intakes (future only via API)
  useEffect(() => {
    if (!selCourse) { setIntakes([]); return; }
    setLoadingIntakes(true);
    fetch(`${BASE_URL}/student/course/intake/${selCourse}`, { headers })
      .then(r => r.json())
      .then(d => { if (d.success) setIntakes(d.data || []); })
      .catch(console.error).finally(() => setLoadingIntakes(false));
    setSelIntake("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selCourse]);

  const handleClose = () => {
    if (submitting) return;
    setSubmitted(false); setError(null);
    setSelCountry(""); setSelUniversity(""); setSelStudyLevel(""); setSelDiscipline(""); setSelCourse(""); setSelIntake("");
    onClose();
  };

  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selCourse) { setError("Please select a course."); return; }
    setError(null); setSubmitting(true);
    try {
      const selectedIntakeObj = intakes.find(i => String(i.id) === selIntake);
      const res = await fetch(`${BASE_URL}/student/loan/enquiry`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          country_id: selCountry || null,
          university_id: selUniversity || null,
          study_level_id: selStudyLevel || null,
          discipline_id: selDiscipline || null,
          course_id: selCourse,
          intake_id: selectedIntakeObj?.intake_id || null,
          intake_year: selectedIntakeObj?.intake_year || null,
          intake_name: selectedIntakeObj?.intake_name || null,
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

  const inputCls = "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 disabled:opacity-50";
  const labelCls = "block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1";
  const sectionCls = "text-sm font-semibold text-gray-800 dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2";

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
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Enquiry Submitted!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Our loan advisor will contact you within 2 business days.</p>
            <button onClick={handleClose} className="px-6 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600">Done</button>
          </div>
        ) : loadingInit ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="px-6 py-5 space-y-6 overflow-y-auto max-h-[65vh]">

              {/* ── Profile ── */}
              <div>
                <p className={sectionCls}>Personal Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Full Name</label>
                    <input type="text" value={profile.fullName} readOnly className={`${inputCls} bg-gray-50 dark:bg-gray-800/50`} />
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input type="email" value={profile.email} readOnly className={`${inputCls} bg-gray-50 dark:bg-gray-800/50`} />
                  </div>
                  <div>
                    <label className={labelCls}>Phone</label>
                    <input type="text" value={profile.phone} readOnly className={`${inputCls} bg-gray-50 dark:bg-gray-800/50`} />
                  </div>
                  <div>
                    <label className={labelCls}>Country of Residence</label>
                    <input type="text" value={profile.country} readOnly className={`${inputCls} bg-gray-50 dark:bg-gray-800/50`} />
                  </div>
                  {profile.address && (
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Current Address</label>
                      <input type="text" value={profile.address} readOnly className={`${inputCls} bg-gray-50 dark:bg-gray-800/50`} />
                    </div>
                  )}
                </div>
              </div>

              {/* ── Academic Qualification ── */}
              <div>
                <p className={sectionCls}>
                  Academic Qualification
                  {!hasAcademicRecord && <span className="text-xs font-normal text-amber-500">(not filled in profile — please enter)</span>}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Highest Level of Study</label>
                    <input type="text" value={academic.levelOfStudy}
                      readOnly={hasAcademicRecord}
                      onChange={e => setAcademic(p => ({ ...p, levelOfStudy: e.target.value }))}
                      placeholder="e.g. Undergraduate"
                      className={`${inputCls} ${hasAcademicRecord ? "bg-gray-50 dark:bg-gray-800/50" : ""}`} />
                  </div>
                  <div>
                    <label className={labelCls}>Institution Name</label>
                    <input type="text" value={academic.institution}
                      readOnly={hasAcademicRecord}
                      onChange={e => setAcademic(p => ({ ...p, institution: e.target.value }))}
                      placeholder="e.g. Delhi University"
                      className={`${inputCls} ${hasAcademicRecord ? "bg-gray-50 dark:bg-gray-800/50" : ""}`} />
                  </div>
                  <div>
                    <label className={labelCls}>Grading System</label>
                    <input type="text" value={academic.gradingSystem}
                      readOnly={hasAcademicRecord}
                      onChange={e => setAcademic(p => ({ ...p, gradingSystem: e.target.value }))}
                      placeholder="e.g. Percentage / CGPA"
                      className={`${inputCls} ${hasAcademicRecord ? "bg-gray-50 dark:bg-gray-800/50" : ""}`} />
                  </div>
                  <div>
                    <label className={labelCls}>Score / GPA</label>
                    <input type="text" value={academic.score}
                      readOnly={hasAcademicRecord}
                      onChange={e => setAcademic(p => ({ ...p, score: e.target.value }))}
                      placeholder="e.g. 8.5 or 75%"
                      className={`${inputCls} ${hasAcademicRecord ? "bg-gray-50 dark:bg-gray-800/50" : ""}`} />
                  </div>
                </div>
              </div>

              {/* ── Course Selection ── */}
              <div>
                <p className={sectionCls}>Course Applying For</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Country */}
                  <div>
                    <label className={labelCls}>Country *</label>
                    <select required value={selCountry} onChange={e => setSelCountry(e.target.value)} className={inputCls}>
                      <option value="">Select country</option>
                      {countries.map(c => <option key={c.country_id ?? c.id} value={String(c.country_id ?? c.id)}>{c.country_name ?? c.name}</option>)}
                    </select>
                  </div>

                  {/* University */}
                  <div>
                    <label className={labelCls}>University *</label>
                    <select required value={selUniversity} onChange={e => setSelUniversity(e.target.value)} className={inputCls} disabled={!selCountry || loadingUniversities}>
                      <option value="">{loadingUniversities ? "Loading..." : "Select university"}</option>
                      {universities.map(u => <option key={u.id} value={String(u.id)}>{u.university ?? u.name}</option>)}
                    </select>
                  </div>

                  {/* Study Level */}
                  <div>
                    <label className={labelCls}>Study Level *</label>
                    <select required value={selStudyLevel} onChange={e => setSelStudyLevel(e.target.value)} className={inputCls} disabled={!selUniversity || loadingStudyLevels}>
                      <option value="">{loadingStudyLevels ? "Loading..." : "Select study level"}</option>
                      {studyLevels.map(s => <option key={s.id} value={String(s.id)}>{s.name}</option>)}
                    </select>
                  </div>

                  {/* Discipline */}
                  <div>
                    <label className={labelCls}>Discipline *</label>
                    <select required value={selDiscipline} onChange={e => setSelDiscipline(e.target.value)} className={inputCls} disabled={!selStudyLevel || loadingDisciplines}>
                      <option value="">{loadingDisciplines ? "Loading..." : "Select discipline"}</option>
                      {disciplines.map(d => <option key={d.id} value={String(d.id)}>{d.name}</option>)}
                    </select>
                  </div>

                  {/* Course */}
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Course *</label>
                    <select required value={selCourse} onChange={e => setSelCourse(e.target.value)} className={inputCls} disabled={!selDiscipline || loadingCourses}>
                      <option value="">{loadingCourses ? "Loading..." : "Select course"}</option>
                      {courses.map(c => <option key={c.id} value={String(c.id)}>{c.course_name}</option>)}
                    </select>
                  </div>

                  {/* Intake */}
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Intake (Future intakes only)</label>
                    <select value={selIntake} onChange={e => setSelIntake(e.target.value)} className={inputCls} disabled={!selCourse || loadingIntakes}>
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
              <button type="button" onClick={handleClose} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
                Cancel
              </button>
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

function IgsServicesTab() {
  const [loanModalOpen, setLoanModalOpen] = useState(false);

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
        <button
          onClick={() => setLoanModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <HandCoins className="w-4 h-4" />
          Apply for Loan
        </button>
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
