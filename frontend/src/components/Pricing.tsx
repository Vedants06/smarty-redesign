import { Check, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with core courses",
    features: [
      "Access to MERN Stack course (free)",
      "Community forum access",
      "Basic progress tracking",
      "Mobile app access",
    ],
    cta: "Start Free",
    highlighted: false,
    key: "free",
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "Unlimited learning, accelerated growth",
    features: [
      "All 6 courses unlocked instantly",
      "Smarty AI tutor — unlimited",
      "Certificates of completion",
      "Offline downloads",
      "Priority support",
      "Learning path generator",
    ],
    cta: "Go Pro",
    highlighted: true,
    key: "pro",
  },
  {
    name: "Teams",
    price: "$49",
    period: "/seat/month",
    description: "Upskill your entire organization",
    features: [
      "Everything in Pro",
      "Team analytics dashboard",
      "Custom learning paths",
      "SSO & admin controls",
      "Dedicated success manager",
      "API access",
    ],
    cta: "Contact Sales",
    highlighted: false,
    key: "teams",
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export function Pricing() {
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const [loading, setLoading]   = useState(false);
  const [isPro, setIsPro]       = useState(false);

  // ── Check if user already has Pro ────────────────────────────────────────
  useEffect(() => {
    async function checkPro() {
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const data    = userDoc.data();
        // Pro = has plan:"pro" OR has all 6 courses purchased
        const purchased: number[] = data?.purchasedCourses ?? [];
        const hasPro = data?.plan === "pro" || purchased.length >= 6;
        setIsPro(hasPro);
      } catch {
        setIsPro(false);
      }
    }
    checkPro();
  }, [user]);

  const handleCTA = async (planKey: string) => {
    if (planKey === "free") {
      navigate("/course/2");
      return;
    }

    if (planKey === "teams") {
      window.location.href = "mailto:sales@smarty.com?subject=Teams Plan Inquiry&body=Hi, I'm interested in the Smarty Teams plan.";
      return;
    }

    // Pro — already subscribed
    if (isPro) {
      navigate("/profile");
      return;
    }

    if (!user) {
      navigate("/login?redirect=/#pricing");
      return;
    }

    setLoading(true);
    try {
      const base      = import.meta.env.BASE_URL.replace(/\/$/, "");
      const returnUrl = window.location.origin + base + "/#/?pro=success&order_id={order_id}";

      const res  = await fetch(`${import.meta.env.VITE_API_URL}/create-pro-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId:    user.uid,
          userEmail: user.email,
          userName:  user.displayName,
          returnUrl,
        }),
      });

      const data = await res.json();
      if (!data.paymentSessionId) throw new Error(data.error || "No session ID");

      const cashfree = await load({
        mode: (import.meta.env.VITE_CASHFREE_ENV as "sandbox" | "production") || "sandbox",
      });

      cashfree.checkout({ paymentSessionId: data.paymentSessionId, redirectTarget: "_self" });

    } catch (err) {
      console.error("Pro checkout error:", err);
      alert("Payment could not be initiated. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section id="pricing" className="relative z-10 py-20 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Start free. Upgrade when you're ready to unlock everything.
          </p>
        </motion.div>

        <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isProPlan    = plan.key === "pro";
            const alreadyPro   = isProPlan && isPro;

            return (
              <motion.div
                key={plan.name}
                variants={item}
                className={`relative rounded-2xl p-6 md:p-8 flex flex-col ${
                  plan.highlighted
                    ? "glass-strong border-primary/40 shadow-glow scale-[1.02]"
                    : "glass"
                }`}
              >
                {/* ── Most Popular badge OR Active Plan badge ── */}
                {plan.highlighted && !alreadyPro && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                {alreadyPro && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-semibold px-4 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Your Plan
                  </span>
                )}

                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mt-1 mb-5">
                  {alreadyPro ? "You have full access to all courses" : plan.description}
                </p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-secondary-foreground">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${alreadyPro ? "text-green-500" : "text-primary"}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCTA(plan.key)}
                  disabled={loading && isProPlan}
                  className={`w-full py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                    alreadyPro
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : plan.highlighted
                      ? "gradient-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {loading && isProPlan && <Loader2 className="w-4 h-4 animate-spin" />}
                  {alreadyPro
                    ? "View My Courses →"
                    : loading && isProPlan
                    ? "Opening payment…"
                    : plan.cta}
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}