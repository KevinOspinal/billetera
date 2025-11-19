import AccountCard from "./AccountCard";

const ACCOUNTS = [
  { id: 1, name: "Cuenta principal", balance: "$8,400.00", accountNumber: "**** 2212" },
  { id: 2, name: "Tarjeta crédito", balance: "$-1,200.15", accountNumber: "**** 5521" },
  { id: 3, name: "Efectivo", balance: "$950.00", accountNumber: "Caja" },
];

export default function AccountsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {ACCOUNTS.map((account) => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  );
}
