import { db } from './packages/database/src';
import { workflows } from './packages/database/src/schema/workflows';
import { eq, desc } from 'drizzle-orm';
import 'dotenv/config';

async function test() {
  try {
    const publicWorkflows = await db.select()
      .from(workflows)
      .where(eq(workflows.isPublished, true))
      .orderBy(desc(workflows.downloads));
    console.log(`Success! Fetched ${publicWorkflows.length} workflows.`);
  } catch (error) {
    console.error('Error fetching workflows:', error);
  }
}

test();
