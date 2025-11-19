"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function ConfirmDeleteModal({ open, account, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <Modal open={open} title="Eliminar cuenta">
      <p>
        ¿Seguro que deseas eliminar <span className="font-semibold">{account?.name}</span>? Esta acción no se puede deshacer.
      </p>
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="secondary"
          className="bg-red-600 hover:bg-red-500 dark:bg-red-500 dark:text-slate-900 dark:hover:bg-red-400"
          onClick={onConfirm}
        >
          Eliminar
        </Button>
      </div>
    </Modal>
  );
}
