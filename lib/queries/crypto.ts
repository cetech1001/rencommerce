"use server";

import { CryptoRate } from "../types";

export async function getCryptoRates(): Promise<CryptoRate | null> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd",
      {
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch crypto rates:", response.statusText);
      return null;
    }

    const data = await response.json();

    return {
      btc: data.bitcoin?.usd || 0,
      eth: data.ethereum?.usd || 0,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Error fetching crypto rates:", error);
    return null;
  }
}
