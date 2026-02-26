"use client";

import React, { useEffect, useState } from "react";

export default function DashboardClient() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`https://api.dexscreener.com/token-boosts/latest/v1`);
        const json = await res.json();
        if (!mounted) return;
        if (json) setRows(json || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    const t = setInterval(fetchData, 15_000);
    return () => { mounted = false; clearInterval(t); };
  }, []);

  if (loading) return <div className="p-6">Loading market data…</div>;

  return (
    <div className="w-full">

      {/* Scrollable table container */}
      <div className="max-h-[65vh] overflow-y-auto rounded-lg border bg-gray-900 text-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800 sticky top-0 z-10">
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
                <td className="p-3">
                  <div className="font-medium">{r.description || r.query}</div>
                  <div className="text-xs text-gray-400">
                    {r.symbol || ""} • ${Number(r.price || 0).toFixed(4)}
                  </div>
                </td>

                <td className="p-3 text-right">Nil</td>
                <td className="p-3 text-right">Nil</td>
                <td className="p-3 text-right">Nil</td>
                <td className="p-3 text-right">Nil</td>

                <td className="p-3">
                  <button className="rounded-full bg-blue-600 px-4 py-1 text-sm">
                    Buy
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}