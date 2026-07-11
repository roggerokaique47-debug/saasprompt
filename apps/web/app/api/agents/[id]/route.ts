import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { agents } from '@prompthub/database/src/schema/agents';
import { users } from '@prompthub/database/src/schema/users';
import { agentWorkflows } from '@prompthub/database/src/schema/agent_workflows';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const UpdateAgentSchema = z.object({
  title: z.string().min(3, 'Título muito curto').max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  color: z.string().optional().nullable(),
});

/**
 * PATCH /api/agents/[id]
 * Update an agent
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [dbUser] = await db
      .select({ organizationId: users.organizationId })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (!dbUser?.organizationId) {
      return NextResponse.json({ error: 'Usuário não vinculado a uma organização.' }, { status: 403 });
    }

    // Verify ownership
    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(and(eq(agents.id, id), eq(agents.organizationId, dbUser.organizationId)))
      .limit(1);

    if (!existingAgent) {
      return NextResponse.json({ error: 'Agent not found or unauthorized' }, { status: 404 });
    }

    const body = await request.json();
    const parsed = UpdateAgentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (parsed.data.title !== undefined) {
      updateData.title = parsed.data.title;
      updateData.content = `Agente: ${parsed.data.title}`;
    }
    if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
    if (parsed.data.color !== undefined) updateData.color = parsed.data.color;
    updateData.updatedAt = new Date();

    const [updatedAgent] = await db
      .update(agents)
      .set(updateData)
      .where(eq(agents.id, id))
      .returning();

    return NextResponse.json({ success: true, data: updatedAgent });
  } catch (error) {
    console.error(`[PATCH /api/agents/error] Error:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * DELETE /api/agents/[id]
 * Delete an agent
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [dbUser] = await db
      .select({ organizationId: users.organizationId })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (!dbUser?.organizationId) {
      return NextResponse.json({ error: 'Usuário não vinculado a uma organização.' }, { status: 403 });
    }
    
    // Verify ownership
    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(and(eq(agents.id, id), eq(agents.organizationId, dbUser.organizationId)))
      .limit(1);

    if (!existingAgent) {
      return NextResponse.json({ error: 'Agent not found or unauthorized' }, { status: 404 });
    }

    // Clean up relations first if cascade isn't guaranteed
    await db.delete(agentWorkflows).where(eq(agentWorkflows.agentId, id));
    
    // Delete agent
    await db.delete(agents).where(eq(agents.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[DELETE /api/agents/error] Error:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
