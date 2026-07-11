import { NodeType, NodeExecutor } from './types';

import { executeCode } from './code/execute';
import { executeDelay } from './delay/execute';
import { executeDiscordSend } from './discord_send/execute';
import { executeEmailSmtp } from './email_smtp/execute';
import { executeFilter } from './filter/execute';
import { executeGmailRead } from './gmail_read/execute';
import { executeGmailSend } from './gmail_send/execute';
import { executeGoogleSheetsRead } from './google_sheets_read/execute';
import { executeGoogleSheetsWrite } from './google_sheets_write/execute';
import { executeHttpRequest } from './http_request/execute';
import { executeHubspotCreateContact } from './hubspot_create_contact/execute';
import { executeMerge } from './merge/execute';
import { executeNotionCreatePage } from './notion_create_page/execute';
import { executeOpenAI } from './openai/execute';
import { executeSchedule } from './schedule/execute';
import { executeSlackSend } from './slack_send/execute';
import { executeSwitch } from './switch/execute';
import { executeTypeformRead } from './typeform_read/execute';
import { executeWebhook } from './webhook/execute';
import { executeWhatsappSend } from './whatsapp_send/execute';

import { executeGoogleDriveUpload } from './google_drive_upload/execute';

export const nodeRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.CODE]: executeCode,
  [NodeType.DELAY]: executeDelay,
  [NodeType.DISCORD_SEND]: executeDiscordSend,
  [NodeType.EMAIL_SMTP]: executeEmailSmtp,
  [NodeType.FILTER]: executeFilter,
  [NodeType.GMAIL_READ]: executeGmailRead,
  [NodeType.GMAIL_SEND]: executeGmailSend,
  [NodeType.GOOGLE_SHEETS_READ]: executeGoogleSheetsRead,
  [NodeType.GOOGLE_SHEETS_WRITE]: executeGoogleSheetsWrite,
  [NodeType.GOOGLE_DRIVE_UPLOAD]: executeGoogleDriveUpload,
  [NodeType.HTTP_REQUEST]: executeHttpRequest,
  [NodeType.HUBSPOT_CREATE_CONTACT]: executeHubspotCreateContact,
  [NodeType.MERGE]: executeMerge,
  [NodeType.NOTION_CREATE_PAGE]: executeNotionCreatePage,
  [NodeType.OPENAI]: executeOpenAI,
  [NodeType.SCHEDULE]: executeSchedule,
  [NodeType.SLACK_SEND]: executeSlackSend,
  [NodeType.SWITCH]: executeSwitch,
  [NodeType.TYPEFORM_READ]: executeTypeformRead,
  [NodeType.WEBHOOK]: executeWebhook,
  [NodeType.WHATSAPP_SEND]: executeWhatsappSend,
};

export { initEnvProvider, callChatCompletion, registerProvider, getActiveProvider, getProvider } from './openai/ai-provider';
export type { AIProviderConfig, AIProviderType } from './openai/ai-provider';
export * from './types';
