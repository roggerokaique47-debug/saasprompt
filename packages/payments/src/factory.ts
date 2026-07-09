import { PaymentProvider } from './types';
import { StripeProvider } from './providers/stripe';

export class PaymentFactory {
  static getProvider(): PaymentProvider {
    const providerName = process.env.PAYMENT_PROVIDER || 'stripe';
    
    switch (providerName.toLowerCase()) {
      case 'stripe':
        return new StripeProvider();
      // case 'mercadopago':
      //   return new MercadoPagoProvider();
      default:
        console.warn(`Provedor de pagamento ${providerName} nao suportado. Usando Stripe como fallback.`);
        return new StripeProvider();
    }
  }
}
