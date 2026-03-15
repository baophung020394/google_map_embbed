import { cn } from '@/lib/utils'

export interface PropertyDescriptionProps {
  description: string
  className?: string
}

export function PropertyDescription({ description, className }: PropertyDescriptionProps) {
  return (
    <section className={cn('rounded-lg border border-slate-200 bg-white p-4 shadow-sm', className)}>
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Description</h2>
      <p className="whitespace-pre-line text-slate-600 leading-relaxed">{description}</p>
    </section>
  )
}
