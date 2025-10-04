import { useState } from "react";
import { Button, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { authClient } from "~/utils/auth";

function AuthSection() {
  const { data: session } = authClient.useSession();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

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

  if (session) {
    return (
      <View className="flex flex-col items-center gap-4 p-4">
        <Text className="text-center text-2xl font-semibold text-foreground">
          Hello, {session.user.name}
        </Text>
        <Button onPress={handleSignOut} title="Sign Out" color="#5B65E9" />
      </View>
    );
  }

  return (
    <View className="flex w-full flex-col gap-4 p-4">
      <View className="flex flex-row gap-2">
        <Pressable
          onPress={() => setIsSignUp(false)}
          className={`flex-1 rounded-md border p-3 ${!isSignUp ? "border-primary bg-primary" : "border-muted bg-background"}`}
        >
          <Text
            className={`text-center font-semibold ${!isSignUp ? "text-primary-foreground" : "text-foreground"}`}
          >
            Sign In
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setIsSignUp(true)}
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
      {error && <Text className="text-sm text-destructive">{error}</Text>}
      <Button
        onPress={isSignUp ? handleSignUp : handleSignIn}
        title={isSignUp ? "Sign Up" : "Sign In"}
        color="#5B65E9"
      />
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
