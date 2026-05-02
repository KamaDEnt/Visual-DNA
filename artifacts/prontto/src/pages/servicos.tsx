import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout";
import { FadeIn } from "@/components/fade-in";
import {
  Sparkles, Wrench, TreePine, Hammer, Zap, Paintbrush,
  Droplet, Truck, ChevronRight, ArrowRight, Star,
  Shield, Clock, CheckCircle, BadgeCheck, Headphones,
  Home, Scissors, Wind, Sofa,
} from "lucide-react";

const categories = [
  {
    icon: Sparkles, name: "Limpeza", color: "bg-blue-50 text-blue-500", border: "border-blue-100",
    desc: "Limpeza residencial, escritório, pós-obra e muito mais.",
    tags: ["Residencial", "Comercial", "Pós-obra"],
    price: "A partir de R$ 80",
  },
  {
    icon: Wrench, name: "Reparos Gerais", color: "bg-orange-50 text-orange-500", border: "border-orange-100",
    desc: "Consertos em geral: portas, janelas, fechaduras, furos.",
    tags: ["Portas", "Janelas", "Fechaduras"],
    price: "A partir de R$ 60",
  },
  {
    icon: TreePine, name: "Jardinagem", color: "bg-green-50 text-green-500", border: "border-green-100",
    desc: "Corte de grama, podas, paisagismo e manutenção de jardins.",
    tags: ["Podas", "Paisagismo", "Grama"],
    price: "A partir de R$ 90",
  },
  {
    icon: Hammer, name: "Montagem", color: "bg-purple-50 text-purple-500", border: "border-purple-100",
    desc: "Montagem de móveis, estantes, cadeiras, camas e escritórios.",
    tags: ["Móveis", "Estantes", "Escritório"],
    price: "A partir de R$ 70",
  },
  {
    icon: Zap, name: "Elétrica", color: "bg-yellow-50 text-yellow-500", border: "border-yellow-100",
    desc: "Instalações elétricas, troca de tomadas, disjuntores e iluminação.",
    tags: ["Tomadas", "Iluminação", "Quadro"],
    price: "A partir de R$ 100",
  },
  {
    icon: Paintbrush, name: "Pintura", color: "bg-pink-50 text-pink-500", border: "border-pink-100",
    desc: "Pintura interna, externa, textura e acabamentos especiais.",
    tags: ["Interna", "Externa", "Textura"],
    price: "A partir de R$ 120",
  },
  {
    icon: Droplet, name: "Encanamento", color: "bg-cyan-50 text-cyan-500", border: "border-cyan-100",
    desc: "Vazamentos, desentupimentos, instalação de torneiras e chuveiros.",
    tags: ["Vazamentos", "Entupimentos", "Torneiras"],
    price: "A partir de R$ 80",
  },
  {
    icon: Truck, name: "Mudança", color: "bg-indigo-50 text-indigo-500", border: "border-indigo-100",
    desc: "Fretes, mudanças residenciais e transporte de móveis.",
    tags: ["Frete", "Mudança", "Transporte"],
    price: "A partir de R$ 150",
  },
  {
    icon: Home, name: "Reforma", color: "bg-amber-50 text-amber-500", border: "border-amber-100",
    desc: "Reformas completas de banheiro, cozinha, piso e revestimentos.",
    tags: ["Banheiro", "Cozinha", "Piso"],
    price: "A partir de R$ 300",
  },
  {
    icon: Scissors, name: "Costura", color: "bg-rose-50 text-rose-500", border: "border-rose-100",
    desc: "Ajustes, reparos e criação de roupas e cortinas sob medida.",
    tags: ["Ajustes", "Cortinas", "Roupas"],
    price: "A partir de R$ 30",
  },
  {
    icon: Wind, name: "Ar-Condicionado", color: "bg-sky-50 text-sky-500", border: "border-sky-100",
    desc: "Instalação, limpeza e manutenção de ar-condicionado.",
    tags: ["Instalação", "Higienização", "Manutenção"],
    price: "A partir de R$ 120",
  },
  {
    icon: Sofa, name: "Impermeabilização", color: "bg-teal-50 text-teal-500", border: "border-teal-100",
    desc: "Higienização e impermeabilização de sofás, tapetes e colchões.",
    tags: ["Sofás", "Tapetes", "Colchões"],
    price: "A partir de R$ 100",
  },
];

const diferenciais = [
  { icon: BadgeCheck, title: "Profissionais Verificados", desc: "Todos passam por verificação de identidade, antecedentes e avaliação técnica antes de entrar na plataforma." },
  { icon: Shield, title: "Pagamento Seguro", desc: "Seu dinheiro fica retido até a conclusão do serviço. Se algo der errado, você é reembolsado integralmente." },
  { icon: Clock, title: "Atendimento Rápido", desc: "Receba respostas em até 30 minutos. Profissionais disponíveis nos fins de semana e feriados." },
  { icon: Star, title: "Avaliação Garantida", desc: "Cada serviço é avaliado. Só aparecem na busca profissionais com nota acima de 4.5." },
  { icon: Headphones, title: "Suporte 24h", desc: "Nossa equipe está disponível 24 horas por dia, 7 dias por semana para resolver qualquer questão." },
  { icon: CheckCircle, title: "Satisfação Garantida", desc: "Não ficou satisfeito? Acionamos outro profissional sem custo adicional ou devolvemos seu dinheiro." },
];

const testimonials = [
  { name: "Fernanda Costa", city: "São Paulo, SP", service: "Limpeza", text: "Contratei a limpeza pós-reforma e ficou impecável! A profissional trouxe todos os produtos e foi super cuidadosa com os detalhes.", rating: 5 },
  { name: "Roberto Mendes", city: "Curitiba, PR", service: "Elétrica", text: "Precisei instalar 8 tomadas e o eletricista chegou em 45 minutos. Trabalho de qualidade e preço justo. Recomendo!", rating: 5 },
  { name: "Juliana Ferreira", city: "Campinas, SP", service: "Jardinagem", text: "Meu jardim estava um caos. O jardineiro transformou tudo em um dia. Agora agenda mensalmente pela plataforma.", rating: 5 },
];

export function Servicos() {
  return (
    <Layout>
      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-28 bg-secondary text-white overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 text-sm text-white/80 w-fit">
              <Sparkles size={14} className="text-primary" />
              +15 categorias disponíveis
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              Serviços para{" "}
              <span className="text-primary">cada necessidade</span>{" "}
              da sua casa.
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-white/70 max-w-[560px] leading-relaxed">
              Limpeza, elétrica, encanamento, pintura e muito mais. Profissionais verificados prontos para atender você hoje.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button size="lg" className="rounded-[10px] bg-primary hover:bg-primary/90 text-white text-base px-8 h-14 shadow-xl shadow-primary/40">
                Solicitar Serviço <ChevronRight size={18} className="ml-1" />
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
                { value: "500+", label: "Profissionais" },
                { value: "12", label: "Categorias" },
                { value: "4.8★", label: "Avaliação Média" },
                { value: "30min", label: "Resposta Média" },
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

      {/* ── CATEGORIES GRID ── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Categorias</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4 text-secondary">Tudo o que sua casa precisa</h2>
            <p className="text-lg text-muted-foreground">Escolha a categoria e receba orçamentos de profissionais verificados na sua região.</p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat, i) => (
              <FadeIn key={cat.name} delay={i * 0.05}>
                <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} className="h-full">
                  <Card className={`h-full group cursor-pointer bg-white border ${cat.border} hover:shadow-xl transition-all duration-300`}>
                    <CardContent className="p-6 flex flex-col gap-4">
                      <div className="flex items-start justify-between">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.color} shrink-0`}>
                          <cat.icon size={24} />
                        </div>
                        <span className="text-xs font-semibold text-primary bg-primary/8 px-2 py-1 rounded-full">{cat.price}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-secondary group-hover:text-primary transition-colors mb-1">{cat.name}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{cat.desc}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                        {cat.tags.map(tag => (
                          <span key={tag} className="text-[11px] text-secondary/60 bg-secondary/5 border border-secondary/10 px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
                        Solicitar <ArrowRight size={14} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIFERENCIAIS ── */}
      <section className="py-28 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <FadeIn className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Por que a Prontto</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4 text-white">Segurança e qualidade em cada serviço</h2>
            <p className="text-lg text-white/60">Não deixamos nada ao acaso. Cada detalhe foi pensado para sua tranquilidade.</p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {diferenciais.map((d, i) => (
              <FadeIn key={d.title} delay={i * 0.1}>
                <div className="flex flex-col gap-4 bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                    <d.icon size={22} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-white text-lg">{d.title}</h3>
                  <p className="text-white/55 leading-relaxed text-sm">{d.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-28 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 0L1440 0L1440 30C1200 60 960 0 720 30C480 60 240 0 0 30L0 0Z" fill="hsl(218 31% 12%)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 md:px-6 pt-10">
          <FadeIn className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Depoimentos</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4 text-secondary">Clientes que confiam na Prontto</h2>
            <p className="text-lg text-muted-foreground">Histórias reais de quem já resolveu seus problemas com a gente.</p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={i} delay={i * 0.15} dir={i === 0 ? "left" : i === 2 ? "right" : "up"}>
                <Card className="h-full bg-white border-border/40 hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                  <CardContent className="p-8 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-0.5">
                        {Array.from({ length: t.rating }).map((_, j) => (
                          <Star key={j} size={14} className="text-primary fill-primary" />
                        ))}
                      </div>
                      <span className="text-[11px] font-semibold text-primary bg-primary/8 px-2 py-0.5 rounded-full">{t.service}</span>
                    </div>
                    <p className="text-secondary/75 leading-relaxed flex-1 text-[15px]">"{t.text}"</p>
                    <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-sm shrink-0">{t.name.charAt(0)}</div>
                      <div>
                        <p className="font-bold text-sm text-secondary">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.city}</p>
                      </div>
                    </div>
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
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">Pronto para resolver?<br />Solicite agora.</h2>
            <p className="text-lg text-white/85 max-w-xl leading-relaxed">Descreva o que precisa e receba propostas de profissionais verificados em minutos.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="rounded-[10px] font-bold px-8 h-14 bg-white text-primary hover:bg-white/90 shadow-2xl shadow-black/20">
                Solicitar Serviço <ArrowRight size={18} className="ml-2" />
              </Button>
              <Link href="/como-funciona">
                <Button size="lg" variant="outline" className="rounded-[10px] text-white border-white/30 hover:bg-white/15 px-8 h-14">Como funciona</Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
}
