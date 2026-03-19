import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { getCourseDetail } from "@/lib/courseData";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";
import { useAuth } from "@/lib/auth-context";
import {
  Star, Clock, Users, Globe, ChevronDown, ChevronUp,
  Play, CheckCircle2, ArrowLeft, BadgeCheck, Lock, Unlock
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { load } from "@cashfreepayments/cashfree-js";

// ─── Star Rating ─────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`} />
      ))}
    </div>
  );
}

// ─── YouTube Embed ────────────────────────────────────────────────────────────
function YouTubeEmbed({ playlistId }: { playlistId: string }) {
  return (
    <div className="glass rounded-2xl overflow-hidden mb-12">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <Play className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Course Content</span>
        <span className="ml-auto text-xs text-muted-foreground">Powered by YouTube</span>
      </div>
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1`}
          title="Course Playlist"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

// ─── Locked Content Overlay ───────────────────────────────────────────────────
function LockedContent({ onEnroll }: { onEnroll: () => void }) {
  return (
    <div className="glass rounded-2xl overflow-hidden mb-12">
      <div className="relative flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-2xl" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full glass flex items-center justify-center shadow-glow">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground">This course is locked</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Purchase this course to unlock the full content, video lectures, and lifetime access.
          </p>
          <button
            onClick={onEnroll}
            className="gradient-primary text-primary-foreground font-semibold py-3 px-10 rounded-xl hover:opacity-90 transition-opacity mt-2"
          >
            Unlock Course
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const course = getCourseDetail(Number(id));
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // ── Check purchase status from Firestore ──────────────────────────────────
  useEffect(() => {
    async function checkAccess() {
      setCheckingAccess(true);
      if (user && course && !course.isFree) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const data = userDoc.data();
          const purchased: number[] = data?.purchasedCourses ?? [];
          setHasPurchased(purchased.includes(course.id));
        } catch {
          setHasPurchased(false);
        }
      }
      setCheckingAccess(false);
    }
    checkAccess();
  }, [user, course]);

  // ── Handle ?payment=success redirect from Cashfree ───────────────────────
  useEffect(() => {
    if (searchParams.get("payment") !== "success") return;

    const orderId = searchParams.get("order_id");
    setPaymentSuccess(true);
    setVerifying(true);

    // Retry verify up to 5 times with 2s delay
    // Cashfree may take a moment to mark the order as PAID on their end
    async function verifyWithRetry(attempts = 5, delayMs = 2000) {
      for (let i = 0; i < attempts; i++) {
        try {
          if (orderId) {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/verify-payment/${orderId}`);
            const data = await res.json();
            console.log(`Verify attempt ${i + 1}:`, data.status);
            if (data.status === "paid") break;
          }
        } catch (e) {
          console.warn(`Verify attempt ${i + 1} failed:`, e);
        }

        if (i < attempts - 1) {
          await new Promise(r => setTimeout(r, delayMs));
        }
      }

      // Final Firestore check to update UI
      if (user && course) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const data = userDoc.data();
        const purchased: number[] = data?.purchasedCourses ?? [];
        setHasPurchased(purchased.includes(course.id));
      }

      setVerifying(false);
    }

    verifyWithRetry();
    window.history.replaceState({}, "", window.location.pathname);
  }, [searchParams, user, course]);

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Course not found</h1>
            <Link to="/" className="text-primary hover:underline">Back to courses</Link>
          </div>
        </div>
      </>
    );
  }

  const toggleSection = (idx: number) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const totalLessons = course.curriculum.reduce((a, s) => a + s.lessons.length, 0);
  const hasAccess = course.isFree || hasPurchased;
  const priceNum = parseFloat(course.price.replace("$", ""));
  const origNum = parseFloat(course.originalPrice.replace("$", ""));
  const discountPct = origNum > 0 && priceNum > 0
    ? Math.round((1 - priceNum / origNum) * 100)
    : null;

  // ── Cashfree Enroll Handler ───────────────────────────────────────────────
  const handleEnroll = async () => {
    if (course.isFree) return;

    if (!user) {
      navigate(`/login?redirect=/course/${course.id}`);
      return;
    }

    setEnrolling(true);
    try {
      // Build the return URL using the frontend's own origin + base path
      // import.meta.env.BASE_URL is set by Vite from the `base` in vite.config.ts
      const base = import.meta.env.BASE_URL.replace(/\/$/, ""); // strip trailing slash
      const returnUrl =
        `${window.location.origin}${base}/course/${course.id}?payment=success&order_id={order_id}`;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId:    course.id,
          userId:      user.uid,
          userEmail:   user.email,
          userName:    user.displayName,
          courseTitle: course.title,
          price:       priceNum,
          returnUrl,   // ← frontend tells backend the correct redirect URL
        }),
      });

      const data = await res.json();
      if (!data.paymentSessionId) throw new Error(data.error || "No session ID returned");

      const cashfree = await load({
        mode: (import.meta.env.VITE_CASHFREE_ENV as "sandbox" | "production") || "sandbox",
      });

      cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget:   "_self",
      });

      // Don't setEnrolling(false) — page will redirect to Cashfree
    } catch (err) {
      console.error("Cashfree checkout error:", err);
      alert("Payment could not be initiated. Please try again.");
      setEnrolling(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pb-16 md:pb-0">

        {/* ── Payment success banner ── */}
        {paymentSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-16 left-0 right-0 z-50 flex justify-center px-4 pt-3"
          >
            <div className="glass border border-green-500/40 text-green-400 text-sm font-medium px-6 py-3 rounded-xl flex items-center gap-2 shadow-glow">
              <Unlock className="w-4 h-4" />
              {verifying
                ? "Confirming your payment, please wait…"
                : "Payment successful! You now have full access to this course."}
            </div>
          </motion.div>
        )}

        {/* ── Hero Banner ── */}
        <section className="relative gradient-hero pt-20">
          <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> All Courses
            </Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-primary">{course.category}</span>
                {course.bestseller && (
                  <span className="gradient-primary text-primary-foreground text-xs font-semibold px-3 py-0.5 rounded-full flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" /> Bestseller
                  </span>
                )}
                {course.isFree && (
                  <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-semibold px-3 py-0.5 rounded-full">
                    Free
                  </span>
                )}
                {!course.isFree && hasAccess && (
                  <span className="bg-primary/20 text-primary border border-primary/30 text-xs font-semibold px-3 py-0.5 rounded-full flex items-center gap-1">
                    <Unlock className="w-3 h-3" /> Purchased
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-4 leading-tight">{course.title}</h1>
              <p className="text-muted-foreground mb-4 max-w-2xl">{course.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-foreground font-semibold">{course.rating}</span>
                </span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" />{course.students} students</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{course.duration} total</span>
                <span className="flex items-center gap-1"><Globe className="w-4 h-4" />{course.language}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-6">Last updated {course.lastUpdated} · {course.level}</p>

              {/* ── Price & CTA ── */}
              {course.isFree ? (
                <div className="mb-6">
                  <div className="flex flex-wrap items-baseline gap-3 mb-4">
                    <span className="text-3xl font-bold text-green-400">Free</span>
                    <span className="text-muted-foreground line-through text-lg">{course.originalPrice}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400 font-medium">You have full access — scroll down to start learning</span>
                  </div>
                </div>
              ) : hasAccess ? (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Unlock className="w-4 h-4 text-primary" />
                    <span className="text-sm text-primary font-medium">You own this course — scroll down to watch</span>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="flex flex-wrap items-baseline gap-3 mb-4">
                    <span className="text-3xl font-bold text-foreground">{course.price}</span>
                    <span className="text-muted-foreground line-through text-lg">{course.originalPrice}</span>
                    {discountPct && (
                      <span className="text-sm font-medium text-green-400">{discountPct}% off</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="gradient-primary text-primary-foreground font-semibold py-3 px-10 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {enrolling ? "Opening payment…" : "Enroll Now"}
                    </button>
                    {!user && (
                      <Link
                        to={`/login?redirect=/course/${course.id}`}
                        className="bg-secondary text-secondary-foreground font-medium py-3 px-8 rounded-xl hover:bg-secondary/80 transition-colors text-sm"
                      >
                        Log in to enroll
                      </Link>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">30-day money-back guarantee</p>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-12">

          {/* ── Video Player / Lock ── */}
          {checkingAccess || verifying ? (
            <div className="glass rounded-2xl flex items-center justify-center py-20 mb-12">
              <span className="text-sm text-muted-foreground animate-pulse">
                {verifying ? "Confirming payment…" : "Checking access…"}
              </span>
            </div>
          ) : hasAccess && course.youtubePlaylistId ? (
            <YouTubeEmbed playlistId={course.youtubePlaylistId} />
          ) : hasAccess && !course.youtubePlaylistId ? (
            <div className="glass rounded-2xl flex flex-col items-center justify-center py-16 mb-12 text-center gap-3">
              <Unlock className="w-8 h-8 text-primary" />
              <p className="text-sm font-medium text-foreground">You have access to this course</p>
              <p className="text-xs text-muted-foreground">Video content is being uploaded — check back soon.</p>
            </div>
          ) : (
            <LockedContent onEnroll={handleEnroll} />
          )}

          {/* ── What You'll Learn ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-2xl p-6 md:p-8 mb-12">
            <h2 className="text-xl font-bold text-foreground mb-5">What you'll learn</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {course.whatYouLearn.map(item => (
                <div key={item} className="flex items-start gap-2 text-sm text-secondary-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Curriculum ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-xl font-bold text-foreground mb-2">Course Curriculum</h2>
            <p className="text-sm text-muted-foreground mb-5">{course.curriculum.length} sections · {totalLessons} lessons · {course.duration} total</p>
            <div className="space-y-2">
              {course.curriculum.map((sec, idx) => (
                <div key={idx} className="glass rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection(idx)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors"
                  >
                    <span className="font-medium text-foreground text-sm">{sec.section}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{sec.lessons.length} lessons</span>
                      {expandedSections.has(idx) ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </button>
                  {expandedSections.has(idx) && (
                    <div className="border-t border-border">
                      {sec.lessons.map((lesson, li) => (
                        <div key={li} className="flex items-center justify-between px-4 py-3 text-sm hover:bg-secondary/20 transition-colors">
                          <span className="flex items-center gap-2 text-secondary-foreground">
                            {hasAccess
                              ? <Play className="w-3.5 h-3.5 text-primary" />
                              : <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                            }
                            {lesson.title}
                          </span>
                          <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Instructor ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-2xl p-6 md:p-8 mb-12">
            <h2 className="text-xl font-bold text-foreground mb-5">Instructor</h2>
            <div className="flex items-start gap-4">
              <img src={course.instructorAvatar} alt={course.instructor} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <h3 className="font-semibold text-foreground text-lg">{course.instructor}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1 mb-3">
                  <span>{course.instructorCourses} courses</span>
                  <span>{course.instructorStudents} students</span>
                </div>
                <p className="text-sm text-secondary-foreground leading-relaxed">{course.instructorBio}</p>
              </div>
            </div>
          </motion.div>

          {/* ── Reviews ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-xl font-bold text-foreground mb-5">Student Reviews</h2>
            <div className="space-y-4">
              {course.reviews.map((review, i) => (
                <div key={i} className="glass rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{review.name}</p>
                      <div className="flex items-center gap-2">
                        <StarRating rating={review.rating} />
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-secondary-foreground leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </section>
      </main>
      <MobileNav />
    </>
  );
}