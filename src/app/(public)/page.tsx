import { Hero } from "@/components/home/Hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldCheck, Wifi, Coffee, Sparkles } from "lucide-react";

export const metadata = {
  title: "AuraStay | Luxury Hotel & Resort Reservations",
  description: "Book an absolute masterpiece of comfort. Browse our elegant rooms and premium amenities.",
};

export default function PublicHomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Hero />
      
      {/* Dynamic Amenities Pitching Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">World-Class Services</h2>
          <p className="text-muted-foreground">Every detail crafted to elevate your sensory experience.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: <Wifi className="h-8 w-8" />, title: "Ultra High-Speed Wi-Fi", desc: "Gigabit fiber connectivity throughout the entire resort complex." },
            { icon: <Coffee className="h-8 w-8" />, title: "Artisanal Dining", desc: "Complimentary premium morning blend curated by master baristas." },
            { icon: <ShieldCheck className="h-8 w-8" />, title: "Complete Security", desc: "Advanced smart key-card encryption and round-the-clock security floor agents." },
            { icon: <Sparkles className="h-8 w-8" />, title: "Wellness & Spa", desc: "Free entry into the infinity edge wellness pools and luxury dry saunas." },
          ].map((amenity, i) => (
            <div key={i} className="p-6 border rounded-xl bg-card space-y-4 shadow-sm">
              <div className="text-primary bg-primary/10 p-3 rounded-lg w-max">{amenity.icon}</div>
              <h3 className="font-semibold text-lg">{amenity.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{amenity.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Button size="lg" asChild>
            <Link href="/rooms">Explore Our Suites & Rooms</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}