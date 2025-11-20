import Avatar from "@/components/ui/Avatar";

export default function SidebarUserInfo({ name = "Invitado", role = "Finanzas" }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white shadow-lg dark:from-slate-800 dark:to-slate-900">
      <div className="absolute inset-0 opacity-10" aria-hidden>
        <div className="gradient-blur" />
      </div>
      <div className="relative flex items-center gap-4">
        <Avatar name={name} />
        <div>
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">{role}</p>
        </div>
      </div>
    </div>
  );
}
