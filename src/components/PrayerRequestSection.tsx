import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { HandHeart, Sparkles } from "lucide-react";

const COOLDOWN_MS = 30_000;

const prayerSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  pedido: z.string().trim().min(10, "Pedido deve ter pelo menos 10 caracteres").max(1000),
});

type PrayerForm = z.infer<typeof prayerSchema>;

const PrayerRequestSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [lastSubmit, setLastSubmit] = useState(0);

  const form = useForm<PrayerForm>({
    resolver: zodResolver(prayerSchema),
    defaultValues: { nome: "", pedido: "" },
  });

  const onSubmit = async (data: PrayerForm) => {
    const now = Date.now();
    if (now - lastSubmit < COOLDOWN_MS) {
      const secs = Math.ceil((COOLDOWN_MS - (now - lastSubmit)) / 1000);
      toast.error(`Aguarde ${secs}s antes de enviar outro pedido.`);
      return;
    }

    const { error } = await supabase.from("pedidos_oracao").insert({
      nome: data.nome,
      pedido: data.pedido,
    });

    if (error) {
      if (error.code === "23505") {
        toast.error("Este pedido já foi enviado.");
      } else if (error.code === "42501") {
        toast.error("Erro de permissão ao enviar. Tente novamente mais tarde.");
      } else if (error.code === "429") {
        toast.error("Muitas tentativas. Aguarde um momento e tente novamente.");
      } else {
        toast.error("Erro ao enviar pedido. Tente novamente.");
      }
      return;
    }

    setLastSubmit(Date.now());
    toast.success("Pedido de oração enviado! Estamos orando por você.");
    form.reset();
  };

  return (
    <section id="oracao" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary via-background to-secondary/50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />

      <div className="container-church max-w-2xl relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 mb-4">
            <Sparkles className="h-6 w-6 text-gold" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">Pedido de Oração</h2>
          <p className="font-body text-muted-foreground mt-4 max-w-lg mx-auto">
            Compartilhe seu pedido conosco. Nossa equipe de intercessão está pronta para orar por você.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-border/40"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-body text-card-foreground">Seu Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Como podemos te chamar?" {...field} className="font-body" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pedido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-body text-card-foreground">Seu Pedido</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Escreva seu pedido de oração..."
                        rows={5}
                        {...field}
                        className="font-body resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full bg-gradient-to-r from-gold to-gold-light text-accent-foreground hover:brightness-110 font-body font-semibold shadow-lg shadow-gold/20"
                size="lg"
              >
                {form.formState.isSubmitting ? (
                  <span className="inline-block h-4 w-4 mr-2 rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground animate-spin" />
                ) : (
                  <HandHeart className="mr-2 h-4 w-4" />
                )}
                {form.formState.isSubmitting ? "Enviando..." : "Enviar Pedido de Oração"}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </section>
  );
};

export default PrayerRequestSection;