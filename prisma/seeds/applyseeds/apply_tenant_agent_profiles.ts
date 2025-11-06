// seeds/apply_tenant_agent_profiles.js
async function seedAgentProfiles() {
  console.log('Seeding apply_tenant_agent_profiles...');

  const agentProfiles = [
    {
      tenant_id: 1,
      user_id: 3,
      agency_name: 'Wilson Education Services',
      registration_number: 'REG123456',
      business_address: {
        street: '123 Education St',
        city: 'London',
        country: 'UK',
        postal_code: 'SW1A 1AA'
      },
      contact_person: 'Mike Wilson',
      website: 'https://wilsoneducation.com',
      social_media: {
        facebook: 'wilsoneducation',
        linkedin: 'company/wilsoneducation'
      },
      commission_rate: 15.0,
      is_verified: true,
      total_students: 25,
      successful_applications: 18
    }
  ];

  for (const profile of agentProfiles) {
    await prisma.apply_tenant_agent_profiles.upsert({
      where: { user_id: profile.user_id },
      update: profile,
      create: profile
    });
  }

  console.log('✓ apply_tenant_agent_profiles seeded successfully');
}