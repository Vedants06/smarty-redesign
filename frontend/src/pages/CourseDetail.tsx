import { useParams, Link } from "react-router-dom";
import { getCourseDetail } from "@/lib/courseData";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";
import { Star, Clock, Users, Globe, ChevronDown, ChevronUp, Play, CheckCircle2, ArrowLeft, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`} />
      ))}
    </div>
  );
}

export default function CourseDetail() {
  const { id } = useParams();
  const course = getCourseDetail(Number(id));
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));

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

  return (
    <>
      <Navbar />
      <main className="pb-16 md:pb-0">
        {/* Hero Banner */}
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

              {/* Price & Enrollment */}
              <div className="flex flex-wrap items-baseline gap-3 mb-4">
                <span className="text-3xl font-bold text-foreground">{course.price}</span>
                <span className="text-muted-foreground line-through text-lg">{course.originalPrice}</span>
                <span className="text-sm font-medium text-green-400">
                  {Math.round((1 - parseFloat(course.price.slice(1)) / parseFloat(course.originalPrice.slice(1))) * 100)}% off
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <button className="gradient-primary text-primary-foreground font-semibold py-3 px-10 rounded-xl hover:opacity-90 transition-opacity">
                  Enroll Now
                </button>
                <button className="bg-secondary text-secondary-foreground font-medium py-3 px-10 rounded-xl hover:bg-secondary/80 transition-colors">
                  Try Free Preview
                </button>
              </div>
              <p className="text-xs text-muted-foreground">30-day money-back guarantee</p>
            </motion.div>
          </div>
        </section>

        {/* What You'll Learn */}
        <section className="max-w-6xl mx-auto px-4 py-12">
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

          {/* Curriculum */}
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
                            <Play className="w-3.5 h-3.5 text-primary" />
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

          {/* Instructor */}
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

          {/* Reviews */}
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
