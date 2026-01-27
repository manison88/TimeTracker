import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create demo user
  const hashedPassword = await hash("password123", 12);
  
  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo User",
      password: hashedPassword,
    },
  });

  console.log("Created user:", user.email);

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      userId: user.id,
      name: "E-commerce Website",
      description: "Building an online store with payment processing",
    },
  });

  const project2 = await prisma.project.create({
    data: {
      userId: user.id,
      name: "Mobile App MVP",
      description: "React Native app for fitness tracking",
    },
  });

  const project3 = await prisma.project.create({
    data: {
      userId: user.id,
      name: "API Integration",
      description: "Integrating third-party APIs for a client",
    },
  });

  console.log("Created projects:", project1.name, project2.name, project3.name);

  // Create features for project 1
  const feature1_1 = await prisma.feature.create({
    data: {
      projectId: project1.id,
      name: "User Authentication",
      description: "Login, signup, password reset",
      status: "completed",
    },
  });

  const feature1_2 = await prisma.feature.create({
    data: {
      projectId: project1.id,
      name: "Product Catalog",
      description: "Product listing, search, filtering",
      status: "active",
    },
  });

  const feature1_3 = await prisma.feature.create({
    data: {
      projectId: project1.id,
      name: "Shopping Cart",
      description: "Add to cart, quantity management",
      status: "active",
    },
  });

  const feature1_4 = await prisma.feature.create({
    data: {
      projectId: project1.id,
      name: "Payment Integration",
      description: "Stripe payment processing",
      status: "active",
    },
  });

  // Create features for project 2
  const feature2_1 = await prisma.feature.create({
    data: {
      projectId: project2.id,
      name: "Workout Tracking",
      description: "Log exercises and sets",
      status: "active",
    },
  });

  const feature2_2 = await prisma.feature.create({
    data: {
      projectId: project2.id,
      name: "Progress Charts",
      description: "Visualize fitness progress",
      status: "active",
    },
  });

  // Create features for project 3
  const feature3_1 = await prisma.feature.create({
    data: {
      projectId: project3.id,
      name: "Stripe API",
      description: "Payment processing integration",
      status: "completed",
    },
  });

  const feature3_2 = await prisma.feature.create({
    data: {
      projectId: project3.id,
      name: "SendGrid API",
      description: "Email notification system",
      status: "active",
    },
  });

  console.log("Created features");

  // Create time entries (past entries with durations)
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);

  // Time entries for feature 1_1 (User Auth - completed)
  await prisma.timeEntry.createMany({
    data: [
      {
        featureId: feature1_1.id,
        userId: user.id,
        startTime: fourDaysAgo,
        endTime: new Date(fourDaysAgo.getTime() + 2 * 60 * 60 * 1000),
        durationSeconds: 2 * 60 * 60, // 2 hours
        notes: "Set up authentication flow",
      },
      {
        featureId: feature1_1.id,
        userId: user.id,
        startTime: threeDaysAgo,
        endTime: new Date(threeDaysAgo.getTime() + 3 * 60 * 60 * 1000),
        durationSeconds: 3 * 60 * 60, // 3 hours
        notes: "Implemented password reset",
      },
      {
        featureId: feature1_1.id,
        userId: user.id,
        startTime: twoDaysAgo,
        endTime: new Date(twoDaysAgo.getTime() + 1.5 * 60 * 60 * 1000),
        durationSeconds: 1.5 * 60 * 60, // 1.5 hours
        notes: "Testing and bug fixes",
      },
    ],
  });

  // Time entries for feature 1_2 (Product Catalog)
  await prisma.timeEntry.createMany({
    data: [
      {
        featureId: feature1_2.id,
        userId: user.id,
        startTime: twoDaysAgo,
        endTime: new Date(twoDaysAgo.getTime() + 4 * 60 * 60 * 1000),
        durationSeconds: 4 * 60 * 60, // 4 hours
        notes: "Product listing page",
      },
      {
        featureId: feature1_2.id,
        userId: user.id,
        startTime: yesterday,
        endTime: new Date(yesterday.getTime() + 2.5 * 60 * 60 * 1000),
        durationSeconds: 2.5 * 60 * 60, // 2.5 hours
        notes: "Search functionality",
      },
    ],
  });

  // Time entries for feature 1_3 (Shopping Cart)
  await prisma.timeEntry.createMany({
    data: [
      {
        featureId: feature1_3.id,
        userId: user.id,
        startTime: yesterday,
        endTime: new Date(yesterday.getTime() + 3 * 60 * 60 * 1000),
        durationSeconds: 3 * 60 * 60, // 3 hours
        notes: "Cart component and state",
      },
    ],
  });

  // Time entries for project 2 features
  await prisma.timeEntry.createMany({
    data: [
      {
        featureId: feature2_1.id,
        userId: user.id,
        startTime: threeDaysAgo,
        endTime: new Date(threeDaysAgo.getTime() + 5 * 60 * 60 * 1000),
        durationSeconds: 5 * 60 * 60, // 5 hours
        notes: "Exercise logging UI",
      },
      {
        featureId: feature2_1.id,
        userId: user.id,
        startTime: twoDaysAgo,
        endTime: new Date(twoDaysAgo.getTime() + 2 * 60 * 60 * 1000),
        durationSeconds: 2 * 60 * 60, // 2 hours
        notes: "Data persistence",
      },
      {
        featureId: feature2_2.id,
        userId: user.id,
        startTime: yesterday,
        endTime: new Date(yesterday.getTime() + 4 * 60 * 60 * 1000),
        durationSeconds: 4 * 60 * 60, // 4 hours
        notes: "Chart library integration",
      },
    ],
  });

  // Time entries for project 3 features
  await prisma.timeEntry.createMany({
    data: [
      {
        featureId: feature3_1.id,
        userId: user.id,
        startTime: fourDaysAgo,
        endTime: new Date(fourDaysAgo.getTime() + 6 * 60 * 60 * 1000),
        durationSeconds: 6 * 60 * 60, // 6 hours
        notes: "Stripe checkout integration",
      },
      {
        featureId: feature3_1.id,
        userId: user.id,
        startTime: threeDaysAgo,
        endTime: new Date(threeDaysAgo.getTime() + 3 * 60 * 60 * 1000),
        durationSeconds: 3 * 60 * 60, // 3 hours
        notes: "Webhook handling",
      },
      {
        featureId: feature3_2.id,
        userId: user.id,
        startTime: twoDaysAgo,
        endTime: new Date(twoDaysAgo.getTime() + 2 * 60 * 60 * 1000),
        durationSeconds: 2 * 60 * 60, // 2 hours
        notes: "Email templates",
      },
    ],
  });

  console.log("Created time entries");

  console.log("\n✅ Seed completed!");
  console.log("\n📧 Demo account:");
  console.log("   Email: demo@example.com");
  console.log("   Password: password123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
