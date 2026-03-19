import { useState, useMemo, useEffect, useRef } from "react";
import { Star, Clock, Users, BadgeCheck, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { courses } from "@/lib/courseData";

const allCategories = [...new Set(courses.map((c) => c.category))];
const allLevels = [...new Set(courses.map((c) => c.level))];
const priceRanges = [
  { label: "Under $12", max: 12 },
  { label: "$12 – $14", max: 14, min: 12 },
  { label: "$14+", min: 14 },
];

interface CourseGridProps {
  searchQuery?: string;
}

export function CourseGrid({ searchQuery = "" }: CourseGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [selectedPrice, setSelectedPrice] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);

      const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
      const matchesLevel = selectedLevel === "All" || c.level === selectedLevel;

      const price = parseFloat(c.price.slice(1));
      const range = priceRanges.find((r) => r.label === selectedPrice);
      const matchesPrice =
        selectedPrice === "All" ||
        (range &&
          (range.min === undefined || price >= range.min) &&
          (range.max === undefined || price < range.max));

      return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    });
  }, [searchQuery, selectedCategory, selectedLevel, selectedPrice]);

  const activeFilterCount = [selectedCategory, selectedLevel, selectedPrice].filter((f) => f !== "All").length;
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery && filtered.length > 0) {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [searchQuery, filtered.length]);

  return (
    <section ref={sectionRef} id="courses" className="relative z-10 py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-3">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-1">Trending Courses</h2>
              <p className="text-muted-foreground text-lg">Hand-picked by our team for maximum career impact</p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-sm font-medium text-foreground hover:border-primary/40 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="gradient-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="glass rounded-2xl p-4 md:p-5 mb-6 flex flex-wrap gap-6">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</p>
                    <div className="flex flex-wrap gap-2">
                      {["All", ...allCategories].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            selectedCategory === cat
                              ? "gradient-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Level</p>
                    <div className="flex flex-wrap gap-2">
                      {["All", ...allLevels].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setSelectedLevel(lvl)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            selectedLevel === lvl
                              ? "gradient-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</p>
                    <div className="flex flex-wrap gap-2">
                      {["All", ...priceRanges.map((r) => r.label)].map((p) => (
                        <button
                          key={p}
                          onClick={() => setSelectedPrice(p)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            selectedPrice === p
                              ? "gradient-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {(searchQuery || activeFilterCount > 0) && (
          <p className="text-sm text-muted-foreground mb-6">
            {filtered.length} course{filtered.length !== 1 ? "s" : ""} found
            {searchQuery && <> for "<span className="text-foreground font-medium">{searchQuery}</span>"</>}
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl">
            <p className="text-lg font-semibold text-foreground mb-2">No courses found</p>
            <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <article key={course.id} className="group">
                <Link
                  to={`/course/${course.id}`}
                  className="block glass rounded-2xl overflow-hidden cursor-pointer shadow-card hover:shadow-glow transition-all hover:-translate-y-1.5"
                >
                  <div className="relative overflow-hidden h-44">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {course.bestseller && (
                      <span className="absolute top-3 left-3 gradient-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3" /> Bestseller
                      </span>
                    )}
                    <span className="absolute top-3 right-3 glass text-foreground text-xs px-2 py-1 rounded-full">
                      {course.level}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-primary font-medium mb-2">{course.category}</p>
                    <h3 className="font-semibold text-foreground leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{course.instructor}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-foreground font-semibold">{course.rating}</span>
                      </span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{course.students}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-foreground">{course.price}</span>
                      <span className="text-sm text-muted-foreground line-through">{course.originalPrice}</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
