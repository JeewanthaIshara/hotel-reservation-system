"use client"; // Marks this explicitly as a client component for hooks

import Link from "next/link";
import { useAuth, useUser, SignInButton, UserButton } from "@clerk/nextjs"; // 💡 Added useUser hook
import { Button } from "@/components/ui/button";
import { Hotel } from "lucide-react";

// 🔐 Hardcoded developer email whitelist (safe for client side checking during dev)
const ADMIN_EMAILS = ["jisharapemathilaka@gmail.com"]; // ◄ Replace this with your exact Clerk account email

export function Navbar() {
  // Get the current user session state using Clerk's client hooks
  const { isSignedIn } = useAuth();
  const { user } = useUser(); // 💡 Fetching the client-side user data profile object

  // Check if the current logged in email matches your developer array entry
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  const isAdmin = userEmail && ADMIN_EMAILS.includes(userEmail);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl tracking-tight">
            <Hotel className="h-6 w-6 text-primary" />
            <span>AuraStay</span>
          </Link>
    
          <nav className="hidden md:flex gap-6 text-sm font-medium transition-colors">
            <Link href="/" className="hover:text-primary">Home</Link>
            <Link href="/rooms" className="hover:text-primary">Rooms</Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">About</Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">Contact</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">Sign In</Button>
            </SignInButton>
          ) : (
            <div className="flex items-center gap-4">
              {/* 🎫 Visible ONLY to Whitelisted System Administrators */}
              {isAdmin ? (
                <Link 
                  href="/admin" 
                  className="text-xs font-semibold bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Admin Panel Control
                </Link>
              ) : (
                /* 👤 Visible ONLY to Standard Commercial Customers */
                <Link 
                  href="/user/dashboard" 
                  className="text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  My Booking Dashboard
                </Link>
              )}

              <UserButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}