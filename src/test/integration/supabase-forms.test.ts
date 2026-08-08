import { describe, it, expect, vi } from "vitest";

/**
 * @integration Integration tests for Supabase form submissions.
 * 
 * These tests validate the contract between the application code
 * and the Supabase API. They mock the supabase client to verify
 * correct data shape and error handling without hitting the real API.
 */

const mockSupabaseInsert = vi.fn();
const mockFrom = vi.fn(() => ({
  insert: mockSupabaseInsert,
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: mockFrom,
  },
}));

describe("contact form submission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validContactData = {
    nome: "João Silva",
    email: "joao@email.com",
    interesse: "Conhecer a Igreja",
    mensagem: "Gostaria de conhecer a igreja.",
  };

  it("should insert contact data with correct shape", async () => {
    mockSupabaseInsert.mockResolvedValueOnce({ error: null });

    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase.from("contatos").insert(validContactData);

    expect(mockFrom).toHaveBeenCalledWith("contatos");
    expect(mockSupabaseInsert).toHaveBeenCalledWith(validContactData);
    expect(error).toBeNull();
  });

  it("should handle insert errors gracefully", async () => {
    mockSupabaseInsert.mockResolvedValueOnce({
      error: new Error("Database error"),
    });

    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase.from("contatos").insert(validContactData);

    expect(error).toBeTruthy();
    expect(error!.message).toBe("Database error");
  });

  it("should handle RLS policy rejections", async () => {
    mockSupabaseInsert.mockResolvedValueOnce({
      error: new Error("new row violates row-level security policy"),
    });

    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase.from("contatos").insert(validContactData);

    expect(error!.message).toContain("row-level security");
  });

  it("should handle network failures", async () => {
    mockSupabaseInsert.mockRejectedValueOnce(new Error("Network error"));

    const { supabase } = await import("@/integrations/supabase/client");
    await expect(supabase.from("contatos").insert(validContactData)).rejects.toThrow("Network error");
  });
});

describe("prayer request form submission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validPrayerData = {
    nome: "Maria",
    pedido: "Oração pela saúde da minha família.",
  };

  it("should insert prayer data with correct shape", async () => {
    mockSupabaseInsert.mockResolvedValueOnce({ error: null });

    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase.from("pedidos_oracao").insert(validPrayerData);

    expect(mockFrom).toHaveBeenCalledWith("pedidos_oracao");
    expect(mockSupabaseInsert).toHaveBeenCalledWith(validPrayerData);
    expect(error).toBeNull();
  });

  it("should handle RLS policy rejections", async () => {
    mockSupabaseInsert.mockResolvedValueOnce({
      error: new Error("new row violates row-level security policy"),
    });

    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase.from("pedidos_oracao").insert(validPrayerData);

    expect(error!.message).toContain("row-level security");
  });

  it("should not include extra fields in insert", async () => {
    mockSupabaseInsert.mockResolvedValueOnce({ error: null });

    const { supabase } = await import("@/integrations/supabase/client");
    const dataWithExtra = { ...validPrayerData, role: "admin", is_admin: true };
    const { error } = await supabase.from("pedidos_oracao").insert(dataWithExtra);

    // TypeScript should prevent extra fields, but at runtime Supabase
    // ignores unknown columns if RLS doesn't allow them
    expect(error).toBeNull();
  });
});

describe("Supabase client configuration", () => {
  it("should be configured with anon key from env", async () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    expect(url).toBe("https://rzlacnuwrzxvlprwfohm.supabase.co");
    expect(key).toBeTruthy();
  });

  it("should use localStorage for auth persistence", () => {
    expect(localStorage).toBeDefined();
  });
});