import { useState, useEffect, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";

type FadeDir = "up" | "left" | "right" | "none";

export function FadeIn({
  children, className, delay = 0, dir = "up",
}: { children: ReactNode; className?: string; delay?: number; dir?: FadeDir }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight + 80) setShow(true);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);
  const hidden: Record<string, number> =
    dir === "left" ? { opacity: 0, x: -40, y: 0 }
    : dir === "right" ? { opacity: 0, x: 40, y: 0 }
    : dir === "none" ? { opacity: 0, x: 0, y: 0 }
    : { opacity: 0, x: 0, y: 36 };
  return (
    <motion.div ref={ref} initial={hidden}
      animate={show ? { opacity: 1, x: 0, y: 0 } : hidden}
      transition={{ duration: 0.65, delay, ease: "easeOut" }}
      className={className}>
      {children}
    </motion.div>
  );
}
