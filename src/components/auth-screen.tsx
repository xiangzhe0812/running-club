import { useOAuth, useSignIn, useSignUp } from "@clerk/expo";
import * as Linking from "expo-linking";
import { SymbolView } from "expo-symbols";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  ACCENT,
  BG,
  CARD_BG,
  CARD_BORDER,
  INPUT_BG,
  INPUT_BORDER,
  TEXT,
  TEXT_DIM,
  TEXT_MUTED,
} from "@/constants/colors";
import { Href, useRouter } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

import {
  AuthFieldErrors,
  validateCode,
  validateCredentials,
} from "@/validations/auth";

type Mode = "login" | "signup";
type Step = "credentials" | "verify";

export function AuthScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});

  const {
    signIn,
    errors: signInErrors,
    fetchStatus: signInFetchStatus,
  } = useSignIn();
  const {
    signUp,
    errors: signUpErrors,
    fetchStatus: signUpFetchStatus,
  } = useSignUp();

  const { startOAuthFlow: googleFlow } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: appleFlow } = useOAuth({ strategy: "oauth_apple" });

  const switchMode = (next: Mode) => {
    setMode(next);
    setStep("credentials");
    setError("");
    setFieldErrors({});
  };

  const checkCredentials = (): boolean => {
    const errs = validateCredentials(email, password, mode);
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const checkCode = (): boolean => {
    const errs = validateCode(code);
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const navigateAfterAuth = ({
    session,
    decorateUrl,
  }: {
    session: { currentTask?: unknown } | null | undefined;
    decorateUrl: (url: string) => string;
  }) => {
    if (session?.currentTask) {
      // Handle pending session tasks
      // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
      console.log(session.currentTask);
      return;
    }

    const url = decorateUrl("/");
    if (url.startsWith("http")) {
      window.location.href = url;
    } else {
      router.push(url as Href);
    }
  };

  const handleLogin = async () => {
    if (!checkCredentials() || !signIn) return;
    setLoading(true);
    setError("");
    try {
      const { error } = await signIn.password({
        emailAddress: email,
        password,
      });
      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            navigateAfterAuth({ session, decorateUrl });
          },
        });
      } else if (signIn.status === "needs_second_factor") {
        // See https://clerk.com/docs/guides/development/custom-flows/authentication/multi-factor-authentication
      } else if (signIn.status === "needs_client_trust") {
        // For other second factor strategies,
        // see https://clerk.com/docs/guides/development/custom-flows/authentication/client-trust
        const emailCodeFactor = signIn.supportedSecondFactors?.find(
          (factor) => factor.strategy === "email_code",
        );

        if (emailCodeFactor) {
          await signIn.mfa.sendEmailCode();
        }
      } else {
        // Check why the sign-in is not complete
        // console.error("Sign-in attempt not complete:", error);
        setError(error?.message ?? "Sign in failed. Please try again.");
      }
    } catch (e: any) {
      setError(e.errors?.[0]?.message ?? "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!checkCredentials()) return;
    setLoading(true);
    setError("");
    try {
      const { error: signUpError } = await signUp.password({
        emailAddress: email,
        password,
      });
      if (signUpError) {
        console.error(
          "Sign-up after identifier-not-found:",
          JSON.stringify(signUpError, null, 2),
        );
        return;
      }
      await signUp.verifications.sendEmailCode();
      const needsEmailCode =
        Array.isArray(signUp.unverifiedFields) &&
        signUp.unverifiedFields.includes("email_address");

      // Display second form to collect the verification code
      if (needsEmailCode) {
        setStep("verify");
        return;
      }
      // If the user is missing required fields, handle accordingly
      // This example redirects to the continue page; see https://clerk.com/docs/guides/development/custom-flows/authentication/oauth-connections#handle-missing-requirements
      if (
        signUp.status === "missing_requirements" &&
        (signUp.missingFields?.length ?? 0) > 0
      ) {
        // router.push("/continue" as Href);
        return;
      }

      console.error("Unexpected sign-up state after password:", {
        status: signUp.status,
        unverifiedFields: signUp.unverifiedFields,
        missingFields: signUp.missingFields,
      });
      return;
    } catch (e: any) {
      setError(e.errors?.[0]?.message ?? "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!checkCode()) return;
    // Handle sign-up with email code verification
    if (code) {
      const { error } = await signUp.verifications.verifyEmailCode({
        code,
      });
      if (error) {
        console.error(JSON.stringify(error, null, 2));
        return;
      }

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: ({ session, decorateUrl }) => {
            navigateAfterAuth({ session, decorateUrl });
          },
        });
        return;
      }

      // Check why the status is not complete
      console.error("Sign-up attempt not complete. Status:", signUp.status);
      return;
    }

    // Handle sign-in with email code verification
    const { error } = await signIn.mfa.verifyEmailCode({
      code,
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          navigateAfterAuth({ session, decorateUrl });
        },
      });
    } else {
      // Check why the sign-in is not complete
      console.error("Sign-in attempt not complete. Status:", signIn.status);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setError("");
    try {
      const flow = provider === "google" ? googleFlow : appleFlow;
      const { createdSessionId, setActive } = await flow({
        redirectUrl: Linking.createURL("/"),
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (e: any) {
      setError(e.errors?.[0]?.message ?? `${provider} sign in failed.`);
    }
  };

  if (step === "verify") {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.flex}>
          <ThemedView style={styles.header}>
            <ThemedText style={styles.title}>RUN CLUB</ThemedText>
            <ThemedText style={styles.subtitle}>CHECK YOUR EMAIL</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.card, styles.cardPadding]}>
            <ThemedText style={styles.verifyHint}>
              Enter the 6-digit code sent to{"\n"}
              {email}
            </ThemedText>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>
                VERIFICATION CODE
              </ThemedText>
              <ThemedView
                style={[
                  styles.inputWrapper,
                  !!fieldErrors.code && styles.inputWrapperError,
                ]}
              >
                <TextInput
                  style={styles.input}
                  value={code}
                  onChangeText={(v) => {
                    setCode(v);
                    setFieldErrors({});
                  }}
                  placeholder="000000"
                  placeholderTextColor={TEXT_MUTED}
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus
                />
              </ThemedView>
              {!!fieldErrors.code && (
                <ThemedText style={styles.fieldError}>
                  {fieldErrors.code}
                </ThemedText>
              )}
            </ThemedView>
            {!!error && (
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            )}
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
              ]}
              onPress={handleVerify}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <ThemedText style={styles.primaryButtonText}>
                  VERIFY EMAIL
                </ThemedText>
              )}
            </Pressable>
            <Pressable
              style={styles.backButton}
              onPress={() => setStep("credentials")}
            >
              <ThemedText style={styles.backText}>← Back</ThemedText>
            </Pressable>
          </ThemedView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ThemedView style={styles.header}>
            <ThemedText style={styles.title}>RUN CLUB</ThemedText>
            <ThemedText style={styles.subtitle}>
              PRECISION. MOMENTUM. PERFORMANCE.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.card}>
            {/* Tabs */}
            <ThemedView style={styles.tabRow}>
              <Pressable
                style={[styles.tab, mode === "login" && styles.tabActive]}
                onPress={() => switchMode("login")}
              >
                <ThemedText
                  style={[
                    styles.tabText,
                    mode === "login" && styles.tabTextActive,
                  ]}
                >
                  LOGIN
                </ThemedText>
              </Pressable>
              <Pressable
                style={[styles.tab, mode === "signup" && styles.tabActive]}
                onPress={() => switchMode("signup")}
              >
                <ThemedText
                  style={[
                    styles.tabText,
                    mode === "signup" && styles.tabTextActive,
                  ]}
                >
                  SIGN UP
                </ThemedText>
              </Pressable>
            </ThemedView>

            {/* Email field */}
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>ATHLETE EMAIL</ThemedText>
              <ThemedView
                style={[
                  styles.inputWrapper,
                  !!fieldErrors.email && styles.inputWrapperError,
                ]}
              >
                <SymbolView
                  name={{ ios: "envelope", android: "mail", web: "mail" }}
                  size={16}
                  tintColor={fieldErrors.email ? "#FF5555" : TEXT_MUTED}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(v) => {
                    setEmail(v);
                    setFieldErrors((e) => ({ ...e, email: undefined }));
                  }}
                  placeholder="runner@pro.com"
                  placeholderTextColor={TEXT_MUTED}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </ThemedView>
              {!!fieldErrors.email && (
                <ThemedText style={styles.fieldError}>
                  {fieldErrors.email}
                </ThemedText>
              )}
            </ThemedView>

            {/* Password field */}
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>PASSWORD</ThemedText>
              <ThemedView
                style={[
                  styles.inputWrapper,
                  !!fieldErrors.password && styles.inputWrapperError,
                ]}
              >
                <SymbolView
                  name={{ ios: "lock", android: "lock", web: "lock" }}
                  size={16}
                  tintColor={fieldErrors.password ? "#FF5555" : TEXT_MUTED}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={(v) => {
                    setPassword(v);
                    setFieldErrors((e) => ({ ...e, password: undefined }));
                  }}
                  placeholder="••••••••"
                  placeholderTextColor={TEXT_MUTED}
                  secureTextEntry
                />
              </ThemedView>
              {!!fieldErrors.password && (
                <ThemedText style={styles.fieldError}>
                  {fieldErrors.password}
                </ThemedText>
              )}
            </ThemedView>

            {/* {mode === "login" && (
              <Pressable
                style={styles.forgotContainer}
                onPress={handleForgotPassword}
              >
                <ThemedText style={styles.forgotText}>
                  Forgot Password?
                </ThemedText>
              </Pressable>
            )} */}

            {!!error && (
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
              ]}
              onPress={mode === "login" ? handleLogin : handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <ThemedText style={styles.primaryButtonText}>
                  {mode === "login" ? "ENTER CLUB" : "JOIN CLUB"}
                </ThemedText>
              )}
            </Pressable>

            {/* Divider */}
            <ThemedView style={styles.dividerRow}>
              <ThemedView style={styles.dividerLine} />
              <ThemedText style={styles.dividerText}>FAST AUTH</ThemedText>
              <ThemedView style={styles.dividerLine} />
            </ThemedView>

            {/* Social buttons */}
            <ThemedView style={styles.socialRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.socialButton,
                  pressed && styles.pressed,
                ]}
                onPress={() => handleOAuth("google")}
              >
                <ThemedText style={styles.googleG}>G</ThemedText>
                <ThemedText style={styles.socialText}>GOOGLE</ThemedText>
              </Pressable>
              {Platform.OS === "ios" && (
                <Pressable
                  style={({ pressed }) => [
                    styles.socialButton,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => handleOAuth("apple")}
                >
                  <SymbolView name="apple.logo" size={18} tintColor={TEXT} />
                  <ThemedText style={styles.socialText}>APPLE</ThemedText>
                </Pressable>
              )}
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.footer}>
            <ThemedText style={styles.footerText}>
              By entering, you agree to our{" "}
              <ThemedText style={styles.footerLink}>Training Terms</ThemedText>
              {" & "}
              <ThemedText style={styles.footerLink}>Privacy Policy</ThemedText>
            </ThemedText>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: BG,
    experimental_backgroundImage:
      "linear-gradient(180deg, #3A1C08 0%, #0D0A07 45%)",
  } as any,
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  // transparent so the container gradient shows through
  header: {
    backgroundColor: "transparent",
    alignItems: "center",
    paddingTop: 100,
    paddingBottom: 36,
    gap: 10,
  },
  title: {
    fontSize: 56,
    fontWeight: "900",
    fontStyle: "italic",
    color: ACCENT,
    letterSpacing: 3,
    lineHeight: 62,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "700",
    color: TEXT_DIM,
    letterSpacing: 4,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    gap: 16,
    padding: 20,
  },
  cardPadding: {
    marginHorizontal: 20,
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#111111",
    borderRadius: 8,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: ACCENT,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "800",
    color: TEXT_MUTED,
    letterSpacing: 1,
  },
  tabTextActive: {
    color: "#000000",
  },
  inputGroup: {
    backgroundColor: "transparent",
    gap: 6,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: TEXT_MUTED,
    letterSpacing: 2,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
  },
  inputIcon: {
    width: 18,
    height: 18,
  },
  input: {
    flex: 1,
    color: TEXT,
    fontSize: 15,
    height: "100%",
  },
  forgotContainer: {
    alignSelf: "flex-end",
    marginTop: -4,
  },
  forgotText: {
    color: ACCENT,
    fontStyle: "italic",
    fontSize: 12,
    fontWeight: "600",
  },
  inputWrapperError: {
    borderColor: "#FF5555",
  },
  fieldError: {
    color: "#FF5555",
    fontSize: 11,
    fontWeight: "500",
    marginTop: -2,
  },
  errorText: {
    color: "#FF5555",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  primaryButton: {
    backgroundColor: ACCENT,
    borderRadius: 10,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  primaryButtonText: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 3,
  },
  pressed: {
    opacity: 0.8,
  },
  dividerRow: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#2E2E2E",
  },
  dividerText: {
    fontSize: 10,
    fontWeight: "700",
    color: TEXT_MUTED,
    letterSpacing: 2,
  },
  socialRow: {
    backgroundColor: "transparent",
    flexDirection: "row",
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#3A3A3A",
    borderRadius: 10,
    height: 52,
    gap: 10,
  },
  googleG: {
    fontSize: 20,
    fontWeight: "900",
    fontStyle: "italic",
    color: TEXT,
  },
  socialText: {
    color: TEXT,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
  },
  footer: {
    backgroundColor: "transparent",
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  footerText: {
    color: TEXT_MUTED,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 20,
  },
  footerLink: {
    color: TEXT_DIM,
    textDecorationLine: "underline",
    fontWeight: "700",
    fontSize: 12,
  },
  verifyHint: {
    color: TEXT_DIM,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  backButton: {
    alignItems: "center",
    paddingVertical: 4,
  },
  backText: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: "600",
  },
});
