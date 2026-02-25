"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";

/**
 * WalletConnect button that:
 *  - Opens the adapter modal if no wallet is selected
 *  - Connects then asks the wallet to sign a server nonce (nonce is tied to pubkey)
 *  - Routes to /dashboard after successful sign-in or when already connected
 */
export default function WalletConnect() {
  const router = useRouter();
  const { wallet, publicKey, connected, connect, disconnect, signMessage } = useWallet();
  const { setVisible } = useWalletModal();
  const [loading, setLoading] = useState(false);

  // If already connected (e.g. autoConnect) send user straight to dashboard
  useEffect(() => {
    if (connected && publicKey) {
      const t = setTimeout(() => router.push("/dashboard"), 150);
      return () => clearTimeout(t);
    }
  }, [connected, publicKey, router]);

  // Helper: wait for publicKey to appear after connect()
  async function waitForPublicKey(timeoutMs = 4000) {
    // fast path
    if (publicKey) return publicKey;

    // if provider injected (Phantom), it may expose window.solana.publicKey
    if (typeof window !== "undefined" && window.solana?.publicKey) return window.solana.publicKey;

    return new Promise((resolve, reject) => {
      const start = Date.now();
      const interval = 50;

      const timer = setInterval(() => {
        // prefer adapter state first
        if (publicKey) {
          clearInterval(timer);
          return resolve(publicKey);
        }
        // fallback to injected provider
        if (typeof window !== "undefined" && window.solana?.publicKey) {
          clearInterval(timer);
          return resolve(window.solana.publicKey);
        }
        if (Date.now() - start > timeoutMs) {
          clearInterval(timer);
          return reject(new Error("Wallet connection timed out"));
        }
      }, interval);
    });
  }

  async function handleConnectAndSign() {
    setLoading(true);

    try {
      // If no wallet adapter at all (Phantom not installed / blocked)
      if (!wallet) {
        setVisible(true);
        alert(
          "No wallet detected. Please select Phantom from the wallet modal or install Phantom and refresh the page."
        );
        setLoading(false);
        return;
      }

      // Ensure connected; prompt user to select/connect if not
      if (!connected) {
        try {
          await connect();
        } catch (err) {
          // open wallet modal if adapter complains about selection/readiness
          if (err?.name === "WalletNotSelectedError" || err?.name === "WalletNotReadyError") {
            setVisible(true);
            setLoading(false);
            return;
          }
          throw err;
        }
      }

      // Wait for publicKey to hydrate (wallet-adapter updates state asynchronously)
      let pkObj;
      try {
        pkObj = await waitForPublicKey();
      } catch (err) {
        throw new Error("Unable to determine wallet public key after connect.");
      }

      if (!pkObj) throw new Error("Unable to determine wallet public key after connect.");

      // convert to string
      const pubkeyStr = typeof pkObj.toBase58 === "function" ? pkObj.toBase58() : String(pkObj);

      // Request a nonce tied to this pubkey
      const nonceRes = await fetch(`/api/auth/nonce?pubkey=${encodeURIComponent(pubkeyStr)}`);
      if (!nonceRes.ok) {
        const text = await nonceRes.text();
        throw new Error(text || "Failed to fetch nonce from server.");
      }
      const { nonce } = await nonceRes.json();

      const encoder = new TextEncoder();
      const messageBytes = encoder.encode(`Sign in to EdgeMetrics\nnonce: ${nonce}`);

      // DEBUG: log wallet + capabilities so you can see what's available in console
      console.log("adapter wallet:", wallet);
      console.log("adapter signMessage function:", !!signMessage);
      console.log("window.solana present:", !!(typeof window !== "undefined" && window.solana));
      console.log(
        "window.solana.signMessage:",
        !!(typeof window !== "undefined" && window.solana && window.solana.signMessage)
      );

      // Primary: use adapter signMessage() if present
      let signed;
      if (signMessage) {
        signed = await signMessage(messageBytes); // returns Uint8Array from adapter
      } else if (typeof window !== "undefined" && window.solana && window.solana.signMessage) {
        // Fallback: raw Phantom provider signMessage() (provider-level)
        const res = await window.solana.signMessage(messageBytes, "utf8");

        if (res?.signature instanceof Uint8Array) {
          signed = res.signature;
        } else if (typeof res?.signature === "string") {
          // assume base64
          try {
            signed = Uint8Array.from(atob(res.signature), (c) => c.charCodeAt(0));
          } catch (e) {
            throw new Error("Received signature in unknown format from wallet provider.");
          }
        } else if (res instanceof Uint8Array) {
          signed = res;
        } else {
          throw new Error("Unexpected signMessage response format from provider.");
        }
      } else {
        throw new Error(
          "This wallet doesn't support message signing. Please update Phantom/your wallet or use a desktop wallet that supports message signing."
        );
      }

      // signed is now a Uint8Array
      const body = {
        pubkey: pubkeyStr,
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

      // success -> route to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Wallet connect / sign error:", err);
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
        <div className="text-sm">
          Connected: {pk.slice(0, 6)}…{pk.slice(-4)}
        </div>
        <button
          onClick={() => {
            disconnect();
          }}
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