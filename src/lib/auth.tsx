import { createContext, useContext, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "../../shared/types";
import { api } from "./api";

interface AuthContextValue {
  user: User | null | undefined;
  isLoading: boolean;
  login: (email: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const { user } = await api.getMe();
      return user;
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (email: string) => {
      const { user } = await api.login(email);
      return user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.logout();
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.clear();
    },
  });

  const value: AuthContextValue = {
    user: meQuery.data,
    isLoading: meQuery.isLoading,
    login: (email) => loginMutation.mutateAsync(email),
    logout: () => logoutMutation.mutateAsync(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
