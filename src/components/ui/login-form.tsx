import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pValue, setPValue] = useState(10);
  const { toast } = useToast();

  const navigate = useNavigate();

  const hitLogin = async (username: string, password: string) => {
    const url = "http://104.154.76.3:7123/api/v1/auth/login";
    const model = {
      username,
      password,
    };

    try {
      const response = await axios.post(url, model);
      if (response.data) {
        toast({
          title: `Login Success`,
          // description: error["code"],
        });
        localStorage.setItem("token", response.data.token || '');

        setTimeout(() => {
          setLoading(false);
          navigate("/loan");
          toast({}).dismiss();
        }, 1000);
      }
    } catch (error: any) {
      toast({
        title: `Login Failed: ${error["message"]}`,
        // description: error["code"],
      });
      setLoading(false);

      setTimeout(() => {
        toast({}).dismiss();
        setEmail("");
        setPassword("");
      }, 2000);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (loading) {
      interval = setInterval(() => {
        setPValue((prev) => {
          const newValue = prev + 5;
          return newValue <= 100 ? newValue : 100; // Stop at 100
        });
      }, 300);
    } else {
      setPValue(0);
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  const handleSubmit = (event: React.FormEvent) => {
    setPValue(0);
    setLoading(true);
    event.preventDefault();

    hitLogin(email, password);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email/username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email/Username</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="m@example.com / ckay"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                Login
              </Button>
              {loading && <Progress value={pValue} />}
            </div>
            <Toaster />

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
