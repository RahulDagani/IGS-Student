// seeds/apply_tenant_staff_profiles.js
async function seedStaffProfiles() {
  console.log('Seeding apply_tenant_staff_profiles...');

  const staffProfiles = [
    {
      tenant_id: 1,
      user_id: 2,
      department: 'Admissions',
      position: 'Admissions Officer',
      notes: 'Handles UK applications'
    }
  ];

  for (const profile of staffProfiles) {
    await prisma.apply_tenant_staff_profiles.upsert({
      where: { user_id: profile.user_id },
      update: profile,
      create: profile
    });
  }

  console.log('✓ apply_tenant_staff_profiles seeded successfully');
}