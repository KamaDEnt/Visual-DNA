import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout";
import { FadeIn } from "@/components/fade-in";
import {
  ChevronRight, ArrowRight, Star, CheckCircle,
  DollarSign, Calendar, MapPin, Shield, Headphones,
  TrendingUp, UserCheck, Clock, BadgeCheck, Zap,
  Wrench, Paintbrush, Sparkles, Droplet, Hammer,
} from "lucide-react";

const beneficios = [
  { icon: DollarSign, color: "bg-green-50 text-green-600", title: "Você define seu preço", desc: "Defina suas próprias tarifas e negocie diretamente com os clientes. Sem teto salarial." },
  { icon: Calendar, color: "bg-blue-50 text-blue-600", title: "Horários flexíveis", desc: "Trabalhe quando quiser. Aceite pedidos nos horários que encaixam na sua rotina." },
  { icon: Zap, color: "bg-yellow-50 text-yellow-600", title: "Receba por Pix", desc: "Pagamento liberado imediatamente após aprovação do cliente, direto na sua conta." },
  { icon: Shield, color: "bg-orange-50 text-orange-600", title: "Sem taxa de adesão", desc: "Cadastro e uso da plataforma são gratuitos. Só cobramos uma pequena comissão nos serviços realizados." },
  { icon: MapPin, color: "bg-purple-50 text-purple-600", title: "Clientes na sua região", desc: "Receba pedidos de clientes próximos a você. Menos deslocamento, mais eficiência." },
  { icon: Headphones, color: "bg-cyan-50 text-cyan-600", title: "Suporte dedicado", desc: "Nossa equipe está disponível 24h para apoiar você em qualquer situação durante os atendimentos." },
  { icon: TrendingUp, color: "bg-rose-50 text-rose-600", title: "Perfil que vende", desc: "Construa uma reputação com avaliações reais. Profissionais bem avaliados aparecem primeiro nas buscas." },
  { icon: BadgeCheck, color: "bg-emerald-50 text-emerald-600", title: "Selo de Verificado", desc: "O selo de profissional verificado aumenta sua credibilidade e a conversão de pedidos." },
];

const passos = [
  {
    number: "01", icon: UserCheck, color: "bg-primary",
    title: "Crie seu perfil",
    desc: "Faça o cadastro gratuito, envie seus documentos para verificação e descreva suas habilidades e experiências. O processo leva menos de 10 minutos.",
    details: ["Cadastro 100% gratuito", "Verificação de identidade rápida", "Adicione fotos do seu trabalho", "Defina sua área de atuação"],
  },
  {
    number: "02", icon: Zap, color: "bg-blue-500",
    title: "Receba pedidos e envie propostas",
    desc: "Veja os pedidos de clientes na sua região em tempo real. Envie uma proposta com seu preço e prazo. Clientes escolhem com base no perfil e avaliação.",
    details: ["Notificações em tempo real", "Aceite apenas o que quiser", "Negocie pelo chat da plataforma", "Sem pressão ou cotas mínimas"],
  },
  {
    number: "03", icon: CheckCircle, color: "bg-green-500",
    title: "Preste o serviço e seja avaliado",
    desc: "Realize o serviço no dia e hora combinados. Após a conclusão, o cliente aprova e você recebe o pagamento na hora, via Pix.",
    details: ["Pagamento garantido pela plataforma", "Receba por Pix imediatamente", "Avaliação constrói sua reputação", "Histórico de serviços no perfil"],
  },
];

const ganhos = [
  { icon: Sparkles, nome: "Limpeza", media: "R$ 2.400", top: "R$ 5.200" },
  { icon: Droplet, nome: "Encanamento", media: "R$ 3.100", top: "R$ 7.000" },
  { icon: Paintbrush, nome: "Pintura", media: "R$ 2.800", top: "R$ 6.500" },
  { icon: Hammer, nome: "Montagem", media: "R$ 2.200", top: "R$ 4.800" },
  { icon: Wrench, nome: "Reparos", media: "R$ 2.900", top: "R$ 6.200" },
];

const depoimentos = [
  { name: "Ricardo Alves", city: "São Paulo, SP", role: "Eletricista", text: "Antes tinha dificuldade de encontrar clientes. Hoje recebo em média 15 pedidos por semana pela Prontto. Dobrei minha renda em 3 meses.", rating: 5, ganho: "R$ 5.800/mês" },
  { name: "Patrícia Lima", city: "Rio de Janeiro, RJ", role: "Diarista", text: "A plataforma me deu liberdade. Trabalho de segunda a sexta, escolho meus clientes e recebo certinho. Nunca mais tive inadimplência.", rating: 5, ganho: "R$ 3.200/mês" },
  { name: "Marcos Oliveira", city: "Belo Horizonte, MG", role: "Encanador", text: "O suporte da Prontto é incrível. Quando tive um problema com um cliente, resolveram tudo em 2 horas. Me sinto protegido.", rating: 5, ganho: "R$ 4.700/mês" },
];

const faqsPrestador = [
  { q: "Existe algum custo para se cadastrar?", a: "Não. O cadastro e uso da plataforma são completamente gratuitos. Cobramos apenas uma comissão de serviço sobre os trabalhos realizados, que varia de 10% a 15% dependendo da categoria." },
  { q: "Como e quando recebo meus pagamentos?", a: "Após o cliente aprovar o serviço concluído, o valor é liberado imediatamente via Pix para a conta bancária cadastrada no seu perfil. Sem demora, sem burocracia." },
  { q: "Sou obrigado a aceitar todos os pedidos?", a: "Não. Você tem total liberdade para aceitar ou recusar pedidos. Não há cotas mínimas nem penalidade por recusar um serviço." },
  { q: "O que acontece se o cliente não ficar satisfeito?", a: "Nossa equipe de mediação analisa o caso. Se for identificado um problema na execução do serviço, você será notificado e terá a chance de reapresentar o trabalho. Agimos sempre com transparência." },
  { q: "Posso trabalhar em mais de uma categoria?", a: "Sim! Você pode cadastrar quantas especialidades quiser no seu perfil. Profissionais multidisciplinares costumam ter mais pedidos." },
];

export function ParaPrestadores() {
  return (
    <Layout>
      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-28 bg-secondary text-white overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-primary/25 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 text-sm text-white/80 w-fit">
              <TrendingUp size={14} className="text-primary" />
              Mais de 500 profissionais já cadastrados
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              Trabalhe com{" "}
              <span className="text-primary">liberdade.</span>{" "}
              Ganhe mais.
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-white/70 max-w-[560px] leading-relaxed">
              Cadastre-se na Prontto, receba pedidos de clientes verificados na sua região e receba por Pix. Sem taxa de adesão, sem burocracia.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button size="lg" className="rounded-[10px] bg-primary hover:bg-primary/90 text-white text-base px-8 h-14 shadow-xl shadow-primary/40">
                Quero me cadastrar <ChevronRight size={18} className="ml-1" />
              </Button>
              <Link href="/como-funciona">
                <Button size="lg" variant="outline" className="rounded-[10px] border-white/20 text-white hover:bg-white/10 text-base px-8 h-14">
                  Ver como funciona
                </Button>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap justify-center items-center gap-10 pt-8 border-t border-white/10 mt-4">
              {[
                { value: "R$ 3.200+", label: "Renda média/mês" },
                { value: "0%", label: "Taxa de adesão" },
                { value: "Pix", label: "Recebimento" },
                { value: "24h", label: "Suporte" },
              ].map(s => (
                <div key={s.label} className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-white">{s.value}</span>
                  <span className="text-sm text-white/50 mt-0.5">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── BENEFÍCIOS ── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Benefícios</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4 text-secondary">Por que trabalhar com a Prontto</h2>
            <p className="text-lg text-muted-foreground">Construímos a plataforma pensando primeiro nos profissionais.</p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {beneficios.map((b, i) => (
              <FadeIn key={b.title} delay={i * 0.06}>
                <Card className="h-full bg-white border-border/40 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                  <CardContent className="p-6 flex flex-col gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${b.color}`}>
                      <b.icon size={22} />
                    </div>
                    <h3 className="font-bold text-secondary">{b.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section className="py-28 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <FadeIn className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Como Funciona</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4 text-white">Três passos para começar a ganhar</h2>
            <p className="text-lg text-white/60">Do cadastro aos primeiros ganhos em menos de 48 horas.</p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-[52px] left-[calc(16.66%+40px)] right-[calc(16.66%+40px)] h-[2px] bg-white/10 rounded-full">
              <div className="h-full bg-gradient-to-r from-primary/40 via-primary to-primary/40 rounded-full" />
            </div>
            {passos.map((passo, i) => (
              <FadeIn key={passo.number} delay={i * 0.18} className="relative z-10 flex flex-col gap-5">
                <div className={`w-20 h-20 rounded-full ${passo.color} flex items-center justify-center shadow-xl relative mx-auto md:mx-0`}>
                  <passo.icon size={32} className="text-white" />
                  <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-secondary border-2 border-white/20 text-white text-xs font-bold flex items-center justify-center">{passo.number}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">{passo.title}</h3>
                  <p className="text-white/55 leading-relaxed mb-4 text-sm">{passo.desc}</p>
                  <ul className="flex flex-col gap-2">
                    {passo.details.map(d => (
                      <li key={d} className="flex items-center gap-2 text-white/60 text-sm">
                        <CheckCircle size={13} className="text-primary shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── POTENCIAL DE GANHO ── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Potencial de Ganho</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4 text-secondary">Quanto você pode ganhar por mês</h2>
            <p className="text-lg text-muted-foreground">Baseado na média dos profissionais ativos na plataforma em 2025.</p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-12">
            {ganhos.map((g, i) => (
              <FadeIn key={g.nome} delay={i * 0.08}>
                <Card className="h-full bg-white border-border/40 hover:shadow-xl hover:border-primary/20 transition-all duration-300 text-center">
                  <CardContent className="p-6 flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <g.icon size={22} className="text-primary" />
                    </div>
                    <h3 className="font-bold text-secondary">{g.nome}</h3>
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Média</span>
                        <span className="font-bold text-secondary">{g.media}</span>
                      </div>
                      <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary/50 rounded-full" style={{ width: "55%" }} />
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Top</span>
                        <span className="font-bold text-primary">{g.top}</span>
                      </div>
                      <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "90%" }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="bg-primary/5 border border-primary/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 max-w-3xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
              <Clock size={30} className="text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-secondary mb-2">Tempo médio para o primeiro pedido</h3>
              <p className="text-muted-foreground leading-relaxed">Após a aprovação do cadastro (que leva até 48h), profissionais recebem em média o primeiro pedido em <strong className="text-secondary">menos de 24 horas</strong>. Regiões com alta demanda têm pedidos imediatos.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section className="py-28 bg-secondary relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 0L1440 0L1440 30C1200 60 960 0 720 30C480 60 240 0 0 30L0 0Z" fill="hsl(218 31% 8%)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 md:px-6 pt-10">
          <FadeIn className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Depoimentos</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4 text-white">Profissionais que transformaram sua renda</h2>
            <p className="text-lg text-white/55">Histórias reais de quem já faz parte da Prontto.</p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            {depoimentos.map((d, i) => (
              <FadeIn key={i} delay={i * 0.15} dir={i === 0 ? "left" : i === 2 ? "right" : "up"}>
                <Card className="h-full bg-white/5 border border-white/10 hover:bg-white/8 transition-colors">
                  <CardContent className="p-8 flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-0.5">
                        {Array.from({ length: d.rating }).map((_, j) => (
                          <Star key={j} size={14} className="text-primary fill-primary" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">{d.ganho}</span>
                    </div>
                    <p className="text-white/70 leading-relaxed flex-1 text-sm">"{d.text}"</p>
                    <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary text-sm shrink-0">{d.name.charAt(0)}</div>
                      <div>
                        <p className="font-bold text-sm text-white">{d.name}</p>
                        <p className="text-xs text-white/40">{d.role} · {d.city}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ PRESTADOR ── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Dúvidas Frequentes</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4 text-secondary">Perguntas dos prestadores</h2>
            <p className="text-lg text-muted-foreground">Tudo que você precisa saber antes de se cadastrar.</p>
          </FadeIn>
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {faqsPrestador.map((faq, i) => (
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
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full border border-white/10 opacity-30" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <FadeIn dir="none" className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold">Cadastro Gratuito</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">Pronto para aumentar<br />sua renda hoje?</h2>
            <p className="text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed">
              Junte-se a mais de 500 profissionais que já trabalham com liberdade e recebem na hora. O cadastro leva menos de 10 minutos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="rounded-[10px] font-bold px-8 h-14 bg-white text-primary hover:bg-white/90 shadow-2xl shadow-black/20">
                Quero me cadastrar <ArrowRight size={18} className="ml-2" />
              </Button>
              <Link href="/como-funciona">
                <Button size="lg" variant="outline" className="rounded-[10px] text-white border-white/30 hover:bg-white/15 px-8 h-14">Saiba mais</Button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 pt-2">
              {["Sem taxa de adesão", "Receba por Pix", "Você decide sua agenda"].map((b) => (
                <div key={b} className="flex items-center gap-2 text-white/80 text-sm">
                  <CheckCircle size={15} className="text-white/90" /> {b}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
}
