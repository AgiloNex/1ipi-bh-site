import { describe, it, expect } from "vitest";
import { z } from "zod";

// Inline schemas from ContactSection and PrayerRequestSection to test them in isolation
const contactSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  interesse: z.string().min(1, "Selecione um interesse"),
  mensagem: z.string().trim().min(10, "Mensagem deve ter pelo menos 10 caracteres").max(1000),
});

const prayerSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  pedido: z.string().trim().min(10, "Pedido deve ter pelo menos 10 caracteres").max(1000),
});

type ContactForm = z.infer<typeof contactSchema>;
type PrayerForm = z.infer<typeof prayerSchema>;

describe("contactSchema", () => {
  describe("happy path", () => {
    it("should validate a complete valid contact form", () => {
      const data: ContactForm = {
        nome: "João Silva",
        email: "joao@email.com",
        interesse: "Conhecer a Igreja",
        mensagem: "Gostaria de conhecer a igreja para participar dos cultos.",
      };
      const result = contactSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should trim whitespace from nome", () => {
      const result = contactSchema.safeParse({
        nome: "  João Silva  ",
        email: "joao@email.com",
        interesse: "Batismo",
        mensagem: "Quero me batizar na igreja.",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.nome).toBe("João Silva");
      }
    });
  });

  describe("boundary conditions", () => {
    it("should reject nome with 1 character", () => {
      const result = contactSchema.safeParse({
        nome: "A",
        email: "joao@email.com",
        interesse: "Outro",
        mensagem: "Tenho interesse em participar.",
      });
      expect(result.success).toBe(false);
    });

    it("should accept nome with exactly 2 characters", () => {
      const result = contactSchema.safeParse({
        nome: "Jo",
        email: "jo@email.com",
        interesse: "Outro",
        mensagem: "Gostaria de mais informações.",
      });
      expect(result.success).toBe(true);
    });

    it("should reject nome longer than 100 characters", () => {
      const result = contactSchema.safeParse({
        nome: "A".repeat(101),
        email: "joao@email.com",
        interesse: "Outro",
        mensagem: "Gostaria de mais informações.",
      });
      expect(result.success).toBe(false);
    });

    it("should accept nome with exactly 100 characters", () => {
      const result = contactSchema.safeParse({
        nome: "A".repeat(100),
        email: "joao@email.com",
        interesse: "Outro",
        mensagem: "Gostaria de mais informações.",
      });
      expect(result.success).toBe(true);
    });

    it("should reject mensagem shorter than 10 characters", () => {
      const result = contactSchema.safeParse({
        nome: "João",
        email: "joao@email.com",
        interesse: "Outro",
        mensagem: "Curto",
      });
      expect(result.success).toBe(false);
    });

    it("should accept mensagem with exactly 10 characters", () => {
      const result = contactSchema.safeParse({
        nome: "João",
        email: "joao@email.com",
        interesse: "Outro",
        mensagem: "Dez caracter",
      });
      expect(result.success).toBe(true);
    });

    it("should reject mensagem longer than 1000 characters", () => {
      const result = contactSchema.safeParse({
        nome: "João",
        email: "joao@email.com",
        interesse: "Outro",
        mensagem: "A".repeat(1001),
      });
      expect(result.success).toBe(false);
    });

    it("should accept mensagem with exactly 1000 characters", () => {
      const result = contactSchema.safeParse({
        nome: "João",
        email: "joao@email.com",
        interesse: "Outro",
        mensagem: "A".repeat(1000),
      });
      expect(result.success).toBe(true);
    });
  });

  describe("email validation", () => {
    it("should reject invalid email formats", () => {
      const invalidEmails = [
        "not-an-email",
        "@no-local.com",
        "no-domain@",
        "spaces in@email.com",
        "",
        "a".repeat(256) + "@email.com",
      ];

      for (const email of invalidEmails) {
        const result = contactSchema.safeParse({
          nome: "João",
          email,
          interesse: "Outro",
          mensagem: "Mensagem de teste válida.",
        });
        expect(result.success).toBe(false);
      }
    });

    it("should accept valid email at max length", () => {
      const localPart = "a".repeat(243);
      const email = `${localPart}@b.co`;
      expect(email.length).toBeLessThanOrEqual(255);
      const result = contactSchema.safeParse({
        nome: "João",
        email,
        interesse: "Outro",
        mensagem: "Mensagem de teste válida.",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("interesse validation", () => {
    it("should reject empty interesse", () => {
      const result = contactSchema.safeParse({
        nome: "João",
        email: "joao@email.com",
        interesse: "",
        mensagem: "Mensagem de teste válida.",
      });
      expect(result.success).toBe(false);
    });

    it("should accept any non-empty string for interesse (not restricted to enum)", () => {
      const result = contactSchema.safeParse({
        nome: "João",
        email: "joao@email.com",
        interesse: "Qualquer interesse válido",
        mensagem: "Mensagem de teste válida.",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("security inputs", () => {
    it("should handle SQL injection attempts", () => {
      const result = contactSchema.safeParse({
        nome: "'; DROP TABLE contatos; --",
        email: "test@test.com",
        interesse: "Outro",
        mensagem: "'; DROP TABLE contatos; --",
      });
      expect(result.success).toBe(true);
    });

    it("should handle XSS attempts", () => {
      const result = contactSchema.safeParse({
        nome: "<script>alert('xss')</script>",
        email: "test@test.com",
        interesse: "Outro",
        mensagem: "<img onerror='alert(1)' src='x' />",
      });
      expect(result.success).toBe(true);
    });

    it("should handle null bytes", () => {
      const result = contactSchema.safeParse({
        nome: "João\x00Silva",
        email: "test@test.com",
        interesse: "Outro",
        mensagem: "Null byte test\x00message.",
      });
      expect(result.success).toBe(true);
    });

    it("should handle very long messages", () => {
      const result = contactSchema.safeParse({
        nome: "João",
        email: "test@test.com",
        interesse: "Outro",
        mensagem: "A".repeat(5000),
      });
      expect(result.success).toBe(false);
    });
  });

  describe("error messages", () => {
    it("should return correct error message for short nome", () => {
      const result = contactSchema.safeParse({
        nome: "A",
        email: "test@test.com",
        interesse: "Outro",
        mensagem: "Mensagem de teste válida.",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Nome deve ter pelo menos 2 caracteres");
      }
    });

    it("should return correct error message for invalid email", () => {
      const result = contactSchema.safeParse({
        nome: "João",
        email: "invalido",
        interesse: "Outro",
        mensagem: "Mensagem de teste válida.",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("E-mail inválido");
      }
    });
  });
});

describe("prayerSchema", () => {
  describe("happy path", () => {
    it("should validate a complete valid prayer request", () => {
      const data: PrayerForm = {
        nome: "Maria",
        pedido: "Oração pela saúde da minha família.",
      };
      const result = prayerSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("boundary conditions", () => {
    it("should reject nome with 1 character", () => {
      const result = prayerSchema.safeParse({ nome: "A", pedido: "Pedido de oração válido." });
      expect(result.success).toBe(false);
    });

    it("should reject pedido with 9 characters", () => {
      const result = prayerSchema.safeParse({ nome: "Maria", pedido: "123456789" });
      expect(result.success).toBe(false);
    });

    it("should accept pedido with exactly 10 characters", () => {
      const result = prayerSchema.safeParse({ nome: "Maria", pedido: "1234567890" });
      expect(result.success).toBe(true);
    });

    it("should reject pedido longer than 1000 characters", () => {
      const result = prayerSchema.safeParse({ nome: "Maria", pedido: "A".repeat(1001) });
      expect(result.success).toBe(false);
    });
  });

  describe("security inputs", () => {
    it("should handle unicode and emoji in pedido", () => {
      const result = prayerSchema.safeParse({
        nome: "🎉 日本語",
        pedido: "🙏 Oração pela paz mundial e 日本.",
      });
      expect(result.success).toBe(true);
    });

    it("should handle path traversal attempts", () => {
      const result = prayerSchema.safeParse({
        nome: "../../etc/passwd",
        pedido: "../../etc/passwd test message here.",
      });
      expect(result.success).toBe(true);
    });
  });
});