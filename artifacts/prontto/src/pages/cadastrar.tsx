import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Phone, ChevronRight, CheckCircle } from "lucide-react";

type AccountType = "cliente" | "prestador" | null;

export function Cadastrar() {
  const [tipo, setTipo] = useState<AccountType>(null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-secondary font-sans flex flex-col" style={{ overflowX: "clip" }}>
      {/* Minimal header */}
      <header className="px-6 py-5 flex items-center justify-between relative z-10">
        <Link href="/">
          <span className="text-2xl font-extrabold tracking-tight text-white cursor-pointer">
            PRON<span className="text-primary">TTO</span>
          </span>
        </Link>
        <button onClick={() => tipo ? setTipo(null) : undefined}>
          <Link href={tipo ? "#" : "/"}>
            <span onClick={() => tipo && setTipo(null)} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors cursor-pointer">
              <ArrowLeft size={16} /> {tipo ? "Voltar" : "Voltar ao site"}
            </span>
          </Link>
        </button>
      </header>

      {/* Background glows */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="flex-1 flex items-center justify-center px-4 py-10 relative z-10">
        <div className="w-full max-w-xl">

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 mb-10">
            {["Tipo de conta", "Seus dados", "Confirmação"].map((s, i) => {
              const done = (tipo && i === 0) || false;
              const active = (!tipo && i === 0) || (tipo && i === 1);
              return (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${done ? "bg-primary text-white" : active ? "bg-white/15 text-white border border-white/30" : "bg-white/5 text-white/30 border border-white/10"}`}>
                    {done ? <CheckCircle size={14} /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium transition-colors ${active ? "text-white/80" : "text-white/30"}`}>{s}</span>
                  {i < 2 && <div className="w-8 h-px bg-white/15 ml-1" />}
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {!tipo ? (
              /* ── STEP 1: Choose type ── */
              <motion.div key="choose" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                <div className="text-center mb-10">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Criar conta</h1>
                  <p className="text-white/55">Escolha como você quer usar a Prontto.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    {
                      type: "cliente" as const,
                      emoji: "🏠",
                      title: "Sou Cliente",
                      desc: "Quero contratar profissionais para serviços na minha casa ou empresa.",
                      bullets: ["Solicite orçamentos gratuitos", "Profissionais verificados", "Pagamento seguro na plataforma"],
                    },
                    {
                      type: "prestador" as const,
                      emoji: "🔧",
                      title: "Sou Prestador",
                      desc: "Quero oferecer meus serviços e conseguir novos clientes.",
                      bullets: ["Receba pedidos na sua região", "Defina seus próprios preços", "Receba por Pix imediatamente"],
                    },
                  ].map((opt) => (
                    <motion.button key={opt.type} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setTipo(opt.type)}
                      className="group text-left bg-white/5 border border-white/15 rounded-3xl p-7 hover:bg-white/8 hover:border-primary/50 transition-all duration-300 flex flex-col gap-5">
                      <span className="text-4xl">{opt.emoji}</span>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{opt.title}</h3>
                        <p className="text-white/50 text-sm leading-relaxed">{opt.desc}</p>
                      </div>
                      <ul className="flex flex-col gap-2">
                        {opt.bullets.map((b) => (
                          <li key={b} className="flex items-center gap-2 text-xs text-white/45">
                            <CheckCircle size={12} className="text-primary shrink-0" /> {b}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
                        Selecionar <ChevronRight size={14} />
                      </div>
                    </motion.button>
                  ))}
                </div>
                <p className="text-center text-sm text-white/40 mt-8">
                  Já tem conta?{" "}
                  <Link href="/entrar">
                    <span className="text-primary hover:text-primary/80 font-semibold cursor-pointer">Entrar</span>
                  </Link>
                </p>
              </motion.div>
            ) : (
              /* ── STEP 2: Registration form ── */
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                <div className="text-center mb-8">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-semibold mb-4">
                    {tipo === "cliente" ? "🏠 Cliente" : "🔧 Prestador de serviços"}
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">Seus dados</h1>
                  <p className="text-white/55 text-sm">Preencha abaixo para criar sua conta gratuitamente.</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm flex flex-col gap-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-white/80">Nome completo</label>
                      <div className="relative">
                        <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                        <input type="text" placeholder="Seu nome"
                          className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 pl-10 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-primary transition-all" />
                      </div>
                    </div>
                    {/* Phone */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-white/80">Telefone</label>
                      <div className="relative">
                        <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                        <input type="tel" placeholder="(00) 00000-0000"
                          className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 pl-10 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-primary transition-all" />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-white/80">E-mail</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                      <input type="email" placeholder="seu@email.com"
                        className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 pl-10 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-primary transition-all" />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-white/80">Senha</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                      <input type={showPassword ? "text" : "password"} placeholder="Mínimo 8 caracteres"
                        className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 pl-10 pr-12 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-primary transition-all" />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {tipo === "prestador" && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-white/80">Área de atuação principal</label>
                      <select className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white/70 text-sm focus:outline-none focus:border-primary transition-all appearance-none">
                        <option value="" className="bg-secondary">Selecione uma categoria</option>
                        {["Limpeza", "Elétrica", "Encanamento", "Pintura", "Montagem", "Jardinagem", "Reparos Gerais", "Mudança", "Ar-condicionado", "Outro"].map(c => (
                          <option key={c} value={c} className="bg-secondary">{c}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Terms */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className="w-4 h-4 rounded border border-primary/60 bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-sm bg-primary" />
                    </div>
                    <span className="text-xs text-white/45 leading-relaxed">
                      Concordo com os <a href="#" className="text-primary hover:underline">Termos de Uso</a> e a <a href="#" className="text-primary hover:underline">Política de Privacidade</a> da Prontto.
                    </span>
                  </label>

                  <Button className="w-full h-12 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 shadow-lg shadow-primary/30 mt-1">
                    Criar conta grátis <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>

                <p className="text-center text-sm text-white/40 mt-6">
                  Já tem conta?{" "}
                  <Link href="/entrar">
                    <span className="text-primary font-semibold cursor-pointer hover:text-primary/80 transition-colors">Entrar</span>
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
