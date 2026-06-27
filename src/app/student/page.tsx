"use client"

import React, { useEffect, useState } from "react";
import { Check, Clock, File, Heart, Table, PenSquare, FileText, User, MessageSquare, X,Newspaper, Video, Calendar } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import CalendlyEmbed from "@/components/CalendlyEmbed"
import Image from "next/image";

interface DashboardData {
  applications: {
    total: number;
  };
  shortlisted_courses: {
    total: number;
  };
  profile: {
    completion_percentage: number;
    is_complete: boolean;
  };
  test_scores: {
    total_added: number;
    is_complete: boolean;
  };
  academic_qualifications: {
    is_complete: boolean;
  };
  work_experience: {
    is_complete: boolean;
  };
  documents: {
    mandatory: number;
    uploaded: number;
    is_complete: boolean;
  };
  links: DashboardLinks[];
}

interface DashboardLinks {
  text: string;
  img: string;
  link: string;
}

interface NewsItem {
  id: number;
  title: string;
  image_url: string | null;
  created_at: string;
}

interface WebinarItem {
  id: number;
  title: string;
  scheduled_at: string;
  recording_url: string;
  university_name: string | null;
  university_logo_url: string | null;
}


export default function StudentDashboard() {
  const { user, token } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCalendlyModalOpen, setIsCalendlyModalOpen] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [webinars, setWebinars] = useState<WebinarItem[]>([]);

  const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/student/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.status) {
          setDashboardData(result.data);
        } else {
          throw new Error('Failed to fetch dashboard data');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  useEffect(() => {
    // Fetch News
    fetch(`${BASE_URL}/front/news?news_type=student&limit=2`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setNews(d.data); })
      .catch(console.error);

    // Fetch Webinars
    fetch(`${BASE_URL}/front/webinars?limit=2`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setWebinars(d.data); })
      .catch(console.error);
  }, []);

  // Add this function to your component
const checkAndRedirectForInterests = async (): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/student/interests`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // Check if interests are saved
    // Based on your API response structure, we check if data exists and has required fields
    if (result.success && result.data && result.data.student_id) {
      // Interests are saved - redirect to recommended courses
      window.location.href = '/student/courses/recommended';
    } else {
      // No interests saved - redirect to interest form
      window.location.href = '/student/editProfile?profileTab=interests';
    }
  } catch (err) {
    console.error('Error checking student interests:', err);
    // If there's an error, redirect to interests form as a fallback
    window.location.href = '/student/editProfile?profileTab=interests';
  }
};




  // Calculate document upload percentage
  const calculateDocumentPercentage = () => {
    if (!dashboardData) return 0;
    if (dashboardData.documents.mandatory === 0) return 0;
    return Math.round((dashboardData.documents.uploaded / dashboardData.documents.mandatory) * 100);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-600 dark:text-gray-400">Loading dashboard data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-600 dark:text-red-400">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                <span className="border-b-4 border-indigo-600">Hi</span> {user?.name}
              </h1>
            </div>
            
            {/* Programs Summary */}
            {dashboardData && (
              <div className="flex gap-4 text-sm">
                {/* Book Session Button */}
                {/* <button
                  onClick={() => setIsCalendlyModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                >
                  <MessageSquare size={16} />
                  Book a Session
                </button> */}

                {/* Flywire Link */}
                <div className="text-center">
                  <a
                    href={dashboardData.links[0].link}
                    className="flywire-button flex px-4 py-2 border-2 border-blue-600 rounded-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-black dark:text-white mr-2">
                      {dashboardData.links[0].text}
                    </span>
                    <Image
                      height={36}
                      width={74}
                      src={dashboardData.links[0].img}
                      alt="Flywire"
                      className="flywire-logo"
                    />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
            {/* My Applications Metric */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-xl text-gray-800 dark:text-white/90">
                    My Applications
                  </span>
                  <div className="flex align-middle">
                    <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
                      {dashboardData?.applications.total || 0}
                    </h4>
                  </div>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                  <File className="text-gray-800 dark:text-white/90" />
                </div>
              </div>
              <div className="mt-4">
                <Link 
                  href="/student/editProfile?tab=applications"
                  className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  Track Applications ›
                </Link>
              </div>
            </div>

            {/* Shortlisted Courses Metric */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-xl text-gray-800 dark:text-white/90">
                    Wishlist
                  </span>
                  <div className="flex align-middle">
                    <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
                      {dashboardData?.shortlisted_courses.total || 0}
                    </h4>
                  </div>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                  <Heart className="text-gray-800 dark:text-white/90" />
                </div>
              </div>
              <div className="mt-4">
                <Link 
                  href="/student/courses/shortlisted"
                  className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  View List ›
                </Link>
              </div>
            </div>

            {/* Book a Counselor Session Metric */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-xl text-gray-800 dark:text-white/90">
                    Book a Counselor Session
                  </span>
                  <div className="flex align-middle">
                    <h4 className="text-gray-800 text-title-sm dark:text-white/90">
                      Available 
                    </h4>
                  </div>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                  <MessageSquare className="text-gray-800 dark:text-white/90" />
                </div>
              </div>
              <div className="mt-4">
                <button 
                  onClick={() => setIsCalendlyModalOpen(true)}
                  className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  Book Now ›
                </button>
              </div>
            </div>
          </div>

          {/* WhatsApp Counselor Contact Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-6 shadow-lg">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -right-4 bottom-0 w-24 h-24 bg-white/10 rounded-full" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium uppercase tracking-wide mb-1">Need Help? Chat with us</p>
                  <h3 className="text-white text-xl font-bold">Talk to a Student Counselor</h3>
                  <p className="text-white/80 text-sm mt-1">Get instant guidance on courses, applications &amp; admissions</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <a
                  href="https://wa.me/919912881199"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white text-green-600 hover:bg-green-50 font-semibold px-5 py-3 rounded-xl shadow-md transition-all hover:shadow-lg hover:scale-105 text-sm whitespace-nowrap"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  +91 99128 81199
                </a>
                <a
                  href="https://wa.me/919515536699"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white text-green-600 hover:bg-green-50 font-semibold px-5 py-3 rounded-xl shadow-md transition-all hover:shadow-lg hover:scale-105 text-sm whitespace-nowrap"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  +91 95155 36699
                </a>
              </div>
            </div>
          </div>

          {/* Two Column Layout for Todo and Quick Links */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Quick Links Section - Right Column */}
            <div className="mb-8">
              <div className="rounded-xl">
                <div>
                  {/* Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Quick Action
                    </h5>
                  </div>

                  {/* Quick Link Cards */}
                  <div className="space-y-4">
                    {/* Start New Application */}
                    <div className="flex flex-col items-start justify-between shadow-sm rounded-xl p-4 dark:text-white transition border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-md">
                      <div className="flex items-start gap-3 w-full mb-3">
                        <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg border border-gray-200 dark:border-gray-800 dark:bg-gray-800">
                          <Table className="text-indigo-600" size={24} />
                        </div>
                        <div className="flex-grow">
                          <strong className="text-gray-800 dark:text-white">Start New Application</strong>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Submit your application to your dream course
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/student/courses"
                        className="w-full inline-flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2.5 rounded-md whitespace-nowrap"
                      >
                        Start Application ›
                      </Link>9
                    </div>

                    {/* Get Recommended Courses */}
<div className="flex flex-col items-start justify-between shadow-sm rounded-xl p-4 dark:text-white transition border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-md">
  <div className="flex items-start gap-3 w-full mb-3">
    <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg border border-gray-200 dark:border-gray-800 dark:bg-gray-800">
      <Heart className="text-indigo-600" size={24} />
    </div>
    <div className="flex-grow">
      <strong className="text-gray-800 dark:text-white">Get Recommended Courses</strong>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Discover courses that match your profile and interests
      </p>
    </div>
  </div>
  <button
    onClick={checkAndRedirectForInterests}
    className="w-full inline-flex items-center justify-center gap-1 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-indigo-900/30 text-sm px-4 py-2.5 rounded-md whitespace-nowrap"
  >
    Get Recommendations ›
  </button>
</div>
{/* University News Section */}
                    {news.length > 0 && (
                      <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
                        <h6 className="text-sm font-semibold text-gray-800 dark:text-white mb-3 flex items-center justify-between">
                          <span className="flex items-center gap-2"><Newspaper size={16} className="text-indigo-600" /> University News</span>
                          <Link href="/student/information-hub" className="text-xs text-indigo-600 hover:underline">View All</Link>
                        </h6>
                        <div className="space-y-3">
                          {news.map((item) => (
                            <Link href="/student/information-hub" key={item.id} className="block shadow-sm rounded-lg p-3 border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800/50 hover:border-indigo-300 transition">
                              <span className="text-[10px] text-gray-400 flex items-center gap-1 mb-1">
                                <Calendar size={10} /> {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </span>
                              <strong className="text-xs text-gray-800 dark:text-white line-clamp-2">{item.title}</strong>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Webinars Section */}
                    {webinars.length > 0 && (
                      <div className="pt-4 mt-2">
                        <h6 className="text-sm font-semibold text-gray-800 dark:text-white mb-3 flex items-center justify-between">
                          <span className="flex items-center gap-2"><Video size={16} className="text-red-500" /> Recent Webinars</span>
                          <Link href="/student/information-hub" className="text-xs text-indigo-600 hover:underline">View All</Link>
                        </h6>
                        <div className="space-y-3">
                          {webinars.map((w) => (
                            <a href={w.recording_url} target="_blank" rel="noopener noreferrer" key={w.id} className="flex items-center justify-between shadow-sm rounded-lg p-3 border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800/50 hover:border-red-300 transition">
                              <div className="flex-grow pr-2">
                                <strong className="text-xs text-gray-800 dark:text-white line-clamp-1">{w.university_name || w.title}</strong>
                                <span className="text-[10px] text-gray-500 line-clamp-1">{w.title}</span>
                              </div>
                              <div className="flex items-center justify-center w-8 h-8 bg-red-50 rounded-md dark:bg-red-900/20 text-red-500 flex-shrink-0">
                                <Video size={14} />
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Todo List Section - Left Column */}
            <div className="mb-8">
              <div className="rounded-xl">
                <div>
                  {/* Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="text-lg font-semibold text-gray-800 dark:text-white">
                      To Do
                    </h5>
                  </div>

                  {/* Todo Items */}
                  <div className="space-y-3">
                    {/* Personal Information */}
                    <div className="flex items-center justify-between shadow-sm rounded-xl p-4 dark:text-white transition border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-md">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-indigo-50 rounded-lg dark:bg-indigo-900/20">
                          <User className="text-indigo-600 dark:text-indigo-400" size={20} />
                        </div>
                        <div>
                          <strong className="text-gray-800 dark:text-white text-sm">
                            Personal Information
                          </strong>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-600" 
                                style={{ width: `${dashboardData?.profile.completion_percentage || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {dashboardData?.profile.completion_percentage || 0}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/student/editProfile?profileTab=profile`}
                        className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                      >
                        {dashboardData?.profile.is_complete ? 'Update' : 'Complete'} ›
                      </Link>
                    </div>

                    {/* Upload Documents */}
                    <div className="flex items-center justify-between shadow-sm rounded-xl p-4 dark:text-white transition border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-md">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-indigo-50 rounded-lg dark:bg-indigo-900/20">
                          <FileText className="text-indigo-600 dark:text-indigo-400" size={20} />
                        </div>
                        <div>
                          <strong className="text-gray-800 dark:text-white text-sm">
                            Upload Documents
                          </strong>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${dashboardData?.documents.is_complete ? 'bg-green-600' : 'bg-indigo-600'}`}
                                style={{ width: `${calculateDocumentPercentage()}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {calculateDocumentPercentage()}%
                              <span className="ml-1 text-gray-400">
                                ({dashboardData?.documents.uploaded || 0}/{dashboardData?.documents.mandatory || 0})
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/student/editProfile?tab=documents`}
                        className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                      >
                        {dashboardData?.documents.is_complete ? 'View' : 'Upload'} ›
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendly Modal */}
      {isCalendlyModalOpen && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-lg shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Book a Counselor Session
              </h3>
              <button
                onClick={() => setIsCalendlyModalOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body - Calendly Embed */}
            <div className="p-4 " style={{height: "500px"}}>
              <CalendlyEmbed url="https://calendly.com/applystore-info" />
            </div>

            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsCalendlyModalOpen(false)}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}