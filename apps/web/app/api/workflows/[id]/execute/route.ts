import { NextResponse } from 'next/server';
import { executeWorkflow } from '@prompthub/engine';
import { NodeType, WorkflowDefinition } from '@prompthub/engine/src/nodes';
import db from '@prompthub/database/src/client';
import { users } from '@prompthub/database/src/schema/users';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { eq } from 'drizzle-orm';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { nodes = [], edges = [] } = body;

    // Autenticação Real B2B via Supabase
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });
    }

    const userId = user.id;

    // 1. Escudo SaaS: Validar Saldo de Créditos
    const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const dbUser = userResult.length > 0 ? userResult[0] : null;

    if (dbUser && dbUser.credits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits. Upgrade your plan or buy more tokens.' },
        { status: 402 } // 402 Payment Required
      );
    }

    // 2. Escudo SaaS: Cobrança Atômica
    // Calcula o custo com base no número de blocos (simplificado)
    const cost = Math.max(1, Math.floor(nodes.length / 2));
    
    await db.update(users)
      .set({ credits: dbUser!.credits - cost })
      .where(eq(users.id, userId));

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

    const result = await executeWorkflow(workflowDef, { userId });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Workflow execution error:', error);
    return NextResponse.json(
      { error: 'Failed to execute workflow', details: (error as Error).message },
      { status: 500 }
    );
  }
}
