// seeds/apply_domains.js
async function seedDomains() {
  console.log('Seeding apply_domains...');

  const domains = [
    {
      tenant_id: 1,
      domain: 'apply.globaleducationhub.com',
      type: 'CUSTOM',
      status: 'ACTIVE',
      is_primary: true,
      verified_at: new Date()
    },
    {
      tenant_id: 1,
      domain: 'globaledu.applyplatform.com',
      type: 'SUBDOMAIN',
      status: 'ACTIVE',
      is_primary: false,
      verified_at: new Date()
    },
    {
      tenant_id: 2,
      domain: 'studentconnect.applyplatform.com',
      type: 'SUBDOMAIN',
      status: 'ACTIVE',
      is_primary: true,
      verified_at: new Date()
    }
  ];

  for (const domain of domains) {
    await prisma.apply_domains.upsert({
      where: { domain: domain.domain },
      update: domain,
      create: domain
    });
  }

  console.log('✓ apply_domains seeded successfully');
}