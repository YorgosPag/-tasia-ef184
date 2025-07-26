
import SimpleSidebar from '@/components/SimpleSidebar';
import SimpleHeader from '@/components/SimpleHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SimpleSidebar />
      <div className="flex-1 flex flex-col">
        <SimpleHeader />
        <main className="p-4 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
