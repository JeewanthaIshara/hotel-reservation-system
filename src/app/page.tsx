"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { 
  ArrowRight, 
  Users, 
  CheckCircle, 
  Search, 
  Wifi, 
  Car, 
  Coffee, 
  Waves,
  ChevronRight,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const featuredRooms = [
    {
      id: 1,
      name: "Deluxe Ocean View",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop&auto=format",
      price: 289,
      capacity: 2,
      size: "42 m²",
      amenities: ["King Bed", "Ocean View", "Balcony"],
      rating: 4.9,
      reviews: 124,
    },
    {
      id: 2,
      name: "Executive Suite",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop&auto=format",
      price: 449,
      capacity: 3,
      size: "68 m²",
      amenities: ["King Bed", "Living Room", "Jacuzzi"],
      rating: 4.8,
      reviews: 89,
    },
    {
      id: 4,
      name: "Presidential Suite",
      image: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&h=400&fit=crop&auto=format",
      price: 899,
      capacity: 4,
      size: "120 m²",
      amenities: ["2 King Beds", "Private Pool", "Chef"],
      rating: 5.0,
      reviews: 41,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Business Traveler",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format",
      text: "Absolutely seamless experience from booking to checkout. The platform made managing my corporate stays incredibly simple.",
      rating: 5,
      stay: "Executive Suite",
    },
    {
      name: "James Thornton",
      role: "Leisure Guest",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
      text: "The ocean view room was breathtaking. Booking was done in under 2 minutes — the interface is so intuitive.",
      rating: 5,
      stay: "Deluxe Ocean View",
    },
  ];

  // Added 'as const' so TypeScript recognizes this specifically as a 4-number cubic-bezier tuple
  const premiumEase = [0.16, 1, 0.3, 1] as const;

  // Explicitly applied the 'Variants' type to guarantee matching index signatures
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: premiumEase } 
    }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const cinematicHeroImage: Variants = {
    hidden: { scale: 1.12, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 0.55,
      transition: { duration: 2.2, ease: premiumEase }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      
      {/* 🌌 HERO SECTION */}
      <section className="relative min-h-[600px] md:min-h-[650px] h-[80vh] md:h-[85vh] w-full bg-slate-950 flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cinematicHeroImage}
            className="w-full h-full relative"
          >
            <Image
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=90"
              alt="LuxeStay Luxury Flagship Ambient Banner"
              fill
              priority
              className="object-cover select-none"
              sizes="100vw"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/30 to-background" />
        </div>

        {/* Hero Content Animated */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            500+ Premium Properties Available
          </motion.div>
          
          <div className="overflow-hidden py-2">
            <motion.h1 
              variants={{
                hidden: { y: "100%" },
                visible: { y: 0, transition: { duration: 1, ease: premiumEase } }
              }} 
              className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-4 max-w-4xl drop-shadow-md"
            >
              Book Your<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-t from-blue-300 via-yellow-200 to-amber-300">Perfect Stay</span>
            </motion.h1>
          </div>
          
          <motion.p variants={fadeInUp} className="text-white/80 text-base sm:text-xl max-w-xl mb-10 font-normal leading-relaxed drop-shadow-sm">
            Discover world-class hotels tailored to every journey. Seamless reservation architectural matrices, exceptional localized stays.
          </motion.p>

          {/* Quick Search Strip */}
          <motion.div variants={fadeInUp} className="w-full max-w-3xl bg-card rounded-2xl shadow-2xl border border-border p-4 text-left">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 ml-1">Check-in</label>
                <input type="date" className="w-full px-3 py-2.5 bg-muted rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 ml-1">Check-out</label>
                <input type="date" className="w-full px-3 py-2.5 bg-muted rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 ml-1">Guests</label>
                <select className="w-full px-3 py-2.5 bg-muted rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium appearance-none">
                  <option>2 Guests</option>
                  <option>1 Guest</option>
                  <option>4 Guests</option>
                </select>
              </div>
              <Button size="lg" className="w-full rounded-xl text-xs font-bold uppercase tracking-wider py-6 group relative overflow-hidden" asChild>
                <Link href="/rooms">
                  <Search size={14} className="mr-2" /> 
                  <span className="relative z-10 flex items-center">Search Rooms</span>
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 📊 METRICS STRIP */}
      <div className="bg-card border-b border-border relative z-20">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          >
            {[
              { value: "12,400+", label: "Happy Guests" },
              { value: "340+", label: "Room Types" },
              { value: "98%", label: "Satisfaction Rate" },
              { value: "24/7", label: "Guest Support" },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeInUp}>
                <div className="text-2xl md:text-3xl font-black text-primary tracking-tight font-mono">{stat.value}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 🏡 SECTION 1: Featured Curated Lookbook Grid */}
      <section className="py-24 px-4 max-w-6xl mx-auto overflow-hidden">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full">Featured Rooms</span>
            <div className="overflow-hidden py-1">
              <motion.h2 
                variants={{
                  hidden: { y: "100%" },
                  visible: { y: 0, transition: { duration: 0.8, ease: premiumEase } }
                }}
                className="text-3xl md:text-4xl font-black text-foreground tracking-tight"
              >
                Handpicked Signature Suites
              </motion.h2>
            </div>
            <p className="text-muted-foreground max-w-md text-sm">
              Each room parameters are completely curated to offer exceptional real-time structural performance and comfort.
            </p>
          </div>
          <Button variant="ghost" className="text-xs font-bold uppercase tracking-wider text-primary group" asChild>
            <Link href="/rooms">
              See All Listings 
              <motion.span 
                className="inline-block ml-1"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </motion.span>
            </Link>
          </Button>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {featuredRooms.map((room) => (
            <motion.div 
              key={room.id} 
              variants={fadeInUp}
              whileHover={{ 
                y: -10, 
                scale: 1.015,
                transition: { duration: 0.4, ease: premiumEase }
              }}
              className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-shadow group flex flex-col cursor-pointer"
            >
              <div className="relative h-52 bg-muted overflow-hidden">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
                  <Star size={11} className="fill-amber-500 text-amber-500" />
                  <span className="text-xs font-bold text-slate-900">{room.rating}</span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-foreground tracking-tight mb-1 group-hover:text-primary transition-colors">{room.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Users size={12} /> {room.capacity} Guests</span>
                    <span>•</span>
                    <span>{room.size}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {room.amenities.map((a) => (
                      <span key={a} className="text-[10px] uppercase tracking-wider bg-muted text-muted-foreground font-semibold px-2 py-0.5 rounded">{a}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <span className="text-xl font-black text-foreground font-mono">${room.price}</span>
                    <span className="text-xs text-muted-foreground font-normal">/night</span>
                  </div>
                  <Button size="sm" className="text-[11px] font-bold uppercase tracking-wider rounded-lg" asChild>
                    <Link href={`/rooms`}>Book Now</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 🏢 SECTION 2: About Editorial Overview Slice */}
      <section className="bg-muted/40 border-y border-border py-24 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: premiumEase }}
            className="relative"
          >
            <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden shadow-xl bg-muted group">
              <Image
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=700&h=500&fit=crop&auto=format"
                alt="Luxury hotel exterior with infinity pool layout"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6, ease: premiumEase }}
              className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground rounded-2xl p-5 shadow-xl hidden md:block border border-primary/20"
            >
              <div className="text-3xl font-black font-mono">15+</div>
              <div className="text-[11px] font-semibold uppercase tracking-wider opacity-90 mt-0.5">Years of Excellence</div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.span variants={fadeInUp} className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full">About LuxeStay</motion.span>
            
            <div className="overflow-hidden py-1">
              <motion.h2 
                variants={{
                  hidden: { y: "100%" },
                  visible: { y: 0, transition: { duration: 0.8, ease: premiumEase } }
                }}
                className="text-3xl md:text-4xl font-black text-foreground tracking-tight leading-tight"
              >
                Where Every Stay Becomes a Story
              </motion.h2>
            </div>

            <motion.p variants={fadeInUp} className="text-muted-foreground text-sm leading-relaxed">
              LuxeStay has redefined hospitality since 2009, offering a curated portfolio of premium multi-tenant properties. Our system combines real-time validation engines with world-class personalized service.
            </motion.p>
            
            <motion.div variants={staggerContainer} className="space-y-3">
              {[
                "Instant processing confirmation protocols",
                "Flexible check-out cancellation parameters",
                "Dedicated localized concierge token validation",
              ].map((item) => (
                <motion.div key={item} variants={fadeInUp} className="flex items-start gap-3">
                  <CheckCircle size={15} className="text-primary mt-0.5 shrink-0" />
                  <span className="text-sm font-medium text-foreground/90">{item}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="pt-2">
              <Button variant="outline" className="text-xs font-bold uppercase tracking-wider rounded-xl px-5 group" asChild>
                <Link href="/about">
                  Learn More About Us 
                  <motion.span
                    className="inline-block ml-1"
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ☕ AMENITIES DISPLAY STRIP */}
      <section className="py-20 px-4 max-w-6xl mx-auto overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: premiumEase }}
          className="text-center max-w-md mx-auto mb-12 space-y-2"
        >
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">World-Class Structural Amenities</h2>
          <p className="text-muted-foreground text-xs">Everything integrated natively for your destination sequence</p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: Wifi, label: "High-Speed WiFi", desc: "Gigabit coverage" },
            { icon: Car, label: "Valet Parking", desc: "Secure 24/7 space" },
            { icon: Coffee, label: "Fine Dining", desc: "5-star masterchefs" },
            { icon: Waves, label: "Infinity Pool", desc: "Direct ocean-facing" },
          ].map(({ icon: Icon, label, desc }) => (
            <motion.div 
              key={label} 
              variants={fadeInUp}
              whileHover={{ 
                scale: 1.03, 
                y: -4,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="bg-card border border-border rounded-2xl p-5 text-center hover:border-primary/40 transition-all group cursor-pointer"
            >
              <div className="w-11 h-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <Icon size={18} />
              </div>
              <div className="font-bold text-sm text-foreground tracking-tight">{label}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 💬 SECTION 3: Guest Review Testimonials */}
      <section className="bg-muted/30 border-t border-border py-24 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: premiumEase }}
            className="text-center max-w-md mx-auto mb-12 space-y-2"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Testimonials</span>
            <h2 className="text-3xl font-black tracking-tight text-foreground">What Our Guests Say</h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {testimonials.map((t) => (
              <motion.div 
                key={t.name} 
                variants={fadeInUp}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-shadow hover:shadow-md"
              >
                <div>
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={13} className="fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/90 italic leading-relaxed mb-6">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden bg-muted">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-foreground tracking-tight">{t.name}</div>
                    <div className="text-[10px] font-medium text-muted-foreground mt-0.5">{t.role} · <span className="text-primary/80">{t.stay}</span></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 📞 SECTION 4: Premium Call-To-Action */}
      <section className="max-w-5xl mx-auto px-4 py-24 text-center w-full overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: premiumEase }}
          className="p-8 md:p-14 rounded-3xl bg-gradient-to-br from-card to-muted/50 border border-border shadow-sm space-y-6 relative overflow-hidden flex flex-col items-center"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground max-w-xl leading-tight">
            Ready to Plan Your Perfect Escape Sequence?
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground max-w-md leading-relaxed">
            Reach out via our structural contact layout parameters, or register safe workspace configuration profile tokens instantly.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button size="lg" className="rounded-xl text-xs font-bold uppercase px-6 py-6 shadow group transition-all" asChild>
              <Link href="/rooms">
                Start Booking Now 
                <motion.span
                  className="inline-block ml-2"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 12 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-xl text-xs font-bold uppercase px-6 py-6 transition-all hover:bg-muted" asChild>
              <Link href="/contact">
                Contact Concierge Desk
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

    </div>
  );
}