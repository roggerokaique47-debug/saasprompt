import db from "./client";
import { users } from "./schema/users";
import { purchases } from "./schema/purchases";
import { workflows } from "./schema/workflows";
import { usageLogs } from "./schema/usage_logs";
import { eq, like } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

import { organizations } from "./schema/organizations";

async function main() {
  console.log("Seeding analytics for test user...");
  
  let testUsers = await db.select().from(users).where(like(users.email, "%test.com"));
  
  if (testUsers.length === 0) {
    console.log("No test user found matching '%test.com'. Creating a dummy user 'admintes@test.com'...");
    await db.insert(users).values({
      id: uuidv4(),
      email: "admintes@test.com",
      name: "Admin Test",
    });
    testUsers = await db.select().from(users).where(like(users.email, "%test.com"));
  }

  const user = testUsers[0];
  console.log(`Found user: ${user.email} (${user.id})`);

  let testOrgs = await db.select().from(organizations).where(eq(organizations.ownerId, user.id));
  if (testOrgs.length === 0) {
    await db.insert(organizations).values({
      id: uuidv4(),
      name: "Test Org",
      slug: "test-org-" + uuidv4().slice(0, 8),
      ownerId: user.id,
      credits: 100,
    });
    testOrgs = await db.select().from(organizations).where(eq(organizations.ownerId, user.id));
  }
  const org = testOrgs[0];

  // Clear existing analytics data for this user to avoid duplicates
  await db.delete(purchases).where(eq(purchases.userId, user.id));
  await db.delete(workflows).where(eq(workflows.authorId, user.id));
  await db.delete(usageLogs).where(eq(usageLogs.organizationId, org.id));

  // Generate Purchases for MRR (last 12 months)
  console.log("Inserting purchases...");
  const purchaseData = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 15);
    // Base revenue that grows over time
    const baseRevenue = 12000 + ((12 - i) * 1500); // from ~12k to ~30k
    // Add 3-5 purchases per month
    for (let j = 0; j < 4; j++) {
      purchaseData.push({
        id: uuidv4(),
        userId: user.id,
        organizationId: org.id,
        contentType: 'subscription',
        contentId: uuidv4(),
        amountCents: Math.floor((baseRevenue / 4) * 100) + Math.floor(Math.random() * 5000),
        platformFeeCents: 1000,
        creatorEarningsCents: 0,
        status: 'completed',
        createdAt: monthDate,
      });
    }
  }
  await db.insert(purchases).values(purchaseData);

  // Generate Workflows (Active Workspaces)
  console.log("Inserting workflows...");
  const workflowData = [];
  for (let i = 0; i < 18; i++) {
    workflowData.push({
      id: uuidv4(),
      title: `Workspace ${i + 1}`,
      slug: `workspace-${i + 1}-${uuidv4().slice(0, 8)}`,
      workflowJson: {},
      isActive: i < 15, // 15 active, 3 inactive
      authorId: user.id,
      organizationId: org.id,
      createdAt: new Date(now.getTime() - Math.random() * 10000000000),
      updatedAt: new Date(),
    });
  }
  await db.insert(workflows).values(workflowData);

  // Generate Usage Logs (API Calls)
  console.log("Inserting usage logs...");
  const usageData = [];
  for (let i = 0; i < 30; i++) {
    usageData.push({
      id: uuidv4(),
      organizationId: org.id,
      action: 'api_request',
      creditsSpent: Math.floor(Math.random() * 50) + 1,
      keyType: 'system',
      createdAt: new Date(now.getTime() - Math.random() * 2592000000), // last 30 days
    });
  }
  await db.insert(usageLogs).values(usageData);

  console.log("Analytics seeded successfully!");
  process.exit(0);
}

main().catch(console.error);
