

// seeds/apply_tenant_universities.js
async function seedUniversities() {
  console.log('Seeding apply_tenant_universities...');

  const universities = [
    {
      tenant_id: 1,
      name: 'University of London',
      slug: 'university-of-london',
      country_code: 'GB',
      state_code: 'ENG',
      city: 'London',
      address: 'Malet St, London WC1E 7HU, UK',
      website: 'https://www.london.ac.uk',
      contact_email: 'international@london.ac.uk',
      phone: '+44 20 7862 8000',
      description: 'A federal university comprising 17 constituent colleges.',
      logo: '/universities/uol-logo.png',
      is_active: true
    },
    {
      tenant_id: 1,
      name: 'University of Toronto',
      slug: 'university-of-toronto',
      country_code: 'CA',
      state_code: 'ON',
      city: 'Toronto',
      address: '27 King\'s College Cir, Toronto, ON M5S, Canada',
      website: 'https://www.utoronto.ca',
      contact_email: 'admissions@utoronto.ca',
      phone: '+1 416-978-2011',
      description: 'Public research university in Toronto, Ontario, Canada.',
      logo: '/universities/utoronto-logo.png',
      is_active: true
    }
  ];

  for (const university of universities) {
    await prisma.apply_tenant_universities.upsert({
      where: {
        tenant_id_slug: {
          tenant_id: university.tenant_id,
          slug: university.slug
        }
      },
      update: university,
      create: university
    });
  }

  console.log('✓ apply_tenant_universities seeded successfully');
}