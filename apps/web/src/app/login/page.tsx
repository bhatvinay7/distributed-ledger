"use client";

import { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, Button, Separator } from "payit-ui";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;

      if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_FRONTENDURL is not configured");
      }

      window.location.href = `${baseUrl}/api/auth/googleAuth`;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        // setError(err.response?.data?.message || "Failed to initiate Google login");
      } else {
        // setError(err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md text-black border border-black/15 shadow-lg rounded-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold">Login to Payit</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <Button
            className="w-full flex items-center border border-black/15 justify-center gap-2"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <FcGoogle className="h-5 w-5" />
            {loading ? "Redirecting..." : "Continue with Google"}
          </Button>

          <Separator />

          <p className="text-center text-sm text-muted-foreground">
            By continuing, you agree to Payit’s Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
