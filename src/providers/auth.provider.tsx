"use client";
import useAuth from "@/hooks/use-auth";
import { useEffect } from "react";

// The Auth Provider

interface Props {
  children: React.ReactNode;
}
// The auth provider (the only job of this component is to call the refreshAuth method once at first rennder)
export default function AuthProvider({ children }: Props) {
  const { refreshAuth } = useAuth();

  useEffect(() => {
    // refreshing the auth
    refreshAuth();
  }, []);

  return children;
}
