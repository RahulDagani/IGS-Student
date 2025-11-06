// seeds/apply_plans.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedPlans() {
  console.log('Seeding apply_plans...');

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small agencies just getting started',
      price_monthly: 49,
      price_yearly: 490,
      features: {
        student_portal: true,
        agent_portal: false,
        max_students: 100,
        max_agents: 3,
        support: 'email',
        storage_gb: 5
      },
      limits: {
        applications_per_month: 50,
        universities: 10,
        courses: 100,
        staff_users: 2
      },
      is_active: true,
      is_default: false,
      sort_order: 1
    },
    {
      name: 'Professional',
      description: 'Ideal for growing education agencies',
      price_monthly: 99,
      price_yearly: 990,
      features: {
        student_portal: true,
        agent_portal: true,
        max_students: 500,
        max_agents: 10,
        support: 'priority',
        storage_gb: 20
      },
      limits: {
        applications_per_month: 200,
        universities: 50,
        courses: 500,
        staff_users: 5
      },
      is_active: true,
      is_default: true,
      sort_order: 2
    },
    {
      name: 'Enterprise',
      description: 'For large education consultancies',
      price_monthly: 199,
      price_yearly: 1990,
      features: {
        student_portal: true,
        agent_portal: true,
        max_students: 2000,
        max_agents: 50,
        support: 'dedicated',
        storage_gb: 100
      },
      limits: {
        applications_per_month: 1000,
        universities: 200,
        courses: 2000,
        staff_users: 20
      },
      is_active: true,
      is_default: false,
      sort_order: 3
    }
  ];

  for (const plan of plans) {
    await prisma.apply_plans.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan
    });
  }

  console.log('✓ apply_plans seeded successfully');
}