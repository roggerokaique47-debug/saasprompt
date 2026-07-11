import { NextResponse } from 'next/server';
import db from '@prompthub/database/src/client';
import { workflowTemplates } from '@prompthub/database/src/schema/templates';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { users } from '@prompthub/database/src/schema/users';
import { createClient } from '@/lib/supabase/server';
import { eq, sql } from 'drizzle-orm';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    const { id: templateId } = await params;

    // Buscar o template
    const templateRows = await db
      .select()
      .from(workflowTemplates)
      .where(eq(workflowTemplates.id, templateId))
      .limit(1);

    if (templateRows.length === 0) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }
    const template = templateRows[0];

    // Buscar dados do usuário para achar a organizationId
    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const userRecord = userRows[0];

    const orgId = userRecord.organizationId;
    if (!orgId) {
      return NextResponse.json(
        { error: 'User or Organization not found' },
        { status: 400 }
      );
    }

    // Inserir novo Workflow
    const title = `${template.name} (Fork)`;
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

    const [newWorkflow] = await db
      .insert(workflows)
      .values({
        title,
        slug,
        description: template.description,
        workflowJson: template.workflowJson,
        authorId: userId,
        organizationId: orgId,
        originalTemplateId: template.id,
        isPublished: false,
      })
      .returning();

    // Incrementar o forkCount
    await db
      .update(workflowTemplates)
      .set({ forkCount: sql`${workflowTemplates.forkCount} + 1` })
      .where(eq(workflowTemplates.id, template.id));

    return NextResponse.json({
      message: 'Template forked successfully',
      workflowId: newWorkflow.id,
    });
  } catch (error: any) {
    console.error('Error forking template:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
