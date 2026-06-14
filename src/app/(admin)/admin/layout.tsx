import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

// 🔐 Hardcoded developer email array (Matches your Navbar perfectly)
const ADMIN_EMAILS = [
  "jisharapemathilaka@gmail.com", // ◄ Type your exact login email address here in lowercase
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Authenticate user access server-side with Clerk
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/");
  }

  // 2. Fetch the primary email address string safely on the server side
  const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase()?.trim();
  
  // 3. Match against your admin array entries safely
  const isAdmin = userEmail && ADMIN_EMAILS.map(e => e.toLowerCase().trim()).includes(userEmail);

  // 4. If the server evaluation fails, bounce them back out
  if (!isAdmin) {
    console.log(`❌ Admin Access Denied for server email: ${userEmail}`);
    redirect("/");
  }

  // 5. If everything passes, render the administrative workspace panel
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-muted/40">
      {/* Sidebar structural frame */}
      <AdminSidebar />
      
      {/* Main interface layout container wrapper canvas */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminHeader user={user} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}