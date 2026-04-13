"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Lock, 
  ArrowRight, 
  Loader2, 
  Smartphone, 
  Calendar,
  CheckCircle2,
  ArrowLeft,
  BadgeCheck,
  ChevronRight,
  UserCircle
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authService } from "@/services/auth.service";

type Step = "MOBILE" | "OTP" | "DETAILS" | "SUCCESS";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("MOBILE");
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    mobile: "",
    otp: "",
    fullName: "",
    gender: "",
    dateOfBirth: "",
    password: "",
  });

  const updateFormData = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.sendOtp(formData.mobile);
      if (response.success) {
        toast.success("OTP sent successfully");
        setStep("OTP");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.otp.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.verifyOtp(formData.mobile, formData.otp);
      if (response.success) {
        toast.success("Mobile verified!");
        setStep("DETAILS");
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, gender, dateOfBirth, password } = formData;
    
    if (!fullName || !gender || !dateOfBirth || !password) {
      toast.error("Please fill all details");
      return;
    }

    setIsLoading(true);
    try {
      const { otp, ...registerData } = formData;
      const response = await authService.register(registerData);
      if (response.success) {
        toast.success("Registration successful!");
        setStep("SUCCESS");
        setTimeout(() => router.push("/login"), 3000);
      }
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500 overflow-hidden">
      {/* Lighter Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[45%] h-[45%] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[100px] rounded-full delay-700 animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[450px] z-10"
      >
        <Card className="border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl border-t-emerald-500 border-t-2 overflow-hidden">
          <CardHeader className="space-y-1 pb-6 relative">
            {step !== "MOBILE" && step !== "SUCCESS" && (
              <button 
                onClick={() => setStep(step === "OTP" ? "MOBILE" : "OTP")}
                className="absolute left-6 top-8 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors"
                aria-label="go-back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <CardTitle className="text-2xl font-bold text-center tracking-tight text-zinc-900 dark:text-zinc-50 pt-2">
              Create Account
            </CardTitle>
            <CardDescription className="text-center text-zinc-500 dark:text-zinc-400">
              Complete your registration in few steps
            </CardDescription>
            
            <div className="flex justify-center gap-2 mt-4">
              {["MOBILE", "OTP", "DETAILS"].map((s, i) => (
                <div 
                  key={s} 
                  className={`h-1 rounded-full transition-all duration-300 ${
                    step === "SUCCESS" || ["MOBILE", "OTP", "DETAILS"].indexOf(step) >= i 
                      ? "w-8 bg-emerald-500" 
                      : "w-4 bg-zinc-200 dark:bg-white/10"
                  }`} 
                />
              ))}
            </div>
          </CardHeader>
          
          <CardContent className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              {step === "MOBILE" && (
                <motion.form
                  key="mobile"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  onSubmit={handleSendOtp}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <Label htmlFor="mobile" className="text-zinc-700 dark:text-zinc-300 ml-1 font-medium">Mobile Number</Label>
                    <div className="relative group">
                      <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-emerald-600 transition-colors" />
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={formData.mobile}
                        onChange={(e) => updateFormData("mobile", e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="pl-10 h-12 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading || formData.mobile.length !== 10}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 font-bold shadow-lg shadow-emerald-100 dark:shadow-none group"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <span className="flex items-center gap-2">
                        Get Verification Code <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </motion.form>
              )}

              {step === "OTP" && (
                <motion.form
                  key="otp"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  onSubmit={handleVerifyOtp}
                  className="space-y-6"
                >
                  <div className="text-center space-y-1 mb-6">
                    <p className="text-zinc-500 text-sm">Code sent to</p>
                    <p className="text-zinc-900 dark:text-white font-bold text-lg">+91 {formData.mobile}</p>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="otp" className="text-zinc-700 dark:text-zinc-300 ml-1 font-medium text-center block">Verification Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="000000"
                      value={formData.otp}
                      onChange={(e) => updateFormData("otp", e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="h-14 text-center text-3xl tracking-[0.3em] font-black bg-white dark:bg-zinc-950 border-zinc-200 dark:border-white/10 text-emerald-600 dark:text-emerald-400 placeholder:text-zinc-200 dark:placeholder:text-zinc-800"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading || formData.otp.length !== 6}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 font-bold shadow-lg shadow-emerald-100"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Continue"}
                  </Button>
                </motion.form>
              )}

              {step === "DETAILS" && (
                <motion.form
                  key="details"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  onSubmit={handleRegister}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label className="text-zinc-700 dark:text-zinc-300 ml-1 font-medium">Full Name</Label>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-emerald-600" />
                        <Input
                          placeholder="Full Name"
                          value={formData.fullName}
                          onChange={(e) => updateFormData("fullName", e.target.value)}
                          className="pl-10 h-11 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-zinc-700 dark:text-zinc-300 ml-1 font-medium">Gender</Label>
                      <Select 
                        value={formData.gender} 
                        onValueChange={(val) => updateFormData("gender", val)}
                      >
                        <SelectTrigger className="h-11 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10">
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-zinc-700 dark:text-zinc-300 ml-1 font-medium">DOB</Label>
                      <div className="relative group">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-emerald-600" />
                        <Input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                          className="pl-10 h-11 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="col-span-2 space-y-2">
                      <Label className="text-zinc-700 dark:text-zinc-300 ml-1 font-medium">Password</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-emerald-600" />
                        <Input
                          type="password"
                          placeholder="Set Password"
                          value={formData.password}
                          onChange={(e) => updateFormData("password", e.target.value)}
                          className="pl-10 h-11 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 font-bold shadow-lg shadow-emerald-100 mt-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Registration"}
                  </Button>
                </motion.form>
              )}

              {step === "SUCCESS" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-10 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10, stiffness: 100 }}
                    className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">Success!</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm">Account created successfully.<br />Redirecting to login...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          <CardFooter className="pb-8">
            {step !== "SUCCESS" && (
              <p className="w-full text-center text-sm text-zinc-500">
                Already have an account?{" "}
                <Link href="/login" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
