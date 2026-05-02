import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout";
import { FadeIn } from "@/components/fade-in";
import {
  LayoutDashboard, Clock, CheckCircle, Star, Plus, ChevronRight,
  Bell, Settings, CreditCard, Heart, FileText, Search,
  MapPin, Calendar, Wrench, Sparkles, TreePine, Zap,
  TrendingUp, MessageSquare, LogOut,
} from "lucide-react";

const tabs = ["Visão Geral", "Meus Pedidos", "Favoritos", "Pagamentos"] as const;
type Tab = (typeof tabs)[number];

const recentServices = [
  { id: 1, icon: Sparkles, name: "Limpeza Residencial", provider: "Ana Souza", date: "28 Abr 2026", status: "concluído", rating: 5, value: "R$ 180" },
  { id: 2, icon: Zap, name: "Instalação Elétrica", provider: "Carlos Lima", date: "15 Abr 2026", status: "concluído", rating: 5, value: "R$ 220" },
  { id: 3, icon: TreePine, name: "Jardinagem", provider: "Pedro Costa", date: "02 Mai 2026", status: "em andamento", rating: null, value: "R$ 130" },
];

const quickActions = [
  { icon: Plus, label: "Novo Pedido", color: "bg-primary/15 text-primary", href: "/servicos" },
  { icon: Heart, label: "Favoritos", color: "bg-red-50 text-red-500", href: "#" },
  { icon: FileText, label: "Histórico", color: "bg-blue-50 text-blue-500", href: "#" },
  { icon: CreditCard, label: "Pagamentos", color: "bg-green-50 text-green-500", href: "#" },
  { icon: MessageSquare, label: "Mensagens", color: "bg-purple-50 text-purple-500", href: "#" },
  { icon: Settings, label: "Configurações", color: "bg-gray-50 text-gray-500", href: "#" },
];

const notifications = [
  { text: "Pedro Costa está a caminho para o serviço de Jardinagem", time: "Agora mesmo", unread: true },
  { text: "Avalie o serviço de Instalação Elétrica com Carlos Lima", time: "2 dias atrás", unread: true },
  { text: "Seu pagamento de R$ 180 foi confirmado", time: "5 dias atrás", unread: false },
];

export function MinhaArea() {
  const [activeTab, setActiveTab] = useState<Tab>("Visão Geral");
  const [showNotif, setShowNotif] = useState(false);

  return (
    <Layout>
      <div className="bg-background min-h-screen">

        {/* ── Dashboard Header ── */}
        <section className="bg-secondary pt-28 pb-10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary border border-primary/30">
                  M
                </div>
                <div>
                  <p className="text-white/50 text-sm">Bem-vindo de volta</p>
                  <h1 className="text-2xl font-bold text-white">Maria Fernanda</h1>
                  <p className="text-white/40 text-xs mt-0.5">Cliente · São Paulo, SP</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNotif(!showNotif)}
                    className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/12 transition-colors relative">
                    <Bell size={18} />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[9px] font-bold text-white flex items-center justify-center">2</span>
                  </motion.button>
                  {showNotif && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-border z-50 overflow-hidden">
                      <div className="p-4 border-b border-border flex items-center justify-between">
                        <span className="font-bold text-secondary">Notificações</span>
                        <button onClick={() => setShowNotif(false)} className="text-xs text-muted-foreground hover:text-primary">Marcar tudo como lido</button>
                      </div>
                      {notifications.map((n, i) => (
                        <div key={i} className={`p-4 border-b border-border/50 last:border-0 flex gap-3 ${n.unread ? "bg-primary/3" : ""}`}>
                          {n.unread && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                          {!n.unread && <div className="w-2 shrink-0" />}
                          <div>
                            <p className="text-sm text-secondary leading-snug">{n.text}</p>
                            <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
                <Link href="/entrar">
                  <Button variant="outline" size="sm" className="rounded-xl border-white/20 text-white hover:bg-white/10 gap-2">
                    <LogOut size={14} /> Sair
                  </Button>
                </Link>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-8 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
              {tabs.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab ? "bg-primary text-white shadow-md" : "text-white/50 hover:text-white"}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Content ── */}
        <div className="container mx-auto px-4 md:px-6 py-10">

          {activeTab === "Visão Geral" && (
            <div className="flex flex-col gap-8">
              {/* Stats */}
              <FadeIn>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: LayoutDashboard, label: "Pedidos Totais", value: "12", sub: "desde jan 2025", color: "bg-blue-50 text-blue-600" },
                    { icon: CheckCircle, label: "Concluídos", value: "10", sub: "83% de sucesso", color: "bg-green-50 text-green-600" },
                    { icon: Clock, label: "Em Andamento", value: "1", sub: "Jardinagem hoje", color: "bg-orange-50 text-orange-600" },
                    { icon: Star, label: "Avaliação Média", value: "4.9", sub: "10 avaliações", color: "bg-yellow-50 text-yellow-600" },
                  ].map((s, i) => (
                    <motion.div key={i} whileHover={{ y: -2 }}>
                      <Card className="bg-white border-border/40 hover:shadow-md transition-shadow">
                        <CardContent className="p-5 flex flex-col gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                            <s.icon size={18} />
                          </div>
                          <div>
                            <p className="text-3xl font-bold text-secondary">{s.value}</p>
                            <p className="text-sm font-medium text-secondary/80">{s.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </FadeIn>

              {/* Quick Actions */}
              <FadeIn delay={0.1}>
                <div>
                  <h2 className="font-bold text-secondary text-lg mb-4">Ações Rápidas</h2>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {quickActions.map((a, i) => (
                      <Link key={i} href={a.href}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-white border border-border/40 hover:shadow-md hover:border-primary/20 cursor-pointer transition-all">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.color}`}>
                            <a.icon size={18} />
                          </div>
                          <span className="text-xs font-medium text-secondary text-center leading-snug">{a.label}</span>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Recent services */}
              <FadeIn delay={0.15}>
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold text-secondary text-lg">Serviços Recentes</h2>
                    <button className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors">
                      Ver todos <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    {recentServices.map((s) => (
                      <Card key={s.id} className="bg-white border-border/40 hover:shadow-md hover:border-primary/15 transition-all cursor-pointer">
                        <CardContent className="p-5 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-secondary/8 flex items-center justify-center shrink-0">
                            <s.icon size={20} className="text-secondary/60" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-semibold text-secondary">{s.name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                                  <span>{s.provider}</span>
                                  <span>·</span>
                                  <Calendar size={11} />
                                  <span>{s.date}</span>
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-1 shrink-0">
                                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${s.status === "concluído" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}>
                                  {s.status}
                                </span>
                                <span className="text-sm font-bold text-secondary">{s.value}</span>
                              </div>
                            </div>
                            {s.rating && (
                              <div className="flex gap-0.5 mt-2">
                                {Array.from({ length: s.rating }).map((_, j) => (
                                  <Star key={j} size={11} className="text-primary fill-primary" />
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Promo banner */}
              <FadeIn delay={0.2}>
                <div className="bg-primary rounded-3xl p-7 flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                  <div className="flex-1">
                    <span className="text-white/70 text-sm font-medium">Para Você</span>
                    <h3 className="text-xl font-bold text-white mt-1 mb-2">Solicite um novo serviço agora</h3>
                    <p className="text-white/70 text-sm">Mais de 500 profissionais verificados disponíveis hoje.</p>
                  </div>
                  <Link href="/servicos">
                    <Button className="rounded-xl bg-white text-primary font-bold hover:bg-white/90 shadow-lg shrink-0 px-6">
                      Solicitar Serviço <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </Link>
                </div>
              </FadeIn>
            </div>
          )}

          {activeTab !== "Visão Geral" && (
            <FadeIn dir="none">
              <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
                <div className="w-20 h-20 rounded-3xl bg-secondary/5 flex items-center justify-center">
                  {activeTab === "Meus Pedidos" && <Wrench size={32} className="text-secondary/30" />}
                  {activeTab === "Favoritos" && <Heart size={32} className="text-secondary/30" />}
                  {activeTab === "Pagamentos" && <CreditCard size={32} className="text-secondary/30" />}
                </div>
                <div>
                  <h3 className="font-bold text-secondary text-xl mb-2">{activeTab}</h3>
                  <p className="text-muted-foreground max-w-xs">Esta seção estará disponível em breve com todas as informações detalhadas.</p>
                </div>
                <Link href="/servicos">
                  <Button className="rounded-xl bg-primary text-white mt-2">Solicitar Novo Serviço</Button>
                </Link>
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </Layout>
  );
}
