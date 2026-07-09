import fs from 'fs';
import path from 'path';

interface ExternalAgent {
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

export const externalAgents: ExternalAgent[] = [
  {
    title: 'UI Designer',
    slug: 'ui-designer',
    description: 'Expert UI designer specializing in visual design systems, component libraries, and pixel-perfect interface creation.',
    categorySlug: 'design',
    tags: ['design', 'ui', 'design-system', 'componentes'],
    platform: ['claude', 'cursor', 'gemini'],
    isPremium: true, priceCents: 1499,
    source: 'mk-knight23/AGENTS-COLLECTION',
    filename: 'design-ui-designer.md',
    color: 'purple',
  },
  {
    title: 'Frontend Developer',
    slug: 'frontend-developer',
    description: 'Senior frontend developer building responsive, accessible web applications with modern frameworks.',
    categorySlug: 'engenharia',
    tags: ['frontend', 'react', 'web', 'css'],
    platform: ['claude', 'cursor'],
    isPremium: true, priceCents: 1499,
    source: 'mk-knight23/AGENTS-COLLECTION',
    filename: 'engineering-frontend-developer.md',
    color: 'blue',
  },
  {
    title: 'DevOps Automator',
    slug: 'devops-automator',
    description: 'Automates infrastructure, CI/CD pipelines, monitoring, and deployment workflows.',
    categorySlug: 'devops',
    tags: ['devops', 'automacao', 'ci-cd', 'infraestrutura'],
    platform: ['claude', 'cursor'],
    isPremium: true, priceCents: 1999,
    source: 'mk-knight23/AGENTS-COLLECTION',
    filename: 'engineering-devops-automator.md',
    color: 'green',
  },
  {
    title: 'Backend Architect',
    slug: 'backend-architect',
    description: 'Designs scalable backend architectures, APIs, microservices, and data pipelines.',
    categorySlug: 'engenharia',
    tags: ['backend', 'arquitetura', 'api', 'microservicos'],
    platform: ['claude', 'cursor', 'gemini'],
    isPremium: true, priceCents: 2499,
    source: 'mk-knight23/AGENTS-COLLECTION',
    filename: 'engineering-backend-architect.md',
    color: 'blue',
  },
  {
    title: 'Data Engineer',
    slug: 'data-engineer',
    description: 'Builds data pipelines, ETL processes, data warehouses, and analytics infrastructure.',
    categorySlug: 'dados',
    tags: ['dados', 'etl', 'pipeline', 'analytics'],
    platform: ['claude', 'cursor'],
    isPremium: true, priceCents: 1999,
    source: 'mk-knight23/AGENTS-COLLECTION',
    filename: 'engineering-data-engineer.md',
    color: 'orange',
  },
  {
    title: 'Security Engineer',
    slug: 'security-engineer',
    description: 'Identifies vulnerabilities, implements security controls, and conducts security audits.',
    categorySlug: 'engenharia',
    tags: ['seguranca', 'auditoria', 'vulnerabilidades', 'pentest'],
    platform: ['claude', 'cursor'],
    isPremium: true, priceCents: 2999,
    source: 'mk-knight23/AGENTS-COLLECTION',
    filename: 'engineering-security-engineer.md',
    color: 'red',
  },
  {
    title: 'UX Researcher',
    slug: 'ux-researcher',
    description: 'Conducts user research, usability testing, and translates insights into design recommendations.',
    categorySlug: 'design',
    tags: ['ux', 'pesquisa', 'usabilidade', 'design'],
    platform: ['claude', 'gemini'],
    isPremium: false, priceCents: 0,
    source: 'mk-knight23/AGENTS-COLLECTION',
    filename: 'design-ux-researcher.md',
    color: 'purple',
  },
  {
    title: 'Content Creator',
    slug: 'content-creator',
    description: 'Creates engaging content for blogs, social media, email marketing, and brand storytelling.',
    categorySlug: 'marketing',
    tags: ['conteudo', 'marketing', 'blog', 'social-media'],
    platform: ['claude', 'gemini'],
    isPremium: false, priceCents: 0,
    source: 'mk-knight23/AGENTS-COLLECTION',
    filename: 'agency-content-creator.md',
    color: 'pink',
  },
  {
    title: 'Mobile App Builder',
    slug: 'mobile-app-builder',
    description: 'Builds cross-platform mobile applications with React Native, Flutter, and native technologies.',
    categorySlug: 'engenharia',
    tags: ['mobile', 'react-native', 'flutter', 'app'],
    platform: ['claude', 'cursor'],
    isPremium: true, priceCents: 1999,
    source: 'mk-knight23/AGENTS-COLLECTION',
    filename: 'engineering-mobile-app-builder.md',
    color: 'blue',
  },
  {
    title: 'Technical Writer',
    slug: 'technical-writer',
    description: 'Creates comprehensive technical documentation, API references, and developer guides.',
    categorySlug: 'conteudo',
    tags: ['documentacao', 'tecnico', 'escrita', 'api'],
    platform: ['claude', 'gemini'],
    isPremium: false, priceCents: 0,
    source: 'mk-knight23/AGENTS-COLLECTION',
    filename: 'engineering-technical-writer.md',
    color: 'gray',
  },
  {
    title: 'Social Media Strategist',
    slug: 'social-media-strategist',
    description: 'Develops social media strategies, content calendars, and engagement campaigns.',
    categorySlug: 'marketing',
    tags: ['social-media', 'estrategia', 'marketing', 'conteudo'],
    platform: ['claude', 'gemini'],
    isPremium: false, priceCents: 0,
    source: 'mk-knight23/AGENTS-COLLECTION',
    filename: 'agency-social-media-strategist.md',
    color: 'pink',
  },
  {
    title: 'Growth Hacker',
    slug: 'growth-hacker',
    description: 'Designs and executes growth experiments, viral loops, and conversion optimization strategies.',
    categorySlug: 'marketing',
    tags: ['growth', 'experimentos', 'conversao', 'marketing'],
    platform: ['claude', 'gemini'],
    isPremium: true, priceCents: 2499,
    source: 'mk-knight23/AGENTS-COLLECTION',
    filename: 'agency-growth-hacker.md',
    color: 'green',
  },
];

export function loadExternalAgentContent(filename: string): string | null {
  const filePath = path.resolve(__dirname, 'agents', filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`  \u26A0 Agent file not found: ${filename}`);
    return null;
  }
  return fs.readFileSync(filePath, 'utf-8');
}
