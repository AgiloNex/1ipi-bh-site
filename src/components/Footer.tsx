import { Cross, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="gradient-navy text-primary-foreground">
      <div className="container-church section-padding pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Cross className="h-6 w-6 text-gold" />
              <span className="font-display text-xl font-bold">Igreja Vida Nova</span>
            </div>
            <p className="font-body text-primary-foreground/70 text-sm leading-relaxed">
              Uma comunidade de fé comprometida com o amor, a esperança e a transformação de vidas.
            </p>
          </div>

          {/* Horários */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4 text-gold">Horários</h3>
            <ul className="space-y-2 font-body text-sm text-primary-foreground/70">
              <li>Domingo — 9h e 18h</li>
              <li>Quarta — 19h30 (Estudo Bíblico)</li>
              <li>Sexta — 20h (Jovens)</li>
              <li>Sábado — 16h (Crianças)</li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4 text-gold">Encontre-nos</h3>
            <ul className="space-y-3 font-body text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold flex-shrink-0" />
                Rua da Fé, 123 — Centro
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold flex-shrink-0" />
                (11) 99999-0000
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold flex-shrink-0" />
                contato@vidanova.church
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 text-center">
          <p className="font-body text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} Igreja Vida Nova. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
