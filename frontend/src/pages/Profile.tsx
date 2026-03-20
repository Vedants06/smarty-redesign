import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { courses } from "@/lib/courseData";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";
import { Play, Lock, User, Mail, BookOpen, Sparkles, Trophy, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [purchasedIds, setPurchasedIds]     = useState<number[]>([]);
  const [isPro, setIsPro]                   = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const data    = userDoc.data();
        const purchased: number[] = data?.purchasedCourses ?? [];
        setPurchasedIds(purchased);
        setIsPro(data?.plan === "pro" || purchased.length >= 6);
      } catch {
        setPurchasedIds([]);
      } finally {
        setLoadingCourses(false);
      }
    }
    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-muted-foreground animate-pulse">Loading...</span>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const myCourses     = courses.filter(c => c.isFree || purchasedIds.includes(c.id));
  const lockedCourses = courses.filter(c => !c.isFree && !purchasedIds.includes(c.id));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-20 pb-16 md:pb-0 px-4">
        <div className="max-w-4xl mx-auto py-10 space-y-8">

          {/* ── Back button ── */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {/* ── Profile Card ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shrink-0">
                {user.displayName?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-foreground">{user.displayName || "Student"}</h1>
                  {isPro && (
                    <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-semibold px-3 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Pro
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{isPro ? "Pro Member" : "Free Member"}</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{loadingCourses ? "—" : myCourses.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Courses Enrolled</p>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{loadingCourses ? "—" : purchasedIds.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Courses Purchased</p>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{isPro ? "Pro" : "Free"}</p>
                <p className="text-xs text-muted-foreground mt-1">Current Plan</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">{user.displayName || "—"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <BookOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">
                  {loadingCourses ? "..." : `${myCourses.length} course${myCourses.length !== 1 ? "s" : ""} enrolled`}
                </span>
              </div>
            </div>
          </motion.div>

          {/* ── My Learning ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">My Learning</h2>
              {myCourses.length > 0 && (
                <span className="text-xs text-muted-foreground">{myCourses.length} course{myCourses.length !== 1 ? "s" : ""}</span>
              )}
            </div>

            {loadingCourses ? (
              <div className="glass rounded-2xl flex items-center justify-center py-12">
                <span className="text-sm text-muted-foreground animate-pulse">Loading your courses...</span>
              </div>
            ) : myCourses.length === 0 ? (
              <div className="glass rounded-2xl flex flex-col items-center justify-center py-12 text-center gap-3">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">No courses yet</p>
                <p className="text-xs text-muted-foreground">Browse our catalog and enroll in a course</p>
                <Link to="/" className="mt-2 gradient-primary text-primary-foreground text-sm font-medium px-5 py-2 rounded-xl hover:opacity-90 transition-opacity">
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {myCourses.map(course => (
                  <Link
                    key={course.id}
                    to={`/course/${course.id}`}
                    className="glass rounded-2xl overflow-hidden hover:shadow-glow hover:-translate-y-1 transition-all group"
                  >
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30" />
                      <div className="absolute top-2 left-2">
                        {course.isFree ? (
                          <span className="bg-green-500/90 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                            Free
                          </span>
                        ) : (
                          <span className="gradient-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Trophy className="w-3 h-3" /> Purchased
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-primary font-medium mb-1">{course.category}</p>
                      <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-xs text-primary font-medium">
                          <Play className="w-3 h-3" /> Continue Learning
                        </span>
                        <span className="text-xs text-muted-foreground">{course.duration}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Locked courses upsell — hidden if Pro ── */}
          {!loadingCourses && lockedCourses.length > 0 && !isPro && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Available to Unlock</h2>
                <Link to="/" className="text-xs text-primary font-medium hover:underline"
                  onClick={() => setTimeout(() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }), 100)}
                >
                  View Pro plan →
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {lockedCourses.map(course => (
                  <Link
                    key={course.id}
                    to={`/course/${course.id}`}
                    className="glass rounded-2xl overflow-hidden hover:shadow-glow hover:-translate-y-1 transition-all group opacity-70 hover:opacity-100"
                  >
                    <div className="relative h-32 overflow-hidden">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-primary font-medium mb-1">{course.category}</p>
                      <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2">{course.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-foreground">{course.price}</span>
                        <span className="text-xs text-primary font-medium">Enroll →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Pro upsell banner — only if not Pro ── */}
          {!loadingCourses && !isPro && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="glass-strong rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-primary/20">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Unlock all 6 courses with Pro</p>
                    <p className="text-xs text-muted-foreground">Only $19/month — cancel anytime</p>
                  </div>
                </div>
                <Link
                  to="/"
                  onClick={() => setTimeout(() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }), 100)}
                  className="gradient-primary text-primary-foreground text-sm font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity shrink-0"
                >
                  Go Pro →
                </Link>
              </div>
            </motion.div>
          )}

        </div>
      </main>
      <MobileNav onScrollToSection={() => {}} />
    </>
  );
};

export default Profile;