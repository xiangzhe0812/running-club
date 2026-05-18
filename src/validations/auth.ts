export type AuthFieldErrors = {
  email?: string;
  password?: string;
  code?: string;
};

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isStrongPassword(value: string): boolean {
  return (
    value.length >= 8 &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /\d/.test(value)
  );
}

export function validateCredentials(
  email: string,
  password: string,
  mode: "login" | "signup",
): AuthFieldErrors {
  const errors: AuthFieldErrors = {};
  if (!email.trim()) errors.email = "Email is required.";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  if (!password) errors.password = "Password is required.";
  else if (mode === "signup" && !isStrongPassword(password))
    errors.password = "Min 8 chars with uppercase, lowercase, and a number.";
  else if (password.length < 8)
    errors.password = "Password must be at least 8 characters.";
  return errors;
}

export function validateCode(code: string): AuthFieldErrors {
  if (code.trim().length !== 6)
    return { code: "Enter the 6-digit verification code." };
  return {};
}
