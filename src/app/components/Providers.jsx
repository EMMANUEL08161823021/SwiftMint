// src/components/Providers.jsx
"use client";

import React from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

// pick your RPC endpoint via env var
const SOLANA_RPC = process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.mainnet-beta.solana.com";

export default function Providers({ children }) {
     const wallets = [new PhantomWalletAdapter()];

     return (
          <ConnectionProvider endpoint={SOLANA_RPC}>
               <WalletProvider wallets={wallets} autoConnect={false}>
               <WalletModalProvider>{children}</WalletModalProvider>
               </WalletProvider>
          </ConnectionProvider>
     );
}