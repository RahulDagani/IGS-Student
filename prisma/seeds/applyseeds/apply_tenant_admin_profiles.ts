// seeds/apply_tenant_admin_profiles.js
async function seedAdminProfiles() {
  console.log('Seeding apply_tenant_admin_profiles...');

  const adminProfiles = [
    {
      tenant_id: 1,
      user_id: 1,
      is_primary_admin: true,
      can_manage_billing: true,
      can_manage_users: true,
      can_manage_settings: true
    },
    {
      tenant_id: 2,
      user_id: 4,
      is_primary_admin: true,
      can_manage_billing: true,
      can_manage_users: true,
      can_manage_settings: true
    }
  ];

  for (const profile of adminProfiles) {
    await prisma.apply_tenant_admin_profiles.upsert({
      where: { user_id: profile.user_id },
      update: profile,
      create: profile
    });
  }

  console.log('✓ apply_tenant_admin_profiles seeded successfully');
}