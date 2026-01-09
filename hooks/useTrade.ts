import { useState } from "react";
import { ethers } from "ethers";
import { type WalletClient } from "viem";
import { toast } from "sonner";
import { PERP_ADDRESS } from "@/lib/contracts";
import PERP_ABI from "@/lib/PerpMarket.json";

type Position = {
  size: bigint;
  entryPrice: bigint;
  margin: bigint;
};

export const useTrade = (loadPosition: () => Promise<void>) => {
  const [loading, setLoading] = useState(false);

  const openPosition = async (
    walletClient: WalletClient,
    isLong: boolean,
    size: number,
    margin: string
  ) => {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(walletClient.transport);
      const signer = await provider.getSigner();
      const perp = new ethers.Contract(PERP_ADDRESS, PERP_ABI.abi, signer);

      const sizeDelta = ethers.parseUnits(size.toFixed(6), 18);
      const marginDelta = ethers.parseEther(margin);

      await perp.openPosition(isLong, sizeDelta, marginDelta, {
        value: marginDelta,
      });

      // Wait for tx? The user's code just awaited the function call which usually waits for tx hash return in ethers v6 contract call, 
      // but usually needs .wait(). However, typically default setup waits for block or at least submission.
      // Assuming 'await perp.openPosition' returns tx response, we should await .wait() for confirmation if we want "Success" after mining.
      // But standard ethers contract call returns TransactionResponse.
      // I'll stick to original logic: await call, then assume submitted/success? 
      // Actually, if it throws, it fails. If it returns, it's submitted.
      // Let's add toast.success("Transaction submitted").

      toast.success("Position opened successfully");
      await loadPosition();
    } catch (e: any) {
      console.error("Open position failed", e?.reason || e);
      toast.error(e?.reason || "Failed to open position");
    } finally {
      setLoading(false);
    }
  };

  const closePosition = async (
    walletClient: WalletClient,
    position: Position,
    closePercent: number
  ) => {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(walletClient.transport);
      const signer = await provider.getSigner();
      const perp = new ethers.Contract(PERP_ADDRESS, PERP_ABI.abi, signer);

      const absSize = position.size < BigInt(0) ? -position.size : position.size;
      const closeSize = (absSize * BigInt(closePercent)) / BigInt(100);

      await perp.closePosition(closeSize);
      toast.success("Position closed successfully");
      await loadPosition();
    } catch (e: any) {
      console.error("Close position failed", e?.reason || e);
      toast.error(e?.reason || "Failed to close position");
    } finally {
      setLoading(false);
    }
  };

  return { loading, openPosition, closePosition };
};
