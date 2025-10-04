"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { authClient } from "@darsunaa/auth/client";
import { Alert, AlertDescription } from "@darsunaa/ui/alert";
import { Button } from "@darsunaa/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@darsunaa/ui/form";
import { Input } from "@darsunaa/ui/input";

// Form schemas
const signInSchema = z.object({
  email: z.email({ error: "Email invalide" }),
  password: z.string().min(1, { error: "Mot de passe requis" }),
});

const signUpSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Le nom doit contenir au moins 2 caractères" }),
  email: z.email({ error: "Email invalide" }),
  password: z
    .string()
    .min(6, { error: "Le mot de passe doit contenir au moins 6 caractères" }),
});

const forgotPasswordSchema = z.object({
  email: z.email({ error: "Email invalide" }),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { error: "Mot de passe actuel requis" }),
  newPassword: z
    .string()
    .min(6, { error: "Le mot de passe doit contenir au moins 6 caractères" }),
});

const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Le nom doit contenir au moins 2 caractères" }),
});

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
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Forms
  const signInForm = useForm({
    schema: signInSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm({
    schema: signUpSchema,
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const forgotPasswordForm = useForm({
    schema: forgotPasswordSchema,
    defaultValues: {
      email: "",
    },
  });

  const changePasswordForm = useForm({
    schema: changePasswordSchema,
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const updateProfileForm = useForm({
    schema: updateProfileSchema,
    defaultValues: {
      name: "",
    },
  });

  const handleSignIn = async (values: z.infer<typeof signInSchema>) => {
    setError("");
    setSuccess("");

    try {
      const result = await authClient.signIn.email(values);

      if (result.error) {
        setError(result.error.message ?? "Échec de la connexion");
        return;
      }

      router.refresh();
    } catch (err) {
      setError("Échec de la connexion");
      console.error("Sign in failed:", err);
    }
  };

  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    setError("");
    setSuccess("");

    try {
      const result = await authClient.signUp.email(values);

      if (result.error) {
        setError(result.error.message ?? "Échec de l'inscription");
        return;
      }

      router.refresh();
    } catch (err) {
      setError("Échec de l'inscription");
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

  const handleForgotPassword = async (
    values: z.infer<typeof forgotPasswordSchema>,
  ) => {
    setError("");
    setSuccess("");

    try {
      await authClient.forgetPassword({
        email: values.email,
        redirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/reset-password`
            : "/auth/reset-password",
      });

      setSuccess(
        "Un email de réinitialisation a été envoyé. Vérifiez votre boîte de réception.",
      );
      forgotPasswordForm.reset();
    } catch (err) {
      setError("Erreur lors de l'envoi de l'email");
      console.error("Forgot password failed:", err);
    }
  };

  const handleChangePassword = async (
    values: z.infer<typeof changePasswordSchema>,
  ) => {
    setError("");
    setSuccess("");

    try {
      const result = await authClient.changePassword(values);

      if (result.error) {
        setError(
          result.error.message ?? "Erreur lors du changement de mot de passe",
        );
        return;
      }

      setSuccess("Mot de passe modifié avec succès");
      changePasswordForm.reset();
      setIsChangingPassword(false);
    } catch (err) {
      setError("Erreur lors du changement de mot de passe");
      console.error("Change password failed:", err);
    }
  };

  const handleUpdateProfile = async (
    values: z.infer<typeof updateProfileSchema>,
  ) => {
    setError("");
    setSuccess("");

    try {
      const result = await authClient.updateUser(values);

      if (result.error) {
        setError(
          result.error.message ?? "Erreur lors de la mise à jour du profil",
        );
        return;
      }

      setSuccess("Profil mis à jour avec succès");
      updateProfileForm.reset();
      setIsEditingProfile(false);
      router.refresh();
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil");
      console.error("Update profile failed:", err);
    }
  };

  if (session) {
    return (
      <div className="flex w-full max-w-md flex-col gap-4">
        <p className="text-center text-2xl">
          <span>Hello, {session.user.name}</span>
        </p>

        {success && (
          <Alert variant="success">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Edit Profile Section */}
        {!isEditingProfile && !isChangingPassword && (
          <div className="flex flex-col gap-2">
            <Button variant="outline" onClick={() => setIsEditingProfile(true)}>
              Modifier le profil
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsChangingPassword(true)}
            >
              Changer le mot de passe
            </Button>
            <Button size="lg" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        )}

        {/* Edit Profile Form */}
        {isEditingProfile && (
          <Form {...updateProfileForm}>
            <form
              onSubmit={updateProfileForm.handleSubmit(handleUpdateProfile)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={updateProfileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Enregistrer
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsEditingProfile(false);
                    updateProfileForm.reset();
                    setError("");
                    setSuccess("");
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </Form>
        )}

        {/* Change Password Form */}
        {isChangingPassword && (
          <Form {...changePasswordForm}>
            <form
              onSubmit={changePasswordForm.handleSubmit(handleChangePassword)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={changePasswordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe actuel</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Mot de passe actuel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={changePasswordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nouveau mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nouveau mot de passe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Changer
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsChangingPassword(false);
                    changePasswordForm.reset();
                    setError("");
                    setSuccess("");
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {success && (
        <Alert variant="success">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {!isForgotPassword && (
        <>
          <div className="flex gap-2">
            <Button
              variant={!isSignUp ? "primary" : "outline"}
              onClick={() => {
                setIsSignUp(false);
                setError("");
                setSuccess("");
              }}
              className="flex-1"
            >
              Sign In
            </Button>
            <Button
              variant={isSignUp ? "primary" : "outline"}
              onClick={() => {
                setIsSignUp(true);
                setError("");
                setSuccess("");
              }}
              className="flex-1"
            >
              Sign Up
            </Button>
          </div>

          {!isSignUp ? (
            <Form {...signInForm}>
              <form
                onSubmit={signInForm.handleSubmit(handleSignIn)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={signInForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="vous@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signInForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Votre mot de passe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" size="lg">
                  Sign In
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...signUpForm}>
              <form
                onSubmit={signUpForm.handleSubmit(handleSignUp)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={signUpForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signUpForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="vous@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signUpForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Votre mot de passe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" size="lg">
                  Sign Up
                </Button>
              </form>
            </Form>
          )}

          {!isSignUp && (
            <Button
              variant="link"
              type="button"
              onClick={() => {
                setIsForgotPassword(true);
                setError("");
                setSuccess("");
              }}
              className="w-fit self-center"
            >
              Mot de passe oublié ?
            </Button>
          )}
        </>
      )}

      {/* Forgot Password Form */}
      {isForgotPassword && (
        <div className="flex flex-col gap-4">
          <h3 className="text-center text-xl font-semibold">
            Mot de passe oublié
          </h3>
          <Form {...forgotPasswordForm}>
            <form
              onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={forgotPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="vous@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" size="lg">
                Envoyer le lien de réinitialisation
              </Button>
            </form>
          </Form>
          <Button
            variant="link"
            type="button"
            onClick={() => {
              setIsForgotPassword(false);
              forgotPasswordForm.reset();
              setError("");
              setSuccess("");
            }}
            className="w-fit self-center"
          >
            Retour à la connexion
          </Button>
        </div>
      )}
    </div>
  );
}
