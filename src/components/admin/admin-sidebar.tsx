'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  MapPin,
  Grid3X3,
  UtensilsCrossed,
  Megaphone,
  MessageSquare,
  LogOut,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/branches', label: 'Branches', icon: MapPin },
  { href: '/admin/categories', label: 'Categories', icon: Grid3X3 },
  { href: '/admin/items', label: 'Items', icon: UtensilsCrossed },
  { href: '/admin/promotions', label: 'Promotions', icon: Megaphone },
  { href: '/admin/feedback', label: 'Feedback', icon: MessageSquare },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth', {
        method: 'DELETE',
      });
      if (res.ok) {
        router.push('/admin/login');
      } else {
        toast.error('Failed to logout');
      }
    } catch {
      toast.error('An error occurred');
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Branding */}
      <div className="border-b px-4 py-6">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-2xl font-bold tracking-tight text-primary">
            قدر
          </span>
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Qidr Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="size-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t px-2 py-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="size-4 shrink-0" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileSidebar />;
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-card md:block">
      <SidebarContent />
    </aside>
  );
}

function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed inset-y-0 left-0 z-40 md:hidden">
      {/* Trigger button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" />
        <span className="sr-only">Open menu</span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <SidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
