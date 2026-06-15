import { prisma } from "@/lib/prisma";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Banknote, TrendingUp, ShieldCheck } from "lucide-react";
import { PaymentStatusSelect } from "@/components/admin/PaymentStatusSelect";

export const revalidate = 0;

export default async function AdminPaymentsPage() {
  // Fetch payment models including user strings via the booking cross-link relation
  const payments = await prisma.payment.findMany({
    include: {
      booking: {
        include: {
          user: { select: { name: true, email: true } }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  // Calculate gross settled revenue total sums dynamically
  const grossRevenue = payments
    .filter(p => p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Banknote className="h-5 w-5 text-primary" /> Financial Settlements Ledger
        </h1>
        <p className="text-sm text-muted-foreground">
          Track invoice lifecycles, oversee cash settlements, and manage guest refunds across your booking network.
        </p>
      </div>

      {/* Metric summary banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 border rounded-xl bg-card shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-600">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Gross Settled Revenue</p>
            <h3 className="text-2xl font-black text-foreground font-mono">${grossRevenue.toFixed(2)}</h3>
          </div>
        </div>
        <div className="p-4 border rounded-xl bg-card shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Invoices Logged</p>
            <h3 className="text-2xl font-black text-foreground font-mono">{payments.length}</h3>
          </div>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Invoice Identifier</TableHead>
              <TableHead>Guest Detail</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Amount Due</TableHead>
              <TableHead className="text-right w-50">Settle Parameters</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-sm text-muted-foreground">
                  No billing invoices have been logged yet.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((invoice) => {
                const formattedDate = new Date(invoice.createdAt).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric"
                });

                return (
                  <TableRow key={invoice.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-xs font-bold text-muted-foreground">
                      INV-{invoice.id.substring(3, 11).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-foreground">
                          {invoice.booking?.user?.name || "Anonymous User"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {invoice.booking?.user?.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-medium">
                      {formattedDate}
                    </TableCell>
                    <TableCell className="font-mono font-bold text-sm text-foreground">
                      ${invoice.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <PaymentStatusSelect paymentId={invoice.id} currentStatus={invoice.status} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}