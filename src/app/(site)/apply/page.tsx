'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';


interface Country {
  country: string;
  country_slug: string;
}

interface StudyLevel {
  study_level: string;
  studylevel_slug: string;
  country: string;
  country_slug: string;
}

interface Discipline {
  discipline: string;
  discipline_slug: string;
}

interface Course {
  name: string;
  slug: string;
}

const HomePageComponent = () => {
  // Static data (replacing your PHP variables)
  const banner = {
    home_page_banner_1: '/images/site/home-banner.png',
    home_page_banner_3: '/images/site/home-banner-3.jpeg',
    home_page_banner_4: '/assets/images/banner/course-bg.jpg',
  };

  const countryNames: Country[] = [
    { country: 'United States', country_slug: 'united-states' },
    { country: 'United Kingdom', country_slug: 'united-kingdom' },
    { country: 'Canada', country_slug: 'canada' },
    { country: 'Australia', country_slug: 'australia' },
    { country: 'Germany', country_slug: 'germany' },
  ];

  const studyLevels: StudyLevel[] = [
    { study_level: 'Bachelor\'s Degree', studylevel_slug: 'bachelors', country: 'United States', country_slug: 'united-states' },
    { study_level: 'Master\'s Degree', studylevel_slug: 'masters', country: 'United States', country_slug: 'united-states' },
    { study_level: 'PhD', studylevel_slug: 'phd', country: 'United States', country_slug: 'united-states' },
    { study_level: 'Diploma', studylevel_slug: 'diploma', country: 'United States', country_slug: 'united-states' },
  ];

  const disciplines: Discipline[] = [
    { discipline: 'Computer Science', discipline_slug: 'computer-science' },
    { discipline: 'Business Administration', discipline_slug: 'business-administration' },
    { discipline: 'Engineering', discipline_slug: 'engineering' },
    { discipline: 'Medicine', discipline_slug: 'medicine' },
    { discipline: 'Architecture', discipline_slug: 'architecture' },
    { discipline: 'Law', discipline_slug: 'law' },
  ];

  const courses: Course[] = [
    { name: 'Computer Science and Engineering', slug: 'computer-science-engineering' },
    { name: 'Software Engineering', slug: 'software-engineering' },
    { name: 'Data Science', slug: 'data-science' },
    { name: 'Artificial Intelligence', slug: 'artificial-intelligence' },
    { name: 'Web Development', slug: 'web-development' },
    { name: 'Cybersecurity', slug: 'cybersecurity' },
    { name: 'Mobile App Development', slug: 'mobile-app-development' },
    { name: 'Cloud Computing', slug: 'cloud-computing' },
    { name: 'Machine Learning', slug: 'machine-learning' },
    { name: 'Information Technology', slug: 'information-technology' },
  ];

  // State management
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedStudyLevel, setSelectedStudyLevel] = useState<string | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [showStudyLevelSection, setShowStudyLevelSection] = useState(false);
  const [showDisciplineSection, setShowDisciplineSection] = useState(false);
  const [showCourseSection, setShowCourseSection] = useState(false);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [currentStudyLevels, setCurrentStudyLevels] = useState<StudyLevel[]>([]);

  // Handle country selection
  const handleCountrySelect = (countrySlug: string) => {
    setLoading(true);
    setSelectedCountry(countrySlug);
    setSelectedStudyLevel(null);
    setSelectedDiscipline(null);
    setSelectedCourses([]);
    
    // Simulate API call delay
    setTimeout(() => {
      // Filter study levels for selected country (in real app, this would come from API)
      const filteredStudyLevels = studyLevels.filter(level => 
        level.country_slug === countrySlug
      );
      setCurrentStudyLevels(filteredStudyLevels.length > 0 ? filteredStudyLevels : studyLevels);
      setShowStudyLevelSection(true);
      setShowDisciplineSection(false);
      setShowCourseSection(false);
      setLoading(false);
      
      // Scroll to study level section
      setTimeout(() => {
        const element = document.getElementById('study-level-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }, 500);
  };

  // Handle study level selection
  const handleStudyLevelSelect = (studyLevelSlug: string, countrySlug: string) => {
    setLoading(true);
    setSelectedStudyLevel(studyLevelSlug);
    setSelectedDiscipline(null);
    setSelectedCourses([]);
    
    setTimeout(() => {
      setShowDisciplineSection(true);
      setShowCourseSection(false);
      setLoading(false);
      
      setTimeout(() => {
        const element = document.getElementById('discipline-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }, 500);
  };

  // Handle discipline selection
  const handleDisciplineSelect = (disciplineSlug: string) => {
    setLoading(true);
    setSelectedDiscipline(disciplineSlug);
    setSelectedCourses([]);
    
    setTimeout(() => {
      setShowCourseSection(true);
      setLoading(false);
      
      setTimeout(() => {
        const element = document.getElementById('course-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }, 500);
  };

  // Handle course selection
  const handleCourseSelect = (courseSlug: string) => {
    setSelectedCourses(prev => {
      if (prev.includes(courseSlug)) {
        return prev.filter(slug => slug !== courseSlug);
      } else {
        return [...prev, courseSlug];
      }
    });
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourses.length === 0) return;
    
    // In a real app, you would navigate to search results
    console.log('Searching with:', {
      country: selectedCountry,
      study_level: selectedStudyLevel,
      discipline: selectedDiscipline,
      courses: selectedCourses,
    });
    
    alert(`Searching for ${selectedCourses.length} course(s) with selected filters!`);
  };

  // Visible courses based on showAllCourses state
  const visibleCourses = showAllCourses ? courses : courses.slice(0, 6);

  return (
    <>
        <Header />
    <div id="home_div ">
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            {/* <h3 className="text-xl font-semibold mb-4 text-gray-800">Loading...</h3> */}
            <div className="loader">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Banner Section */}
      <div 
  id="main-bg-home" 
  className="relative  bg-contain bg-no-repeat bg-right-top bg-white "
  style={{ backgroundImage: `url('${banner.home_page_banner_1}')`, minHeight: "560px"}}
>
        {/* <div className="absolute inset-0 bg-white/40"></div> */}

        <div className='max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between'>

        
        
        <div className="container relative mx-auto px-4 py-20 z-10">
          <h2 className="text-5xl font-bold mb-12 text-[#111d5e]">
            <span className='mb-2'>Search and Apply to</span> <span className="text-orange-400 block">Universities of YOUR choice</span>
          </h2>
          
          <div className="clearfix"></div>
          
          <div className="headcapt mb-12">
            <h3 className="flex items-center justify-start gap-4 text-2xl md:text-3xl font-semibold text-[#111d5e]">
              <figure>
                <Image 
                  src="/images/site/numb1.png" 
                  alt="Step 1" 
                  width={90} 
                  height={90}
                  className="w-12 h-12 md:w-20 md:h-20"
                />
              </figure>
              Select <span className="text-orange-400 ml-2">Country</span>
            </h3>
          </div>
          
          <div className="chooseopt">
            <ul className="flex flex-wrap justify-start gap-4">
              {countryNames.map((country, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleCountrySelect(country.country_slug)}
                    className={`px-6 py-3 border-2 border-black rounded-lg text-lg font-medium transition-all duration-300 ${
                      selectedCountry === country.country_slug
                        ? 'bg-orange-500 border-orange-500 text-white shadow-lg transform scale-105'
                        : 'bg-white/90 text-gray-800 hover:border-orange-500 hover:border-2 hover:text-orange-500 hover:shadow-md'
                    }`}
                  >
                    {country.country}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Down arrow */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <Image 
            src="/images/site/circle_arrow.png" 
            alt="Scroll down" 
            width={40} 
            height={40}
            className="w-16 h-16"
          />
        </div>

        </div>
      </div>

      {/* Study Level Section */}
      {showStudyLevelSection && (
        <div id="study-level-section" className="disparea py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <Image 
                src="/images/site/numb2.png" 
                alt="Step 2" 
                width={120} 
                height={120}
                className="mx-auto mb-6"
              />
              <br />
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12">
                Select <span className="text-orange-500">Type Of Degree</span>
              </h2>
              
              <div className="chooseopt">
                <ul className="flex flex-wrap justify-center gap-4">
                  {currentStudyLevels.map((level, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleStudyLevelSelect(level.studylevel_slug, level.country_slug)}
                        className={`px-6 py-3 rounded-lg text-lg font-medium transition-all border-2 duration-300 ${
                          selectedStudyLevel === level.studylevel_slug
                            ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                            : 'bg-white text-gray-800 border border-black hover:border-orange-500 hover:text-orange-500 hover:shadow-md'
                        }`}
                      >
                        {level.study_level}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Down arrow */}
          <div className="flex justify-center mt-12 animate-bounce">
            <Image 
              src="/images/site/circle_arrow.png" 
              alt="Scroll down" 
              width={40} 
              height={40}
              className="w-16 h-16"
            />
          </div>
        </div>
      )}

      {/* Discipline Section */}
      {showDisciplineSection && (
        <div 
          id="discipline-section" 
          className="discipline py-20 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${banner.home_page_banner_3}')` }}
        >
          {/* <div className="absolute inset-0 bg-black/30"></div> */}
          <div className="container relative mx-auto px-4 z-10">
            <div className="text-center">
              <Image 
                src="/images/site/numb3.png" 
                alt="Step 3" 
                width={80} 
                height={80}
                className="mx-auto mb-6"
              />
              <br />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">
                Select <span className="text-orange-300">Discipline</span>
              </h2>
              
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <div className="relative">
                    <select
                      value={selectedDiscipline || ''}
                      onChange={(e) => handleDisciplineSelect(e.target.value)}
                      className="w-full px-6 py-4 text-lg rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 focus:outline-none appearance-none bg-white"
                    >
                      <option value="">Select Discipline</option>
                      {disciplines.map((discipline, index) => (
                        <option key={index} value={discipline.discipline_slug}>
                          {discipline.discipline}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Down arrow */}
          {selectedDiscipline && (
            <div className="flex justify-center mt-12 animate-bounce relative z-10">
              <Image 
                src="/images/site/circle_arrow.png" 
                alt="Scroll down" 
                width={40} 
                height={40}
                className="w-16 h-16"
              />
            </div>
          )}
        </div>
      )}

      {/* Course Selection Section */}
      {showCourseSection && (
        <div id="course-section" className="location py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="row">
              <div className="col-12 course-content">
                <div className="headcapt flex items-center justify-center gap-4 mb-12">
                  <figure>
                    <Image 
                      src="/images/site/numb4.png" 
                      alt="Step 4" 
                      width={80} 
                      height={80}
                      className="w-20 h-20"
                    />
                  </figure>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
                    Select <span className="text-teal-600">Course</span>
                  </h2>
                </div>
                
                <div className="srch-uni-btn">
                  <form onSubmit={handleSearchSubmit}>
                    <div className="form-group mb-8">
                      <div className="autocomplete11">
                        <div className="flex flex-wrap gap-3 justify-center">
                          {visibleCourses.map((course, index) => (
                            <div key={index} className="cat">
                              <label className="cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="course_check sr-only"
                                  name="course[]"
                                  value={course.slug}
                                  checked={selectedCourses.includes(course.slug)}
                                  onChange={() => handleCourseSelect(course.slug)}
                                />
                                <span className={`inline-block px-6 py-3 rounded-lg border transition-all duration-300 ${
                                  selectedCourses.includes(course.slug)
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105 border-orange-500'
                                    : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50 hover:border-orange-300 hover:shadow-md'
                                }`}>
                                  {course.name}
                                </span>
                              </label>
                            </div>
                          ))}
                          
                          {courses.length > 6 && (
                            <div className="cat11">
                              <label>
                                <span 
                                  onClick={() => setShowAllCourses(!showAllCourses)}
                                  className="inline-block px-6 py-3 text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
                                >
                                  {showAllCourses ? '<< Show Less' : 'Show More >>'}
                                </span>
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <input type="hidden" name="country" value={selectedCountry || ''} />
                    <input type="hidden" name="study_level" value={selectedStudyLevel || ''} />
                    <input type="hidden" name="discipline" value={selectedDiscipline || ''} />
                    
                    <div className="text-center">
                      <button
                        type="submit"
                        disabled={selectedCourses.length === 0}
                        className={`btn default-btn px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 ${
                          selectedCourses.length === 0
                            ? 'bg-gray-400 cursor-not-allowed opacity-50'
                            : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        }`}
                      >
                        Search {selectedCourses.length > 0 && `(${selectedCourses.length})`}
                        <i className="fa fa-search ml-2" aria-hidden="true"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer />
    </>
  );
};

export default HomePageComponent;