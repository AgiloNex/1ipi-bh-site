import { useRef } from "react";
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
import { HandHeart } from "lucide-react";

const prayerSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  pedido: z.string().trim().min(10, "Pedido deve ter pelo menos 10 caracteres").max(1000),
});

type PrayerForm = z.infer<typeof prayerSchema>;

const PrayerRequestSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const form = useForm<PrayerForm>({
    resolver: zodResolver(prayerSchema),
    defaultValues: { nome: "", pedido: "" },
  });

  const onSubmit = async (data: PrayerForm) => {
    const { error } = await supabase.from("pedidos_oracao").insert({
      nome: data.nome,
      pedido: data.pedido,
    });

    if (error) {
      toast.error("Erro ao enviar pedido. Tente novamente.");
      return;
    }

    toast.success("Pedido de oração enviado! Estamos orando por você.");
    form.reset();
  };

  return (
    <section id="oracao" className="section-padding bg-background">
      <div className="container-church max-w-2xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-gold font-body text-sm uppercase tracking-[0.2em] mb-2">Estamos Com Você</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">Pedido de Oração</h2>
          <p className="font-body text-muted-foreground mt-4 max-w-lg mx-auto">
            Compartilhe seu pedido conosco. Nossa equipe de intercessão está pronta para orar por você.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card rounded-xl p-6 sm:p-8 shadow-lg border border-border/50"
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
                className="w-full bg-gold text-accent-foreground hover:bg-gold-light font-body font-semibold"
                size="lg"
              >
                <HandHeart className="mr-2 h-4 w-4" />
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
