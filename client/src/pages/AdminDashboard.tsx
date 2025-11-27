import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Mail, User, Clock, Zap } from "lucide-react";
import { gsap } from "gsap";

type PendingUser = { id: string; username: string; email: string; verified: boolean };

export default function AdminDashboard() {
  const [pending, setPending] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pending");
      const data = await res.json();
      setPending(data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch pending users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  useEffect(() => {
    if (containerRef.current && pending.length > 0) {
      gsap.fromTo(
        containerRef.current.querySelectorAll(".user-card"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [pending]);

  const approve = async (id: string) => {
    try {
      await fetch(`/api/admin/approve/${id}`, { method: "POST" });
      setMessage("✓ User approved! Notification email sent.");
      setPending((p) => p.filter((u) => u.id !== id));
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setMessage("✗ Failed to approve user");
    }
  };

  const reject = async (id: string) => {
    try {
      await fetch(`/api/admin/reject/${id}`, { method: "POST" });
      setMessage("✓ User rejected.");
      setPending((p) => p.filter((u) => u.id !== id));
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setMessage("✗ Failed to reject user");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden pt-32 pb-20">
      {/* Animated background orbs */}
      <div className="fixed top-40 left-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-5 animate-pulse pointer-events-none" />
      <div className="fixed bottom-40 right-10 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-5 animate-pulse pointer-events-none" style={{ animationDelay: "1.5s" }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={containerRef}>
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-8 h-8 text-yellow-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Manage user registration approvals</p>
        </div>

        {/* Status message */}
        {message && (
          <div
            className={`mb-8 p-4 rounded-lg border font-medium transition-all ${
              message.includes("✗")
                ? "bg-red-500/10 border-red-500/20 text-red-300"
                : "bg-green-500/10 border-green-500/20 text-green-300"
            }`}
          >
            {message}
          </div>
        )}

        {/* Stats bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="p-4 rounded-lg border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
            <p className="text-sm text-purple-300 mb-1">Pending Approvals</p>
            <p className="text-3xl font-bold text-purple-300">{pending.length}</p>
          </div>
          <div className="p-4 rounded-lg border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
            <p className="text-sm text-blue-300 mb-1">Status</p>
            <p className="text-lg font-semibold text-blue-300">{loading ? "Refreshing..." : "Ready"}</p>
          </div>
          <div className="p-4 rounded-lg border border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-transparent">
            <p className="text-sm text-pink-300 mb-1">Action Required</p>
            <p className="text-3xl font-bold text-pink-300">{pending.length > 0 ? "Yes" : "No"}</p>
          </div>
        </div>

        {/* Users list */}
        {loading && <div className="text-center py-12 text-gray-400">Loading pending users...</div>}

        {!loading && pending.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-xl text-gray-300 font-medium mb-2">All caught up!</p>
            <p className="text-gray-500">No pending user approvals at this time</p>
          </div>
        )}

        {pending.length > 0 && (
          <div className="space-y-4">
            {pending.map((u) => (
              <div
                key={u.id}
                className="user-card p-6 rounded-xl border border-white/6 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5 hover:border-purple-500/20 transition-all duration-300 flex items-center justify-between hover:shadow-lg hover:shadow-purple-900/20"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-white">{u.username}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Mail className="w-4 h-4" />
                        {u.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-13 text-xs">
                    {u.verified ? (
                      <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-300 border border-green-500/20">
                        <CheckCircle className="w-3 h-3" />
                        OTP Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        <Clock className="w-3 h-3" />
                        Pending Verification
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => reject(u.id)}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => approve(u.id)}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-500/50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Accept
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
