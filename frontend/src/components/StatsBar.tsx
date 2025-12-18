import { FileText, MessageSquare, Zap, TrendingUp } from 'lucide-react';

interface StatsBarProps {
  documentsCount: number;
  conversationsCount: number;
  queriesThisWeek: number;
}

export function StatsBar({ documentsCount, conversationsCount, queriesThisWeek }: StatsBarProps) {
  const stats = [
    {
      icon: FileText,
      label: 'Documents',
      value: documentsCount,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: MessageSquare,
      label: 'Conversations',
      value: conversationsCount,
      color: 'text-chart-2',
      bg: 'bg-chart-2/10',
    },
    {
      icon: Zap,
      label: 'Queries',
      value: queriesThisWeek,
      color: 'text-chart-1',
      bg: 'bg-chart-1/10',
    },
  ];

  return (
    <div className="flex items-center gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <div>
            <p className="text-2xl font-semibold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
