import AccountsHeader from "@/components/accounts/AccountsHeader";
import AccountsGrid from "@/components/accounts/AccountsGrid";

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <AccountsHeader />
      <AccountsGrid />
    </div>
  );
}
