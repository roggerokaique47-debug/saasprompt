-- Sprint 8 & 9: Multi-tenant and Integrations B2B

-- 1. Organizations Stripe Columns
ALTER TABLE "organizations" ADD COLUMN IF NOT EXISTS "stripe_subscription_id" text UNIQUE;
ALTER TABLE "organizations" ADD COLUMN IF NOT EXISTS "stripe_customer_id" text UNIQUE;

-- 2. Users Organization Linking (for RBAC)
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "organization_id" uuid;

-- 3. Organization Invites
CREATE TABLE IF NOT EXISTS "organization_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'viewer' NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"accepted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
DO $$ BEGIN
 ALTER TABLE "organization_invites" ADD CONSTRAINT "organization_invites_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
CREATE UNIQUE INDEX IF NOT EXISTS "organization_invites_token_unique" ON "organization_invites" ("token");

-- 4. Credentials Refactoring (Multi-tenant)
ALTER TABLE "credentials" ADD COLUMN IF NOT EXISTS "organization_id" uuid;
ALTER TABLE "credentials" ADD COLUMN IF NOT EXISTS "access_token" text;
ALTER TABLE "credentials" ADD COLUMN IF NOT EXISTS "refresh_token" text;
ALTER TABLE "credentials" ADD COLUMN IF NOT EXISTS "scopes" text[];
ALTER TABLE "credentials" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true NOT NULL;
ALTER TABLE "credentials" ADD COLUMN IF NOT EXISTS "expires_at" timestamp;

-- Se o organization_id estava nulo, associamos a uma org default (caso exista dados lixo)
UPDATE "credentials" c
SET "organization_id" = o.id
FROM "users" u
JOIN "organizations" o ON o.owner_id = u.id
WHERE c.user_id = u.id AND c.organization_id IS NULL;

-- Remove colunas defasadas (CBC)
ALTER TABLE "credentials" DROP COLUMN IF EXISTS "user_id";
ALTER TABLE "credentials" DROP COLUMN IF EXISTS "encrypted_data";

-- Add nova foreign key
DO $$ BEGIN
 ALTER TABLE "credentials" ADD CONSTRAINT "credentials_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Modificar organization_id para not null após update
ALTER TABLE "credentials" ALTER COLUMN "organization_id" SET NOT NULL;
