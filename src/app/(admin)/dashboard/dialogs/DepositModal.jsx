"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import QRCode from "react-qr-code";

export default function DepositModal({ isOpen = false, onClose = () => {}, chain = "Solana", address = "", balance = 0 }) {
  const modalRef = useRef(null);
  const firstFocusRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Deposit");
  const [copied, setCopied] = useState(false);

  // lock body scroll while modal open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  // focus & ESC
  useEffect(() => {
    if (!isOpen) return;
    const focusTimer = setTimeout(() => firstFocusRef.current?.focus(), 80);
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (err) {
      console.error("copy failed", err);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Full-page overlay with blur */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-lg"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Centered modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="fixed left-1/2 top-1/2 z-[70] p-4 transform -translate-x-1/2 -translate-y-1/2"
            onClick={onClose}
          >
            <div
              ref={modalRef}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="deposit-title"
              className="w-full max-w-md rounded-2xl bg-[#0f0f11] text-white shadow-2xl ring-1 ring-white/6 max-h-[90vh] overflow-auto"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
                <h3 id="deposit-title" className="text-lg font-semibold">Exchange</h3>
                <button aria-label="Close deposit dialog" onClick={onClose} className="rounded-md px-2 py-1 text-white/60 hover:text-white focus:outline-none">✕</button>
              </div>

              <div className="px-4 pt-4">
                <div className="flex gap-2 rounded-xl bg-white/3 p-1">
                  {["Convert", "Deposit", "Buy"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${activeTab === t ? "bg-[#141416] text-white shadow-sm" : "text-white/60 hover:text-white"}`}
                      aria-pressed={activeTab === t}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-5 py-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-cyan-400 text-black text-sm font-bold">
                      {chain?.[0] ?? "S"}
                    </div>

                    <div>
                      <div className="text-sm font-medium">{chain}</div>
                      <div className="text-xs text-white/60">Only deposit {chain} through the {chain} network for this address.</div>
                    </div>
                  </div>

                  <div className="text-sm text-white/60">Balance: <span className="text-white ml-1">{balance} {chain === "Solana" ? "SOL" : ""}</span></div>
                </div>

                <div className="mt-4 flex flex-col items-center gap-4">
                  <div className="rounded-lg bg-white p-3 text-black">
                    <QRCode value={address || "dummy:address"} size={156} />
                  </div>

                  <div className="w-full rounded-md border border-white/6 bg-[#0b0b0c] p-3 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="text-xs text-white/60">Deposit Address</div>
                        <div className="mt-1 break-all font-mono text-sm">{address || "8oXsvS3Ggyrb2z37bNyordBkxXbEdGWLeBEeo2VwwJEwf"}</div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <button ref={firstFocusRef} onClick={handleCopy} className="rounded-md bg-gradient-to-br from-blue-500 to-purple-500 px-3 py-2 text-xs font-medium">
                          {copied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-white/60">
                    Don't have any {chain}? <a className="text-blue-400 underline" href="https://onramper.com" target="_blank" rel="noreferrer">Buy through Onramper</a>.
                  </div>
                </div>

                <div className="mt-6 px-1">
                  <button onClick={() => { navigator.clipboard.writeText(address || ""); setCopied(true); setTimeout(()=>setCopied(false),1400); }} className="w-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 px-4 py-2 text-sm font-semibold">
                    Copy Address
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}