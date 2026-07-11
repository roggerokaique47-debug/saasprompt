import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import db from '@prompthub/database/src/client';
import { members, organizations } from '@prompthub/database/src/schema/organizations';
import { organizationInvites } from '@prompthub/database/src/schema/organization_invites';
import { users } from '@prompthub/database/src/schema/users';
import { getUserPrimaryOrgId, getOrgContext } from '@prompthub/shared/src/rbac/guard';
import { eq, and, isNull } from 'drizzle-orm';
import { Users, Mail, Crown, Shield, Eye, Pencil, Clock, CheckCircle2 } from 'lucide-react';
import { InviteMemberForm } from './invite-form';

export const metadata = { title: 'Equipe - NovaFlow' };

const ROLE_CONFIG = {
  owner: { label: 'Owner', icon: Crown, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  admin: { label: 'Admin', icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  editor: { label: 'Editor', icon: Pencil, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  viewer: { label: 'Viewer', icon: Eye, color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/30' },
};

function RoleBadge({ role }: { role: string }) {
  const cfg = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG] ?? ROLE_CONFIG.viewer;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {cfg.label}
    </span>
  );
}

export default async function EquipePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const organizationId = await getUserPrimaryOrgId(user.id);
  if (!organizationId) redirect('/dashboard');

  // Verificar papel do usuário atual
  const ctx = await getOrgContext(user.id, organizationId);
  const canInvite = ctx && (ctx.role === 'owner' || ctx.role === 'admin');

  // Buscar organização
  const [org] = await db
    .select({ name: organizations.name, plan: organizations.plan })
    .from(organizations)
    .where(eq(organizations.id, organizationId))
    .limit(1);

  // Buscar membros ativos
  const orgMembers = await db
    .select({
      memberId: members.id,
      role: members.role,
      joinedAt: members.joinedAt,
      userId: members.userId,
      email: users.email,
      name: users.name,
      avatarUrl: users.avatarUrl,
    })
    .from(members)
    .innerJoin(users, eq(members.userId, users.id))
    .where(
      and(
        eq(members.organizationId, organizationId),
        eq(members.isActive, true),
      )
    );

  // Owner também conta como membro
  const [ownerUser] = await db
    .select({ email: users.email, name: users.name, id: users.id })
    .from(organizations)
    .innerJoin(users, eq(organizations.ownerId, users.id))
    .where(eq(organizations.id, organizationId))
    .limit(1);

  // Convites pendentes
  const pendingInvites = await db
    .select({
      id: organizationInvites.id,
      email: organizationInvites.email,
      role: organizationInvites.role,
      expiresAt: organizationInvites.expiresAt,
      createdAt: organizationInvites.createdAt,
    })
    .from(organizationInvites)
    .where(
      and(
        eq(organizationInvites.organizationId, organizationId),
        isNull(organizationInvites.acceptedAt),
      )
    );

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Users className="w-7 h-7 text-[var(--accent)]" />
          <h1 className="text-2xl font-bold text-white">Gestão de Equipe</h1>
        </div>
        <p className="text-slate-400 text-sm">
          {org?.name} · Plano <span className="capitalize font-medium text-white">{org?.plan}</span>
        </p>
      </div>

      {/* Convidar membro */}
      {canInvite && (
        <div className="mb-8 p-5 rounded-xl border border-slate-700 bg-slate-800/60">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Mail className="w-4 h-4 text-[var(--accent)]" />
            Convidar Novo Membro
          </h2>
          <InviteMemberForm />
        </div>
      )}

      {/* Membros Ativos */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Membros Ativos ({orgMembers.length + 1})
        </h2>
        <div className="space-y-2">
          {/* Owner */}
          {ownerUser && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-semibold text-sm">
                  {ownerUser.name?.[0]?.toUpperCase() || ownerUser.email[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{ownerUser.name || ownerUser.email}</p>
                  <p className="text-xs text-slate-500">{ownerUser.email}</p>
                </div>
              </div>
              <RoleBadge role="owner" />
            </div>
          )}

          {orgMembers.map((member) => (
            <div key={member.memberId} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-300 font-semibold text-sm">
                  {member.name?.[0]?.toUpperCase() || member.email[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{member.name || member.email}</p>
                  <p className="text-xs text-slate-500">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RoleBadge role={member.role} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Convites Pendentes */}
      {pendingInvites.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Convites Pendentes ({pendingInvites.length})
          </h2>
          <div className="space-y-2">
            {pendingInvites.map((invite) => (
              <div key={invite.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-dashed border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-700/50 border border-dashed border-slate-600 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-300">{invite.email}</p>
                    <p className="text-xs text-slate-500">
                      Expira em {new Date(invite.expiresAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <RoleBadge role={invite.role} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
