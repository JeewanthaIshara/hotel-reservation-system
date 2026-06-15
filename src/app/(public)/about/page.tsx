"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Award, ShieldCheck, Users2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
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

  const coreValues = [
    {
      icon: Award,
      title: "Curated Excellence",
      desc: "Every listed property undergoes rigorous real-time validation to meet top-tier hospitality metrics."
    },
    {
      icon: ShieldCheck,
      title: "Secure Verification",
      desc: "Built around advanced distributed data engines ensuring bulletproof workspace and transaction tokens."
    },
    {
      icon: Users2,
      title: "Human-Centric Service",
      desc: "Bridging architectural platform perfection with intuitive, immediate localized concierge systems."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground overflow-x-hidden pt-20">
      
      {/* 🌌 HERO HEADER */}
      <section className="relative py-20 md:py-28 bg-slate-950 flex items-center justify-center px-4 overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80"
            alt="About LuxeStay Banner"
            fill
            priority
            className="object-cover opacity-30 select-none scale-100"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/20 to-background" />
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 w-full max-w-3xl mx-auto text-center space-y-4"
        >
          <motion.span variants={fadeInUp} className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-semibold uppercase tracking-wider">
            Our Story
          </motion.span>
          <div className="overflow-hidden py-1">
            <motion.h1 
              variants={{
                hidden: { y: "100%" },
                visible: { y: 0, transition: { duration: 1, ease: premiumEase } }
              }}
              className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight"
            >
              Redefining the Matrices of Modern Hospitality
            </motion.h1>
          </div>
          <motion.p variants={fadeInUp} className="text-white/80 text-sm sm:text-base max-w-xl mx-auto font-normal leading-relaxed">
            Since 2009, LuxeStay has engineered seamless pathways connecting elite global travelers to pristine, handpicked spaces.
          </motion.p>
        </motion.div>
      </section>

      {/* 🏡 EDITORIAL STORY SECTION */}
      <section className="py-24 px-4 max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: premiumEase }}
          className="relative"
        >
          <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden shadow-xl bg-muted group">
            <Image
              src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=700&h=500&fit=crop&auto=format"
              alt="Luxury resort architecture"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="space-y-6"
        >
          <motion.span variants={fadeInUp} className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full">Vision & Mission</motion.span>
          <div className="overflow-hidden py-1">
            <motion.h2 
              variants={{
                hidden: { y: "100%" },
                visible: { y: 0, transition: { duration: 0.8, ease: premiumEase } }
              }}
              className="text-2xl md:text-3xl font-black text-foreground tracking-tight leading-tight"
            >
              Where Strategic Architectural Frameworks Meet Supreme Comfort
            </motion.h2>
          </div>
          <motion.p variants={fadeInUp} className="text-muted-foreground text-sm leading-relaxed">
            We believe a reservation is more than a transactional sequence. It is the architectural blueprint of an experience. LuxeStay brings together elite infrastructure validation and fluid, real-time user-interface processing protocols to ensure perfection down to the finest detail.
          </motion.p>
          <motion.p variants={fadeInUp} className="text-muted-foreground text-sm leading-relaxed">
            Whether managing a multi-tenant global corporate asset map or preparing a signature coastal suite for an individual gateway sequence, our standards remain absolute.
          </motion.p>
        </motion.div>
      </section>

      {/* 💎 CORE VALUES STRIP */}
      <section className="bg-muted/40 border-y border-border py-24 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-md mx-auto space-y-2"
          >
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">Our Operational Pillars</h2>
            <p className="text-muted-foreground text-xs">The foundational blueprints driving our client dedication</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {coreValues.map(({ icon: Icon, title, desc }) => (
              <motion.div 
                key={title} 
                variants={fadeInUp}
                whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.3 } }}
                className="bg-card border border-border rounded-2xl p-6 text-left shadow-sm hover:border-primary/40 transition-all cursor-pointer"
              >
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                  <Icon size={18} />
                </div>
                <div className="font-bold text-base text-foreground tracking-tight mb-2">{title}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 📞 CLOSING CALL-TO-ACTION */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: premiumEase }}
          className="space-y-6"
        >
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">Experience the LuxeStay Distinction</h2>
          <p className="text-xs md:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Your destination validation sequence begins with a single selection. Explore our premier inventory of tailored properties now.
          </p>
          <Button size="lg" className="rounded-xl text-xs font-bold uppercase px-6 py-6 shadow group transition-all" asChild>
            <Link href="/rooms">
              Browse Signature Suites
              <motion.span
                className="inline-block ml-2"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </Link>
          </Button>
        </motion.div>
      </section>

    </div>
  );
}