"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, use, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, type BookingInput } from "@/validators/booking";
import { createBooking } from "@/actions/booking-actions";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface PageProps {
  searchParams: Promise<{ room?: string }>;
}

export default function CreateBookingPage({ searchParams }: PageProps) {
  const resolvedParams = use(searchParams);
  const roomId = resolvedParams.room || "";
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { roomId, checkIn: undefined, checkOut: undefined },
  });

  const onSubmit = async (data: BookingInput) => {
    setIsPending(true);
    startTransition(async () => {
      try {
        const response = await createBooking(data);
        if (response?.success) {
          toast.success("Reservation confirmed successfully!");
          router.push("/dashboard");
        }
      } catch (err: any) {
        toast.error(err.message || "An error occurred while creating your reservation.");
      } finally {
        setIsPending(false);
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="border rounded-xl p-8 shadow-xl bg-card space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Finalize Reservation</h1>
          <p className="text-sm text-muted-foreground">Select your dates to secure your accommodations.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="checkIn"
              render={({ field }: { field: any }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Check In</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Pick arrival date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="checkOut"
              render={({ field }: { field: any }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Check Out</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Pick departure date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full h-11" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm Complete Reservation"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}