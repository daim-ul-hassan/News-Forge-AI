import { create } from "zustand";

export type AuthStatus = "unknown" | "authenticated" | "unauthenticated";

interface AuthState {
  status: AuthStatus;
  user: null;
  signIn: () => void;
  signOut: () => void;
  checkSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: "unauthenticated",
  user: null,
  // TODO: wire to /api/v1/auth
  signIn: () => {
    set({ status: "unauthenticated" });
  },
  signOut: () => {
    set({ status: "unauthenticated", user: null });
  },
  checkSession: () => {
    set({ status: "unauthenticated", user: null });
  },
}));
