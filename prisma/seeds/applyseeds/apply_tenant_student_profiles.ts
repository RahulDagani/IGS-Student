// seeds/apply_tenant_student_profiles.js
async function seedStudentProfiles() {
  console.log('Seeding apply_tenant_student_profiles...');

  const studentProfiles = [
    {
      tenant_id: 1,
      user_id: 5, // Assuming we create additional users for students
      student_type: 'DIRECT',
      date_of_birth: new Date('2000-05-15'),
      gender: 'Male',
      nationality: 'Indian',
      passport_number: 'A12345678',
      address: {
        street: '456 Student Ave',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        postal_code: '400001'
      },
      emergency_contact: {
        name: 'Parent Name',
        relationship: 'Father',
        phone: '+912345678901',
        email: 'parent@email.com'
      },
      education_background: [
        {
          degree: 'Bachelor of Science',
          institution: 'University of Mumbai',
          year: 2022,
          gpa: 3.5
        }
      ],
      test_scores: {
        ielts: 7.5,
        gre: 320
      },
      preferred_countries: ['UK', 'USA', 'Canada'],
      preferred_levels: ['Masters', 'PhD'],
      preferred_disciplines: ['Computer Science', 'Data Science'],
      budget_range: {
        min: 20000,
        max: 40000,
        currency: 'USD'
      }
    }
  ];

  for (const profile of studentProfiles) {
    await prisma.apply_tenant_student_profiles.upsert({
      where: { user_id: profile.user_id },
      update: profile,
      create: profile
    });
  }

  console.log('✓ apply_tenant_student_profiles seeded successfully');
}