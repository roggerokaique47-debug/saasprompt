import { NodeType, NodeExecutor } from '../types';
import db from '@prompthub/database/src/client';
import { credentials } from '@prompthub/database/src/schema/credentials';
import { eq, and } from 'drizzle-orm';
import { decryptText } from '@prompthub/shared';

export const executeTypeformRead: NodeExecutor = {
  type: NodeType.TYPEFORM_READ,
  async execute(config, input, context) {
    if (!context?.organizationId) {
      throw new Error('OrganizationId not provided in context');
    }

    const formId = config.formId as string;

    if (!formId) {
      throw new Error('Typeform formId is missing');
    }

    const existing = await db
      .select()
      .from(credentials)
      .where(and(eq(credentials.organizationId, context.organizationId), eq(credentials.provider, 'typeform')))
      .limit(1);

    if (existing.length === 0 || !existing[0].accessToken) {
      throw new Error('Typeform integration not found or disconnected');
    }

    const accessToken = decryptText(existing[0].accessToken);
    
    if (!accessToken) {
      throw new Error('Access token missing in Typeform credentials');
    }

    const res = await fetch(`https://api.typeform.com/forms/${formId}/responses`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(`Typeform API Error: ${data.description || res.statusText}`);
    }

    return { success: true, formId, responses: data.items };
  }
};
