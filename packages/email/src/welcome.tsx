import {
  Html,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Tailwind,
} from '@react-email/components';

interface WelcomeEmailProps {
  userName: string;
  locale?: string;
}

export function WelcomeEmail({ userName, locale = 'pt-BR' }: WelcomeEmailProps) {
  const t = locale === 'pt-BR' ? translations.pt : translations.en;

  return (
    <Tailwind>
      <Html>
        <Body className="bg-white font-sans">
          <Container className="mx-auto max-w-lg px-4 py-8">
            <Heading className="text-2xl font-bold text-[#6C5CE7]">
              {t.title} {userName}!
            </Heading>
            <Text className="text-gray-600">{t.subtitle}</Text>
            <Button
              href="https://prompthub.com/busca"
              className="mt-4 rounded-lg bg-[#6C5CE7] px-6 py-3 text-white"
            >
              {t.cta}
            </Button>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}

const translations = {
  pt: {
    title: 'Bem-vindo ao PromptHub',
    subtitle:
      'Sua biblioteca inteligente de prompts de IA. Comece a explorar milhares de prompts prontos para usar.',
    cta: 'Explorar Prompts',
  },
  en: {
    title: 'Welcome to PromptHub',
    subtitle:
      'Your intelligent AI prompt library. Start exploring thousands of ready-to-use prompts.',
    cta: 'Explore Prompts',
  },
};
