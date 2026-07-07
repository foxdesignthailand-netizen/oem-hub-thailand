import { MvpControlPanel } from "@/components/mvp-control-panel";
import { SiteHeader } from "@/components/site-header";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-muted">
      <SiteHeader />
      <main className="container-page py-8">
        <MvpControlPanel mode="auth" />
      </main>
    </div>
  );
}
