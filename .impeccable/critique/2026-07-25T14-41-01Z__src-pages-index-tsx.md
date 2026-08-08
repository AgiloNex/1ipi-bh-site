---
target: Igreja Vida Nova — site completo
total_score: 17
p0_count: 2
p1_count: 2
timestamp: 2026-07-25T14-41-01Z
slug: src-pages-index-tsx
---
# Relatório de Critique — Igreja Vida Nova

## Design Health Score

| # | Heurística | Score | Problema Chave |
|---|-----------|-------|---------------|
| 1 | Visibility of System Status | 3 | Toast funciona, mas sem skeleton na galeria |
| 2 | Match System / Real World | 3 | PT-BR correto, mas estrutura "kicker + heading" não é natural |
| 3 | User Control and Freedom | 2 | Sem "voltar ao topo", sem undo |
| 4 | Consistency and Standards | 1 | Toda seção idêntica; `text-gold` vs `text-primary` duplicam ouro |
| 5 | Error Prevention | 3 | Zod schemas OK, mas sem confirmação destrutiva no Admin |
| 6 | Recognition Rather Than Recall | 3 | Nav clara, ícones decorativos sem legenda |
| 7 | Flexibility and Efficiency | 1 | Zero atalhos, sem skip-to-content |
| 8 | Aesthetic and Minimalist Design | 1 | 3 grids de cards idênticos; heroína soterrada pelo gradiente |
| 9 | Error Recovery | 2 | Erro genérico do Supabase sem sugestão |
| 10 | Help and Documentation | 0 | Zero ajuda, FAQ, tooltips |
| **Total** | | **17/40** | **Poor — requires major UX overhaul** |

## Anti-Patterns Verdict

**LLM assessment: 8/10 no slop-ometer.** Toda regra de DON'T foi acionada:
- Playfair Display + Source Sans 3 (reflex-reject pair #1)
- Eyebrow tracked kicker em TODAS as 6 seções
- 3 grids de cards idênticos (ícone + título + descrição)
- Fade-up em literalmente toda seção
- Background beige creme (hsl 210 20% 98%)

**Detector scan: 1 finding (false positive).** `.text-gradient-gold` em `index.css:122` é CSS morto.

**Browser visualization: skipped** — sem browser tool disponível nesta sessão.

## Overall Impression

O site é funcional mas indistinto. A mecânica de template é visível: toda seção segue a mesma receita. A heroína tem a foto mais bonita do site mas o gradiente cobre 80% dela. O admin panel é genuinamente bom, mas está exposto sem autenticação.

## What's Working

1. **Form validation robusta** — Zod schemas com min/max, email validation, mensagens de erro em PT-BR natural.
2. **Admin CRUD funcional** — Reordenar, toggle enabled, edição inline. Arquitetado corretamente.
3. **Mobile nav sólida** — Hamburguer com AnimatePresence, container-church responsivo.

## Priority Issues

### [P0] Homogeneidade de Template
Kicker gold tracking + heading 4xl/5xl + fade-up em todas as 6 seções. Destrói hierarquia visual. Suggested: `$impeccable distill`

### [P0] Heroína — gradiente cobre a foto da igreja
`from-navy-deep/80 via-navy-deep/60 to-navy-deep/90` — o ativo mais emocional do site é quase invisível. Suggested: `$impeccable bolder`

### [P1] Rota /admin sem autenticação
Rota pública, link no header. Risco real de defacement. Suggested: `$impeccable harden`

### [P1] Cards de ministérios com falso affordance
`hover:shadow-lg hover:-translate-y-1` sem onClick. Suggested: `$impeccable clarify`

### [P2] Lightbox usa replace() frágil na URL
`includes("w=600&h=400")` — só funciona com Unsplash exato. Suggested: `$impeccable harden`

## Persona Red Flags

**Jordan (First-timer):** Gradiente esconde igreja; 6 seções idênticas causam tédio; formulário pede escolha antes de contexto.

**Riley (Stress tester):** Admin sem auth; cards fingem ser clicáveis; sem rate limit nos forms.

**Casey (Mobile):** Hero image 3.5MB coberta; sem reduced-motion; 6MB+ de JS.

## Minor Observations
- `border-border/50/60/70` inconsistentes
- PrayerRequest `bg-gold` vs Contact `bg-primary` — duas cores para ações adjacentes
- Timeline hardcoded (não editável pelo Admin)
- `siteContentStorageKey` vaza nome do projeto
- Admin com metalinguagem visível ao público
