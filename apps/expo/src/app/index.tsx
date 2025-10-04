import { useState } from "react";
import { Button, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { authClient } from "~/utils/auth";

function AuthSection() {
  const { data: session } = authClient.useSession();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignIn = async () => {
    setError("");

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message ?? "Sign in failed");
      }
    } catch (err) {
      setError("Sign in failed");
      console.error("Sign in failed:", err);
    }
  };

  const handleSignUp = async () => {
    setError("");

    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        setError(result.error.message ?? "Sign up failed");
      }
    } catch (err) {
      setError("Sign up failed");
      console.error("Sign up failed:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setSuccess("");

    try {
      await authClient.forgetPassword({
        email,
        redirectTo: "/auth/reset-password",
      });

      setSuccess(
        "Un email de réinitialisation a été envoyé. Vérifiez votre boîte de réception.",
      );
    } catch (err) {
      setError("Erreur lors de l'envoi de l'email");
      console.error("Forgot password failed:", err);
    }
  };

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
      });

      if (result.error) {
        setError(
          result.error.message ?? "Erreur lors du changement de mot de passe",
        );
        return;
      }

      setSuccess("Mot de passe modifié avec succès");
      setCurrentPassword("");
      setNewPassword("");
      setIsChangingPassword(false);
    } catch (err) {
      setError("Erreur lors du changement de mot de passe");
      console.error("Change password failed:", err);
    }
  };

  const handleUpdateProfile = async () => {
    setError("");
    setSuccess("");

    try {
      const result = await authClient.updateUser({
        name: newName,
      });

      if (result.error) {
        setError(
          result.error.message ?? "Erreur lors de la mise à jour du profil",
        );
        return;
      }

      setSuccess("Profil mis à jour avec succès");
      setNewName("");
      setIsEditingProfile(false);
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil");
      console.error("Update profile failed:", err);
    }
  };

  if (session) {
    return (
      <View className="flex w-full flex-col gap-4 p-4">
        <Text className="text-center text-2xl font-semibold text-foreground">
          Hello, {session.user.name}
        </Text>

        {success && (
          <View className="rounded-lg border border-green-500/50 bg-background px-4 py-3">
            <Text className="text-sm text-green-600">{success}</Text>
          </View>
        )}
        {error && (
          <View className="rounded-lg border border-destructive/50 bg-background px-4 py-3">
            <Text className="text-sm text-destructive">{error}</Text>
          </View>
        )}

        {/* Default View */}
        {!isEditingProfile && !isChangingPassword && (
          <View className="flex flex-col gap-2">
            <Button
              onPress={() => setIsEditingProfile(true)}
              title="Modifier le profil"
              color="#6B7280"
            />
            <Button
              onPress={() => setIsChangingPassword(true)}
              title="Changer le mot de passe"
              color="#6B7280"
            />
            <Button onPress={handleSignOut} title="Sign Out" color="#5B65E9" />
          </View>
        )}

        {/* Edit Profile Form */}
        {isEditingProfile && (
          <View className="flex flex-col gap-4">
            <TextInput
              className="rounded-md border border-input bg-background px-3 py-2 text-foreground"
              placeholder="Nouveau nom"
              value={newName}
              onChangeText={setNewName}
              autoCapitalize="words"
            />
            <View className="flex flex-row gap-2">
              <Button
                onPress={handleUpdateProfile}
                title="Enregistrer"
                color="#5B65E9"
              />
              <Button
                onPress={() => {
                  setIsEditingProfile(false);
                  setNewName("");
                  setError("");
                  setSuccess("");
                }}
                title="Annuler"
                color="#6B7280"
              />
            </View>
          </View>
        )}

        {/* Change Password Form */}
        {isChangingPassword && (
          <View className="flex flex-col gap-4">
            <TextInput
              className="rounded-md border border-input bg-background px-3 py-2 text-foreground"
              placeholder="Mot de passe actuel"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
            />
            <TextInput
              className="rounded-md border border-input bg-background px-3 py-2 text-foreground"
              placeholder="Nouveau mot de passe"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <View className="flex flex-row gap-2">
              <Button
                onPress={handleChangePassword}
                title="Changer"
                color="#5B65E9"
              />
              <Button
                onPress={() => {
                  setIsChangingPassword(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setError("");
                  setSuccess("");
                }}
                title="Annuler"
                color="#6B7280"
              />
            </View>
          </View>
        )}
      </View>
    );
  }

  return (
    <View className="flex w-full flex-col gap-4 p-4">
      {success && (
        <View className="rounded-lg border border-green-500/50 bg-background px-4 py-3">
          <Text className="text-sm text-green-600">{success}</Text>
        </View>
      )}

      {!isForgotPassword && (
        <>
          <View className="flex flex-row gap-2">
            <Pressable
              onPress={() => {
                setIsSignUp(false);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 rounded-md border p-3 ${!isSignUp ? "border-primary bg-primary" : "border-muted bg-background"}`}
            >
              <Text
                className={`text-center font-semibold ${!isSignUp ? "text-primary-foreground" : "text-foreground"}`}
              >
                Sign In
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setIsSignUp(true);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 rounded-md border p-3 ${isSignUp ? "border-primary bg-primary" : "border-muted bg-background"}`}
            >
              <Text
                className={`text-center font-semibold ${isSignUp ? "text-primary-foreground" : "text-foreground"}`}
              >
                Sign Up
              </Text>
            </Pressable>
          </View>

          {isSignUp && (
            <TextInput
              className="rounded-md border border-input bg-background px-3 py-2 text-foreground"
              placeholder="Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          )}
          <TextInput
            className="rounded-md border border-input bg-background px-3 py-2 text-foreground"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            className="rounded-md border border-input bg-background px-3 py-2 text-foreground"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {error && (
            <View className="rounded-lg border border-destructive/50 bg-background px-4 py-3">
              <Text className="text-sm text-destructive">{error}</Text>
            </View>
          )}
          <Button
            onPress={isSignUp ? handleSignUp : handleSignIn}
            title={isSignUp ? "Sign Up" : "Sign In"}
            color="#5B65E9"
          />

          {!isSignUp && (
            <Pressable
              onPress={() => {
                setIsForgotPassword(true);
                setError("");
                setSuccess("");
              }}
              className="self-center"
            >
              <Text className="text-center text-sm text-primary underline">
                Mot de passe oublié ?
              </Text>
            </Pressable>
          )}
        </>
      )}

      {/* Forgot Password Form */}
      {isForgotPassword && (
        <View className="flex flex-col gap-4">
          <Text className="text-center text-xl font-semibold text-foreground">
            Mot de passe oublié
          </Text>
          <TextInput
            className="rounded-md border border-input bg-background px-3 py-2 text-foreground"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {error && (
            <View className="rounded-lg border border-destructive/50 bg-background px-4 py-3">
              <Text className="text-sm text-destructive">{error}</Text>
            </View>
          )}
          <Button
            onPress={handleForgotPassword}
            title="Envoyer le lien de réinitialisation"
            color="#5B65E9"
          />
          <Pressable
            onPress={() => {
              setIsForgotPassword(false);
              setError("");
              setSuccess("");
            }}
            className="self-center"
          >
            <Text className="text-center text-sm text-primary underline">
              Retour à la connexion
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default function Index() {
  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen options={{ title: "Home" }} />
      <View className="h-full w-full bg-background">
        <Text className="pb-4 pt-8 text-center text-5xl font-bold text-foreground">
          Darsunaa
        </Text>

        <AuthSection />
      </View>
    </SafeAreaView>
  );
}
