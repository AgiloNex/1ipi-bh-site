
-- Create contatos table
CREATE TABLE public.contatos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  interesse TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contatos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form" ON public.contatos FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can read contacts" ON public.contatos FOR SELECT TO authenticated USING (true);

-- Create pedidos_oracao table
CREATE TABLE public.pedidos_oracao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  pedido TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pedidos_oracao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit prayer request" ON public.pedidos_oracao FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read prayer requests" ON public.pedidos_oracao FOR SELECT USING (true);
