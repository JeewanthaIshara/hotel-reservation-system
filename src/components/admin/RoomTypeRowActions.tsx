"use client";

import { useState } from "react";
import { EditRoomTypeModal } from "./EditRoomTypeModal";
import { deleteRoomType } from "@/actions/room-types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Loader2 } from "lucide-react";

interface RoomTypeRowActionsProps {
  roomType: {
    id: string;
    name: string;
    description: string;
    price: number;
    capacity: number;
    amenities: { amenity: { id: string; name: string } }[];
  };
  globalAmenities: { id: string; name: string }[];
}

export function RoomTypeRowActions({ roomType, globalAmenities }: RoomTypeRowActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you absolutely sure you want to delete the "${roomType.name}" tier classification? All linked database records will clear cascade.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteRoomType(roomType.id);
      if (!result.success) {
        alert(result.error || "Failed to process target deletion framework.");
      }
    } catch (err) {
      alert("Network exception error handling database structural operations.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0" disabled={isDeleting}>
            <span className="sr-only">Open management menu</span>
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => setIsEditOpen(true)} className="gap-2 cursor-pointer text-xs font-semibold">
            <Edit className="h-3.5 w-3.5 text-muted-foreground" /> Edit Properties
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} className="gap-2 cursor-pointer text-xs font-semibold text-destructive focus:text-destructive focus:bg-destructive/10">
            <Trash2 className="h-3.5 w-3.5" /> Delete Matrix
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Stateful configuration injection mapping */}
      <EditRoomTypeModal 
        open={isEditOpen} 
        setOpen={setIsEditOpen} 
        roomType={roomType} 
        globalAmenities={globalAmenities} 
      />
    </>
  );
}