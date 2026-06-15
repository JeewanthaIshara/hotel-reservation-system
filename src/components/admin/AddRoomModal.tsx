"use client";

import { useState } from "react";
import { createPhysicalRoom } from "@/actions/rooms"; // Maps to your physical rooms action file
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";

interface AddRoomModalProps {
  roomTypes: Array<{ id: string; name: string }>;
}

export function AddRoomModal({ roomTypes }: AddRoomModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    
    const payload = {
      roomNumber: formData.get("roomNumber") as string,
      roomTypeId: formData.get("roomTypeId") as string,
    };

    try {
      const result = await createPhysicalRoom(payload);
      if (result.success) {
        setOpen(false);
        (event.target as HTMLFormElement).reset(); // Clean up inputs on success
      }
    } catch (err: any) {
      setError(err.message || "Could not map target structure registry profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-sm font-semibold text-sm">
          <Plus className="h-4 w-4" /> Add Physical Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-100">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <DialogTitle>Map Physical Inventory Unit</DialogTitle>
            <DialogDescription>
              Assign individual door numbers directly to architectural suite classes.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-xs font-semibold text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Input 1: Room Identifier */}
            <div className="space-y-1.5">
              <Label htmlFor="roomNumber">Room Designation Identifier</Label>
              <Input id="roomNumber" name="roomNumber" placeholder="e.g., 101, 204, B-12" required disabled={loading} />
            </div>

            {/* Input 2: Dynamic Relational Dropdown Select */}
            <div className="space-y-1.5">
              <Label htmlFor="roomTypeId">Target Class Model Allocation</Label>
              <select 
                id="roomTypeId" 
                name="roomTypeId" 
                required 
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled selected>Choose a category model class...</option>
                {roomTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter className="pt-2 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading} className="min-w-25">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Link Unit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}