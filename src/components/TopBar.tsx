import { Bell, Search, Menu } from 'lucide-react'

interface TopBarProps {
  title: string
  description: string
  onMenuClick?: () => void
}

export default function TopBar({
  title,
  description,
  onMenuClick,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 lg:hidden"
            aria-label="メニューを開く"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-white sm:text-2xl">
              {title}
            </h1>
            <p className="mt-1 truncate text-xs text-slate-400 sm:text-sm">
              {description}
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <div className="relative hidden md:block">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="search"
              placeholder="管理画面を検索..."
              className="w-52 rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-400/50 focus:outline-none"
            />
          </div>

          <button
            type="button"
            aria-label="通知"
            title="通知（未接続）"
            className="relative rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition hover:bg-white/10"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-400" />
          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/15 text-sm font-bold text-blue-300">
            管
          </div>
        </div>
      </div>
    </header>
  )
}
