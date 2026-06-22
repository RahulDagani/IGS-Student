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
  ChevronRight,
  Calendar,
  ExternalLink,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "igs-services" | "training-resources" | "university-webinars" | "university-news";

interface LoanFormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  studyLevel: string;
  discipline: string;
  university: string;
  course: string;
  intakeMonth: string;
  intakeYear: string;
  intakeCourse: string;
  gpa: string;
}

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
  const [form, setForm] = useState<LoanFormData>({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    studyLevel: "",
    discipline: "",
    university: "",
    course: "",
    intakeMonth: "",
    intakeYear: "",
    intakeCourse: "",
    gpa: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (field: keyof LoanFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setForm({
      fullName: "", email: "", phone: "", country: "", studyLevel: "",
      discipline: "", university: "", course: "", intakeMonth: "", intakeYear: "",
      intakeCourse: "", gpa: "",
    });
    onClose();
  };

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  if (!isOpen) return null;

  const inputCls =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500";
  const labelCls = "block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1";

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-2xl my-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col">

        {/* Header — always visible */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Education Loan Enquiry</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Fill in your details and we&apos;ll connect you with the right lender.</p>
          </div>
          <button
            onClick={handleClose}
            className="ml-4 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-12 px-6">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Request Submitted!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Our loan advisor will contact you within 2 business days.</p>
            <button onClick={handleClose} className="px-6 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* Scrollable body */}
            <div className="px-6 py-5 space-y-5 overflow-y-auto max-h-[60vh]">

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Full Name *</label>
                  <input required type="text" placeholder="John Doe" value={form.fullName} onChange={set("fullName")} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Email Address *</label>
                  <input required type="email" placeholder="john@example.com" value={form.email} onChange={set("email")} className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Phone Number *</label>
                  <input required type="tel" placeholder="+1 234 567 8900" value={form.phone} onChange={set("phone")} className={inputCls} />
                </div>
              </div>

              {/* Tell Us About You */}
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                  Tell Us About You
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Country of Residence *</label>
                    <select required value={form.country} onChange={set("country")} className={inputCls}>
                      <option value="">Select country</option>
                      {["India", "Nigeria", "Pakistan", "Bangladesh", "Nepal", "Sri Lanka", "Philippines", "Vietnam", "Indonesia", "Other"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Study Level *</label>
                    <select required value={form.studyLevel} onChange={set("studyLevel")} className={inputCls}>
                      <option value="">Select level</option>
                      {["Undergraduate", "Postgraduate", "PhD / Doctorate", "Diploma", "Certificate"].map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Discipline *</label>
                    <input required type="text" placeholder="e.g. Computer Science" value={form.discipline} onChange={set("discipline")} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>University *</label>
                    <input required type="text" placeholder="e.g. University of Toronto" value={form.university} onChange={set("university")} className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Course Name *</label>
                    <input required type="text" placeholder="e.g. MSc Data Science" value={form.course} onChange={set("course")} className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Intake */}
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                  Intake Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Intake Month</label>
                    <select value={form.intakeMonth} onChange={set("intakeMonth")} className={inputCls}>
                      <option value="">Month</option>
                      {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Intake Year</label>
                    <select value={form.intakeYear} onChange={set("intakeYear")} className={inputCls}>
                      <option value="">Year</option>
                      {["2025", "2026", "2027"].map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Course Start</label>
                    <input type="text" placeholder="e.g. Sep 2025" value={form.intakeCourse} onChange={set("intakeCourse")} className={inputCls} />
                  </div>
                </div>
              </div>

              {/* GPA */}
              <div>
                <label className={labelCls}>GPA / Percentage *</label>
                <input required type="text" placeholder="e.g. 3.5 / 10 or 75%" value={form.gpa} onChange={set("gpa")} className={inputCls} />
              </div>
            </div>

            {/* Footer — always visible */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors"
              >
                Submit Enquiry
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

function TrainingResourcesTab() {
  const { token } = useAuth();
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "video" | "guide" | "link" | "news">("all");

  const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([
      fetch(`${BASE_URL}/tenant/resources?audience_type=student&limit=50`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${BASE_URL}/tenant/resources?audience_type=all&limit=50`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ])
      .then(([studentRes, allRes]) => {
        const studentData: ResourceItem[] = studentRes.success ? studentRes.data : [];
        const allData: ResourceItem[] = allRes.success ? allRes.data : [];
        const seen = new Set<number>();
        const merged = [...studentData, ...allData].filter(r => {
          if (seen.has(r.id)) return false;
          seen.add(r.id);
          return true;
        });
        setResources(merged);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, BASE_URL]);

  const typeConfig = {
    video: { label: "Video", icon: <Video className="w-3.5 h-3.5" />, color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    guide: { label: "Guide", icon: <BookOpen className="w-3.5 h-3.5" />, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    link:  { label: "Link",  icon: <ExternalLink className="w-3.5 h-3.5" />, color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
    news:  { label: "News",  icon: <Newspaper className="w-3.5 h-3.5" />, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  };

  const filtered = filter === "all" ? resources : resources.filter(r => r.resource_type === filter);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden animate-pulse">
            <div className="h-40 bg-gray-200 dark:bg-gray-700" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-sm text-gray-500 dark:text-gray-400">No training resources available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", "video", "guide", "link", "news"] as const).map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
              filter === t
                ? "bg-brand-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {t === "all" ? "All" : typeConfig[t].label}
            {t !== "all" && (
              <span className="ml-1 opacity-70">({resources.filter(r => r.resource_type === t).length})</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400 py-6 text-center">No {filter} resources found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((r) => {
            const type = typeConfig[r.resource_type] ?? typeConfig.link;
            return (
              <div key={r.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm flex flex-col">
                {/* Thumbnail */}
                {r.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.thumbnail_url} alt={r.title} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-300 dark:text-gray-600 scale-150">{type.icon}</span>
                  </div>
                )}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${type.color}`}>
                      {type.icon}{type.label}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1 leading-snug">{r.title}</h3>
                  {r.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-grow line-clamp-3">{r.description}</p>
                  )}
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-brand-500 hover:text-brand-600"
                  >
                    {r.resource_type === "video" ? "Watch" : r.resource_type === "guide" ? "Read Guide" : "Open"}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
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
