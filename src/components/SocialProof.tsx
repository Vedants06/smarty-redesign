import { motion } from "framer-motion";
import { User } from "lucide-react";

const companies = ["Google", "Meta", "Amazon", "Microsoft", "OpenAI", "Netflix", "Apple", "Stripe", "Spotify", "Tesla"];

const feed = [
  { name: "Arjun M.", course: "AI & Machine Learning Bootcamp", time: "2 min ago" },
  { name: "Lisa K.", course: "MERN Stack Masterclass", time: "5 min ago" },
  { name: "Omar S.", course: "AWS Solutions Architect", time: "8 min ago" },
  { name: "Emily R.", course: "Deep Learning with PyTorch", time: "12 min ago" },
];

export function SocialProof() {
  return (
    <section className="relative z-10 py-16 px-4 overflow-hidden bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Trusted by */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest mb-6">
            Trusted by students at
          </p>
        </motion.div>

        <div className="relative mb-16">
          <div className="flex overflow-hidden">
            <div className="flex animate-marquee gap-12 items-center">
              {[...companies, ...companies].map((c, i) => (
                <span key={i} className="text-xl md:text-2xl font-bold text-muted-foreground/30 whitespace-nowrap select-none">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Live feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 max-w-lg mx-auto"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live Learner Feed
          </h3>
          <div className="space-y-3">
            {feed.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">
                    <span className="font-medium">{item.name}</span> enrolled in{" "}
                    <span className="text-primary">{item.course}</span>
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
