interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <span className="text-lg font-semibold text-gray-900">Ferro Maps Admin</span>
      </header>
      <main className="flex-1 px-8 py-6">
        {children}
      </main>
    </div>
  )
}
