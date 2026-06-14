import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={cn("font-sans", geist.variable)}>
        <body className="flex flex-col min-h-screen bg-background text-foreground antialiased">
          
          <Navbar />
          
          {/* Fixed: Use a standard div spacer container here instead of a nested main */}
          <div className="flex-grow flex flex-col">
            {children}
          </div>
          
          <Footer />
          
        </body>
      </html>
    </ClerkProvider>
  );
}