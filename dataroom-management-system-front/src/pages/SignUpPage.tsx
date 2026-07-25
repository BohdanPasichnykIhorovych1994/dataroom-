import { useState, type SubmitEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Database } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { APP_ROUTE, INPUT_TYPE } from "@/constants";
import {
  clearCustomValidity,
  setEnglishValidity,
} from "@/helpers/formValidation";
import { ApiError } from "@/storage/http";
import { useAuth } from "@/store/AuthContext";

export function SignUpPage() {
  const { signUp, user, ready } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  if (ready && user) {
    return <Navigate to={APP_ROUTE.ROOT} replace />;
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    try {
      await signUp(email.trim(), password, false);
      navigate(APP_ROUTE.ROOT, { replace: true });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Sign up failed. Try again.";
      toast.error(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-[radial-gradient(ellipse_at_top,oklch(0.97_0.01_200)_0%,var(--background)_55%)] px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Database className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Sign up</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create an account to start your Data Room
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type={INPUT_TYPE.EMAIL}
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                clearCustomValidity(e);
                setEmail(e.target.value);
              }}
              onInvalid={setEnglishValidity}
              placeholder="you@example.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => {
                clearCustomValidity(e);
                setPassword(e.target.value);
              }}
              onInvalid={setEnglishValidity}
              placeholder="At least 8 characters"
            />
          </div>

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Creating…" : "Sign up"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to={APP_ROUTE.LOGIN}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
