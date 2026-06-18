import { create } from "zustand";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export type AuthStatus = "unknown" | "authenticated" | "unauthenticated";

interface AuthState {
  status: AuthStatus;
  user: User | null;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: "unknown",
  user: null,
  setUser: (user) => {
    set({
      user,
      status: user ? "authenticated" : "unauthenticated",
    });
  },
  signOut: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ status: "unauthenticated", user: null });
  },
  checkSession: async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    set({
      user: session?.user || null,
      status: session?.user ? "authenticated" : "unauthenticated",
    });
  },
}));
