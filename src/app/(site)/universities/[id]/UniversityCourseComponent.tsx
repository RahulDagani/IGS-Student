'use client';

import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Select from 'react-select';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';

interface UniversityCourse {
  logo: string;
  university: string;
  address: string;
  description: string;
  video_link: string;
  brocher: string;
  tution_url: string;
  kind_of_partners: string;
  type_of_university: string;
  university_slug: string;
  course_id: number;
  course: string;
  university_name: string;
  country: string;
  study_level: string;
  application_fee: string;
  ielts_score?: string;
  toefl_score?: string;
  pte_score?: string;
  gre_score?: string;
  gmat_score?: string;
  sat_score?: string;
  act_score?: string;
  duolingo_score?: string;
  gpa_score?: string;
}

interface Article {
  id: number;
  slug: string;
  title: string;
  image_url: string;
  url: string;
}

interface StudyLevel {
  studylevel_slug: string;
  study_level: string;
}

interface Discipline {
  discipline_slug: string;
  discipline: string;
}

interface UniversityCourseComponentProps {
  initialData?: {
    university_courses: UniversityCourse[];
    news: Article[];
    webinars: Article[];
    study_levels: StudyLevel[];
    disciplines: Discipline[];
    study_level?: string;
    discipline?: string;
  };
}

// Custom styles for react-select
const customSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: '48px',
    borderRadius: '8px',
    borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.1)' : 'none',
    '&:hover': {
      borderColor: '#3b82f6',
    },
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    zIndex: 50,
  }),
  menuList: (base: any) => ({
    ...base,
    padding: 0,
    borderRadius: '8px',
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
    color: state.isSelected ? 'white' : '#374151',
    '&:active': {
      backgroundColor: '#3b82f6',
      color: 'white',
    },
  }),
  singleValue: (base: any) => ({
    ...base,
    color: '#374151',
  }),
  placeholder: (base: any) => ({
    ...base,
    color: '#9ca3af',
  }),
};

const UniversityCourseComponent = ({ initialData }: UniversityCourseComponentProps) => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Parse URL segments
  const segments = pathname.split('/').filter(Boolean);
  const universitySlug = segments.length >= 3 ? segments[2] : '';
  const studyLevelSlug = segments.length >= 4 ? segments[3] : '';
  const disciplineSlug = segments.length >= 5 ? segments[4] : '';
  
  // State for filters
  const [selectedStudyLevel, setSelectedStudyLevel] = useState<{ value: string; label: string } | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<{ value: string; label: string } | null>(null);
  const [externalEvaluation, setExternalEvaluation] = useState<string>('');
  const [greGmat, setGreGmat] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Score states
  const [satScore, setSatScore] = useState('');
  const [actScore, setActScore] = useState('');
  const [toeflScore, setToeflScore] = useState('');
  const [pteScore, setPteScore] = useState('');
  const [duolingoScore, setDuolingoScore] = useState('');
  const [ieltsScore, setIeltsScore] = useState('');
  
  // Filtered courses
  const [filteredCourses, setFilteredCourses] = useState<UniversityCourse[]>([]);
  
  // Data
  const data = initialData || {
    university_courses: [],
    news: [],
    webinars: [],
    study_levels: [],
    disciplines: [],
  };
  
  // Transform data for select options
  const studyLevelOptions = (data.study_levels || []).map(level => ({
    value: level.studylevel_slug,
    label: level.study_level
  }));
  
  const disciplineOptions = (data.disciplines || []).map(discipline => ({
    value: discipline.discipline_slug,
    label: discipline.discipline
  }));
  
  // Initialize from URL params
  useEffect(() => {
    if (studyLevelSlug && studyLevelOptions.length > 0) {
      const foundStudyLevel = studyLevelOptions.find(opt => opt.value === studyLevelSlug);
      if (foundStudyLevel) setSelectedStudyLevel(foundStudyLevel);
    }
    
    if (disciplineSlug && disciplineOptions.length > 0) {
      const foundDiscipline = disciplineOptions.find(opt => opt.value === disciplineSlug);
      if (foundDiscipline) setSelectedDiscipline(foundDiscipline);
    }
    
    // Initialize courses
    setFilteredCourses(data.university_courses || []);
  }, [data, studyLevelSlug, disciplineSlug]);
  
  // Handle study level change
  const handleStudyLevelChange = (selected: any) => {
    setSelectedStudyLevel(selected);
    if (selected && universitySlug) {
      const url = `/filter/university/${universitySlug}/${selected.value}`;
      router.push(url);
    }
  };
  
  // Handle discipline change
  const handleDisciplineChange = (selected: any) => {
    setSelectedDiscipline(selected);
    if (selected && selectedStudyLevel && universitySlug) {
      const url = `/filter/university/${universitySlug}/${selectedStudyLevel.value}/${selected.value}`;
      router.push(url);
    }
  };
  
  // Apply filters
  const handleApplyFilters = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate filtering
    setTimeout(() => {
      let courses = [...(data.university_courses || [])];
      
      // Filter by scores
      if (satScore) {
        courses = courses.filter(course => 
          course.sat_score && 
          parseInt(course.sat_score) >= parseInt(satScore)
        );
      }
      
      if (actScore) {
        courses = courses.filter(course => 
          course.act_score && 
          parseInt(course.act_score) >= parseInt(actScore)
        );
      }
      
      if (toeflScore) {
        courses = courses.filter(course => 
          course.toefl_score && 
          parseInt(course.toefl_score) >= parseInt(toeflScore)
        );
      }
      
      if (pteScore) {
        courses = courses.filter(course => 
          course.pte_score && 
          parseInt(course.pte_score) >= parseInt(pteScore)
        );
      }
      
      if (ieltsScore) {
        courses = courses.filter(course => 
          course.ielts_score && 
          parseFloat(course.ielts_score) >= parseFloat(ieltsScore)
        );
      }
      
      if (duolingoScore) {
        courses = courses.filter(course => 
          course.duolingo_score && 
          parseInt(course.duolingo_score) >= parseInt(duolingoScore)
        );
      }
      
      // Filter by GRE/GMAT
      if (greGmat === 'Yes') {
        courses = courses.filter(course => 
          course.gre_score || course.gmat_score
        );
      } else if (greGmat === 'No') {
        courses = courses.filter(course => 
          !course.gre_score && !course.gmat_score
        );
      }
      
      setFilteredCourses(courses);
      setLoading(false);
    }, 500);
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setExternalEvaluation('');
    setGreGmat('');
    setSatScore('');
    setActScore('');
    setToeflScore('');
    setPteScore('');
    setDuolingoScore('');
    setIeltsScore('');
    setFilteredCourses(data.university_courses || []);
  };
  
  // Handle view course
  const handleViewCourse = (courseId: number, e: React.MouseEvent) => {
    e.preventDefault();
    const url = `https://student.indoglobalstudies.org/course-details?course_id=${courseId}`;
    
    // Set cookie for all subdomains
    document.cookie = `igs_course_details_url=${encodeURIComponent(url)}; domain=.indoglobalstudies.org; path=/`;
    
    // Open in new tab
    window.open(url, '_blank');
  };
  
  // Get university info from first course
  const universityInfo = data.university_courses && data.university_courses.length > 0 
    ? data.university_courses[0] 
    : null;
  
  return (
    <>
      <Header />
      <div className="main-div-search-panel bg-gray-50 min-h-screen">
        <div className="main-uni-course flex flex-col lg:flex-row max-w-7xl mx-auto">
          {/* Left Filter Sidebar */}
          <section className="left11-form lg:w-1/4 p-4 lg:p-6">
            <div className="university-side-form">
              <div className="sticky top-4">
                <form 
                  id="filter-form" 
                  onSubmit={handleApplyFilters}
                  className="space-y-4 bg-white p-5 rounded-xl shadow-lg border border-gray-100 mb-6"
                >
                  {/* University Search Hidden Field */}
                  <input 
                    type="hidden" 
                    id="uni-universal_search" 
                    value={universitySlug || ''}
                  />
                  
                  {/* Study Level Select */}
                  <div className="switch-program">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Study Level
                    </label>
                    <Select
                      options={studyLevelOptions}
                      value={selectedStudyLevel}
                      onChange={handleStudyLevelChange}
                      placeholder="Select Study level"
                      styles={customSelectStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                  
                  {/* Discipline Select */}
                  <div className="switch-program">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discipline
                    </label>
                    <Select
                      options={disciplineOptions}
                      value={selectedDiscipline}
                      onChange={handleDisciplineChange}
                      placeholder="Select Discipline"
                      styles={customSelectStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                  
                  {/* Filters Toggle */}
                  <div className="score-section">
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="customSwitches"
                        checked={showFilters}
                        onChange={() => setShowFilters(!showFilters)}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="customSwitches" className="ml-2 text-sm font-medium text-gray-700">
                        Show Advanced Filters
                      </label>
                    </div>
                    
                    {/* Advanced Filters */}
                    {showFilters && (
                      <div id="customSwitches1" className="space-y-4">
                        <div className="filter-form1">
                          {/* External Evaluation */}
                          <div className="checkbox-gre">
                            <h6 className="text-sm font-medium text-gray-700 mb-2">
                              Filter by External Evaluation
                            </h6>
                            <div className="flex items-center space-x-4">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="external_evaluation"
                                  checked={externalEvaluation === 'Req'}
                                  onChange={() => setExternalEvaluation('Req')}
                                  className="h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2 text-sm text-gray-700">Yes</span>
                              </label>
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="external_evaluation"
                                  checked={externalEvaluation === 'No Req'}
                                  onChange={() => setExternalEvaluation('No Req')}
                                  className="h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2 text-sm text-gray-700">No</span>
                              </label>
                            </div>
                          </div>
                          
                          {/* Application Fee */}
                          <div className="checkbox-gre mt-4">
                            <h6 className="text-sm font-medium text-gray-700 mb-2">
                              Filter By Application Fee
                            </h6>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                id="chk_application"
                                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">Waiver</span>
                            </label>
                          </div>
                          
                          {/* GRE/GMAT */}
                          <div className="checkbox-gre mt-4">
                            <h6 className="text-sm font-medium text-gray-700 mb-2">
                              GRE/GMAT
                            </h6>
                            <div className="flex items-center space-x-4">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="gre_gmat"
                                  checked={greGmat === 'Yes'}
                                  onChange={() => setGreGmat('Yes')}
                                  className="h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2 text-sm text-gray-700">Yes</span>
                              </label>
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="gre_gmat"
                                  checked={greGmat === 'No'}
                                  onChange={() => setGreGmat('No')}
                                  className="h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2 text-sm text-gray-700">No</span>
                              </label>
                            </div>
                          </div>
                          
                          {/* Score Inputs */}
                          <div className="grid grid-cols-2 gap-3 mt-4">
                            <div>
                              <input
                                type="text"
                                name="sat_score"
                                id="sat_score"
                                value={satScore}
                                onChange={(e) => setSatScore(e.target.value)}
                                placeholder="SAT Score"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                name="act_score"
                                id="act_score"
                                value={actScore}
                                onChange={(e) => setActScore(e.target.value)}
                                placeholder="ACT Score"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                name="toefl_score"
                                id="toefl_score"
                                value={toeflScore}
                                onChange={(e) => setToeflScore(e.target.value)}
                                placeholder="TOEFL Score"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                name="pte_score"
                                id="pte_score"
                                value={pteScore}
                                onChange={(e) => setPteScore(e.target.value)}
                                placeholder="PTE Score"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                name="duolingo_score"
                                id="duolingo_score"
                                value={duolingoScore}
                                onChange={(e) => setDuolingoScore(e.target.value)}
                                placeholder="Duolingo Score"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                name="ielts_score"
                                id="ielts_score"
                                value={ieltsScore}
                                onChange={(e) => setIeltsScore(e.target.value)}
                                placeholder="IELTS Score"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Filter Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                    >
                      {loading ? 'Applying...' : 'Apply Filters'}
                    </button>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all shadow-sm hover:shadow-md"
                    >
                      Reset
                    </button>
                  </div>
                </form>
                
                {/* News Section - Desktop */}
                <div className="hidden lg:block mt-8">
                  <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 border-b">
                      <p className="font-bold text-gray-800 mb-0 flex items-center gap-2">
                        <i className="ri-newspaper-line text-blue-600"></i>
                        Latest News
                      </p>
                    </div>
                    {(data.news || []).map((article) => (
                      <Link
                        key={article.id}
                        href={`/news/${article.slug}/${article.id}`}
                        className="block border-b last:border-b-0 hover:bg-blue-50 transition-colors group"
                      >
                        <div className="p-3">
                          <p className="text-gray-800 mb-0 line-clamp-2 text-sm group-hover:text-blue-700 transition-colors">
                            {article.title}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Webinars Section - Desktop */}
                <div className="hidden lg:block mt-6">
                  <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <div className="bg-gradient-to-r from-red-50 to-red-100 p-3 border-b">
                      <p className="font-bold text-gray-800 mb-0 flex items-center gap-2">
                        <i className="ri-video-line text-red-600"></i>
                        Student Testimonials
                      </p>
                    </div>
                    {(data.webinars || []).map((webinar) => (
                      <Link
                        key={webinar.id}
                        href={`/webinar/${webinar.slug}/${webinar.id}`}
                        target="_blank"
                        className="block border-b last:border-b-0 hover:bg-red-50 transition-colors group"
                      >
                        <div className="p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-gray-800 mb-2 text-sm group-hover:text-red-700 transition-colors">
                                {webinar.title}
                              </p>
                              {webinar.url && (
                                <div className="text-right">
                                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold rounded-full hover:from-red-700 hover:to-red-800 transition-all shadow-sm">
                                    Watch Now
                                    <i className="ri-youtube-line"></i>
                                  </span>
                                </div>
                              )}
                            </div>
                            {!webinar.url && webinar.image_url && (
                              <div className="ml-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden ring-2 ring-gray-100">
                                  <Image
                                    src={webinar.image_url}
                                    alt={webinar.title}
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Main Content */}
          <section className="top-section flex-1 p-4 lg:p-6">
            <div className="university-section">
              {/* University Header */}
              {universityInfo && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* University Logo */}
                      <div className="lg:w-1/6 flex-shrink-0">
                        <div className="w-32 h-32 mx-auto lg:mx-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center p-4 ring-2 ring-gray-100">
                          {universityInfo.logo ? (
                            <Image
                              src={`/images/site/igslogo.png`}
                              alt={universityInfo.university}
                              width={120}
                              height={120}
                              className="object-contain"
                            />
                          ) : (
                            <div className="text-gray-300 text-center">
                              <i className="ri-building-line ri-4x"></i>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* University Details */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {universityInfo.university}
                        </h3>
                        
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(universityInfo.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-start gap-2 text-gray-600 mb-3 hover:text-blue-600 transition-colors"
                        >
                          <i className="ri-map-pin-line mt-0.5"></i>
                          <span>{universityInfo.address}</span>
                        </a>
                        
                        <p className="text-gray-700 text-sm mb-5">
                          {universityInfo.description}
                        </p>
                        
                        {/* University Links */}
                        <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
                          {universityInfo.video_link && (
                            <a
                              href={universityInfo.video_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                            >
                              <i className="ri-video-line"></i>
                              Video Link
                            </a>
                          )}
                          
                          {universityInfo.brocher && (
                            <a
                              href={`/assets/brochers/university-brocher/${universityInfo.brocher}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                            >
                              <i className="ri-file-line"></i>
                              Brochure
                            </a>
                          )}
                          
                          {universityInfo.tution_url && (
                            <a
                              href={universityInfo.tution_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                            >
                              <i className="ri-money-dollar-circle-line"></i>
                              Tuition URL
                            </a>
                          )}
                          
                          {universityInfo.kind_of_partners && (
                            <div className="flex items-center gap-2 text-gray-700 text-sm">
                              <i className="ri-group-line"></i>
                              <span>{universityInfo.kind_of_partners}</span>
                            </div>
                          )}
                          
                          {universityInfo.type_of_university && (
                            <div className="flex items-center gap-2 text-gray-700 text-sm">
                              <i className="ri-building-line"></i>
                              <span>{universityInfo.type_of_university}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Courses Count */}
              <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Available Courses</h1>
                <p className="text-gray-600">
                  Showing <span className="font-semibold text-blue-600">{filteredCourses.length}</span> courses
                </p>
              </div>
              
              {/* Loader */}
              {loading && (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                  <div className="inline-flex items-center justify-center w-12 h-12 animate-spin mb-4">
                    <i className="ri-loader-line ri-2x text-blue-600"></i>
                  </div>
                  <p className="text-gray-600">Filtering courses...</p>
                </div>
              )}
              
              {/* Courses List */}
              {!loading && filteredCourses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                  <div className="text-gray-300 mb-4">
                    <i className="ri-search-line ri-4x"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your filters</p>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div id="results-course-container" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCourses.map((course, index) => {
                    const scores = [
                      { name: 'IELTS', value: course.ielts_score },
                      { name: 'TOEFL', value: course.toefl_score },
                      { name: 'PTE', value: course.pte_score },
                      { name: 'GRE', value: course.gre_score },
                      { name: 'GMAT', value: course.gmat_score },
                      { name: 'SAT', value: course.sat_score },
                      { name: 'ACT', value: course.act_score },
                      { name: 'Duolingo', value: course.duolingo_score },
                      { name: 'GPA', value: course.gpa_score },
                    ].filter(score => score.value && score.value.trim() !== '');
                    
                    return (
                      <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                        <div className="p-6 h-full flex flex-col">
                          {/* Course Header */}
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center p-3 flex-shrink-0">
                              {course.logo ? (
                                <Image
                                  src={`/images/site/igslogo.png`}
                                  alt={course.university}
                                  width={60}
                                  height={60}
                                  className="object-contain"
                                />
                              ) : (
                                <i className="ri-building-line ri-2x text-blue-400"></i>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 mb-1 line-clamp-2">
                                {course.course}
                              </h4>
                              <p className="text-sm text-gray-600 mb-1">
                                {course.university_name}, {course.country}
                              </p>
                              <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded">
                                {course.study_level}
                              </span>
                            </div>
                          </div>
                          
                          <hr className="my-4 border-gray-200" />
                          
                          {/* Course Details */}
                          <ul className="space-y-3 flex-1">
                            <li className="flex items-center text-sm text-gray-700">
                              <i className="ri-award-line text-blue-500 mr-2"></i>
                              {course.study_level}
                            </li>
                            <li className="flex items-center text-sm text-gray-700">
                              <i className="ri-map-pin-line text-blue-500 mr-2"></i>
                              {course.country}
                            </li>
                            <li className="flex items-center text-sm text-gray-700">
                              <i className="ri-wallet-line text-blue-500 mr-2"></i>
                              Application Fee - {course.application_fee}
                            </li>
                            <li className="flex items-center text-sm text-gray-700">
                              <i className="ri-clipboard-line text-blue-500 mr-2"></i>
                              External Evaluation - Required (WES)
                            </li>
                            
                            {/* Entry Requirements */}
                            {scores.length > 0 && (
                              <>
                                <li className="text-sm font-medium text-gray-700 mt-2">
                                  Entry Requirements:
                                </li>
                                <ul className="pl-4 space-y-1">
                                  {scores.map((score, idx) => (
                                    <li key={idx} className="text-sm text-gray-600 flex items-center">
                                      <i className="ri-checkbox-blank-circle-fill text-blue-300 text-xs mr-2"></i>
                                      {score.name}: <span className="font-semibold ml-1">{score.value}</span>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </ul>
                          
                          {/* View Course Button */}
                          <button
                            onClick={(e) => handleViewCourse(course.course_id, e)}
                            className="mt-6 w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                          >
                            View Course Details
                            <i className="ri-arrow-right-line"></i>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Mobile News Section */}
              <div className="lg:hidden mt-8">
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 border-b">
                    <p className="font-bold text-gray-800 mb-0 flex items-center gap-2">
                      <i className="ri-newspaper-line text-blue-600"></i>
                      Latest News
                    </p>
                  </div>
                  {(data.news || []).map((article) => (
                    <Link
                      key={article.id}
                      href={`/news/${article.slug}/${article.id}`}
                      className="block border-b last:border-b-0 hover:bg-blue-50 transition-colors"
                    >
                      <div className="p-3">
                        <p className="text-gray-800 mb-0 text-sm">{article.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Mobile Webinars Section */}
              <div className="lg:hidden mt-6">
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="bg-gradient-to-r from-red-50 to-red-100 p-3 border-b">
                    <p className="font-bold text-gray-800 mb-0 flex items-center gap-2">
                      <i className="ri-video-line text-red-600"></i>
                      Student Testimonials
                    </p>
                  </div>
                  {(data.webinars || []).map((webinar) => (
                    <Link
                      key={webinar.id}
                      href={`/webinar/${webinar.slug}/${webinar.id}`}
                      target="_blank"
                      className="block border-b last:border-b-0 hover:bg-red-50 transition-colors"
                    >
                      <div className="p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-gray-800 mb-2 text-sm">{webinar.title}</p>
                            {webinar.url && (
                              <div className="text-right">
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold rounded-full hover:from-red-700 hover:to-red-800 transition-all">
                                  Watch Now
                                  <i className="ri-youtube-line"></i>
                                </span>
                              </div>
                            )}
                          </div>
                          {!webinar.url && webinar.image_url && (
                            <div className="ml-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden">
                                <Image
                                  src={webinar.image_url}
                                  alt={webinar.title}
                                  width={40}
                                  height={40}
                                  className="object-cover"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default UniversityCourseComponent;