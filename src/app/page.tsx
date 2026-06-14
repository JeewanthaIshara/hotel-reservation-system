import { Hero } from "@/components/home/Hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldCheck, Wifi, Coffee, Sparkles, Star } from "lucide-react";

export const metadata = {
  title: "AuraStay | Luxury Hotel & Resort Reservations",
  description: "Book an absolute masterpiece of comfort. Browse our elegant rooms and premium amenities.",
};

export default function PublicHomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* 1. Hero Banner Component with embedded RoomSearch */}
      <Hero />
      
      {/* 2. Premium Grid Section */}
      <section className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            <Star className="h-3.5 w-3.5 fill-current" /> World-Class Experience
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">
            Crafted for Unmatched Comfort
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Every architectural lines, design texture, and digital system has been engineered to elevate your sensory stay.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { 
              icon: <Wifi className="h-6 w-6" />, 
              title: "Ultra High-Speed Wi-Fi", 
              desc: "Gigabit fiber connectivity throughout the entire resort complex, pool decks, and lounges." 
            },
            { 
              icon: <Coffee className="h-6 w-6" />, 
              title: "Artisanal Dining", 
              desc: "Complimentary premium morning blends and snacks curated daily by master baristas." 
            },
            { 
              icon: <ShieldCheck className="h-6 w-6" />, 
              title: "Absolute Security", 
              desc: "Advanced smart key-card encryption layers alongside round-the-clock secure floor management." 
            },
            { 
              icon: <Sparkles className="h-6 w-6" />, 
              title: "Wellness & Spa", 
              desc: "All-inclusive access into the heated infinity edge wellness pools and luxury dry saunas." 
            },
          ].map((amenity, i) => (
            <div key={i} className="group relative p-6 border rounded-xl bg-card hover:bg-accent/20 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between">
              <div className="space-y-4">
                <div className="text-primary bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground p-3 rounded-lg w-max transition-colors duration-300">
                  {amenity.icon}
                </div>
                <h3 className="font-semibold text-lg text-foreground tracking-tight">{amenity.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{amenity.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* 3. Call To Action Conversion Block */}
        <div className="mt-20 border rounded-2xl bg-muted/40 p-8 md:p-12 text-center max-w-4xl mx-auto space-y-6 shadow-inner">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Ready to Secure Your Sanctuary?</h3>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Browse our verified inventory of luxury suites, view detailed layouts, and complete your reservation instantly through our protected booking flow.
          </p>
          <div className="pt-2">
            <Button size="lg" className="font-semibold px-8 h-12 shadow-md hover:shadow-lg transition-all" asChild>
              <Link href="/rooms">Explore Available Rooms</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}