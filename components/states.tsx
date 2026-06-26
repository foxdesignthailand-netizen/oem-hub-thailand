import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export function LoadingSkeleton() {
  return (
    <main className="container-page py-10">
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            className="h-36 animate-pulse rounded-xl border border-border bg-white"
            key={index}
          />
        ))}
      </div>
    </main>
  );
}

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="p-8 text-center">
      <Inbox className="mx-auto h-10 w-10 text-primary" />
      <h2 className="mt-4 text-xl font-bold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </Card>
  );
}

export function Alert({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-primary-soft bg-primary-light p-4 text-sm text-primary-deep">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-primary-deep/80">{description}</p>
      </div>
    </div>
  );
}

export function ToastPreview() {
  return (
    <div className="fixed bottom-5 right-5 z-50 hidden rounded-xl border border-primary-soft bg-white px-4 py-3 text-sm font-semibold text-primary-deep shadow-soft lg:flex">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      บันทึกร่างอัตโนมัติ
    </div>
  );
}
