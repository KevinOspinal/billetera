import { redirect } from "next/navigation";
import AccountsClient from "@/components/accounts/AccountsClient";
import { getSessionUser } from "@/lib/session";
import { getAccountsOverview } from "@/lib/accounts-data";

export default async function AccountsPage() {
  const user = await getSessionUser();
  const userId = Number(user?.id);

  if (!userId) {
    redirect("/login");
  }
  
  const overview = await getAccountsOverview(userId);

  return (
    <div className="space-y-6">
      <AccountsClient userId={userId} {...overview} />
    </div>
  );
}
 
