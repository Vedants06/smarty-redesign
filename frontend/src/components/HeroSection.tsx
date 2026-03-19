import { Search, Brain, Globe, Cloud, Code, Database, Cpu } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { icon: Brain, label: "Artificial Intelligence", count: "24+ courses", color: "from-purple-500 to-pink-500" },
  { icon: Code, label: "Web Development", count: "31+ courses", color: "from-blue-500 to-cyan-500" },
  { icon: Cloud, label: "Cloud Computing", count: "18+ courses", color: "from-emerald-500 to-teal-500" },
  { icon: Database, label: "Data Science", count: "21+ courses", color: "from-orange-500 to-amber-500" },
  { icon: Cpu, label: "Cybersecurity", count: "12+ courses", color: "from-red-500 to-rose-500" },
  { icon: Globe, label: "DevOps & MLOps", count: "20+ courses", color: "from-violet-500 to-indigo-500" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface HeroSectionProps {
  query: string;
  onQueryChange: (q: string) => void;
}

export function HeroSection({ query, onQueryChange }: HeroSectionProps) {
  return (
    <section className="relative z-0 min-h-[90vh] flex flex-col items-center justify-center px-4 pt-24 pb-16 gradient-hero overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-accent/10 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-4xl mx-auto relative z-10"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          <span className="text-gradient">Master the Future</span>
          <br />
          <span className="text-foreground">of Tech</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Industry-leading courses in AI, Cloud, and Full-Stack Development.
          Learn from top engineers at Google, Meta, and OpenAI.
        </p>

        <div className="relative max-w-xl mx-auto mb-16">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search courses, topics, or instructors..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl glass-strong text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto w-full relative z-10"
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.label}
            variants={item}
            whileHover={{ scale: 1.03, y: -4 }}
            className="glass rounded-2xl p-4 md:p-6 cursor-pointer group transition-colors hover:border-primary/30"
          >
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow`}
            >
              <cat.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-foreground text-sm md:text-base">{cat.label}</h3>
            <p className="text-xs text-muted-foreground mt-1">{cat.count}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
