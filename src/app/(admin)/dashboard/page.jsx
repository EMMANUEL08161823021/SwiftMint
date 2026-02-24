"use client";

import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import DepositModal from "./dialogs/DepositModal";
import Header from "./components/Header";

export default function DashboardPage() {
  // central state
  const [depositOpen, setDepositOpen] = useState(false);
  const [chain, setChain] = useState("Solana"); // display string
  const [depositAddress, setDepositAddress] = useState("8oXsvS3Ggyrb2z37bNyordBkxXbEdGWLeBEeo2VwwJEwf");
  const [balance, setBalance] = useState(0);

  return (
    <div>
      {/* Header receives callback to open the modal and current chain */}
      <Header chain={chain} onOpenDeposit={() => setDepositOpen(true)} />

      {/* Page content */}
      <main>
        <Dashboard />
      </main>

      {/* Single controlled modal instance */}
      <DepositModal
        isOpen={depositOpen}
        onClose={() => setDepositOpen(false)}
        chain={chain}
        address={depositAddress}
        balance={balance}
      />
    </div>
  );
}