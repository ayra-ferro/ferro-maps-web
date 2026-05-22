import * as RadixDropdown from '@radix-ui/react-dropdown-menu'

interface DropdownItem {
  label: string
  onSelect?: () => void
  disabled?: boolean
  destructive?: boolean
}

interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  align?: 'start' | 'center' | 'end'
}

export function Dropdown({ trigger, items, align = 'start' }: DropdownProps) {
  return (
    <RadixDropdown.Root>
      <RadixDropdown.Trigger asChild>{trigger}</RadixDropdown.Trigger>

      <RadixDropdown.Portal>
        <RadixDropdown.Content
          align={align}
          sideOffset={4}
          className="z-50 min-w-40 bg-white rounded-card border border-gray-200 shadow-md p-1 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
        >
          {items.map((item, i) => (
            <RadixDropdown.Item
              key={i}
              disabled={item.disabled}
              onSelect={item.onSelect}
              className={`flex items-center px-3 py-2 text-sm rounded-button cursor-pointer select-none outline-none transition-colors data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed ${
                item.destructive
                  ? 'text-red-600 data-[highlighted]:bg-red-50'
                  : 'text-gray-700 data-[highlighted]:bg-ferro-tint data-[highlighted]:text-ferro-primary'
              }`}
            >
              {item.label}
            </RadixDropdown.Item>
          ))}
        </RadixDropdown.Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  )
}
