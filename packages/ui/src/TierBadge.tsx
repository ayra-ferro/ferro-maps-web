import React from 'react'
import { Star, CircleDollarSign, Gem } from 'lucide-react'

type Tier = 'good' | 'great' | 'flawless'

interface TierBadgeProps {
  tier: Tier
}

const config: Record<Tier, { icon: React.ElementType; iconColor: string; labelColor: string; label: string }> = {
  good: {
    icon: Star,
    iconColor: '#9CA3AF',
    labelColor: '#6B7280',
    label: 'Good',
  },
  great: {
    icon: CircleDollarSign,
    iconColor: '#FFB72E',
    labelColor: '#FFB72E',
    label: 'Great',
  },
  flawless: {
    icon: Gem,
    iconColor: '#1E7BFF',
    labelColor: '#1E7BFF',
    label: 'Flawless',
  },
}

export function TierBadge({ tier }: TierBadgeProps) {
  const { icon: Icon, iconColor, labelColor, label } = config[tier]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#E8F1FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={22} color={iconColor} />
      </div>
      <span style={{ fontSize: '11px', fontWeight: 500, color: labelColor, letterSpacing: '0.02em' }}>
        {label}
      </span>
    </div>
  )
}
