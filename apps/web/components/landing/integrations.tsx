const integrations = [
  { name: 'Gmail', icon: '📧' },
  { name: 'Google Sheets', icon: '📊' },
  { name: 'Google Drive', icon: '📁' },
  { name: 'WhatsApp', icon: '💬' },
  { name: 'Slack', icon: '💎' },
  { name: 'Discord', icon: '🎮' },
  { name: 'Stripe', icon: '💰' },
  { name: 'Shopify', icon: '🛍️' },
  { name: 'WooCommerce', icon: '🛒' },
  { name: 'PostgreSQL', icon: '🗄️' },
  { name: 'MySQL', icon: '🗃️' },
  { name: 'OpenAI', icon: '🤖' },
  { name: 'Claude', icon: '🧠' },
  { name: 'Gemini', icon: '✨' },
  { name: 'GitHub', icon: '🐙' },
  { name: 'Notion', icon: '📝' },
  { name: 'HubSpot', icon: '📈' },
  { name: 'Salesforce', icon: '☁️' },
];

export function Integrations() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold">
            Integrações nativas
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Conecte-se com as ferramentas que você já usa. Mais de 80
            integrações disponíveis.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {integrations.map((int) => (
            <div
              key={int.name}
              className="flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm transition-all hover:border-primary hover:shadow-md hover:-translate-y-0.5"
            >
              <span className="text-lg">{int.icon}</span>
              <span className="font-medium">{int.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
