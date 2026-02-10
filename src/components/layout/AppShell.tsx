import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function AppShell({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-brand-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-3">
          <img src="/logo.svg" alt="Atlético Cabeceirense" className="h-12 w-auto" />
          <div>
            <h1 className="text-lg font-bold text-gray-800">Scouting Atlético Cabeceirense</h1>
            <p className="text-xs text-gray-500">Relatório de Observação</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {children}
      </main>
    </div>
  );
}
