import TransactionHistory from "@/components/TransactionHistory";

export default function HistoryPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="page-kicker">Ledger</p>
        <h1 className="page-title">Transaction history</h1>
      </div>
      <TransactionHistory />
    </div>
  );
}
