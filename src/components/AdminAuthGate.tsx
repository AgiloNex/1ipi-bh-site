import { useState } from "react";
import { Shield, Eye, EyeOff, Cross } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AUTH_KEY = "1ipi-bh-admin-auth";
const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || "admin123";

type AdminAuthGateProps = {
  children: React.ReactNode;
};

const AdminAuthGate = ({ children }: AdminAuthGateProps) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [authenticated, setAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === "true";
    } catch {
      return false;
    }
  });

  const handleLogin = () => {
    if (pin === ADMIN_PIN) {
      try {
        sessionStorage.setItem(AUTH_KEY, "true");
      } catch {}
      setAuthenticated(true);
      setError(false);
      setPin("");
    } else {
      setError(true);
    }
  };

  if (authenticated) return <>{children}</>;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Acesso Restrito</h1>
          <p className="font-body text-sm text-muted-foreground mt-2">
            Digite o PIN de administrador para continuar.
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm">
          <div className="space-y-4">
            <div className="relative">
              <Input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLogin();
                }}
                placeholder="PIN de acesso"
                className="font-body pr-10"
                autoFocus
                aria-invalid={error}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPin ? "Esconder PIN" : "Mostrar PIN"}
              >
                {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <p className="font-body text-xs text-destructive" role="alert">
                PIN incorreto. Tente novamente.
              </p>
            )}

            <Button onClick={handleLogin} className="w-full" size="lg">
              Acessar Painel
            </Button>
          </div>

          <div className="mt-6 pt-4 border-t border-border/40">
            <a
              href="/"
              className="flex items-center justify-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Cross className="h-3.5 w-3.5" />
              Voltar ao site
            </a>
          </div>
        </div>

        <p className="text-center mt-6 font-body text-xs text-muted-foreground">
          Configure o PIN via VITE_ADMIN_PIN no arquivo .env
        </p>
      </div>
    </main>
  );
};

export default AdminAuthGate;