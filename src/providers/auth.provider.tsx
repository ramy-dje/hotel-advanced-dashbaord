"use client";

// The Auth Provider

interface Props {
  children: React.ReactNode;
}
// The auth provider (the only job of this component is to call the refreshAuth method once at first rennder)
export default function AuthProvider({ children }: Props) {
  // No-op provider in permissive mode: do not trigger refresh/auth network calls
  return <>{children}</>;
}
