import { PrismaClient, UserRole, OrganizationStatus, SubscriptionTier, SubscriptionStatus, ApplicationStatus, BlogPostStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Create Categories ───
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "restaurants" },
      update: {},
      create: { name: "Restaurants & Dining", slug: "restaurants", icon: "utensils", sortOrder: 1 },
    }),
    prisma.category.upsert({
      where: { slug: "home-services" },
      update: {},
      create: { name: "Home Services", slug: "home-services", icon: "home", sortOrder: 2 },
    }),
    prisma.category.upsert({
      where: { slug: "health-wellness" },
      update: {},
      create: { name: "Health & Wellness", slug: "health-wellness", icon: "heart", sortOrder: 3 },
    }),
    prisma.category.upsert({
      where: { slug: "automotive" },
      update: {},
      create: { name: "Automotive", slug: "automotive", icon: "car", sortOrder: 4 },
    }),
    prisma.category.upsert({
      where: { slug: "professional-services" },
      update: {},
      create: { name: "Professional Services", slug: "professional-services", icon: "briefcase", sortOrder: 5 },
    }),
    prisma.category.upsert({
      where: { slug: "beauty-spas" },
      update: {},
      create: { name: "Beauty & Spas", slug: "beauty-spas", icon: "sparkles", sortOrder: 6 },
    }),
    prisma.category.upsert({
      where: { slug: "fitness" },
      update: {},
      create: { name: "Fitness & Training", slug: "fitness", icon: "dumbbell", sortOrder: 7 },
    }),
    prisma.category.upsert({
      where: { slug: "retail-shopping" },
      update: {},
      create: { name: "Retail & Shopping", slug: "retail-shopping", icon: "shopping-bag", sortOrder: 8 },
    }),
    prisma.category.upsert({
      where: { slug: "real-estate" },
      update: {},
      create: { name: "Real Estate", slug: "real-estate", icon: "building", sortOrder: 9 },
    }),
    prisma.category.upsert({
      where: { slug: "education" },
      update: {},
      create: { name: "Education & Tutoring", slug: "education", icon: "graduation-cap", sortOrder: 10 },
    }),
  ]);

  // ─── Create Admin User ───
  const adminPassword = await hash("Admin123!@#", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@mindspark.ai" },
    update: {},
    create: {
      email: "admin@mindspark.ai",
      password: adminPassword,
      name: "Platform Admin",
      role: UserRole.SUPER_ADMIN,
      emailVerifiedAt: new Date(),
    },
  });

  // ─── Create Demo Organizations ───
  const org1 = await prisma.organization.upsert({
    where: { slug: "bravos-italian-kitchen" },
    update: {},
    create: {
      name: "Bravo's Italian Kitchen",
      slug: "bravos-italian-kitchen",
      description: "Family-owned Italian restaurant serving authentic handmade pasta, wood-fired pizzas, and imported wines since 1998. Our recipes have been passed down through three generations, bringing the flavors of Tuscany to your table. Whether you're celebrating a special occasion or enjoying a casual weeknight dinner, Bravo's delivers an unforgettable dining experience.",
      shortDescription: "Authentic Italian dining with handmade pasta and wood-fired pizzas since 1998.",
      phone: "(555) 123-4567",
      email: "hello@bravositaliankitchen.com",
      website: "https://bravositaliankitchen.com",
      address: "142 Main Street",
      city: "Austin",
      state: "TX",
      zip: "78701",
      country: "US",
      latitude: 30.2672,
      longitude: -97.7431,
      status: OrganizationStatus.APPROVED,
      featured: true,
      featuredOrder: 1,
      subscriptionTier: SubscriptionTier.PREMIUM,
      approvedAt: new Date(),
      openHours: {
        monday: { open: "11:00", close: "22:00" },
        tuesday: { open: "11:00", close: "22:00" },
        wednesday: { open: "11:00", close: "22:00" },
        thursday: { open: "11:00", close: "23:00" },
        friday: { open: "11:00", close: "23:00" },
        saturday: { open: "10:00", close: "23:00" },
        sunday: { open: "10:00", close: "21:00" },
      },
      socialLinks: {
        facebook: "https://facebook.com/bravositalian",
        instagram: "https://instagram.com/bravositalian",
      },
    },
  });

  const org2 = await prisma.organization.upsert({
    where: { slug: "summit-dental-care" },
    update: {},
    create: {
      name: "Summit Dental Care",
      slug: "summit-dental-care",
      description: "Modern dental practice offering comprehensive oral healthcare including cosmetic dentistry, orthodontics, and emergency care. Our state-of-the-art facility and compassionate team ensure a comfortable experience for patients of all ages. We believe everyone deserves a confident smile.",
      shortDescription: "Comprehensive dental care with cosmetic, orthodontic, and emergency services.",
      phone: "(555) 987-6543",
      email: "info@summitdentalcare.com",
      website: "https://summitdentalcare.com",
      address: "500 Congress Ave, Suite 200",
      city: "Austin",
      state: "TX",
      zip: "78701",
      country: "US",
      latitude: 30.2680,
      longitude: -97.7425,
      status: OrganizationStatus.APPROVED,
      featured: true,
      featuredOrder: 2,
      subscriptionTier: SubscriptionTier.ELITE,
      approvedAt: new Date(),
      openHours: {
        monday: { open: "08:00", close: "17:00" },
        tuesday: { open: "08:00", close: "17:00" },
        wednesday: { open: "08:00", close: "17:00" },
        thursday: { open: "08:00", close: "17:00" },
        friday: { open: "08:00", close: "14:00" },
        saturday: { closed: true },
        sunday: { closed: true },
      },
    },
  });

  const org3 = await prisma.organization.upsert({
    where: { slug: "prestige-auto-works" },
    update: {},
    create: {
      name: "Prestige Auto Works",
      slug: "prestige-auto-works",
      description: "Full-service automotive repair and detailing shop specializing in European luxury vehicles. ASE-certified technicians, genuine OEM parts, and a lifetime warranty on all repairs. From routine maintenance to complex engine work, trust your vehicle to the best.",
      shortDescription: "European luxury vehicle repair & detailing with ASE-certified technicians.",
      phone: "(555) 456-7890",
      email: "service@prestigeautoworks.com",
      website: "https://prestigeautoworks.com",
      address: "8800 Burnet Road",
      city: "Austin",
      state: "TX",
      zip: "78758",
      country: "US",
      latitude: 30.3710,
      longitude: -97.7197,
      status: OrganizationStatus.APPROVED,
      featured: true,
      featuredOrder: 3,
      subscriptionTier: SubscriptionTier.FEATURED,
      approvedAt: new Date(),
    },
  });

  // ─── Link Organizations to Categories ───
  await prisma.organizationCategory.createMany({
    data: [
      { organizationId: org1.id, categoryId: categories[0]!.id },
      { organizationId: org2.id, categoryId: categories[2]!.id },
      { organizationId: org3.id, categoryId: categories[3]!.id },
    ],
    skipDuplicates: true,
  });

  // ─── Create Business Client Users ───
  const clientPassword = await hash("Client123!@#", 12);
  await prisma.user.upsert({
    where: { email: "owner@bravositaliankitchen.com" },
    update: {},
    create: {
      email: "owner@bravositaliankitchen.com",
      password: clientPassword,
      name: "Marco Bravo",
      role: UserRole.BUSINESS_CLIENT,
      organizationId: org1.id,
      emailVerifiedAt: new Date(),
    },
  });

  // ─── Create Demo Subscriptions ───
  await prisma.subscription.upsert({
    where: { organizationId: org1.id },
    update: {},
    create: {
      organizationId: org1.id,
      tier: SubscriptionTier.PREMIUM,
      priceCents: 199700,
      currency: "usd",
      interval: "MONTHLY",
      status: SubscriptionStatus.ACTIVE,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // ─── Create Demo Application ───
  await prisma.application.upsert({
    where: { id: "demo-application-1" },
    update: {},
    create: {
      id: "demo-application-1",
      businessName: "Zen Yoga Studio",
      contactName: "Sarah Chen",
      email: "sarah@zenyogastudio.com",
      phone: "(555) 321-0987",
      website: "https://zenyogastudio.com",
      category: "Health & Wellness",
      message: "We're a boutique yoga studio looking to expand our local reach. We offer 30+ classes per week and private sessions.",
      status: ApplicationStatus.NEW,
    },
  });

  // ─── Create Demo Blog Post ───
  await prisma.blogPost.upsert({
    where: { slug: "top-10-restaurants-austin-2026" },
    update: {},
    create: {
      title: "Top 10 Must-Try Restaurants in Austin for 2026",
      slug: "top-10-restaurants-austin-2026",
      content: "Austin's dining scene continues to evolve with exciting new openings and beloved classics...",
      excerpt: "Discover the best dining experiences Austin has to offer this year.",
      authorId: admin.id,
      status: BlogPostStatus.PUBLISHED,
      featuredOrgId: org1.id,
      seoTitle: "Top 10 Best Restaurants in Austin 2026 | MindSpark.ai",
      seoDescription: "Discover the top 10 must-try restaurants in Austin for 2026. From authentic Italian to modern Tex-Mex, find your next favorite dining spot.",
      publishedAt: new Date(),
    },
  });

  // ─── Site Settings ───
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      siteName: "MindSpark.ai",
      siteTagline: "Discover Premium Local Businesses",
      siteDescription: "MindSpark.ai is the premier directory of vetted, high-quality local businesses. Find trusted professionals, restaurants, and services in your area.",
      contactEmail: "hello@mindspark.ai",
    },
  });

  console.log("✅ Seed complete!");
  console.log(`   → ${categories.length} categories`);
  console.log(`   → 3 organizations`);
  console.log(`   → 2 users (admin + client)`);
  console.log(`   → 1 subscription`);
  console.log(`   → 1 application`);
  console.log(`   → 1 blog post`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
