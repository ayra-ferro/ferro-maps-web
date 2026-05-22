interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-card border border-gray-200 shadow-md p-6 ${className}`}>
      {children}
    </div>
  )
}
