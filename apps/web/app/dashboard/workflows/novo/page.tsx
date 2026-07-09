import { redirect } from 'next/navigation';

export default function NovoWorkflowRedirect() {
  redirect('/dashboard/workflows/novo/edit');
}
