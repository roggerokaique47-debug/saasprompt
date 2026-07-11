'use client';

export function VipForm() {
  return (
    <form className="vip-form" onSubmit={(e) => { e.preventDefault(); alert('Em breve!'); }}>
      <div className="vip-input-group">
        <input type="text" className="vip-input" placeholder="Seu nome" required aria-label="Nome" />
        <input type="email" className="vip-input" placeholder="Seu melhor e-mail" required aria-label="E-mail" />
        <button type="submit" className="btn btn-primary btn-glow btn-arrow vip-btn">Garantir Acesso Antecipado</button>
      </div>
      <p className="vip-note">🔒 Seus dados estão seguros. Sem spam. Cancele quando quiser.</p>
    </form>
  );
}
