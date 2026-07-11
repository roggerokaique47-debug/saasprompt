-- Enable Row Level Security (RLS) para as tabelas principais
-- Isso garante o isolamento B2B de tenants de forma irreversível no DB

ALTER TABLE "organizations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "workflows" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "credentials" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY;

-- Exemplo de Policies:
-- Organizations:
CREATE POLICY "Users can view their own organization"
  ON "organizations"
  FOR SELECT
  USING (
    id IN (
      SELECT organization_id FROM "users" WHERE id = auth.uid()
    )
  );

-- Users:
CREATE POLICY "Users can only view users in their org"
  ON "users"
  FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM "users" WHERE id = auth.uid()
    )
  );

-- Workflows:
CREATE POLICY "Workflows isolated by organization"
  ON "workflows"
  FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM "users" WHERE id = auth.uid()
    )
  );

-- Credentials:
CREATE POLICY "Credentials isolated by organization"
  ON "credentials"
  FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM "users" WHERE id = auth.uid()
    )
  );

-- Audit Logs:
CREATE POLICY "Audit Logs isolated by organization"
  ON "audit_logs"
  FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM "users" WHERE id = auth.uid()
    )
  );
