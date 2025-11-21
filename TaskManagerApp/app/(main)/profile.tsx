import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../styles/theme";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PROFILE</Text>
      <Text style={styles.text}>User settings and stats can go here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.BG_PRIMARY,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.ACCENT_PRIMARY,
    fontFamily: "monospace",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
});
