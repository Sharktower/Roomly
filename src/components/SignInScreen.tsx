import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useUsers } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ApiClientError } from "@/lib/api";

export function SignInScreen() {
  const { login } = useAuth();
  const { data: users = [] } = useUsers();
  const [email, setEmail] = useState("alex@acme.co");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="min-h-screen grid place-items-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm p-6">
        <div className="mb-6 text-center">
          <div className="mx-auto size-10 rounded-md bg-primary text-primary-foreground grid place-items-center font-bold mb-3">
            R
          </div>
          <h1 className="text-lg font-semibold">Sign in to Roomly</h1>
          <p className="text-sm text-muted-foreground mt-1">Demo · use any seeded email</p>
        </div>
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            setError(null);
            try {
              await login(email.trim());
            } catch (err) {
              setError(err instanceof ApiClientError ? err.message : "Sign in failed");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pw">Password</Label>
            <Input id="pw" type="password" defaultValue="demo" disabled />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
          <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
            <div className="font-medium text-foreground">Try:</div>
            {users.map((u) => (
              <div key={u.id} className="flex justify-between">
                <span>{u.email}</span>
                <span className="text-muted-foreground/70">{u.role}</span>
              </div>
            ))}
          </div>
        </form>
      </Card>
    </div>
  );
}
