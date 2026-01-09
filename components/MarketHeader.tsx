"use client";

import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type MarketHeaderProps = {
  price: number | null;
  priceChange: number | null;
  marketCap: number | null;
};

export const MarketHeader = ({ price, priceChange, marketCap }: MarketHeaderProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between mb-8 px-2">
      <div className="flex items-center gap-4">
        <div className="text-3xl font-mono font-bold tracking-tight flex items-center gap-2">
          {price ? `$${price.toFixed(2)}` : <Skeleton className="h-8 w-24" />}
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
            <TrendingUp className="w-3 h-3 text-muted-foreground" />
          </div>
        </div>
        <Badge
          variant="secondary"
          className={`font-mono px-2 py-0.5 rounded-sm ${
            priceChange && priceChange >= 0
              ? "text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20"
              : "text-rose-600 bg-rose-500/10 hover:bg-rose-500/20"
          }`}
        >
          {priceChange ? `${priceChange >= 0 ? "+" : ""}${priceChange.toFixed(2)}%` : "0.00%"} 24h
        </Badge>
      </div>
      <div className="flex items-center gap-4 font-mono text-sm text-muted-foreground">
        <span>
          fdv{" "}
          <span className="text-foreground font-bold">
            {marketCap ? `$${(marketCap / 1e6).toFixed(1)}M` : "..."}
          </span>
        </span>
      </div>
    </div>
  );
};
