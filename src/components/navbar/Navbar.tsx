"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth, useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Hotel, Menu } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";

// 🔐 Hardcoded developer email whitelist
const ADMIN_EMAILS = ["jisharapemathilaka@gmail.com"];

export function Navbar() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  // Check if the current logged-in email matches your developer array entry
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  const isAdmin = userEmail && ADMIN_EMAILS.includes(userEmail);

  // Modular nav links array with explicit optional type checking for muted keys
  const navLinks: { label: string; href: string; muted?: boolean }[] = [
    { label: "Home", href: "/" },
    { label: "Rooms", href: "/rooms" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        
        {/* Left Side Section: Branding Logo & Desktop Navigation */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl tracking-tight">
            <Hotel className="h-6 w-6 text-primary" />
            <span>AuraStay</span>
          </Link>
    
          {/* 💻 Desktop Navigation View Layer (Hidden on Mobile) */}
          <nav className="hidden md:flex gap-6 text-sm font-medium transition-colors">
            {navLinks.map((link, idx) => (
              <Link 
                key={idx} 
                href={link.href} 
                className={link.muted ? "text-muted-foreground hover:text-primary" : "hover:text-primary"}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Right Side Section: Authentication Profiles & Mobile Sidebar Action Trigger */}
        <div className="flex items-center gap-4">
          
          {/* Action Buttons Frame Layer */}
          <div className="hidden md:flex items-center gap-4">
            {!isSignedIn ? (
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">Sign In</Button>
              </SignInButton>
            ) : (
              <div className="flex items-center gap-4">
                {isAdmin ? (
                  <Link 
                    href="/sync-user" 
                    className="text-xs font-semibold bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Admin Panel Control
                  </Link>
                ) : (
                  <Link 
                    href="/sync-user" 
                    className="text-sm font-medium text-muted-foreground hover:text-primary"
                  >
                    My Booking Dashboard
                  </Link>
                )}
                <UserButton />
              </div>
            )}
          </div>

          {/* 📱 Mobile Drawer Wrapper Trigger Component (Hidden on Desktop) */}
          <div className="flex items-center gap-4 md:hidden">
            {isSignedIn && <UserButton />}
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 p-0" aria-label="Toggle Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-70 sm:w-85 flex flex-col justify-between">
                <div className="space-y-6">
                  <SheetHeader className="text-left border-b pb-4">
                    <SheetTitle className="flex items-center gap-2 font-bold text-lg">
                      <Hotel className="h-5 w-5 text-primary" />
                      <span>AuraStay Navigation</span>
                    </SheetTitle>
                  </SheetHeader>

                  {/* Mobile Navigation List Links Container */}
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link, idx) => (
                      <Link
                        key={idx}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`text-base font-semibold transition-colors py-1 ${
                          link.muted ? "text-muted-foreground hover:text-primary" : "text-foreground hover:text-primary"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  {/* Dynamic Action Buttons inside Sidebar Content Menu */}
                  <div className="border-t pt-4 space-y-3">
                    {isSignedIn && (
                      isAdmin ? (
                        <Link 
                          href="/sync-user" 
                          onClick={() => setIsOpen(false)}
                          className="flex w-full justify-center text-center text-sm font-bold bg-primary text-primary-foreground py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
                        >
                          Admin Panel Control
                        </Link>
                      ) : (
                        <Link 
                          href="/sync-user" 
                          onClick={() => setIsOpen(false)}
                          className="flex w-full justify-center text-center text-sm font-bold border py-2.5 rounded-xl hover:bg-muted transition-colors"
                        >
                          My Booking Dashboard
                        </Link>
                      )
                    )}
                  </div>
                </div>

                {/* Bottom Action Footer Layer (If Signed Out) */}
                {!isSignedIn && (
                  <div className="border-t pt-4 pb-2">
                    <SignInButton mode="modal">
                      <Button onClick={() => setIsOpen(false)} className="w-full font-bold uppercase tracking-wide py-5 rounded-xl">
                        Sign In Access
                      </Button>
                    </SignInButton>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
}