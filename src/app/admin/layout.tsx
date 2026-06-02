'use client';
import { usePathname } from 'next/navigation';

const hideSidebarPaths = ['/admin/login'];
export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const showSidebar = !hideSidebarPaths.some(p => pathname.startsWith(p));
  return (
    <div className="min-h-screen bg-background">
      {showSidebar && <AdminSidebar />}
      <main className={showSidebar ? 'md:pl-64' : ''}>
        {children}
      </main>
    </div>
  );
}
