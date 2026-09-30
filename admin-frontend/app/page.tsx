export default function AdminHome() {
  return (
    <main className="flex flex-1 flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
              Food24KH Admin
            </p>
            <p className="text-xs text-muted">Marketplace operations console</p>
          </div>
          <p className="text-sm text-muted">Phase 1 · Scaffold ready</p>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-6 px-4 py-16 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-foreground">
          Admin foundation is ready.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-muted">
          This separate Next.js app will host restaurant approvals, orders,
          promotions, reports, and audit logs. Authentication and dashboard
          modules arrive in later phases.
        </p>
        <div className="rounded-[var(--radius)] border border-border bg-card p-5 text-sm text-muted">
          API target:{" "}
          <code className="rounded bg-background px-1.5 py-0.5 text-foreground">
            {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1"}
          </code>
        </div>
      </section>
    </main>
  );
}
