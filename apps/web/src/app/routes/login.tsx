import { useState } from "react";
import { useNavigate } from "react-router";
import { AuthForm } from "@/components/auth-form";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@repo/libs";
import type { Route } from "./+types/login";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Sign In - WaterBiller" },
    { name: "description", content: "Sign in to your WaterBiller account" },
  ];
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: { username: string; password: string }) => {
    setError(undefined);
    setIsLoading(true);

    try {
      const { data: result, error } = await api["sign-in"].post({
        username: data.username,
        password: data.password,
      });

      if (error) {
        setError((error.value as any)?.error || "Failed to sign in");
        return;
      }

      // Update auth context
      login(result);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return <AuthForm mode="login" onSubmit={handleLogin} error={error} isLoading={isLoading} />;
}
