'use client';

import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = !pathname.startsWith('/admin/login');

  return (
    <div className="min-h-screen bg-background">
      {showSidebar && <AdminSidebar />}
      <main className={showSidebar ? 'md:pl-64' : ''}>
        <div className="mx-auto max-w-7xl p-4 pt-16 md:p-8 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
