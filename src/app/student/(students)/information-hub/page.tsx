"use client";
import React, { useState } from "react";
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

const trainingResources = [
  {
    id: 1,
    title: "Study Abroad Application Guide",
    channel: "IGS Education",
    publishDate: "2024-09-10",
    youtubeUrl: "https://www.youtube.com/embed/ffqQSDjZl3E",
    description: "Step-by-step walkthrough of the entire study abroad application process from selecting a country to visa approval.",
    tags: ["Application", "Study Abroad", "Visa"],
  },
  {
    id: 2,
    title: "IELTS Preparation Masterclass",
    channel: "IGS Training",
    publishDate: "2024-08-22",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Comprehensive IELTS preparation covering all four modules: Listening, Reading, Writing, and Speaking.",
    tags: ["IELTS", "English", "Exam Prep"],
  },
  {
    id: 3,
    title: "Scholarship Application Tips",
    channel: "IGS Education",
    publishDate: "2024-07-15",
    youtubeUrl: "https://www.youtube.com/embed/abc123def456",
    description: "Expert tips on finding and applying for scholarships at top universities worldwide.",
    tags: ["Scholarship", "Funding", "University"],
  },
];

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

const universityNews = [
  {
    id: 1,
    title: "QS Rankings 2025: Top Universities Revealed",
    source: "IGS News",
    date: "2025-01-10",
    category: "Rankings",
    excerpt: "The QS World University Rankings 2025 have been announced. MIT tops the list for the 13th consecutive year, followed by Cambridge and Oxford.",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&q=80",
    readMoreUrl: "#",
  },
  {
    id: 2,
    title: "Canada Introduces New Student Visa Pathways for 2025",
    source: "IGS Updates",
    date: "2025-01-05",
    category: "Visa",
    excerpt: "IRCC has announced new study permit processing changes to ease the backlog and improve turnaround times for international students.",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    readMoreUrl: "#",
  },
  {
    id: 3,
    title: "UK Universities Offering Record Scholarships for 2025 Intake",
    source: "IGS News",
    date: "2024-12-28",
    category: "Scholarships",
    excerpt: "Leading UK institutions have announced significant scholarship packages to attract international talent for the 2025 academic year.",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
    readMoreUrl: "#",
  },
  {
    id: 4,
    title: "Australia's New Post-Study Work Visa Extension",
    source: "IGS Updates",
    date: "2024-12-15",
    category: "Visa",
    excerpt: "Australia extends post-study work rights for graduates from select universities and in-demand sectors.",
    imageUrl: "https://images.unsplash.com/photo-1494587351196-bbf5f29cff42?w=400&q=80",
    readMoreUrl: "#",
  },
];

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
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Explore our curated video resources to help you prepare for your study abroad journey.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {trainingResources.map((r) => (
          <div key={r.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
              <iframe
                src={r.youtubeUrl}
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
                title={r.title}
              />
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">{r.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{r.channel}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed flex-grow">{r.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {r.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(r.publishDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: University Webinars ─────────────────────────────────────────────────

function UniversityWebinarsTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Register for upcoming university webinars or watch recorded sessions.
      </p>
      <div className="flex flex-col gap-4">
        {universityWebinars.map((w) => (
          <div key={w.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
              <Video className="w-6 h-6 text-brand-500" />
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{w.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  w.status === "Upcoming"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }`}>
                  {w.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{w.university}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3">{w.description}</p>
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(w.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · {w.time}
                </span>
                <a
                  href={w.registrationUrl}
                  className="text-xs font-medium text-brand-500 hover:text-brand-600 flex items-center gap-1"
                >
                  {w.status === "Upcoming" ? "Register Now" : "Watch Recording"}
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: University News ─────────────────────────────────────────────────────

function UniversityNewsTab() {
  const categoryColors: Record<string, string> = {
    Rankings: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    Visa: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Scholarships: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Stay up to date with the latest news from universities and study abroad destinations.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {universityNews.map((news) => (
          <div key={news.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm flex flex-col">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 flex flex-col flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[news.category] ?? "bg-gray-100 text-gray-600"}`}>
                  {news.category}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(news.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </span>
              </div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-2 leading-snug">{news.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-grow">{news.excerpt}</p>
              <a href={news.readMoreUrl} className="mt-3 text-xs font-medium text-brand-500 hover:text-brand-600 flex items-center gap-1">
                Read More <ChevronRight className="w-3.5 h-3.5" />
              </a>
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
