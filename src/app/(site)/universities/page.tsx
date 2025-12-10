import { Suspense } from 'react';
import UniversitySearchWrapper from './UniversitySearchWrapper';

// Sample data to pass to the component
const sampleUniversityData = {
  universities: [
    {
      logo: 'stanford.png',
      university: 'Stanford University',
      address: '450 Serra Mall, Stanford, CA 94305, USA',
      description: 'Stanford University is one of the world\'s leading teaching and research institutions. It is located in the heart of Silicon Valley, with a beautiful campus spread over 8,180 acres.',
      video_link: 'https://www.youtube.com/watch?v=example1',
      brocher: 'stanford-brochure.pdf',
      tution_url: 'https://www.stanford.edu/tuition',
      kind_of_partners: 'Research Partners, Industry Collaborators',
      type_of_university: 'Private',
      university_slug: 'stanford-university'
    },
    {
      logo: 'mit.png',
      university: 'Massachusetts Institute of Technology',
      address: '77 Massachusetts Ave, Cambridge, MA 02139, USA',
      description: 'MIT is a world-class educational institution where teaching and research are guided by a mission to advance knowledge and educate students in science, technology, and other areas.',
      video_link: 'https://www.youtube.com/watch?v=example2',
      brocher: 'mit-brochure.pdf',
      tution_url: 'https://www.mit.edu/tuition',
      kind_of_partners: 'Corporate Sponsors, Government Agencies',
      type_of_university: 'Private',
      university_slug: 'massachusetts-institute-of-technology'
    },
    {
      logo: 'harvard.png',
      university: 'Harvard University',
      address: 'Cambridge, MA 02138, USA',
      description: 'Harvard University is a private Ivy League research university in Cambridge, Massachusetts, established in 1636. It is the oldest institution of higher learning in the United States.',
      video_link: 'https://www.youtube.com/watch?v=example3',
      brocher: 'harvard-brochure.pdf',
      tution_url: 'https://www.harvard.edu/tuition',
      kind_of_partners: 'Alumni Network, Research Institutes',
      type_of_university: 'Private',
      university_slug: 'harvard-university'
    },
    {
      logo: 'oxford.png',
      university: 'University of Oxford',
      address: 'Oxford OX1 2JD, United Kingdom',
      description: 'The University of Oxford is a collegiate research university in Oxford, England. There is evidence of teaching as early as 1096, making it the oldest university in the English-speaking world.',
      video_link: 'https://www.youtube.com/watch?v=example4',
      brocher: 'oxford-brochure.pdf',
      tution_url: 'https://www.ox.ac.uk/tuition',
      kind_of_partners: 'International Collaborators',
      type_of_university: 'Public',
      university_slug: 'university-of-oxford'
    },
    {
      logo: 'cambridge.png',
      university: 'University of Cambridge',
      address: 'The Old Schools, Trinity Ln, Cambridge CB2 1TN, UK',
      description: 'The University of Cambridge is a collegiate public research university in Cambridge, England. Founded in 1209, Cambridge is the world\'s third-oldest surviving university.',
      video_link: 'https://www.youtube.com/watch?v=example5',
      brocher: 'cambridge-brochure.pdf',
      tution_url: 'https://www.cam.ac.uk/tuition',
      kind_of_partners: 'Research Centers, Corporate Partners',
      type_of_university: 'Public',
      university_slug: 'university-of-cambridge'
    },
    {
      logo: 'toronto.png',
      university: 'University of Toronto',
      address: '27 King\'s College Cir, Toronto, ON M5S, Canada',
      description: 'The University of Toronto is a public research university in Toronto, Ontario, Canada. It was founded by royal charter in 1827 and is Canada\'s leading institution of learning.',
      video_link: 'https://www.youtube.com/watch?v=example6',
      brocher: 'toronto-brochure.pdf',
      tution_url: 'https://www.utoronto.ca/tuition',
      kind_of_partners: 'Canadian Industries, Research Networks',
      type_of_university: 'Public',
      university_slug: 'university-of-toronto'
    },
    {
      logo: 'melbourne.png',
      university: 'University of Melbourne',
      address: 'Parkville VIC 3010, Australia',
      description: 'The University of Melbourne is a public research university located in Melbourne, Australia. Founded in 1853, it is Australia\'s second oldest university and the oldest in Victoria.',
      video_link: 'https://www.youtube.com/watch?v=example7',
      brocher: 'melbourne-brochure.pdf',
      tution_url: 'https://www.unimelb.edu.au/tuition',
      kind_of_partners: 'Australian Research Council',
      type_of_university: 'Public',
      university_slug: 'university-of-melbourne'
    },
    {
      logo: 'ethzurich.png',
      university: 'ETH Zurich',
      address: 'Rämistrasse 101, 8092 Zürich, Switzerland',
      description: 'ETH Zurich is a public research university in the city of Zürich, Switzerland. It is consistently ranked among the top universities in the world, particularly in STEM fields.',
      video_link: 'https://www.youtube.com/watch?v=example8',
      brocher: 'ethz-brochure.pdf',
      tution_url: 'https://www.ethz.ch/tuition',
      kind_of_partners: 'Swiss Industries, European Union',
      type_of_university: 'Public',
      university_slug: 'eth-zurich'
    },
    {
      logo: 'nus.png',
      university: 'National University of Singapore',
      address: '21 Lower Kent Ridge Rd, Singapore 119077',
      description: 'The National University of Singapore is Singapore\'s flagship university, which offers a global approach to education and research, with a focus on Asian perspectives.',
      video_link: 'https://www.youtube.com/watch?v=example9',
      brocher: 'nus-brochure.pdf',
      tution_url: 'https://www.nus.edu.sg/tuition',
      kind_of_partners: 'Singapore Government, Asian Partners',
      type_of_university: 'Public',
      university_slug: 'national-university-of-singapore'
    },
    {
      logo: 'tsinghua.png',
      university: 'Tsinghua University',
      address: '30 Shuangqing Rd, Haidian District, Beijing, China',
      description: 'Tsinghua University is a major public research university in Beijing, China. The university is consistently ranked as one of the top academic institutions in China.',
      video_link: 'https://www.youtube.com/watch?v=example10',
      brocher: 'tsinghua-brochure.pdf',
      tution_url: 'https://www.tsinghua.edu.cn/tuition',
      kind_of_partners: 'Chinese Industries, International Collaborators',
      type_of_university: 'Public',
      university_slug: 'tsinghua-university'
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
    },
    {
      id: 3,
      slug: 'research-breakthrough-ai',
      title: 'Research Breakthrough in Artificial Intelligence',
      image_url: '/news/research.jpg',
      url: ''
    },
    {
      id: 4,
      slug: 'student-achievements-2023',
      title: 'Student Achievements and Awards 2023',
      image_url: '/news/achievements.jpg',
      url: ''
    }
  ],
  webinars: [
    {
      id: 1,
      slug: 'study-abroad-experience',
      title: 'Study Abroad: A Student\'s Experience at Harvard',
      image_url: '/webinars/harvard-student.jpg',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 2,
      slug: 'career-opportunities-after-graduation',
      title: 'Career Opportunities After Graduation from Top Universities',
      image_url: '/webinars/career.jpg',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 3,
      slug: 'campus-life-oxford',
      title: 'Campus Life at University of Oxford',
      image_url: '/webinars/oxford-life.jpg',
      url: ''
    },
    {
      id: 4,
      slug: 'research-opportunities-mit',
      title: 'Research Opportunities at MIT',
      image_url: '/webinars/mit-research.jpg',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ],
  disciplines: [
    { discipline_slug: 'computer-science', discipline: 'Computer Science' },
    { discipline_slug: 'business-administration', discipline: 'Business Administration' },
    { discipline_slug: 'engineering', discipline: 'Engineering' },
    { discipline_slug: 'medicine', discipline: 'Medicine' },
    { discipline_slug: 'law', discipline: 'Law' },
    { discipline_slug: 'architecture', discipline: 'Architecture' },
    { discipline_slug: 'psychology', discipline: 'Psychology' },
    { discipline_slug: 'economics', discipline: 'Economics' },
    { discipline_slug: 'biology', discipline: 'Biology' },
    { discipline_slug: 'mathematics', discipline: 'Mathematics' },
    { discipline_slug: 'physics', discipline: 'Physics' },
    { discipline_slug: 'chemistry', discipline: 'Chemistry' }
  ],
  courses: [
    { course_slug: 'computer-science-engineering', course: 'Computer Science and Engineering' },
    { course_slug: 'software-engineering', course: 'Software Engineering' },
    { course_slug: 'data-science', course: 'Data Science' },
    { course_slug: 'artificial-intelligence', course: 'Artificial Intelligence' },
    { course_slug: 'machine-learning', course: 'Machine Learning' },
    { course_slug: 'cybersecurity', course: 'Cybersecurity' },
    { course_slug: 'cloud-computing', course: 'Cloud Computing' },
    { course_slug: 'mba', course: 'Master of Business Administration' },
    { course_slug: 'finance', course: 'Finance' },
    { course_slug: 'marketing', course: 'Marketing' },
    { course_slug: 'mechanical-engineering', course: 'Mechanical Engineering' },
    { course_slug: 'civil-engineering', course: 'Civil Engineering' },
    { course_slug: 'electrical-engineering', course: 'Electrical Engineering' },
    { course_slug: 'biotechnology', course: 'Biotechnology' },
    { course_slug: 'pharmacy', course: 'Pharmacy' }
  ],
  countries: [
    { country_slug: 'united-states', country: 'United States' },
    { country_slug: 'united-kingdom', country: 'United Kingdom' },
    { country_slug: 'canada', country: 'Canada' },
    { country_slug: 'australia', country: 'Australia' },
    { country_slug: 'germany', country: 'Germany' },
    { country_slug: 'france', country: 'France' },
    { country_slug: 'singapore', country: 'Singapore' },
    { country_slug: 'switzerland', country: 'Switzerland' },
    { country_slug: 'japan', country: 'Japan' },
    { country_slug: 'china', country: 'China' },
    { country_slug: 'india', country: 'India' },
    { country_slug: 'netherlands', country: 'Netherlands' }
  ],
  states: [
    { state_slug: 'california', state: 'California' },
    { state_slug: 'new-york', state: 'New York' },
    { state_slug: 'massachusetts', state: 'Massachusetts' },
    { state_slug: 'texas', state: 'Texas' },
    { state_slug: 'illinois', state: 'Illinois' },
    { state_slug: 'ontario', state: 'Ontario' },
    { state_slug: 'british-columbia', state: 'British Columbia' },
    { state_slug: 'victoria', state: 'Victoria' },
    { state_slug: 'new-south-wales', state: 'New South Wales' },
    { state_slug: 'england', state: 'England' },
    { state_slug: 'scotland', state: 'Scotland' },
    { state_slug: 'wales', state: 'Wales' }
  ],
  intakes: [
    { intake: 'Fall 2024' },
    { intake: 'Spring 2024' },
    { intake: 'Summer 2024' },
    { intake: 'Fall 2025' },
    { intake: 'Spring 2025' }
  ],
  current_page: 1,
  total_pages: 2,
  limit: 10
};

// Loading component
function UniversitySearchLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 animate-spin mb-4">
          <i className="ri-loader-line ri-2x text-blue-600"></i>
        </div>
        <p className="text-gray-600">Loading universities...</p>
      </div>
    </div>
  );
}

export default function UniversitiesPage() {
  return (
    <Suspense fallback={<UniversitySearchLoading />}>
      <UniversitySearchWrapper initialData={sampleUniversityData} />
    </Suspense>
  );
}