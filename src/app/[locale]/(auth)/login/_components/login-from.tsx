"use client";
import { CardContent, CardHeader } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFromValidationSchema } from "../validations/login-from.schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/routing";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import useAuth from "@/hooks/use-auth";
import InlineAlert from "@/components/ui/inline-alert";
import logo_ralf_horizental from "../../../../logo_ralf_horizental.svg";
import Image from "next/image";

// The login from

interface FromType {
  email: string;
  password: string;
}

export default function LoginFrom() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FromType>({
    resolver: zodResolver(LoginFromValidationSchema),
  });
  const { isLoading, login } = useAuth();
  const [authError, setAuthError] = useState<false | 403 | 400 | 500>(false);
  const { replace, refresh } = useRouter();

  const handleLogin = async (data: FromType) => {
    try {
      const res = await login(data.email, data.password);
      if (res === 500) {
        setAuthError(500);
      } else if (res == 400 || res == 403) {
        setAuthError(res);
      } else {
        replace("/");
        refresh();
      }
    } catch {
      setAuthError(500);
    }
  };

  return (
    <div className="w-full ">
      <CardHeader className="w-full flex gap-5 lg:gap-7 flex-col items-center lg:items-start">
        <Image alt="" src={logo_ralf_horizental} width={240} height={80} />
        <h1 className="w-4/5 text-center lg:text-left text-2xl lg:text-3xl font-bold">
          Welcome To Ralf Dashboard
        </h1>
        <p className="text-sm text-foreground/90 text-center lg:text-start">
          Please enter your email below to sign up to your account and by
          signing up, you will gain access to full hotel system
        </p>
      </CardHeader>
      <CardContent className="w-full flex flex-col gap-4">
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="w-full flex flex-col gap-5"
        >
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              disabled={isLoading}
              id="email"
              type="email"
              className="h-12"
              placeholder="m@example.com"
              {...register("email", { required: true })}
            />
            {errors?.email ? (
              <InlineAlert type="error">{errors.email.message}</InlineAlert>
            ) : null}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              disabled={isLoading}
              id="password"
              className="h-12"
              placeholder="Password"
              type="password"
              {...register("password", { required: true })}
            />
            {errors?.password ? (
              <InlineAlert type="error">{errors.password.message}</InlineAlert>
            ) : null}
          </div>
          {authError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {authError == 400
                  ? "Email or password is wrong"
                  : authError == 403
                  ? "Access denied"
                  : "Something went wrong"}
              </AlertTitle>
              <AlertDescription>
                {authError == 400
                  ? "Your email or password is wrong. Please log in again."
                  : authError == 403
                  ? "Only admins can access this dashboard"
                  : "Something went when was logging. Please log in again."}
              </AlertDescription>
            </Alert>
          ) : null}

          <Button
            isLoading={isLoading}
            type="submit"
            className="w-full h-12 mt-2"
          >
            Login
          </Button>
        </form>
      </CardContent>
    </div>
  );
}
