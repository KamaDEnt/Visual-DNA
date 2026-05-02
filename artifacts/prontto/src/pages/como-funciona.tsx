import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout";
import { FadeIn } from "@/components/fade-in";
import {
  Search, Shield, Clock, CheckCircle, ChevronRight, ArrowRight,
  Star, Smartphone, CreditCard, MessageSquare, MapPin,
  BadgeCheck, Zap, RotateCcw, Lock, UserCheck, ThumbsUp,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    color: "bg-blue-500",
    title: "Descreva o que você precisa",
    desc: "Selecione a categoria, informe o endereço e nos conte os detalhes do serviço — fotos ajudam muito! Quanto mais detalhes, melhores as propostas.",
    details: [
      "Escolha entre mais de 15 categorias",
      "Adicione fotos do problema (opcional)",
      "Informe data e horário preferidos",
      "Receba respostas em até 30 minutos",
    ],
    visual: "search",
  },
  {
    number: "02",
    icon: UserCheck,
    color: "bg-primary",
    title: "Compare e escolha o profissional certo",
    desc: "Receba propostas de profissionais verificados na sua região. Veja avaliações, histórico de serviços e converse antes de decidir.",
    details: [
      "Perfis completos com avaliações reais",
      "Histórico de serviços realizados",
      "Chat direto antes de fechar",
      "Preços transparentes sem surpresas",
    ],
    visual: "compare",
  },
  {
    number: "03",
    icon: Clock,
    color: "bg-green-500",
    title: "Agende e acompanhe em tempo real",
    desc: "Confirme o profissional, escolha o horário ideal e acompanhe a chegada em tempo real pelo app. Sem telefonemas, sem esperas.",
    details: [
      "Agendamento flexível 7 dias por semana",
      "Acompanhamento de localização em tempo real",
      "Notificações automáticas de status",
      "Confirmação imediata por mensagem",
    ],
    visual: "track",
  },
  {
    number: "04",
    icon: CheckCircle,
    color: "bg-emerald-500",
    title: "Serviço concluído. Pagamento seguro.",
    desc: "Após a conclusão, avalie o profissional e efetue o pagamento pela plataforma. Seu dinheiro só é liberado quando você aprova o serviço.",
    details: [
      "Pagamento liberado só após aprovação",
      "Recibo digital gerado automaticamente",
      "Avaliação que ajuda outros usuários",
      "Histórico completo de serviços",
    ],
    visual: "done",
  },
];

const garantias = [
  { icon: Lock, title: "Pagamento Protegido", desc: "O valor fica retido na plataforma e só é liberado ao profissional após você confirmar a conclusão do serviço." },
  { icon: BadgeCheck, title: "Profissionais Verificados", desc: "Verificação de identidade, CPF, antecedentes criminais e validação técnica antes de cada cadastro." },
  { icon: RotateCcw, title: "Reembolso Garantido", desc: "Se o serviço não for realizado ou não atender ao acordado, devolvemos 100% do seu dinheiro." },
  { icon: MessageSquare, title: "Mediação de Conflitos", desc: "Nossa equipe resolve qualquer disputa entre cliente e profissional de forma rápida e justa." },
  { icon: Smartphone, title: "Acompanhamento Total", desc: "Do pedido à conclusão, você é notificado em cada etapa. Visibilidade total sobre o andamento." },
  { icon: Zap, title: "Resposta em 30 Minutos", desc: "Em média, você recebe o primeiro contato de um profissional em menos de 30 minutos após o pedido." },
];

const faqs = [
  {
    q: "Como os profissionais são selecionados?",
    a: "Todos passam por verificação de identidade (RG/CPF), consulta de antecedentes criminais, validação de habilidades técnicas e período de teste. Apenas quem mantém nota acima de 4.5 permanece na plataforma.",
  },
  {
    q: "O pagamento é feito antes ou depois do serviço?",
    a: "O valor é reservado no momento do pedido mas só é liberado ao profissional após você confirmar que o serviço foi concluído. Se algo der errado, devolvemos integralmente.",
  },
  {
    q: "Posso cancelar depois de confirmar um profissional?",
    a: "Sim. Cancelamentos com mais de 2 horas de antecedência são gratuitos. Cancelamentos de última hora podem ter uma taxa de conveniência de R$ 20.",
  },
  {
    q: "E se eu não ficar satisfeito com o resultado?",
    a: "Entre em contato com nosso suporte em até 48h após o serviço. Vamos mediar a situação e, se necessário, enviar outro profissional sem custo ou reembolsar você.",
  },
  {
    q: "Quais formas de pagamento são aceitas?",
    a: "Pix, cartão de crédito (até 12x) e débito. O pagamento é feito pela plataforma — não precisa ter dinheiro em espécie.",
  },
  {
    q: "Posso solicitar o mesmo profissional novamente?",
    a: "Sim! Você pode favoritar profissionais e solicitar diretamente a eles em pedidos futuros.",
  },
];

export function ComoFunciona() {
  return (
    <Layout>
      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-28 bg-secondary text-white overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 text-sm text-white/80 w-fit">
              <Clock size={14} className="text-primary" />
              Do pedido ao profissional em minutos
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              Simples assim.{" "}
              <span className="text-primary">4 passos</span>{" "}
              para resolver tudo.
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-white/70 max-w-[560px] leading-relaxed">
              Contrate um profissional verificado com a segurança de que seu dinheiro está protegido e o serviço será entregue como combinado.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button size="lg" className="rounded-[10px] bg-primary hover:bg-primary/90 text-white text-base px-8 h-14 shadow-xl shadow-primary/40">
                Solicitar Agora <ChevronRight size={18} className="ml-1" />
              </Button>
              <Link href="/servicos">
                <Button size="lg" variant="outline" className="rounded-[10px] border-white/20 text-white hover:bg-white/10 text-base px-8 h-14">
                  Ver serviços disponíveis
                </Button>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }}
              className="grid grid-cols-4 gap-6 pt-8 border-t border-white/10 mt-4 w-full max-w-lg">
              {[
                { value: "4", label: "Passos simples" },
                { value: "30min", label: "1ª resposta" },
                { value: "100%", label: "Dinheiro seguro" },
                { value: "24h", label: "Suporte" },
              ].map(s => (
                <div key={s.label} className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-white">{s.value}</span>
                  <span className="text-xs text-white/50 mt-0.5 text-center">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STEP-BY-STEP ── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Passo a Passo</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4 text-secondary">Como funciona na prática</h2>
            <p className="text-lg text-muted-foreground">Cada etapa foi desenhada para simplificar sua experiência do início ao fim.</p>
          </FadeIn>

          <div className="flex flex-col gap-12">
            {steps.map((step, i) => (
              <FadeIn key={step.number} delay={0.1} dir={i % 2 === 0 ? "left" : "right"}>
                <div className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-10 items-center`}>
                  {/* Text side */}
                  <div className="flex-1 flex flex-col gap-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center shadow-lg`}>
                        <step.icon size={26} className="text-white" />
                      </div>
                      <span className="text-5xl font-black text-secondary/10">{step.number}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-secondary">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">{step.desc}</p>
                    <ul className="flex flex-col gap-3 mt-2">
                      {step.details.map(detail => (
                        <li key={detail} className="flex items-center gap-3">
                          <CheckCircle size={16} className="text-primary shrink-0" />
                          <span className="text-sm text-secondary/75">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual side */}
                  <div className="flex-1 flex justify-center">
                    <div className={`w-full max-w-sm h-64 rounded-3xl ${step.color} bg-opacity-10 border border-white/20 flex items-center justify-center relative overflow-hidden`}
                      style={{ background: `linear-gradient(135deg, hsl(218 31% 14%), hsl(218 31% 10%))` }}>
                      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                      <div className="relative z-10 flex flex-col items-center gap-3 text-white/20">
                        <step.icon size={64} />
                        <span className="text-sm font-bold tracking-widest uppercase">{step.title.split(" ").slice(0, 3).join(" ")}</span>
                      </div>
                      <div className={`absolute -bottom-8 -right-8 w-32 h-32 ${step.color} opacity-20 rounded-full blur-2xl`} />
                    </div>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex justify-center mt-4">
                    <div className="w-0.5 h-8 bg-border rounded-full" />
                  </div>
                )}
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── GARANTIAS ── */}
      <section className="py-28 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <FadeIn className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Segurança</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4 text-white">Sua proteção em cada etapa</h2>
            <p className="text-lg text-white/60">Construímos a Prontto para que você nunca precise se preocupar.</p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {garantias.map((g, i) => (
              <FadeIn key={g.title} delay={i * 0.08}>
                <div className="flex flex-col gap-3 bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center">
                    <g.icon size={20} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-white">{g.title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{g.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Dúvidas Frequentes</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4 text-secondary">Perguntas que recebemos todo dia</h2>
            <p className="text-lg text-muted-foreground">Encontre as respostas mais rápido por aqui.</p>
          </FadeIn>
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <Card className="bg-white border-border/40 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-secondary mb-3 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      {faq.q}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm pl-9">{faq.a}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 bg-primary relative overflow-hidden">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border border-white/10 opacity-30" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <FadeIn dir="none" className="max-w-3xl mx-auto text-center flex flex-col items-center gap-7">
            <ThumbsUp size={40} className="text-white/60" />
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">Entendeu como é simples?<br />Então vamos lá.</h2>
            <p className="text-lg text-white/85 max-w-xl leading-relaxed">Faça seu primeiro pedido agora e veja como é fácil ter um profissional de confiança na sua porta.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="rounded-[10px] font-bold px-8 h-14 bg-white text-primary hover:bg-white/90 shadow-2xl shadow-black/20">
                Fazer Primeiro Pedido <ArrowRight size={18} className="ml-2" />
              </Button>
              <Link href="/servicos">
                <Button size="lg" variant="outline" className="rounded-[10px] text-white border-white/30 hover:bg-white/15 px-8 h-14">Ver serviços</Button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 pt-2">
              {["Sem cadastro obrigatório", "Primeiro serviço sem taxa", "Suporte 24h"].map((b) => (
                <div key={b} className="flex items-center gap-2 text-white/80 text-sm">
                  <CheckCircle size={14} className="text-white/90" /> {b}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
}
