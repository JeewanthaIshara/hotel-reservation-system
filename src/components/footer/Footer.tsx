import Link from "next/link";
import { Building, Globe, MessageSquare, Share2 } from "lucide-react"; // Replaced brand icons
import { Button } from "@/components/ui/button";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-card text-card-foreground mt-auto">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="space-y-4 flex flex-col">
            <Link href="/" className="flex items-center space-x-2 font-bold text-xl tracking-tight">
              <Building className="h-5 w-5 text-primary" />
              <span>AuraStay</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Bespoke architectural logic, digital hospitality engines, and premium sanctuary booking flows built for unmatched comfort.
            </p>
          </div>

          {/* Navigation Links Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground/80">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/rooms" className="text-muted-foreground hover:text-primary transition-colors">Our Suites</Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Amenities</Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground/80">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Refund Policies</Link>
              </li>
            </ul>
          </div>

          {/* Social Icons Column - Swapped for standard supported primitives */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground/80">
              Connect With Us
            </h4>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" asChild className="h-9 w-9 text-muted-foreground hover:text-primary">
                <Link href="https://twitter.com" target="_blank" aria-label="Social Updates">
                  <MessageSquare className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="h-9 w-9 text-muted-foreground hover:text-primary">
                <Link href="https://github.com" target="_blank" aria-label="Open Source Repository">
                  <Share2 className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="h-9 w-9 text-muted-foreground hover:text-primary">
                <Link href="https://facebook.com" target="_blank" aria-label="Global Portal">
                  <Globe className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Strip */}
        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} AuraStay Inc. All secure rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded text-[11px] border">
              System Status: Nominal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}