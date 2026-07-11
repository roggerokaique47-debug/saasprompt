import { NodeType, NodeExecutor } from '../types';
import db from '@prompthub/database/src/client';
import { credentials } from '@prompthub/database/src/schema/credentials';
import { eq, and } from 'drizzle-orm';
import { decryptText } from '@prompthub/shared';

export const executeHubspotCreateContact: NodeExecutor = {
  type: NodeType.HUBSPOT_CREATE_CONTACT,
  async execute(config, input, context) {
      if (!context?.organizationId) {
        throw new Error('OrganizationId not provided in context');
      }

      const email = config.email as string || (input as any)?.email;
      const properties = config.properties as Record<string, string> || {};
      
      if (!email) {
        throw new Error('Email is required for creating a HubSpot contact');
      }

      // Buscar credencial do HubSpot no banco
      const existing = await db
        .select()
        .from(credentials)
        .where(and(eq(credentials.organizationId, context.organizationId), eq(credentials.provider, 'hubspot')))
        .limit(1);

      if (existing.length === 0 || !existing[0].accessToken) {
        throw new Error('HubSpot integration not found or disconnected');
      }

      const accessToken = decryptText(existing[0].accessToken);
      
      if (!accessToken) {
        throw new Error('Access token missing in HubSpot credentials');
      }

      // Payload para a API v3 de contatos do HubSpot
      const payload = {
        properties: {
          email: email,
          ...properties
        }
      };

      const res = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();
      
      if (!res.ok) {
        throw new Error(`HubSpot API error: ${responseData.message || JSON.stringify(responseData)}`);
      }

      return { success: true, contactId: responseData.id, email, properties: responseData.properties };
    }
};

