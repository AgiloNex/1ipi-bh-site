import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Cross } from "lucide-react";
import { Link } from "react-router-dom";
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
  const [activeSection, setActiveSection] = useState("#inicio");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter((el): el is Element => el !== null);

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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
        <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "location" : undefined}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive ? "text-gold" : "text-primary-foreground/80 hover:text-gold"
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <Button asChild size="sm" variant="secondary" className="ml-2">
            <Link to="/admin">Admin</Link>
          </Button>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex items-center gap-2 min-h-[44px] px-1 text-primary-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          aria-controls="menu-mobile"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="text-sm font-medium">{isOpen ? "Fechar" : "Menu"}</span>
        </button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            id="menu-mobile"
            aria-label="Navegação principal"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden gradient-navy overflow-hidden"
          >
            <div className="flex flex-col px-6 pb-4">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive ? "location" : undefined}
                    className={`flex items-center min-h-[44px] text-sm font-medium transition-colors ${
                      isActive ? "text-gold" : "text-primary-foreground/80 hover:text-gold"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
              <div className="py-2">
                <Button asChild size="sm" variant="secondary" className="w-fit">
                  <Link to="/admin" onClick={() => setIsOpen(false)}>
                    Admin
                  </Link>
                </Button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
