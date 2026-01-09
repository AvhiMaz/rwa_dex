import { useState, useEffect } from "react";
import axios from "axios";
import { type Time } from "lightweight-charts";

type OHLCData = {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
};

export const useMarketData = (timeframe: "15m" | "30m" | "24h" | "7d") => {
  const [price, setPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number | null>(null);
  const [marketCap, setMarketCap] = useState<number | null>(null);
  const [ohlcData, setOhlcData] = useState<OHLCData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const days = timeframe === "7d" ? 7 : 1;

        const priceRes = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=tether-gold&vs_currencies=usd&include_market_cap=true&include_24hr_change=true"
        );
        const data = priceRes.data["tether-gold"];
        setPrice(data.usd);
        setPriceChange(data.usd_24h_change);
        setMarketCap(data.usd_market_cap);

        const ohlcRes = await axios.get(
          `https://api.coingecko.com/api/v3/coins/tether-gold/ohlc?vs_currency=usd&days=${days}`
        );

        const formattedData = ohlcRes.data.map((d: number[]) => ({
          time: Math.floor(d[0] / 1000) as Time,
          open: d[1],
          high: d[2],
          low: d[3],
          close: d[4],
        }));

        setOhlcData(formattedData);
      } catch (e) {
        console.error("Market data fetch failed", e);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [timeframe]);

  return { price, priceChange, marketCap, ohlcData };
};
