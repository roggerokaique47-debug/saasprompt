import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { agents } from '@prompthub/database/src/schema/agents';
import { agentWorkflows } from '@prompthub/database/src/schema/agent_workflows';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { users } from '@prompthub/database/src/schema/users';
import { eq, sql } from 'drizzle-orm';
import { InstallService } from '@prompthub/shared/src/marketplace/install-service';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params;
    
    // Auth Real B2B
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    const [dbUser] = await db
      .select({ organizationId: users.organizationId })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!dbUser?.organizationId) {
      return NextResponse.json({ error: 'Usuário não vinculado a uma organização.' }, { status: 403 });
    }
    
    const organizationId = dbUser.organizationId;

    // Buscar o Agente original
    const [originalAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, agentId))
      .limit(1);

    if (!originalAgent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    if (!originalAgent.isPublished) {
      return NextResponse.json({ error: 'This agent is not available in the marketplace' }, { status: 403 });
    }

    if (originalAgent.isPremium) {
      return NextResponse.json({ error: 'Premium agents require payment validation (Not implemented yet)' }, { status: 402 });
    }

    // Inserir clone do Agente no banco
    const [clonedAgent] = await db.insert(agents).values({
      title: `${originalAgent.title} (Clone)`,
      slug: `${originalAgent.slug}-clone-${Date.now()}`,
      description: originalAgent.description,
      content: originalAgent.content,
      platform: originalAgent.platform,
      categoryId: originalAgent.categoryId,
      authorId: userId, // Novo dono
      organizationId: organizationId, // Nova org
      isPublished: false, // Clone local
      isPremium: false,
      color: originalAgent.color,
    }).returning();

    // Incrementar os downloads do agente original
    await db
      .update(agents)
      .set({ downloads: sql`${agents.downloads} + 1` })
      .where(eq(agents.id, originalAgent.id));

    // Buscar os workflows vinculados ao agente original
    const relatedWorkflows = await db
      .select({
        workflowId: agentWorkflows.workflowId,
      })
      .from(agentWorkflows)
      .where(eq(agentWorkflows.agentId, originalAgent.id));

    const clonedWorkflowsList = [];

    // Clonar todos os workflows atrelados
    for (const rw of relatedWorkflows) {
      const [originalWorkflow] = await db
        .select()
        .from(workflows)
        .where(eq(workflows.id, rw.workflowId))
        .limit(1);

      if (originalWorkflow) {
        const sanitizedJson = InstallService.sanitizeWorkflowJson(originalWorkflow.workflowJson);

        const [clonedWorkflow] = await db.insert(workflows).values({
          title: `${originalWorkflow.title} (Agente Clone)`,
          slug: `${originalWorkflow.slug}-agentclone-${Date.now()}`,
          description: originalWorkflow.description,
          workflowJson: sanitizedJson,
          isActive: false, 
          categoryId: originalWorkflow.categoryId,
          authorId: userId,
          organizationId: organizationId,
          isPublished: false,
          isPremium: false,
        }).returning();

        // Criar o vinculo no novo agente
        await db.insert(agentWorkflows).values({
          agentId: clonedAgent.id,
          workflowId: clonedWorkflow.id,
        });

        clonedWorkflowsList.push(clonedWorkflow);
      }
    }

    return NextResponse.json({ 
      success: true, 
      agent: clonedAgent,
      workflows: clonedWorkflowsList 
    });
  } catch (error) {
    console.error('Error installing agent:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
