import { notFound } from 'next/navigation';
import db from '@prompthub/database/src/client';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { eq } from 'drizzle-orm';
import { WorkflowEditor } from '@/features/workflows/components/editor/workflow-editor';

interface EditWorkflowPageProps {
  params: { id: string };
}

export default async function EditWorkflowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: workflowId } = await params;

  let initialNodes = [];
  let initialEdges = [];
  
  if (workflowId !== 'novo') {
    const workflowResult = await db.select().from(workflows).where(eq(workflows.id, workflowId)).limit(1);
    
    if (workflowResult.length === 0) {
      notFound();
    }
    
    const workflow = workflowResult[0];
    
    try {
      const definition = workflow.workflowJson ? (typeof workflow.workflowJson === 'string' ? JSON.parse(workflow.workflowJson) : workflow.workflowJson) : null;
      if (definition && typeof definition === 'object') {
        initialNodes = (definition as any).nodes || [];
        initialEdges = (definition as any).edges || [];
      }
    } catch (e) {
      console.error('Failed to parse workflow definition', e);
    }
  }

  // ToDo: Implement the save function to call a Server Action or API route

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex-1 relative">
        <WorkflowEditor 
          workflowId={workflowId} 
          initialNodes={initialNodes} 
          initialEdges={initialEdges} 
        />
      </div>
    </div>
  );
}
