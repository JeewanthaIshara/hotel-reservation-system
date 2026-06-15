"use client";

import { useState, useEffect } from "react";
import { updateRoomType } from "@/actions/room-types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface AmenityOption {
  id: string;
  name: string;
}

interface EditRoomTypeModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  roomType: {
    id: string;
    name: string;
    description: string;
    price: number;
    capacity: number;
    amenities: { amenity: { id: string } }[];
  };
  globalAmenities: AmenityOption[];
}

export function EditRoomTypeModal({ open, setOpen, roomType, globalAmenities }: EditRoomTypeModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // 🟢 LIVE ALIGNMENT LAYER: Synchronize component states when incoming target reference mounts
  useEffect(() => {
    if (open && roomType.amenities) {
      const activeIds = roomType.amenities.map((item) => item.amenity.id);
      setSelectedAmenities(activeIds);
    }
  }, [open, roomType]);

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
      amenityIds: selectedAmenities,
    };

    try {
      const result = await updateRoomType(roomType.id, payload);
      if (result.success) {
        setOpen(false);
      } else {
        setError(result.error || "Could not update dynamic configuration parameters.");
      }
    } catch (err: any) {
      setError(err.message || "Could not process structural update sequences.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-115">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <DialogTitle>Modify Classification Properties</DialogTitle>
            <DialogDescription>
              Adjust pricing matrix formulas, capacity thresholds, or check/uncheck available suite perks.
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
              <Label htmlFor="edit-name">Classification Name</Label>
              <Input 
                id="edit-name" 
                name="name" 
                defaultValue={roomType.name} 
                required 
                disabled={loading} 
              />
            </div>

            {/* Input 2: Description */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-description">Description Layout Parameters</Label>
              <textarea
                id="edit-description"
                name="description"
                defaultValue={roomType.description}
                required
                disabled={loading}
                className="flex min-h-17.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>

            {/* Input 3 & 4: Price and Capacity Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-price">Price per Night ($)</Label>
                <Input 
                  id="edit-price" 
                  name="price" 
                  type="number" 
                  min="1" 
                  defaultValue={roomType.price} 
                  required 
                  disabled={loading} 
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-capacity">Max Capacity (Guests)</Label>
                <Input 
                  id="edit-capacity" 
                  name="capacity" 
                  type="number" 
                  min="1" 
                  defaultValue={roomType.capacity} 
                  required 
                  disabled={loading} 
                />
              </div>
            </div>

            {/* Input 5: Dynamic Amenities Feature List Grid */}
            <div className="space-y-2 border-t pt-3">
              <Label className="text-xs font-bold text-muted-foreground tracking-wide uppercase">
                Adjust Packaged Perks & Amenities
              </Label>
              
              {globalAmenities.length === 0 ? (
                <p className="text-xs italic text-muted-foreground">No global amenities registered in system tables.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-30 overflow-y-auto p-2 border rounded-md bg-muted/10">
                  {globalAmenities.map((item) => (
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
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}