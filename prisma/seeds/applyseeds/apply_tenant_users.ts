// seeds/apply_tenant_users.js
async function seedTenantUsers() {
  console.log('Seeding apply_tenant_users...');

  const users = [
    // Tenant 1 - Global Education Hub
    {
      tenant_id: 1,
      email: 'admin@globaleducationhub.com',
      password_hash: '$2b$10$examplehashedpassword123456789012',
      name: 'John Smith',
      phone: '+1234567890',
      role: 'ADMIN',
      is_active: true,
      is_email_verified: true
    },
    {
      tenant_id: 1,
      email: 'staff1@globaleducationhub.com',
      password_hash: '$2b$10$examplehashedpassword123456789012',
      name: 'Sarah Johnson',
      phone: '+1234567891',
      role: 'STAFF',
      is_active: true,
      is_email_verified: true
    },
    {
      tenant_id: 1,
      email: 'agent1@globaleducationhub.com',
      password_hash: '$2b$10$examplehashedpassword123456789012',
      name: 'Mike Wilson',
      phone: '+1234567892',
      role: 'AGENT',
      is_active: true,
      is_email_verified: true
    },
    // Tenant 2 - Student Connect
    {
      tenant_id: 2,
      email: 'admin@studentconnect.com',
      password_hash: '$2b$10$examplehashedpassword123456789012',
      name: 'Emma Davis',
      phone: '+1234567893',
      role: 'ADMIN',
      is_active: true,
      is_email_verified: true
    }
  ];

  for (const user of users) {
    await prisma.apply_tenant_users.upsert({
      where: {
        tenant_id_email: {
          tenant_id: user.tenant_id,
          email: user.email
        }
      },
      update: user,
      create: user
    });
  }

  console.log('✓ apply_tenant_users seeded successfully');
}