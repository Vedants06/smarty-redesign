import { useState } from "react";
import { Bot, Send, X, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = { role: "bot" | "user"; text: string };

const demoMessages: Message[] = [
  { role: "bot", text: "Hi! I'm Smarty AI. Ask me anything about your courses or career path." },
];

export function AITutorSidebar() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(demoMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { role: "user" as const, text: input }]);
    const q = input;
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "bot" as const,
          text: q.toLowerCase().includes("python")
            ? "Python is essential for AI/ML. Start with our 'Python Fundamentals' course — it covers data structures, OOP, and NumPy/Pandas."
            : q.toLowerCase().includes("career")
            ? "Based on market trends, AI Engineering and Cloud Architecture have the highest growth. Check our Learning Paths for a structured roadmap!"
            : "Great question! I'd recommend exploring our trending courses section. Want me to suggest a specific learning path?",
        },
      ]);
    }, 800);
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className={`fixed bottom-20 md:bottom-6 right-4 z-50 gradient-primary text-primary-foreground p-4 rounded-full shadow-glow animate-pulse_glow ${open ? "hidden" : ""}`}
        aria-label="Open Smarty AI"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-20 md:bottom-6 right-4 z-50 w-80 md:w-96 h-[28rem] glass-strong rounded-2xl flex flex-col overflow-hidden shadow-card"
          >
            {/* Header */}
            <div className="gradient-primary p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary-foreground" />
                <span className="font-semibold text-primary-foreground">Smarty AI</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-primary-foreground/80 hover:text-primary-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "gradient-primary text-primary-foreground rounded-br-sm"
                        : "bg-secondary text-secondary-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask Smarty AI..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 bg-secondary text-foreground placeholder:text-muted-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
                <button
                  onClick={handleSend}
                  className="gradient-primary text-primary-foreground p-2.5 rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
