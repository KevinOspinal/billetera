import Tabs from "@/components/ui/Tabs";

const TABS = [
  { id: "month", label: "Este mes" },
  { id: "week", label: "Esta semana" },
  { id: "today", label: "Hoy" },
];

export default function ExpensesTabs({ activeTab = "month", onChange }) {
  return <Tabs tabs={TABS} activeTab={activeTab} onChange={onChange} />;
}
