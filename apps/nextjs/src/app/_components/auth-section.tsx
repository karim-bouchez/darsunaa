"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@darsunaa/auth/client";
import { Button } from "@darsunaa/ui/button";
import { Input } from "@darsunaa/ui/input";

/**
 * Auth section component
 *
 * Handles authentication using the external auth-service microservice.
 * All authentication operations are handled client-side via the authClient.
 */
export function AuthSection() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message ?? "Sign in failed");
        return;
      }

      router.refresh();
    } catch (err) {
      setError("Sign in failed");
      console.error("Sign in failed:", err);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        setError(result.error.message ?? "Sign up failed");
        return;
      }

      router.refresh();
    } catch (err) {
      setError("Sign up failed");
      console.error("Sign up failed:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center text-2xl">
          <span>Hello, {session.user.name}</span>
        </p>

        <Button size="lg" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex gap-2">
        <Button
          variant={!isSignUp ? "primary" : "outline"}
          onClick={() => setIsSignUp(false)}
          className="flex-1"
        >
          Sign In
        </Button>
        <Button
          variant={isSignUp ? "primary" : "outline"}
          onClick={() => setIsSignUp(true)}
          className="flex-1"
        >
          Sign Up
        </Button>
      </div>

      <form
        onSubmit={isSignUp ? handleSignUp : handleSignIn}
        className="flex flex-col gap-4"
      >
        {isSignUp && (
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" size="lg">
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>
      </form>
    </div>
  );
}
