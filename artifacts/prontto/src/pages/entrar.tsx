import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from "lucide-react";

export function Entrar() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-secondary font-sans flex flex-col" style={{ overflowX: "clip" }}>
      {/* Minimal header */}
      <header className="px-6 py-5 flex items-center justify-between">
        <Link href="/">
          <span className="text-2xl font-extrabold tracking-tight text-white cursor-pointer">
            PRON<span className="text-primary">TTO</span>
          </span>
        </Link>
        <Link href="/">
          <span className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors cursor-pointer">
            <ArrowLeft size={16} /> Voltar
          </span>
        </Link>
      </header>

      {/* Background glows */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="w-full max-w-md">

          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Bem-vindo de volta</h1>
            <p className="text-white/55">Entre na sua conta para gerenciar seus serviços.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/80">E-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="email" placeholder="seu@email.com"
                  className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 pl-10 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-primary focus:bg-white/10 transition-all" />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white/80">Senha</label>
                <a href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">Esqueci minha senha</a>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input type={showPassword ? "text" : "password"} placeholder="••••••••"
                  className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 pl-10 pr-12 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-primary focus:bg-white/10 transition-all" />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="w-4 h-4 rounded border border-white/20 bg-white/8 flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-sm bg-primary opacity-0 peer-checked:opacity-100" />
              </div>
              <span className="text-sm text-white/55">Lembrar minha conta</span>
            </label>

            <Button className="w-full h-12 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 shadow-lg shadow-primary/30 mt-1">
              Entrar
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-white/30">ou continue com</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Google", letter: "G", color: "text-red-400" },
                { label: "Apple", letter: "", color: "text-white" },
              ].map((s) => (
                <motion.button key={s.label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 h-11 rounded-xl bg-white/8 border border-white/15 text-white/80 text-sm font-medium hover:bg-white/12 transition-colors">
                  <span className={`font-bold ${s.color}`}>{s.letter || "⌘"}</span>
                  {s.label}
                </motion.button>
              ))}
            </div>

          </div>

          <p className="text-center text-sm text-white/40 mt-8">
            Não tem conta?{" "}
            <Link href="/cadastrar">
              <span className="text-primary hover:text-primary/80 font-semibold cursor-pointer transition-colors">Cadastre-se grátis</span>
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
