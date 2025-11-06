// seeds/apply_tenants.js
async function seedTenants() {
  console.log('Seeding apply_tenants...');

  const tenants = [
    {
      name: 'Global Education Hub',
      company_name: 'Global Education Hub Ltd',
      subdomain: 'globaledu',
      custom_domain: 'apply.globaleducationhub.com',
      email: 'admin@globaleducationhub.com',
      password_hash: '$2b$10$examplehashedpassword123456789012',
      plan_id: 2, // Professional plan
      status: 'ACTIVE',
      trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      subscription_ends_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      is_active: true,
      settings: {
        theme: 'blue',
        language: 'en',
        timezone: 'UTC',
        date_format: 'MM/DD/YYYY'
      }
    },
    {
      name: 'Student Connect',
      company_name: 'Student Connect Agency',
      subdomain: 'studentconnect',
      email: 'info@studentconnect.com',
      password_hash: '$2b$10$examplehashedpassword123456789012',
      plan_id: 1, // Starter plan
      status: 'ACTIVE',
      trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      is_active: true,
      settings: {
        theme: 'green',
        language: 'en',
        timezone: 'America/New_York',
        date_format: 'DD/MM/YYYY'
      }
    }
  ];

  for (const tenant of tenants) {
    await prisma.apply_tenants.upsert({
      where: { subdomain: tenant.subdomain },
      update: tenant,
      create: tenant
    });
  }

  console.log('✓ apply_tenants seeded successfully');
}