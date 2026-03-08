import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Cross } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Ministérios", href: "#ministerios" },
  { label: "Galeria", href: "#galeria" },
  { label: "Contato", href: "#contato" },
  { label: "Oração", href: "#oracao" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 gradient-navy backdrop-blur-sm">
      <div className="container-church flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <a href="#inicio" className="flex items-center gap-2">
          <Cross className="h-6 w-6 text-gold" />
          <span className="font-display text-lg font-bold text-primary-foreground">
            Igreja Vida Nova
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-primary-foreground/80 hover:text-gold transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-primary-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden gradient-navy overflow-hidden"
          >
            <div className="flex flex-col gap-4 px-6 pb-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-primary-foreground/80 hover:text-gold transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
