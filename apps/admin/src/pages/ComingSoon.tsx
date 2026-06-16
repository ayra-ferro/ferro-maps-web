import AppShell from '../components/AppShell'

type ComingSoonProps = {
  label: string
}

export default function ComingSoon({ label }: ComingSoonProps) {
  return (
    <AppShell title={label}>
      <div className="flex h-full items-center justify-center">
        <p className="text-text-secondary text-body">{label} — coming soon</p>
      </div>
    </AppShell>
  )
}
