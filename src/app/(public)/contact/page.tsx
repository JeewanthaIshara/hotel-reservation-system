"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
 // TypeScript now infers this as readonly [0.16, 1, 0.3, 1] instead of number[]
const premiumEase = [0.16, 1, 0.3, 1] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: premiumEase } 
  }
};

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const contactDetails = [
    { icon: Phone, title: "Direct Concierge Desk", detail: "+1 (800) 555-LUXE", sub: "Toll-free 24/7 priority routing" },
    { icon: Mail, title: "Electronic Correspondence", detail: "concierge@luxestay.com", sub: "Inquiries processed within 2 hours" },
    { icon: MapPin, title: "Corporate Matrix HQ", detail: "742 Luxury Boulevard, Suite 100", sub: "Beverly Hills, CA 90210" },
    { icon: Clock, title: "Operational Time Windows", detail: "24 Hours a Day / 365 Days", sub: "Continuous global system uptime" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground overflow-x-hidden pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* 🌌 PAGE HEADER */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center max-w-2xl mx-auto mb-16 space-y-3"
        >
          <motion.span variants={fadeInUp} className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full">
            Connect With Us
          </motion.span>
          <div className="overflow-hidden py-1">
            <motion.h1 
              variants={{
                hidden: { y: "100%" },
                visible: { y: 0, transition: { duration: 0.8, ease: premiumEase } }
              }}
              className="text-3xl md:text-5xl font-black tracking-tight text-foreground"
            >
              Establish Communication
            </motion.h1>
          </div>
          <motion.p variants={fadeInUp} className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Reach out via our structured desk parameters. Our dedicated global response system remains standing by to process your profile configuration inquiries.
          </motion.p>
        </motion.div>

        {/* 🧱 CONTACT GRID */}
        <div className="grid md:grid-cols-5 gap-12 items-start">
          
          {/* LEFT COLUMN: INFORMATION METRICS */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="md:col-span-2 grid grid-cols-1 gap-4"
          >
            {contactDetails.map(({ icon: Icon, title, detail, sub }) => (
              <motion.div 
                key={title} 
                variants={fadeInUp}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                className="bg-card border border-border rounded-2xl p-5 flex gap-4 items-start shadow-sm transition-colors hover:border-primary/30"
              >
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={16} />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</div>
                  <div className="text-sm font-black text-foreground font-mono tracking-tight">{detail}</div>
                  <div className="text-[11px] text-muted-foreground">{sub}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* RIGHT COLUMN: HIGH-END FORM FIELD ARCHITECTURE */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: premiumEase, delay: 0.2 }}
            className="md:col-span-3 bg-card border border-border rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Full Name</label>
                  <input required type="text" placeholder="John Doe" className="w-full px-4 py-3 bg-muted rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60 border border-transparent focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Electronic Mail</label>
                  <input required type="email" placeholder="john@example.com" className="w-full px-4 py-3 bg-muted rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60 border border-transparent focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Inquiry Subject</label>
                <input required type="text" placeholder="Corporate Stay Architecture Token Verification" className="w-full px-4 py-3 bg-muted rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60 border border-transparent focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Transmission Context</label>
                <textarea required rows={5} placeholder="Elaborate details regarding your parameters..." className="w-full px-4 py-3 bg-muted rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60 border border-transparent focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none" />
              </div>

              <Button type="submit" size="lg" className="w-full rounded-xl text-xs font-bold uppercase tracking-wider py-6 group relative overflow-hidden shadow-md">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Transmit Transmission Matrix 
                  <motion.span
                    whileHover={{ x: 3, y: -2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Send size={12} />
                  </motion.span>
                </span>
              </Button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}