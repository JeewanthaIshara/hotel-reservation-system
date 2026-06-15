import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// 🔐 Your master administrative system list
const ADMIN_EMAILS = [
  "jisharapemathilaka@gmail.com", // ◄ Your exact login email address
];

export default async function SyncUserPage() {
  const { userId } = await auth();
  const user = await currentUser();

  // 1. Immediate exit safety guard for unauthenticated traffic
  if (!userId || !user) {
    return redirect("/");
  }

  // 2. Safely extract and clean the email address string
  const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase()?.trim();
  
  if (!userEmail) {
    return redirect("/");
  }

  // 3. Evaluate role status cleanly
  const isAdmin = ADMIN_EMAILS.map(e => e.toLowerCase().trim()).includes(userEmail);

  // 4. Declare a single fallback destination path
  let targetDestination = "/dashboard";

  if (isAdmin) {
    console.log(`⚡ Admin detected (${userEmail}). Routing to Management Panel.`);
    targetDestination = "/admin";
  } else {
    console.log(`👤 Customer detected (${userEmail}). Routing to Guest Portal.`);
    targetDestination = "/dashboard";
  }

  // 5. Final singular redirect call to prevent Next.js routing runtime crashes
  return redirect(targetDestination);
}