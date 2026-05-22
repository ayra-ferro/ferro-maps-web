import * as RadixTabs from '@radix-ui/react-tabs'

interface Tab {
  value: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

export function Tabs({ tabs, defaultValue, value, onValueChange, className = '' }: TabsProps) {
  const initial = defaultValue ?? tabs[0]?.value

  return (
    <RadixTabs.Root
      defaultValue={initial}
      value={value}
      onValueChange={onValueChange}
      className={className}
    >
      <RadixTabs.List className="flex gap-1 border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <RadixTabs.Trigger
            key={tab.value}
            value={tab.value}
            className="px-4 py-2 text-sm font-medium text-gray-500 border-b-2 border-transparent -mb-px transition-colors hover:text-ferro-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ferro-primary focus-visible:ring-offset-2 data-[state=active]:text-ferro-primary data-[state=active]:border-ferro-primary"
          >
            {tab.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>

      {tabs.map((tab) => (
        <RadixTabs.Content
          key={tab.value}
          value={tab.value}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ferro-primary focus-visible:ring-offset-2 rounded-button"
        >
          {tab.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  )
}
