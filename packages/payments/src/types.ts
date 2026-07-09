export type PaymentPlan = 'free' | 'pro' | 'team' | 'enterprise';

export type PaymentEventAction = 
  | 'ACTIVATE_SUBSCRIPTION'
  | 'UPDATE_SUBSCRIPTION'
  | 'CANCEL_SUBSCRIPTION'
  | 'ONE_TIME_PURCHASE'
  | 'PAYMENT_FAILED';

export interface NormalizedPaymentEvent {
  userId: string;
  action: PaymentEventAction;
  plan?: PaymentPlan;
  subscriptionId?: string;
  paymentIntentId?: string;
  status: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  contentType?: string;
  contentId?: string;
  priceCents?: number;
  rawEvent?: unknown; // Mantém o evento original caso precisem debugar
}

export interface CheckoutParams {
  userId: string;
  plan: PaymentPlan;
  successUrl: string;
  cancelUrl: string;
}

export interface PaymentProvider {
  /** Cria a sessão de Checkout e retorna a URL de redirecionamento */
  createCheckoutSession(params: CheckoutParams): Promise<string>;
  
  /** Cria o portal do cliente (Customer Portal) e retorna a URL */
  createPortalSession(customerId: string, returnUrl: string): Promise<string>;
  
  /** 
   * Transforma a requisição crua do Webhook (independente se for Stripe ou Asaas)
   * em um evento normatizado para o banco de dados.
   */
  parseWebhookEvent(body: string, signature: string, secret: string): Promise<NormalizedPaymentEvent | null>;
}
