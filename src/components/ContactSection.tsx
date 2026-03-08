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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Send } from "lucide-react";

const contactSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  interesse: z.string().min(1, "Selecione um interesse"),
  mensagem: z.string().trim().min(10, "Mensagem deve ter pelo menos 10 caracteres").max(1000),
});

type ContactForm = z.infer<typeof contactSchema>;

const interesses = [
  "Conhecer a Igreja",
  "Participar de um Ministério",
  "Escola Bíblica",
  "Ação Social",
  "Casamento",
  "Batismo",
  "Outro",
];

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { nome: "", email: "", interesse: "", mensagem: "" },
  });

  const onSubmit = async (data: ContactForm) => {
    const { error } = await supabase.from("contatos").insert({
      nome: data.nome,
      email: data.email,
      interesse: data.interesse,
      mensagem: data.mensagem,
    });

    if (error) {
      toast.error("Erro ao enviar mensagem. Tente novamente.");
      return;
    }

    toast.success("Mensagem enviada com sucesso!");
    form.reset();
  };

  return (
    <section id="contato" className="section-padding bg-secondary">
      <div className="container-church max-w-2xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-gold font-body text-sm uppercase tracking-[0.2em] mb-2">Fale Conosco</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">Contato</h2>
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
                    <FormLabel className="font-body text-card-foreground">Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} className="font-body" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-body text-card-foreground">E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" type="email" {...field} className="font-body" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interesse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-body text-card-foreground">Interesse</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="font-body">
                          <SelectValue placeholder="Selecione seu interesse" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {interesses.map((item) => (
                          <SelectItem key={item} value={item} className="font-body">
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mensagem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-body text-card-foreground">Mensagem</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Escreva sua mensagem..." rows={4} {...field} className="font-body resize-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body font-semibold"
                size="lg"
              >
                <Send className="mr-2 h-4 w-4" />
                {form.formState.isSubmitting ? "Enviando..." : "Enviar Mensagem"}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
