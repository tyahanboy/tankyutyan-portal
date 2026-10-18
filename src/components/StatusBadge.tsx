import type { ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Clock3, XCircle } from 'lucide-react'

type BadgeStatus = 'online' | 'offline' | 'starting' | 'error' | 'success'

interface StatusBadgeProps {
  status: BadgeStatus
  label?: string
  children?: ReactNode
}

const statusStyles: Record<BadgeStatus, string> = {
  online: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
  offline: 'border-slate-400/20 bg-slate-400/10 text-slate-300',
  starting: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
  error: 'border-rose-400/20 bg-rose-400/10 text-rose-300',
  success: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
}

const statusLabels: Record<BadgeStatus, string> = {
  online: 'オンライン',
  offline: 'オフライン',
  starting: '起動中',
  error: 'エラー',
  success: '成功',
}

export default function StatusBadge({
  status,
  label,
  children,
}: StatusBadgeProps) {
  const Icon =
    status === 'online' || status === 'success'
      ? CheckCircle2
      : status === 'starting'
        ? Clock3
        : status === 'error'
          ? AlertCircle
          : XCircle

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      <Icon size={13} />
      {label ?? children ?? statusLabels[status]}
    </span>
  )
}
