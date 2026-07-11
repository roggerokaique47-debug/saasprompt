import { NextResponse } from 'next/server';
import { executeWorkflow } from '@prompthub/engine';
import { NodeType, WorkflowDefinition } from '@prompthub/engine';
import db from '@prompthub/database/src/client';
import { users } from '@prompthub/database/src/schema/users';
import { organizations } from '@prompthub/database/src/schema/organizations';
import { eq } from 'drizzle-orm';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { nodes = [], edges = [], agentId } = body;

    // Autenticação Real B2B via Supabase
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });
    }

    const userId = user.id;
    
    // Obter organizationId primário do usuário
    const userResult = await db.select({ organizationId: users.organizationId }).from(users).where(eq(users.id, userId)).limit(1);
    const organizationId = userResult.length > 0 ? userResult[0].organizationId : null;
    
    if (!organizationId) {
       return NextResponse.json({ error: 'User does not belong to an organization' }, { status: 403 });
    }

    // 1. Escudo SaaS: Validar Saldo de Créditos da Organização
    const orgResult = await db.select().from(organizations).where(eq(organizations.id, organizationId)).limit(1);
    const dbOrg = orgResult.length > 0 ? orgResult[0] : null;

    if (dbOrg && dbOrg.credits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits. Upgrade your plan or buy more tokens.' },
        { status: 402 } // 402 Payment Required
      );
    }

    // 2. Escudo SaaS: Cobrança Atômica
    // Calcula o custo com base no número de blocos (simplificado)
    const cost = Math.max(1, Math.floor(nodes.length / 2));
    
    await db.update(organizations)
      .set({ credits: dbOrg!.credits - cost })
      .where(eq(organizations.id, organizationId));

    // Map React Flow format to Engine format
    const engineNodes = nodes.map((node: any) => ({
      id: node.id,
      type: (node.data?.type || 'webhook') as NodeType,
      label: node.data?.label || 'Node',
      position: node.position,
      config: node.data?.config || {},
      inputs: [],
      outputs: []
    }));

    const engineEdges = edges.map((edge: any) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle
    }));

    const workflowDef: WorkflowDefinition = {
      id: id,
      name: 'Temp Run',
      nodes: engineNodes,
      edges: engineEdges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await executeWorkflow(workflowDef, { userId, organizationId, agentId: agentId ?? undefined });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Workflow execution error:', error);
    return NextResponse.json(
      { error: 'Failed to execute workflow', details: (error as Error).message },
      { status: 500 }
    );
  }
}
