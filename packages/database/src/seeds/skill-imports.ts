import fs from 'fs';
import path from 'path';

interface ExternalSkill {
  title: string;
  slug: string;
  description: string;
  categorySlug: string;
  tags: string[];
  platform: string[];
  isPremium: boolean;
  priceCents: number;
  source: string;
  filename: string;
  color?: string;
}

export const externalSkills: ExternalSkill[] = [
  {
    title: 'PR Review Expert',
    slug: 'pr-review-expert',
    description: 'Expert code reviewer that analyzes pull requests for security, performance, maintainability, and best practices.',
    categorySlug: 'engenharia',
    tags: ['code-review', 'pr', 'qualidade', 'engenharia'],
    platform: ['claude', 'cursor'],
    isPremium: true, priceCents: 1499,
    source: 'alirezarezvani/claude-skills',
    filename: 'pr-review-expert.md',
  },
  {
    title: 'Database Schema Designer',
    slug: 'database-schema-designer',
    description: 'Designs and optimizes database schemas with normalization, indexing strategies, and migration planning.',
    categorySlug: 'engenharia',
    tags: ['banco-de-dados', 'schema', 'sql', 'engenharia'],
    platform: ['claude', 'cursor'],
    isPremium: true, priceCents: 1499,
    source: 'alirezarezvani/claude-skills',
    filename: 'database-schema-designer.md',
  },
  {
    title: 'API Design Reviewer',
    slug: 'api-design-reviewer',
    description: 'Reviews REST API designs for consistency, scalability, security, and adherence to best practices.',
    categorySlug: 'engenharia',
    tags: ['api', 'rest', 'design', 'engenharia'],
    platform: ['claude', 'cursor'],
    isPremium: true, priceCents: 1299,
    source: 'alirezarezvani/claude-skills',
    filename: 'api-design-reviewer.md',
  },
  {
    title: 'Agent Designer',
    slug: 'agent-designer',
    description: 'Designs AI agent architectures with tool selection, planning strategies, and evaluation frameworks.',
    categorySlug: 'ia',
    tags: ['agentes', 'ia', 'arquitetura', 'ferramentas'],
    platform: ['claude', 'cursor'],
    isPremium: true, priceCents: 1999,
    source: 'alirezarezvani/claude-skills',
    filename: 'agent-designer.md',
  },
  {
    title: 'Chaos Engineering',
    slug: 'chaos-engineering',
    description: 'Designs and runs chaos engineering experiments to test system resilience and reliability.',
    categorySlug: 'engenharia',
    tags: ['chaos-engineering', 'resiliencia', 'testes', 'devops'],
    platform: ['claude', 'cursor'],
    isPremium: false, priceCents: 0,
    source: 'alirezarezvani/claude-skills',
    filename: 'chaos-engineering.md',
  },
  {
    title: 'Browser Automation',
    slug: 'browser-automation',
    description: 'Builds browser automation scripts for web scraping, form filling, and data extraction.',
    categorySlug: 'engenharia',
    tags: ['automacao', 'browser', 'scraping', 'playwright'],
    platform: ['claude'],
    isPremium: true, priceCents: 999,
    source: 'alirezarezvani/claude-skills',
    filename: 'browser-automation.md',
  },
  {
    title: 'CI/CD Pipeline Builder',
    slug: 'cicd-pipeline-builder',
    description: 'Creates optimized CI/CD pipelines for GitHub Actions, GitLab CI, and other platforms.',
    categorySlug: 'devops',
    tags: ['ci-cd', 'devops', 'automacao', 'github-actions'],
    platform: ['claude', 'cursor'],
    isPremium: false, priceCents: 0,
    source: 'alirezarezvani/claude-skills',
    filename: 'cicd-pipeline-builder.md',
  },
  {
    title: 'Kubernetes Operator Builder',
    slug: 'kubernetes-operator-builder',
    description: 'Builds Kubernetes operators and controllers for automated infrastructure management.',
    categorySlug: 'devops',
    tags: ['kubernetes', 'operator', 'devops', 'infraestrutura'],
    platform: ['claude', 'cursor'],
    isPremium: true, priceCents: 2499,
    source: 'alirezarezvani/claude-skills',
    filename: 'kubernetes-operator.md',
  },
  {
    title: 'Docker Development',
    slug: 'docker-development',
    description: 'Creates optimized Dockerfiles and docker-compose configurations for development and production.',
    categorySlug: 'devops',
    tags: ['docker', 'container', 'devops', 'desenvolvimento'],
    platform: ['claude', 'cursor'],
    isPremium: false, priceCents: 0,
    source: 'alirezarezvani/claude-skills',
    filename: 'docker-development.md',
  },
  {
    title: 'Feature Flags Architect',
    slug: 'feature-flags-architect',
    description: 'Designs feature flag systems with rollout strategies, kill switches, and flag lifecycle management.',
    categorySlug: 'engenharia',
    tags: ['feature-flags', 'engenharia', 'release', 'experimentos'],
    platform: ['claude', 'cursor'],
    isPremium: false, priceCents: 0,
    source: 'alirezarezvani/claude-skills',
    filename: 'feature-flags-architect.md',
  },
  {
    title: 'Env & Secrets Manager',
    slug: 'env-secrets-manager',
    description: 'Manages environment variables and secrets across development, staging, and production environments.',
    categorySlug: 'devops',
    tags: ['env', 'secrets', 'devops', 'seguranca'],
    platform: ['claude'],
    isPremium: false, priceCents: 0,
    source: 'alirezarezvani/claude-skills',
    filename: 'env-secrets-manager.md',
  },
];

export function loadExternalSkillContent(filename: string): string | null {
  const filePath = path.resolve(__dirname, 'skills', filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`  \u26A0 Skill file not found: ${filename}`);
    return null;
  }
  return fs.readFileSync(filePath, 'utf-8');
}
