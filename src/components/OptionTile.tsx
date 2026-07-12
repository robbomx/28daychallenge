import type { ReactNode } from "react";

interface Props {
  label: string;
  icon?: ReactNode;
  selected: boolean;
  onClick: () => void;
}

export default function OptionTile({ label, icon, selected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-4 w-full text-left px-4 py-4 border rounded-sm transition-colors ${
        selected
          ? "bg-op-orange/10 border-op-orange text-op-off-white"
          : "bg-op-panel border-op-line text-op-off-white-dim hover:border-op-off-white-dim"
      }`}
    >
      {icon && (
        <span className={`flex-shrink-0 ${selected ? "text-op-orange" : "text-op-off-white-dim"}`}>{icon}</span>
      )}
      <span className="text-sm">{label}</span>
      <span
        className={`ml-auto w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center ${
          selected ? "border-op-orange" : "border-op-line"
        }`}
      >
        {selected && <span className="w-2 h-2 rounded-full bg-op-orange" />}
      </span>
    </button>
  );
}
