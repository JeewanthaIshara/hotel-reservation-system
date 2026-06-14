import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// 🔐 Your master administrative system list
const ADMIN_EMAILS = [
  "jisharapemathilaka@gmail.com", // ◄ Your exact login email address
];

export default async function SyncUserPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/");
  }

  // Extract the primary email address safely
  const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase()?.trim();
  const isAdmin = userEmail && ADMIN_EMAILS.map(e => e.toLowerCase().trim()).includes(userEmail);

  // 🔀 The Decision Engine: Separate the traffic completely
  if (isAdmin) {
    console.log(`⚡ Admin detected (${userEmail}). Routing to Management Panel.`);
    redirect("/admin");
  } else {
    console.log(`👤 Customer detected (${userEmail}). Routing to Guest Portal.`);
    redirect("/user/dashboard");
  }
}