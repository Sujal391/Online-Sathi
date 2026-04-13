"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Smartphone,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/services/auth.service";
import { authStore } from "@/store/auth.store";
import { ROLE_ROUTES } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mobile || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login(mobile, password);

      if (response.success) {
        authStore.setState({
          user: { id: '', mobile: mobile, identity: response.identity },
          isAuthenticated: true,
          isLoading: false
        });

        toast.success("Login successful! Welcome back.");
        const targetPath = ROLE_ROUTES[response.identity as keyof typeof ROLE_ROUTES] || "/";
        router.push(targetPath);
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500 overflow-hidden">
      {/* Dynamic Background Elements - Softer/Lighter */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[45%] h-[45%] bg-blue-500/10 dark:bg-blue-500/5 blur-[100px] rounded-full delay-700 animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[420px] z-10"
      >
        <Card className="border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl dark:shadow-2xl overflow-hidden">
          <CardHeader className="space-y-1.5 pb-8 relative">
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                className="w-14 h-14 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20"
              >
                <ShieldCheck className="w-7 h-7" />
              </motion.div>
            </div>
            <CardTitle className="text-2xl font-bold text-center tracking-tight text-zinc-900 dark:text-zinc-50">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-zinc-500 dark:text-zinc-400">
              Access your personalized dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-zinc-700 dark:text-zinc-300 ml-1 font-medium">Mobile Number</Label>
                <div className="relative group">
                  <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" />
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="0000000000"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="pl-10 h-11 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                {/* <div className="flex items-center justify-between ml-1 text-sm">
                  <Label htmlFor="password" title="password" className="text-zinc-700 dark:text-zinc-300 font-medium">Password</Label>
                  <Link 
                    href="/forgot-password" 
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors font-medium"
                  >
                    Forgot?
                  </Link>
                </div> */}
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white h-11 rounded-lg font-bold shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-8">
            <div className="w-full flex items-center gap-4 text-zinc-300 dark:text-zinc-800 px-4">
              <div className="h-[1px] flex-1 bg-zinc-200 dark:bg-white/10" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Secure Access</span>
              <div className="h-[1px] flex-1 bg-zinc-200 dark:bg-white/10" />
            </div>

            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 transition-all"
              >
                Register Now
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Floating security badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 font-bold"
        >
          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
          System Operational & Secure
        </motion.div>
      </motion.div>
    </div>
  );
}
