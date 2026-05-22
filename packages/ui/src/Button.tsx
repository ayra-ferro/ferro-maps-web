import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  children: React.ReactNode
}

const variants = {
  primary: 'bg-ferro-primary text-white hover:bg-ferro-deep',
  secondary: 'bg-white text-ferro-primary border border-ferro-primary hover:bg-ferro-tint',
  ghost: 'bg-transparent text-ferro-primary hover:bg-ferro-tint',
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center px-4 py-2 rounded-button text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ferro-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
