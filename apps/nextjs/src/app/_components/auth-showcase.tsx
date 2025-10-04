"use client";

import { useRouter } from "next/navigation";

import { Button } from "@darsunaa/ui/button";
import { authClient } from "@darsunaa/auth/client";

/**
 * Auth showcase component
 *
 * This component demonstrates authentication using the external auth-service microservice.
 * All authentication operations are handled client-side via the authClient.
 */
export function AuthShowcase() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleSignIn = async () => {
    try {
      const res = await authClient.signIn.social({
        provider: "discord",
        callbackURL: "/",
      });

      // Better-Auth returns { data, error }
      if (res.error) {
        console.error("Sign in failed:", res.error);
        return;
      }

      // Redirect to OAuth provider URL
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error("Sign in failed:", error);
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

  if (!session) {
    return (
      <Button size="lg" onClick={handleSignIn}>
        Sign in with Discord
      </Button>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        <span>Logged in as {session.user.name}</span>
      </p>

      <Button size="lg" onClick={handleSignOut}>
        Sign out
      </Button>
    </div>
  );
}
