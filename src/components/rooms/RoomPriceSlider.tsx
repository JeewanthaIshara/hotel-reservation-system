"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export function RoomPriceSlider({ currentMaxPrice }: { currentMaxPrice?: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [price, setPrice] = useState<number>(currentMaxPrice || 600);

  function handleFilterSubmit() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("maxPrice", price.toString());
    
    startTransition(() => {
      router.push(`/rooms?${params.toString()}`);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
        <label>Max Budget Allocation</label>
        <span className="font-mono text-foreground font-black text-sm">${price}/n</span>
      </div>
      
      <Slider 
        value={[price]} 
        max={1000} 
        min={50} 
        step={25} 
        onValueChange={(val) => setPrice(val[0])}
        className="py-2" 
      />

      <Button 
        onClick={handleFilterSubmit} 
        disabled={isPending}
        className="w-full text-xs font-bold uppercase tracking-wider py-4 rounded-xl" 
        size="sm"
      >
        {isPending ? "Syncing Parameters..." : "Execute Query"}
      </Button>
    </div>
  );
}