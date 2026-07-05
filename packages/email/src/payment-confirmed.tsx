import {
  Html,
  Body,
  Container,
  Heading,
  Text,
  Tailwind,
} from '@react-email/components';

interface PaymentConfirmedEmailProps {
  userName: string;
  planName: string;
  locale?: string;
}

export function PaymentConfirmedEmail({
  userName,
  planName,
  locale = 'pt-BR',
}: PaymentConfirmedEmailProps) {
  const t = locale === 'pt-BR' ? translations.pt : translations.en;

  return (
    <Tailwind>
      <Html>
        <Body className="bg-white font-sans">
          <Container className="mx-auto max-w-lg px-4 py-8">
            <Heading className="text-2xl font-bold text-[#00B894]">
              {t.title}
            </Heading>
            <Text className="text-gray-600">
              {t.subtitle(userName, planName)}
            </Text>
            <Text className="text-gray-600">{t.benefits}</Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}

const translations = {
  pt: {
    title: 'Pagamento Confirmado!',
    subtitle: (name: string, plan: string) =>
      `Olá ${name}, seu plano ${plan} foi ativado com sucesso.`,
    benefits: 'Aproveite downloads ilimitados, sem anúncios e todos os recursos premium!',
  },
  en: {
    title: 'Payment Confirmed!',
    subtitle: (name: string, plan: string) =>
      `Hi ${name}, your ${plan} plan has been activated successfully.`,
    benefits:
      'Enjoy unlimited downloads, no ads, and all premium features!',
  },
};
