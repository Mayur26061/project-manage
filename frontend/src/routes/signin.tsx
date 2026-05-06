import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "@/lib/useAuth";

export const Route = createFileRoute("/signin")({
  component: LoginComponent,
  beforeLoad: async ({ context }) => {
    if (context.auth?.user.user) {
      throw redirect({
        to: "/",
      });
    }
  },
});

function LoginComponent() {
  const navigate = useNavigate({ from: "/signin" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const response = await axios.post("/api/user/signin", {
        email: email,
        password: password,
      });
      if (response.status !== 200) {
        console.error("Login failed with status:", response.status);
        return;
      }
      login(response.data.user);
      navigate({
        to: "/",
      });
    } catch (error) {
      console.error("Login failed:", error);
      return;
    }
  }
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" onClick={onSubmit}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
