"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";

interface DashboardChartsProps {
  revenueData: Array<{ name: string; revenue: number }>;
  distributionData: Array<{ name: string; value: number }>;
}

export function DashboardCharts({ revenueData, distributionData }: DashboardChartsProps) {
  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
      
      {/* 1. Large Area Graph Chart - Monthly Cash Flow Tracking */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base font-bold">Revenue Pipeline Analysis</CardTitle>
          <CardDescription>Visualized trailing gross cash generation vectors over time.</CardDescription>
        </CardHeader>
        <CardContent className="h-[320px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" />
              <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip 
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid处理 hsl(var(--border))", borderRadius: "8px" }}
                labelStyle={{ fontWeight: "bold" }}
              />
              <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2. Bar Chart Graph - Room Type Distribution Allocations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Inventory Volume Allocation</CardTitle>
          <CardDescription>Physical units categorized across active room types.</CardDescription>
        </CardHeader>
        <CardContent className="h-[320px] w-full pt-2">
          {distributionData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
              No inventory classes registered to generate chart tracks.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" />
                <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                />
                <Bar dataKey="value" name="Total Units" fill="hsl(var(--primary)/0.85)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

    </div>
  );
}