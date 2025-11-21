import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { COLORS } from "../styles/theme";

const RootLayoutNav = () => {
  const { token, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    const inAuthGroup = segments[0] === "(auth)";

    if (token && inAuthGroup) {
      router.replace("/(main)");
    } else if (!token && !inAuthGroup) {
      router.replace("/(auth)");
    }
  }, [token, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.ACCENT_PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Slot />
    </View>
  );
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.BG_PRIMARY,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_PRIMARY,
  },
});