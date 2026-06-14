import { UserButton } from "@clerk/nextjs";

interface AdminHeaderProps {
  user: any;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6 md:px-8 shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono bg-muted px-2 py-1 rounded border text-muted-foreground">
          SaaS Environment: Core
        </span>
      </div>

      {/* Profile actions container */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-semibold leading-none">{user.firstName} {user.lastName}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">System Operator</p>
        </div>
        <UserButton />
      </div>
    </header>
  );
}