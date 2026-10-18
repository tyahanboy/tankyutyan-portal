import {
  Activity,
  Bot,
  ChartNoAxesCombined,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react'

export type PageId =
  | 'dashboard'
  | 'bot'
  | 'discord'
  | 'logs'
  | 'search'
  | 'settings'

interface SidebarProps {
  activePage: PageId
  onNavigate: (page: PageId) => void
  open?: boolean
  onClose?: () => void
}

const navigation = [
  {
    section: 'メイン',
    items: [
      { id: 'dashboard', label: 'ダッシュボード', icon: LayoutDashboard },
      { id: 'bot', label: 'Bot状態', icon: Bot },
    ],
  },
  {
    section: 'モニタリング',
    items: [
      { id: 'discord', label: 'Discordサーバー', icon: MessageSquare },
      { id: 'logs', label: 'AI利用ログ', icon: Activity },
      { id: 'search', label: '検索履歴', icon: Search },
    ],
  },
  {
    section: 'システム',
    items: [
      { id: 'settings', label: '管理設定', icon: Settings },
    ],
  },
] as const

export default function Sidebar({
  activePage,
  onNavigate,
  open = false,
  onClose,
}: SidebarProps) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="メニューを閉じる"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-slate-950/95 transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/20">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white">たんきゅーちゃん</p>
              <p className="mt-0.5 text-xs text-slate-400">管理ダッシュボード</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div className="border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2 rounded-xl border border-amber-400/15 bg-amber-400/5 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-xs font-medium text-amber-200">
              API未接続・開発モード
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {navigation.map((group) => (
            <div key={group.section}>
              <p className="mb-2 px-3 text-[11px] font-semibold tracking-widest text-slate-500">
                {group.section}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const selected = activePage === item.id

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onNavigate(item.id)
                        onClose?.()
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                        selected
                          ? 'border border-blue-400/20 bg-blue-500/15 font-semibold text-blue-300'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                      {selected && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/15">
              <ChartNoAxesCombined size={18} className="text-violet-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">探究部AI</p>
              <p className="mt-0.5 text-xs text-slate-500">ローカル管理画面</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
