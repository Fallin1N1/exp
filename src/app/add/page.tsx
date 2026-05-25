import TransactionForm from "@/components/TransactionForm";

export default function AddTransactionPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <p className="page-kicker">New entry</p>
        <h1 className="page-title">Add transaction</h1>
      </div>
      <TransactionForm />
    </div>
  );
}
