import { WorkflowEditor } from '@/features/workflows/components/editor/workflow-editor';

export default function TestEditorPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <WorkflowEditor workflowId="novo" />
    </div>
  );
}
