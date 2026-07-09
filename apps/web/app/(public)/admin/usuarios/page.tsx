import type { Metadata } from 'next';
import db from '@prompthub/database/src/client';
import { users } from '@prompthub/database/src/schema/users';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Usuários' };

export default async function AdminUsuariosPage() {
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt)).limit(100);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Usuários</h1>
      <div className="rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Plano</th>
              <th className="px-4 py-3 font-medium">Idioma</th>
              <th className="px-4 py-3 font-medium">Criado em</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3 capitalize">{u.plan}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.locale}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {u.createdAt.toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

