"use client";

import { useState } from "react";
import { createRoomType } from "@/actions/room-types";
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

interface AmenityOption {
  id: string;
  name: string;
}

interface AddRoomTypeModalProps {
  amenities: AmenityOption[];
}

export function AddRoomTypeModal({ amenities }: AddRoomTypeModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Toggle utility tracking for chosen checkbox arrays
  const handleAmenityToggle = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    const payload = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      capacity: parseInt(formData.get("capacity") as string),
      images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"], // Standard placeholder setup
      amenityIds: selectedAmenities,
    };

    try {
      const result = await createRoomType(payload);
      if (result.success) {
        setOpen(false);
        setSelectedAmenities([]); // Reset checkmarks
        (event.target as HTMLFormElement).reset(); // Wipe standard input states
      }
    } catch (err: any) {
      setError(err.message || "Could not register target tier data parameters.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-sm font-semibold text-sm">
          <Plus className="h-4 w-4" /> Add Classification Tier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-115">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <DialogTitle>Create Room Classification Tier</DialogTitle>
            <DialogDescription>
              Define pricing configurations, stay capacities, and map bundled amenities.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-xs font-semibold text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Input 1: Classification Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name">Classification Name</Label>
              <Input id="name" name="name" placeholder="e.g., Executive King Suite, Deluxe Double" required disabled={loading} />
            </div>

            {/* Input 2: Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description">Description Layout Parameters</Label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe suite bed layouts, spatial structural dimensions, views..."
                required
                disabled={loading}
                className="flex min-h-17.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>

            {/* Input 3 & 4: Price and Capacity Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="price">Price per Night ($)</Label>
                <Input id="price" name="price" type="number" min="1" placeholder="250" required disabled={loading} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="capacity">Max Capacity (Guests)</Label>
                <Input id="capacity" name="capacity" type="number" min="1" placeholder="2" required disabled={loading} />
              </div>
            </div>

            {/* Input 5: Dynamic Amenities Feature List Grid */}
            <div className="space-y-2 border-t pt-3">
              <Label className="text-xs font-bold text-muted-foreground tracking-wide uppercase">
                Bundle Included Perks & Amenities
              </Label>
              
              {amenities.length === 0 ? (
                <p className="text-xs italic text-muted-foreground">No custom amenities found in global tables setup.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-30 overflow-y-auto p-2 border rounded-md bg-muted/10">
                  {amenities.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer p-1.5 hover:bg-muted/60 rounded transition-colors select-none"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(item.id)}
                        onChange={() => handleAmenityToggle(item.id)}
                        disabled={loading}
                        className="h-4 w-4 rounded border-input text-primary focus:ring-0 focus:ring-offset-0 disabled:opacity-50 cursor-pointer"
                      />
                      <span className="truncate">{item.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="min-w-25">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Configuration"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}