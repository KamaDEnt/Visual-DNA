import { useState, useEffect, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const NAV = [
  { href: "/servicos", label: "Serviços" },
  { href: "/como-funciona", label: "Como Funciona" },
  { href: "/para-prestadores", label: "Para Prestadores" },
] as const;

export function Layout({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans text-secondary" style={{ overflowX: "clip" }}>

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"}`}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">

          <Link href="/">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              className="flex items-center gap-1 cursor-pointer">
              <span className={`text-2xl font-extrabold tracking-tight transition-colors duration-300 ${scrolled ? "text-secondary" : "text-white"}`}>
                PRON<span className="text-primary">TTO</span>
              </span>
            </motion.div>
          </Link>

          <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center gap-8">
            {NAV.map((item) => {
              const active = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <span className={`text-sm font-medium hover:text-primary transition-colors relative group cursor-pointer ${active ? "text-primary" : scrolled ? "text-secondary/80" : "text-white/90"}`}>
                    {item.label}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
                  </span>
                </Link>
              );
            })}
          </motion.nav>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            className="hidden md:flex items-center gap-3">
            <Button variant="outline" className={`rounded-[10px] text-sm ${scrolled ? "border-border text-secondary" : "border-white/30 text-white hover:bg-white/10"}`}>Minha Área</Button>
            <Button variant="ghost" className={`rounded-[10px] text-sm ${scrolled ? "text-secondary" : "text-white hover:bg-white/10"}`}>Entrar</Button>
            <Button className="rounded-[10px] text-sm bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/30">Cadastre-se</Button>
          </motion.div>

          <button className={`md:hidden p-2 rounded-md ${scrolled ? "text-secondary" : "text-white"}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
              className="md:hidden bg-white border-t border-border overflow-hidden">
              <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
                {NAV.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <span className="block py-2 text-secondary font-medium border-b border-border/50 last:border-0 cursor-pointer">{item.label}</span>
                  </Link>
                ))}
                <Button variant="outline" className="w-full mt-2 rounded-[10px]">Minha Área</Button>
                <Button className="w-full rounded-[10px] bg-primary text-white">Cadastre-se</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-secondary pt-20 pb-10 text-white/60">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <Link href="/">
                <span className="text-3xl font-extrabold tracking-tight text-white block mb-5 cursor-pointer">
                  PRON<span className="text-primary">TTO</span>
                </span>
              </Link>
              <p className="mb-6 max-w-sm leading-relaxed">O marketplace de serviços domésticos que conecta você aos melhores profissionais da sua região.</p>
            </div>
            {[
              { title: "Plataforma", links: ["Como funciona", "Serviços", "Preços", "Avaliações"] },
              { title: "Profissionais", links: ["Cadastre-se", "Central de Ajuda", "Regras da Comunidade"] },
              { title: "Empresa", links: ["Sobre nós", "Contato", "Termos de Uso", "Privacidade"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">{col.title}</h4>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link}><a href="#" className="text-sm hover:text-primary transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">&copy; {new Date().getFullYear()} Prontto. Todos os direitos reservados.</p>
            <div className="flex items-center gap-3">
              {["In", "Fb", "Ig"].map((social) => (
                <motion.div key={social} whileHover={{ scale: 1.15, backgroundColor: "hsl(24 94% 53%)" }}
                  className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center cursor-pointer text-xs font-bold text-white">
                  {social}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
