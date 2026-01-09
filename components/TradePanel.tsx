"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

type TradePanelProps = {
  margin: string;
  setMargin: (value: string) => void;
  leverage: number;
  setLeverage: (value: number) => void;
  size: number;
  notional: number;
  price: number | null;
  canTrade: boolean;
  isConnected: boolean;
  loading: boolean;
  onOpenLong: () => void;
  onOpenShort: () => void;
};

const MAX_LEVERAGE = 10;

export const TradePanel = ({
  margin,
  setMargin,
  leverage,
  setLeverage,
  size,
  notional,
  price,
  canTrade,
  isConnected,
  loading,
  onOpenLong,
  onOpenShort,
}: TradePanelProps) => {
  return (
    <Card className="border-none shadow-2xl shadow-primary/10 ring-1 ring-border/50 backdrop-blur-xl bg-background/60 overflow-hidden supports-[backdrop-filter]:bg-background/40">
      <CardHeader className="pb-4 bg-transparent">
        <CardTitle>Trade</CardTitle>
        <CardDescription>Open a long or short position</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">Leverage</Label>
            <Badge variant="outline" className="font-mono">
              {leverage}x
            </Badge>
          </div>
          <Slider
            defaultValue={[3]}
            max={MAX_LEVERAGE}
            min={1}
            step={1}
            value={[leverage]}
            onValueChange={(vals) => setLeverage(vals[0])}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>1x</span>
            <span>5x</span>
            <span>10x</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Margin (MNT)</Label>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.0"
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
              className="bg-background pr-16 h-12 text-lg font-mono"
            />
            <div className="absolute right-3 top-3 text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded">
              MNT
            </div>
          </div>
        </div>

        <div className="bg-secondary/40 rounded-xl p-4 space-y-3 text-sm border border-border/50">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Position Size</span>
            <span className="font-medium">{size.toFixed(4)} XAUT</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Notional Value</span>
            <span className="font-medium">${notional.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fees</span>
            <span className="font-medium">0.1%</span>
          </div>
          <Separator className="bg-border/50" />
          <div className="flex justify-between font-semibold">
            <span>Total Cost</span>
            <span>{margin} MNT</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            className="h-14 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 cursor-pointer"
            onClick={onOpenLong}
            disabled={!canTrade}
          >
            Long
          </Button>
          <Button
            className="h-14 text-lg font-semibold bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-500/20 cursor-pointer"
            onClick={onOpenShort}
            disabled={!canTrade}
          >
            Short
          </Button>
        </div>

        {!isConnected && (
          <div className="text-center text-xs text-muted-foreground">Connect wallet to trade</div>
        )}
      </CardContent>
    </Card>
  );
};
