import { ACCENT } from "@/constants/colors";
import { useClerk } from "@clerk/expo";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "../themed-text";

export const SignOutButton = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to your desired page
      router.replace("/");
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={handleSignOut}
    >
      <ThemedText style={styles.signOutText}>SIGN OUT</ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: "#3A3A3A",
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  signOutText: {
    color: ACCENT,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 2,
  },
});
