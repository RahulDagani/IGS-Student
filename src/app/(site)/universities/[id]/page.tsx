// app/filter/university/[slug]/page.tsx
import UniversityCourseComponent from './UniversityCourseComponent';

const sampleUniversityCourseData = {
  university_courses: [
    {
      logo: 'stanford.png',
      university: 'Stanford University',
      address: '450 Serra Mall, Stanford, CA 94305, USA',
      description: 'Stanford University is one of the world\'s leading teaching and research institutions.',
      video_link: 'https://www.youtube.com/watch?v=example1',
      brocher: 'stanford-brochure.pdf',
      tution_url: 'https://www.stanford.edu/tuition',
      kind_of_partners: 'Research Partners, Industry Collaborators',
      type_of_university: 'Private',
      university_slug: 'stanford-university',
      course_id: 1,
      course: 'Computer Science Master\'s Program',
      university_name: 'Stanford University',
      country: 'USA',
      study_level: 'Master\'s Degree',
      application_fee: '$90',
      ielts_score: '7.5',
      toefl_score: '100',
      gre_score: '320',
      gpa_score: '3.5'
    },
    {
      logo: 'stanford.png',
      university: 'Stanford University',
      address: '450 Serra Mall, Stanford, CA 94305, USA',
      description: 'Stanford University is one of the world\'s leading teaching and research institutions.',
      video_link: 'https://www.youtube.com/watch?v=example1',
      brocher: 'stanford-brochure.pdf',
      tution_url: 'https://www.stanford.edu/tuition',
      kind_of_partners: 'Research Partners, Industry Collaborators',
      type_of_university: 'Private',
      university_slug: 'stanford-university',
      course_id: 2,
      course: 'MBA Program',
      university_name: 'Stanford University',
      country: 'USA',
      study_level: 'Master\'s Degree',
      application_fee: '$275',
      gmat_score: '730',
      toefl_score: '105',
      gpa_score: '3.7'
    },
    {
      logo: 'stanford.png',
      university: 'Stanford University',
      address: '450 Serra Mall, Stanford, CA 94305, USA',
      description: 'Stanford University is one of the world\'s leading teaching and research institutions.',
      video_link: 'https://www.youtube.com/watch?v=example1',
      brocher: 'stanford-brochure.pdf',
      tution_url: 'https://www.stanford.edu/tuition',
      kind_of_partners: 'Research Partners, Industry Collaborators',
      type_of_university: 'Private',
      university_slug: 'stanford-university',
      course_id: 3,
      course: 'Electrical Engineering PhD',
      university_name: 'Stanford University',
      country: 'USA',
      study_level: 'PhD',
      application_fee: '$125',
      gre_score: '325',
      toefl_score: '100',
      gpa_score: '3.8'
    },
    {
      logo: 'stanford.png',
      university: 'Stanford University',
      address: '450 Serra Mall, Stanford, CA 94305, USA',
      description: 'Stanford University is one of the world\'s leading teaching and research institutions.',
      video_link: 'https://www.youtube.com/watch?v=example1',
      brocher: 'stanford-brochure.pdf',
      tution_url: 'https://www.stanford.edu/tuition',
      kind_of_partners: 'Research Partners, Industry Collaborators',
      type_of_university: 'Private',
      university_slug: 'stanford-university',
      course_id: 4,
      course: 'Bachelor of Computer Science',
      university_name: 'Stanford University',
      country: 'USA',
      study_level: 'Bachelor\'s Degree',
      application_fee: '$90',
      sat_score: '1500',
      act_score: '34',
      toefl_score: '100'
    }
  ],
  news: [
    {
      id: 1,
      slug: 'new-scholarship-program-2024',
      title: 'New Scholarship Program for International Students 2024',
      image_url: '/news/scholarship.jpg',
      url: ''
    },
    {
      id: 2,
      slug: 'campus-reopening-update',
      title: 'Campus Reopening Update for Fall Semester',
      image_url: '/news/campus.jpg',
      url: ''
    }
  ],
  webinars: [
    {
      id: 1,
      slug: 'study-abroad-experience',
      title: 'Study Abroad: A Student\'s Experience at Stanford',
      image_url: '/webinars/stanford-student.jpg',
      url: 'https://www.youtube.com/embed/example_video'
    },
    {
      id: 2,
      slug: 'career-opportunities-after-graduation',
      title: 'Career Opportunities After Graduation',
      image_url: '/webinars/career.jpg',
      url: ''
    }
  ],
  study_levels: [
    { studylevel_slug: 'bachelors', study_level: 'Bachelor\'s Degree' },
    { studylevel_slug: 'masters', study_level: 'Master\'s Degree' },
    { studylevel_slug: 'phd', study_level: 'PhD' },
    { studylevel_slug: 'diploma', study_level: 'Diploma' }
  ],
  disciplines: [
    { discipline_slug: 'computer-science', discipline: 'Computer Science' },
    { discipline_slug: 'business-administration', discipline: 'Business Administration' },
    { discipline_slug: 'engineering', discipline: 'Engineering' },
    { discipline_slug: 'medicine', discipline: 'Medicine' }
  ]
};

export default function UniversityCoursesPage() {
  // Fetch data based on slug
  const universityData = {
    // ... your data here
  };
  
  return <UniversityCourseComponent initialData={sampleUniversityCourseData} />;
}