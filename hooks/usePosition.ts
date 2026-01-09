import { useState, useEffect, useMemo, useCallback } from "react";
import { type PublicClient } from "viem";
import { ethers } from "ethers";
import { PERP_ADDRESS } from "@/lib/contracts";
import PERP_ABI from "@/lib/PerpMarket.json";

type Position = {
  size: bigint;
  entryPrice: bigint;
  margin: bigint;
};

const formatUnits = (v?: bigint, d = 18) => {
  if (typeof v !== "bigint") return 0;
  try {
    return Number(ethers.formatUnits(v, d));
  } catch {
    return 0;
  }
};

export const usePosition = (
  address: `0x${string}` | undefined,
  publicClient: PublicClient | undefined,
  price: number | null
) => {
  const [position, setPosition] = useState<Position | null>(null);

  const loadPosition = useCallback(async () => {
    if (!address || !publicClient) return;

    try {
      const raw = (await publicClient.readContract({
        address: PERP_ADDRESS as `0x${string}`,
        abi: PERP_ABI.abi,
        functionName: "positions",
        args: [address],
      })) as readonly [bigint, bigint, bigint];

      const [size, entryPrice, margin] = raw;

      if (size !== BigInt(0)) {
        setPosition({ size, entryPrice, margin });
      } else {
        setPosition(null);
      }
    } catch (e) {
      console.error("Position load failed", e);
      setPosition(null);
    }
  }, [address, publicClient]);

  useEffect(() => {
    loadPosition();
  }, [loadPosition]);

  const decoded = useMemo(() => {
    if (!position) return null;

    const absSize = formatUnits(position.size < BigInt(0) ? -position.size : position.size);
    const entry = formatUnits(position.entryPrice);
    const marginUsd = formatUnits(position.margin);

    const side = position.size > BigInt(0) ? "LONG" : "SHORT";
    const pnl = price !== null ? (price - entry) * absSize * (side === "LONG" ? 1 : -1) : 0;
    const lev = marginUsd > 0 && price !== null ? (absSize * price) / marginUsd : 0;

    return { side, absSize, entry, marginUsd, pnl, lev };
  }, [position, price]);

  return { position, decoded, loadPosition };
};
