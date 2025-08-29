"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowRight, Shield, Zap } from "lucide-react";
import { IoLogoGithub } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { SignInPageSkeleton } from "@/components/skeleton/SignInPageSkeleton";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredProvider, setHoveredProvider] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800); // Show skeleton for 800ms

    return () => clearTimeout(timer);
  }, []);
  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true);
    try {
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        toast.error("Sign in failed", {
          description: result.error,
        });
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch {
      toast.error("Error", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };
  if (isPageLoading) {
    return <SignInPageSkeleton />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div>
        {/*Sign In Card */}
        <div className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-white mb-2">
                Get Started
              </CardTitle>
              <p className="text-gray-300 text-lg">
                Choose your preferred method to continue
              </p>
            </CardHeader>

            <CardContent className="space-y-4 pb-8">
              {/* Google Sign In */}
              <Button
                onClick={() => handleOAuthSignIn("google")}
                disabled={isLoading}
                onMouseEnter={() => setHoveredProvider("google")}
                onMouseLeave={() => setHoveredProvider(null)}
                className="w-full h-14 text-lg font-semibold bg-white hover:bg-gray-50 text-gray-900 border-2 border-transparent hover:border-cyan-400 transition-all duration-300 transform "
              >
                <FcGoogle className="mr-3 h-10 w-10" />
                Continue with Google
                <ArrowRight
                  className={`ml-auto h-10 w-10 ${
                    hoveredProvider === "google"
                      ? "translate-x-1 text-cyan-600"
                      : "text-gray-400"
                  }`}
                />
              </Button>

              {/* GitHub Sign In */}
              <Button
                onClick={() => handleOAuthSignIn("github")}
                disabled={isLoading}
                onMouseEnter={() => setHoveredProvider("github")}
                onMouseLeave={() => setHoveredProvider(null)}
                className="w-full h-14 text-lg font-semibold bg-gray-900 hover:bg-gray-800 text-white border-2 border-gray-700 hover:border-purple-400 transition-all duration-300 transform"
              >
                <IoLogoGithub className="mr-3 h-10 w-10 " />
                Continue with GitHub
                <ArrowRight
                  className={`ml-auto h-5 w-5 transition-all duration-300 ${
                    hoveredProvider === "github"
                      ? "translate-x-1 text-purple-400"
                      : "text-gray-400"
                  }`}
                />
              </Button>

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-gray-400">
                    Trusted by students & professionals
                  </span>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-sm">Secure</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Instant Setup</span>
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <p className="text-white font-medium">Signing you in...</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
