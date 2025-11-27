import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, CheckCircle, Clock } from "lucide-react";
import { gsap } from "gsap";

export default function AdminRegister() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState<"form" | "otp" | "done">("form");
  const [userId, setUserId] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [stage]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Error");
      setUserId(data.id);
      setStage("otp");
      setMessage("✓ OTP sent to your email. Please check your inbox.");
    } catch (err: any) {
      setMessage("✗ " + (err.message || "Failed to register"));
    } finally {
      setLoading(false);
    }
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Error");
      setStage("done");
      setMessage("✓ Verified successfully!");
    } catch (err: any) {
      setMessage("✗ " + (err.message || "OTP verification failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex items-center justify-center py-12">
      {/* Animated background orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-10 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "1s" }} />

      <div ref={containerRef} className="max-w-lg w-full px-4 sm:px-6 relative z-10">
        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-black via-purple-900/10 to-black backdrop-blur-md p-8 shadow-2xl shadow-purple-900/20">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Admin Access
            </h1>
            <p className="text-gray-400">Register for exclusive admin features</p>
          </div>

          {/* Status message */}
          {message && (
            <div className={`mb-6 p-3 rounded-lg text-sm ${message.includes("✗") ? "bg-red-500/10 text-red-300 border border-red-500/20" : "bg-green-500/10 text-green-300 border border-green-500/20"}`}>
              {message}
            </div>
          )}

          {/* Registration Form */}
          {stage === "form" && (
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Username
                </label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="bg-white/5 border-purple-500/20 text-white placeholder:text-gray-500"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-white/5 border-purple-500/20 text-white placeholder:text-gray-500"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Secure password"
                  className="bg-white/5 border-purple-500/20 text-white placeholder:text-gray-500"
                  disabled={loading}
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 font-semibold py-2"
              >
                {loading ? "Registering..." : "Register & Send OTP"}
              </Button>
            </form>
          )}

          {/* OTP Verification */}
          {stage === "otp" && (
            <form onSubmit={verify} className="space-y-5">
              <div className="text-center mb-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-blue-300">OTP sent to <strong>{email}</strong></p>
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">Enter OTP Code</label>
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="bg-white/5 border-purple-500/20 text-white placeholder:text-gray-500 text-center text-2xl tracking-widest font-mono"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-2">Check your email for the 6-digit code</p>
              </div>
              <Button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-lg hover:shadow-blue-500/50 font-semibold py-2"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          )}

          {/* Approved State */}
          {stage === "done" && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="relative">
                  <CheckCircle className="w-20 h-20 text-green-400 animate-bounce" />
                  <div className="absolute inset-0 w-20 h-20 bg-green-400 rounded-full animate-pulse opacity-20" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-400 mb-2">Verification Complete!</h3>
                <p className="text-gray-400 mb-4">Your account is now verified. Awaiting admin approval...</p>
              </div>
              <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Clock className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: "3s" }} />
                <p className="text-sm text-amber-300">You will receive an email once approved</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
