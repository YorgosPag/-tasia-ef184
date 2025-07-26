
import { AppShell } from '@/tasia/components/layout/app-shell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
        {children}
    </AppShell>
  );
}
