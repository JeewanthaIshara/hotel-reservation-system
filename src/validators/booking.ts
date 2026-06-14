import { z } from "zod";

export const bookingSchema = z.object({
  roomId: z.string().min(1, "A valid target room selection criteria is required."),
  // For z.date(), pass the fallback message directly using the message key
  checkIn: z.date({ message: "Arrival target date selection required." }),
  checkOut: z.date({ message: "Departure target date selection required." }),
}).refine((data) => data.checkOut > data.checkIn, {
  message: "Check-out criteria timeline must terminate after your initialization calendar event.",
  path: ["checkOut"],
});

export type BookingInput = z.infer<typeof bookingSchema>;