import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const paths = [
  {
    goal: "AI Engineer",
    courseId: 1, // Complete AI & Machine Learning Bootcamp
    steps: [
      { title: "Python Fundamentals", done: true },
      { title: "Mathematics for ML", done: true },
      { title: "Machine Learning A-Z", done: false },
      { title: "Deep Learning Specialization", done: false },
      { title: "MLOps & Deployment", done: false },
    ],
  },
  {
    goal: "Full-Stack Developer",
    courseId: 2, // MERN Stack (free)
    steps: [
      { title: "HTML, CSS & JavaScript", done: true },
      { title: "React & TypeScript", done: true },
      { title: "Node.js & Express", done: false },
      { title: "MongoDB & PostgreSQL", done: false },
      { title: "System Design & DevOps", done: false },
    ],
  },
  {
    goal: "Cloud Architect",
    courseId: 3, // AWS Solutions Architect
    steps: [
      { title: "Networking Fundamentals", done: true },
      { title: "Linux & Scripting", done: false },
      { title: "AWS Core Services", done: false },
      { title: "Infrastructure as Code", done: false },
      { title: "Multi-Cloud Strategy", done: false },
    ],
  },
];

export function LearningPaths() {
  const navigate = useNavigate();

  return (
    <section className="relative z-10 py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Your Learning Path</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Pick a career goal and follow a curated roadmap to get there
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {paths.map((path, i) => (
            <motion.div
              key={path.goal}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="glass rounded-2xl p-6 shadow-card hover:shadow-glow transition-shadow group cursor-pointer"
            >
              <div className="gradient-primary text-primary-foreground text-sm font-semibold rounded-full px-4 py-1.5 inline-block mb-5">
                {path.goal}
              </div>

              <div className="space-y-3">
                {path.steps.map((step, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <CheckCircle2
                        className={`w-5 h-5 ${step.done ? "text-primary" : "text-muted-foreground/40"}`}
                        fill={step.done ? "currentColor" : "none"}
                      />
                      {j < path.steps.length - 1 && (
                        <div className={`w-px h-5 ${step.done ? "bg-primary/50" : "bg-border"}`} />
                      )}
                    </div>
                    <span className={`text-sm ${step.done ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate(`/course/${path.courseId}`)}
                className="mt-6 flex items-center gap-2 text-sm text-primary font-medium group-hover:gap-3 transition-all"
              >
                Start this path <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}