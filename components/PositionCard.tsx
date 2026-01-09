"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

type PositionCardProps = {
  decoded: {
    side: string;
    absSize: number;
    entry: number;
    marginUsd: number;
    pnl: number;
    lev: number;
  };
  closePercent: number;
  setClosePercent: (value: number) => void;
  onClose: () => void;
  loading: boolean;
};

export const PositionCard = ({
  decoded,
  closePercent,
  setClosePercent,
  onClose,
  loading,
}: PositionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-8"
    >
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <Activity className="w-5 h-5 text-gray-700" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">XAUT/USD</h3>
            <Badge
              className={
                decoded.side === "LONG"
                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-0 rounded-md text-xs font-medium mt-1"
                  : "bg-rose-50 text-rose-600 hover:bg-rose-50 border-0 rounded-md text-xs font-medium mt-1"
              }
            >
              {decoded.side} {decoded.lev.toFixed(1)}x
            </Badge>
          </div>
        </div>

        {/* PnL Display */}
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Unrealized PnL
          </p>
          <div
            className={`text-2xl font-semibold ${decoded.pnl >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
          >
            {decoded.pnl >= 0 ? "+" : ""}
            {decoded.pnl.toFixed(2)} USD
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-sm text-gray-500">Size</span>
          <span className="text-sm font-medium text-gray-900">
            {decoded.absSize.toFixed(4)}{" "}
            <span className="text-gray-400">XAUT</span>
          </span>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-sm text-gray-500">Entry</span>
          <span className="text-sm font-medium text-gray-900">
            ${decoded.entry.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-sm text-gray-500">Margin</span>
          <span className="text-sm font-medium text-gray-900">
            ${decoded.marginUsd.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Close Position Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Close Position
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {closePercent}%
          </span>
        </div>

        <Slider
          defaultValue={[100]}
          max={100}
          min={1}
          step={1}
          value={[closePercent]}
          onValueChange={(vals) => setClosePercent(vals[0])}
          className="py-1"
        />

        <Button
          variant="outline"
          className="cursor-pointer w-90 h-11 font-medium rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
          onClick={onClose}
          disabled={loading}
        >
          {loading ? "Closing..." : "Execute Close"}
        </Button>
      </div>
    </motion.div>
  );
};