'use client';

import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  MapPin,
  Grid3X3,
  UtensilsCrossed,
  MessageSquare,
  Star,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Stats {
  totalBranches: number;
  totalCategories: number;
  totalItems: number;
  totalFeedback: number;
  averageRating: string;
}

const statCards = [
  {
    key: 'totalBranches' as const,
    label: 'Total Branches',
    icon: MapPin,
    accentColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    key: 'totalCategories' as const,
    label: 'Total Categories',
    icon: Grid3X3,
    accentColor: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    key: 'totalItems' as const,
    label: 'Total Menu Items',
    icon: UtensilsCrossed,
    accentColor: 'text-rose-600',
    bgColor: 'bg-rose-50',
  },
  {
    key: 'totalFeedback' as const,
    label: 'Total Feedback',
    icon: MessageSquare,
    accentColor: 'text-violet-600',
    bgColor: 'bg-violet-50',
  },
  {
    key: 'averageRating' as const,
    label: 'Average Rating',
    icon: Star,
    accentColor: 'text-amber-500',
    bgColor: 'bg-amber-50',
    isText: true,
  },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary">
            <LayoutDashboard className="size-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome to Qidr Admin Panel
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your restaurant branches, menus, and feedback
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    <Skeleton className="h-4 w-24" />
                  </CardTitle>
                  <Skeleton className="size-8 rounded-lg" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))
          : stats &&
            statCards.map((card) => (
              <Card key={card.key}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.label}
                  </CardTitle>
                  <div
                    className={`flex size-8 items-center justify-center rounded-lg ${card.bgColor}`}
                  >
                    <card.icon className={`size-4 ${card.accentColor}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {card.isText
                      ? String(stats[card.key])
                      : stats[card.key]}
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
}
