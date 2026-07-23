import type { ComponentType } from 'react';

interface StatTileProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

// Плитка сводки в «Обзоре» профиля: иконка + подпись + значение.
export function StatTile({ icon: Icon, label, value }: StatTileProps) {
  return (
    <div className="border-border bg-card rounded-2xl border p-4">
      <div className="text-muted-foreground mb-1 flex items-center gap-1.5 text-sm">
        <Icon className="size-4 shrink-0" />
        {label}
      </div>
      <p className="text-lg leading-tight font-bold tracking-tight">{value}</p>
    </div>
  );
}
