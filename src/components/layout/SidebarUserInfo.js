import Avatar from "@/components/ui/Avatar";

export default function SidebarUserInfo({ name = "Invitado", role = "Finanzas" }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-transparent bg-slate-50/80 p-3 dark:bg-slate-800/80">
      <Avatar name={name} />
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{role}</p>
      </div>
    </div>
  );
}
