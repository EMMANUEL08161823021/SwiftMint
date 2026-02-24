"use client";

import React, { useEffect, useState } from "react";

export default function Dashboard() {
     const [rows, setRows] = useState([]);
     const [loading, setLoading] = useState(true);

     // optional: pass pairs list here; server falls back to demo tokens if empty
     const pairsParam = ["ORCA","CLAWTISTS","PUNCH","DOBBY","LOBSTAR","DAVE"].join(",");

     useEffect(() => {
     let mounted = true;
     async function fetchData() {
          setLoading(true);
          try {
          const res = await fetch(`https://api.dexscreener.com/token-boosts/latest/v1`);
          const json = await res.json();
          console.log("json", json);
          
          if (!mounted) return;
          if (json) setRows(json || []);
          else console.error("Server error:", json.error);
          } catch (err) {
          console.error(err);
          } finally {
          if (mounted) setLoading(false);
          }
     }
     fetchData();
     const t = setInterval(fetchData, 15_000); // refresh every 15s (adjust)
     return () => { mounted = false; clearInterval(t); };
     }, []);

     if (loading) return <div className="p-6">Loading market data…</div>;

     return (
          <div className="p-6">
               <div className="overflow-x-auto rounded-lg border bg-gray-900 text-white">
               <table className="min-w-full text-sm">
                    <thead className="bg-gray-800">
                    <tr>
                    <th className="p-3 text-left">Pair</th>
                    <th className="p-3 text-right">Market Cap</th>
                    <th className="p-3 text-right">Liquidity</th>
                    <th className="p-3 text-right">Volume (24h)</th>
                    <th className="p-3 text-right">TXNs</th>
                    <th className="p-3 text-left">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((r, i) => (
                    <tr key={i} className="border-t border-gray-800">
                         <td className="p-3 flex items-center gap-3">
                         {/* <img src={r.tokenInfo.logo || "/assets/default-token.png"} alt="" className="h-8 w-8 rounded" /> */}
                         <div>
                              <div className="font-medium">{r.description || r.query}</div>
                              <div className="text-xs text-gray-400">{r.symbol || ""} • ${Number(r.price || 0).toFixed(4)}</div>
                         </div>
                         </td>

                         {/* <td className="p-3 text-right">{r.tokenInfo.marketCap ? `$${Number(r.tokenInfo.marketCap).toLocaleString()}` : "—"}</td> */}

                         <td className="p-3 text-right">Nil</td>
                         <td className="p-3 text-right">Nil</td>
                         <td className="p-3 text-right">Nil</td>
                         <td className="p-3 text-right">Nil</td>

                         {/* <td className="p-3 text-right">{r.volume24h ? `$${Number(r.volume24h).toLocaleString()}` : "—"}</td> */}

                         {/* <td className="p-3 text-right">{r.txns24h ?? "—"}</td> */}

                         <td className="p-3">
                         <button className="rounded-full bg-blue-600 px-4 py-1 text-sm">Buy</button>
                         </td>
                    </tr>
                    ))}
                    </tbody>
               </table>
               </div>
          </div>
     );
}