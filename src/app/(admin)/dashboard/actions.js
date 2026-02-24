// app/api/market-data/route.js
import { NextResponse } from "next/server";

/**
 * Example server handler that:
 *  - Accepts optional query param ?pairs=comma,separated (pair identifiers or token symbols)
 *  - Fetches pair/token data from DEXScreener and price/marketcap from CoinGecko
 *
 * NOTE: adapt pairIds/tokenIds to your app's needs. Add caching for production.
 */

const DEX_SCREENER_BASE = "https://api.dexscreener.com";
const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    // expected format: ?pairs=orca,clawtists or ?pairs=sol:pairAddress1,sol:pairAddress2
    const pairsQuery = url.searchParams.get("pairs") || "";
    const pairs = pairsQuery ? pairsQuery.split(",").map((s) => s.trim()).filter(Boolean) : [];

    // If no pairs passed, use a demo set (symbols or pair ids)
    const demoPairs = ["ORCA", "CLAWTISTS", "PUNCH", "DOBBY", "LOBSTAR", "DAVE"];
    const queryPairs = pairs.length ? pairs : demoPairs;

    // Build DEXScreener search requests (example: using symbol search endpoint)
    // Docs: https://docs.dexscreener.com/api/reference
    // We'll call the search endpoint (rate-limited); for production use pair IDs or a server-side cache.
    const dsPromises = queryPairs.map(async (p) => {
      // search by token symbol (works for many tokens)
      const searchUrl = `${DEX_SCREENER_BASE}/latest/dex/search?q=${encodeURIComponent(p)}`;
      const res = await fetch(searchUrl);
      if (!res.ok) return { query: p, error: true };
      const data = await res.json();
      // DEXScreener returns list of pairs; pick the first relevant pair to represent this token
      const pair = (data.pairs && data.pairs[0]) || null;
      return { query: p, pair };
    });

    const dsResults = await Promise.all(dsPromises);

    // collect coinGecko ids from found pairs (if pair contains coinGeckoId)
    const cgIds = [];
    dsResults.forEach((r) => {
      const coinId = r.pair?.baseToken?.coinGeckoId || r.pair?.targetToken?.coinGeckoId;
      if (coinId && !cgIds.includes(coinId)) cgIds.push(coinId);
    });

    // fetch coinGecko markets for those ids (market cap, image, symbol)
    let cgMap = {};
    if (cgIds.length > 0) {
      const cgUrl = `${COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=${encodeURIComponent(
        cgIds.join(",")
      )}&order=market_cap_desc&per_page=250&page=1&sparkline=false`;
      const cgRes = await fetch(cgUrl);
      if (cgRes.ok) {
        const cgData = await cgRes.json();
        cgMap = Object.fromEntries(cgData.map((c) => [c.id, c]));
      }
    }

    // build unified payload
    const payload = dsResults.map((r) => {
      const pair = r.pair;
      if (!pair) return { query: r.query, missing: true };

      const coinId = pair.baseToken?.coinGeckoId || pair.targetToken?.coinGeckoId;
      const coinGecko = coinId ? cgMap[coinId] || null : null;

      return {
        query: r.query,
        pairId: pair.pairId || pair.dexId || null,
        name: pair.baseToken?.name || pair.pairName || pair.name,
        symbol: pair.baseToken?.symbol || pair.baseToken?.contract || pair.symbol,
        price: pair.priceUsd || pair.price || null,
        priceChange24h: pair.priceChange?.priceChange24h || pair.priceChange24h || pair.priceChange,
        liquidity: pair.liquidity?.usd || pair.liquidity || null,
        volume24h: pair.volume?.usd || pair.volume || null,
        txns24h: pair.txns || null,
        tokenInfo: {
          logo: coinGecko?.image || pair.baseToken?.logoURI || null,
          marketCap: coinGecko?.market_cap || null,
          marketCapRank: coinGecko?.market_cap_rank || null,
        },
        raw: pair, // include raw provider payload for debugging
      };
    });

    console.log("payload", payload);
    

    return NextResponse.json({ ok: true, data: payload });
  } catch (err) {
    console.error("market-data error", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}