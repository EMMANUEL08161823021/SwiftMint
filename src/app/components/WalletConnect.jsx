"use client";

import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

/**
 * WalletConnect button that:
 *  - Opens the adapter modal if no wallet is selected
 *  - Connects then asks the wallet to sign a server nonce
 *  - Handles common adapter errors (WalletNotSelectedError)
 */
export default function WalletConnect() {
  const { wallet, publicKey, connected, connect, disconnect, signMessage } = useWallet();
  const { setVisible } = useWalletModal();
  const [loading, setLoading] = useState(false);

  async function handleConnectAndSign() {
    setLoading(true);
    try {
      // If no wallet adapter at all (Phantom not installed / blocked)
      if (!wallet) {
        // open the wallet modal so user can pick/install
        setVisible(true);
        alert(
          "No wallet detected. Please select Phantom from the wallet modal or install Phantom and refresh the page."
        );
        setLoading(false);
        return;
      }

      // If a wallet exists but not connected, ask to connect
      if (!connected) {
        try {
          await connect();
        } catch (err) {
          // If the adapter complains that no wallet was selected, open the modal
          // WalletNotSelectedError is thrown by some adapters when the app tries to connect without a selection
          if (err?.name === "WalletNotSelectedError" || err?.name === "WalletNotReadyError") {
            setVisible(true);
            setLoading(false);
            return;
          }
          throw err;
        }
      }

      // After connect, ensure signMessage exists
      if (!signMessage) {
        throw new Error("This wallet doesn't support message signing.");
      }

      // Get nonce from server
      const nonceRes = await fetch("/api/auth/nonce");
      if (!nonceRes.ok) throw new Error("Failed to fetch nonce from server.");
      const { nonce } = await nonceRes.json();

      const encoder = new TextEncoder();
      const message = encoder.encode(`Sign in to EdgeMetrics\nnonce: ${nonce}`);

      const signed = await signMessage(message); // wallet will prompt

      // Send signature to server for verification
      const body = {
        pubkey: publicKey?.toBase58(),
        signature: Array.from(signed),
        nonce,
      };

      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!verifyRes.ok) {
        const text = await verifyRes.text();
        throw new Error(text || "Signature verification failed on server.");
      }

      // success
      const data = await verifyRes.json();
      console.log("Signed in:", data);
      // navigate or reload as you need, e.g.:
      // router.push('/dashboard')
    } catch (err) {
      console.error("Wallet connect / sign error:", err);
      // Friendly messages for common scenarios:
      if (err?.name === "WalletNotSelectedError") {
        setVisible(true);
        alert("Please select Phantom in the wallet picker.");
        return;
      }
      if (err?.message?.includes("No wallet detected")) {
        alert("Phantom not installed. Install Phantom and refresh the page.");
        return;
      }
      alert(err.message || "Wallet connect failed. See console for details.");
    } finally {
      setLoading(false);
    }
  }

  if (connected && publicKey) {
    const pk = publicKey.toBase58();
    return (
      <div className="flex items-center gap-2">
        <div className="text-sm">Connected: {pk.slice(0, 6)}…{pk.slice(-4)}</div>
        <button
          onClick={() => disconnect()}
          className="px-3 py-1 border rounded-md text-sm"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnectAndSign}
      disabled={loading}
      className="w-full px-4 py-2 rounded-md border text-sm"
    >
      {loading ? "Connecting…" : "Connect Phantom"}
    </button>
  );
}