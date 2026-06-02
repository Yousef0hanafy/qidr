import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      {/* Main content offset for sidebar on desktop */}
      <main className="md:pl-64">
        <div className="mx-auto max-w-7xl p-4 pt-16 md:p-8 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
