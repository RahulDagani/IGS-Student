

// seeds/apply_tenant_courses.js
async function seedCourses() {
  console.log('Seeding apply_tenant_courses...');

  const courses = [
    {
      tenant_id: 1,
      university_id: 1,
      name: 'MSc Computer Science',
      slug: 'msc-computer-science',
      study_level: 'Masters',
      discipline: 'Computer Science',
      duration: '12 months',
      tuition_fee: {
        home: 15000,
        international: 25000,
        currency: 'GBP'
      },
      intake_dates: ['2024-09-01', '2025-01-15'],
      requirements: {
        degree: 'Bachelor in Computer Science or related field',
        gpa: 3.0,
        english_test: 'IELTS 6.5 or equivalent',
        prerequisites: ['Programming fundamentals', 'Data structures']
      },
      description: 'Advanced computer science program focusing on modern technologies.',
      is_active: true
    },
    {
      tenant_id: 1,
      university_id: 2,
      name: 'MBA Business Administration',
      slug: 'mba-business-administration',
      study_level: 'Masters',
      discipline: 'Business Administration',
      duration: '24 months',
      tuition_fee: {
        home: 35000,
        international: 65000,
        currency: 'CAD'
      },
      intake_dates: ['2024-09-01'],
      requirements: {
        degree: 'Bachelor degree',
        gpa: 3.2,
        work_experience: '2 years minimum',
        english_test: 'IELTS 7.0 or equivalent'
      },
      description: 'Comprehensive MBA program for future business leaders.',
      is_active: true
    }
  ];

  for (const course of courses) {
    await prisma.apply_tenant_courses.upsert({
      where: {
        tenant_id_university_id_slug: {
          tenant_id: course.tenant_id,
          university_id: course.university_id,
          slug: course.slug
        }
      },
      update: course,
      create: course
    });
  }

  console.log('✓ apply_tenant_courses seeded successfully');
}