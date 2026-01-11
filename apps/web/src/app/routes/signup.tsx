import { useState } from "react";
import { useNavigate } from "react-router";
import { AuthForm } from "@/components/auth-form";
import { api } from "@repo/libs";
import type { Route } from "./+types/signup";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Sign Up - WaterBiller" },
    { name: "description", content: "Create your WaterBiller account" },
  ];
}

export default function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (data: {
    name: string;
    username: string;
    email: string;
    password: string;
  }) => {
    setError(undefined);
    setIsLoading(true);

    try {
      const { data: result, error } = await api["sign-up"].post({
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
      });

      if (error) {
        setError((error.value as any)?.error || "Failed to create account");
        return;
      }

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(result));

      // Redirect to dashboard or home
      navigate("/dashboard");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return <AuthForm mode="signup" onSubmit={handleSignup} error={error} isLoading={isLoading} />;
}
