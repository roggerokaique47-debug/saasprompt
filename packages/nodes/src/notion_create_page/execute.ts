import { NodeType, NodeExecutor } from '../types';
import db from '@prompthub/database/src/client';
import { credentials } from '@prompthub/database/src/schema/credentials';
import { eq, and } from 'drizzle-orm';
import { decryptText } from '@prompthub/shared';

export const executeNotionCreatePage: NodeExecutor = {
  type: NodeType.NOTION_CREATE_PAGE,
  async execute(config, input, context) {
    if (!context?.organizationId) {
      throw new Error('OrganizationId not provided in context');
    }

    const databaseId = config.databaseId as string;
    const title = (config.title as string) || 'NovaFlow Page';

    if (!databaseId) {
      throw new Error('Notion databaseId is missing');
    }

    const existing = await db
      .select()
      .from(credentials)
      .where(and(eq(credentials.organizationId, context.organizationId), eq(credentials.provider, 'notion')))
      .limit(1);

    if (existing.length === 0 || !existing[0].accessToken) {
      throw new Error('Notion integration not found or disconnected');
    }

    const accessToken = decryptText(existing[0].accessToken);
    
    if (!accessToken) {
      throw new Error('Access token missing in Notion credentials');
    }

    const res = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: title
                }
              }
            ]
          }
        }
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(`Notion API Error: ${data.message || res.statusText}`);
    }

    return { success: true, databaseId, pageId: data.id, title };
  }
};
