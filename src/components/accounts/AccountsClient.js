"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import AccountsHeader from "./AccountsHeader";
import AccountsGrid from "./AccountsGrid";
import AccountFormModal from "./AccountFormModal";
import TransferModal from "./TransferModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

function normalizeAccount(account) {
  return {
    ...account,
    initialBalance: Number(account.initialBalance ?? 0),
    currentBalance: Number(account.currentBalance ?? 0),
  };
}

const emptySummary = { monthlyIncome: 0, monthlyExpenses: 0, net: 0, categories: [] };

export default function AccountsClient({ userId, accounts: initialAccounts = [], principalAccount = null, principalSummary = emptySummary }) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [deletingAccount, setDeletingAccount] = useState(null);
  const [transferAccount, setTransferAccount] = useState(null);
  const [, startTransition] = useTransition();

  const accounts = useMemo(() => initialAccounts.map(normalizeAccount), [initialAccounts]);
  const principal = useMemo(() => (principalAccount ? normalizeAccount(principalAccount) : null), [principalAccount]);
  const summary = principalSummary ?? emptySummary;
  const handleCreateAccount = async (payload) => {
    const response = await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, userId }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.error ?? "No se pudo crear la cuenta");
    }

    startTransition(() => router.refresh());
  };

  const handleUpdateAccount = async (accountId, payload) => {
    const response = await fetch(`/api/accounts/${accountId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.error ?? "No se pudo actualizar la cuenta");
    }

    startTransition(() => router.refresh());
  };

  const handleDeleteAccount = async (account) => {
    const response = await fetch(`/api/accounts/${account.id}`, { method: "DELETE" });
    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result?.error ?? "No se pudo eliminar la cuenta");
    }

    startTransition(() => router.refresh());
  };

  const handleMarkAsPrimary = async (account) => {
    if (principal?.id === account.id) {
      return;
    }

    await handleUpdateAccount(account.id, { status: "primary" });
    if (principal) {
      await handleUpdateAccount(principal.id, { status: "active" });
    }
  };

  const handleTransfer = async ({ fromAccountId, toAccountId, amount, description }) => {
    const response = await fetch("/api/accounts/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, fromAccountId, toAccountId, amount, description }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.error ?? "No se pudo completar la transferencia");
    }

    startTransition(() => router.refresh());
  };

  const principalId = principal?.id ?? null;

  const handleViewAccount = (account) => {
    router.push(`/transactions?account=${account.id}`);
  };

  return (
    <>
      <AccountsHeader principal={principal} summary={summary} onAddAccount={() => setIsCreating(true)} />
      <AccountsGrid
        accounts={accounts}
        principalId={principalId}
        onEdit={(account) => setEditingAccount(account)}
        onDelete={(account) => setDeletingAccount(account)}
        onTransfer={(account) => setTransferAccount(account)}
        onView={handleViewAccount}
        onMakePrimary={handleMarkAsPrimary}
      />

      <AccountFormModal
        key={isCreating ? "create-open" : "create-closed"}
        open={isCreating}
        mode="create"
        onClose={() => setIsCreating(false)}
        onSubmit={async (payload) => {
          await handleCreateAccount(payload);
          setIsCreating(false);
        }}
      />

      <AccountFormModal
        key={editingAccount ? `edit-${editingAccount.id}` : "edit-closed"}
        open={Boolean(editingAccount)}
        mode="edit"
        account={editingAccount}
        onClose={() => setEditingAccount(null)}
        onSubmit={async (payload) => {
          await handleUpdateAccount(editingAccount.id, payload);
          setEditingAccount(null);
        }}
      />

      <TransferModal
        key={transferAccount ? `transfer-${transferAccount.id}` : "transfer-closed"}
        open={Boolean(transferAccount)}
        accounts={accounts}
        defaultFromId={principalId}
        defaultToId={transferAccount?.id}
        onClose={() => setTransferAccount(null)}
        onSubmit={async (payload) => {
          await handleTransfer(payload);
          setTransferAccount(null);
        }}
      />

      <ConfirmDeleteModal
        open={Boolean(deletingAccount)}
        account={deletingAccount}
        onClose={() => setDeletingAccount(null)}
        onConfirm={async () => {
          await handleDeleteAccount(deletingAccount);
          setDeletingAccount(null);
        }}
      />
    </>
  );
}
