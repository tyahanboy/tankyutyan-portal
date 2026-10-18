import { apiFetch } from '../lib/api'
import { useCallback, useEffect, useState } from 'react'
import {
  Activity,
  Bot,
  Clock3,
  MessageSquare,
  TrendingUp,
} from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { demoBotInfo } from '../data'

interface StatsApiResponse {
  ok: boolean
  stats: {
    total: number
    success: number
    failed: number
    success_rate: number
    today_success: number
  }
}

interface BotApiResponse {
  ok: boolean
  bot: {
    connected: boolean
    stale: boolean
    latency_ms: number | null
    bot_user: string | null
    updated_at: string | null
  } | null
  message?: string
}

const statCardStyles = [
  {
    label: '累計AI利用数',
    icon: MessageSquare,
    color: 'text-blue-300',
    background: 'bg-blue-400/10',
  },
  {
    label: '本日の成功利用数',
    icon: Activity,
    color: 'text-violet-300',
    background: 'bg-violet-400/10',
  },
  {
    label: '成功率',
    icon: TrendingUp,
    color: 'text-cyan-300',
    background: 'bg-cyan-400/10',
  },
  {
    label: '失敗数',
    icon: Bot,
    color: 'text-rose-300',
    background: 'bg-rose-400/10',
  },
]

function formatDate(value: string | null | undefined) {
  if (!value) return '未取得'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? '不明'
    : date.toLocaleString('ja-JP')
}

export default function DashboardView() {
  const [bot, setBot] = useState<BotApiResponse['bot']>(null)
  const [apiError, setApiError] = useState(false)
  const [stats, setStats] = useState<StatsApiResponse['stats'] | null>(null)
  const [statsError, setStatsError] = useState(false)

  const refreshStats = useCallback(async () => {
    try {
      const response = await apiFetch('/api/stats', { cache: 'no-store' })
      const result = await response.json() as StatsApiResponse

      if (!response.ok || !result.ok || !result.stats) {
        throw new Error(`Stats API error: ${response.status}`)
      }

      setStats(result.stats)
      setStatsError(false)
    } catch {
      setStatsError(true)
    }
  }, [])

  const refresh = useCallback(async () => {
    try {
      const response = await apiFetch('/api/bot/status', {
        cache: 'no-store',
      })
      const result = await response.json() as BotApiResponse

      if (!response.ok && response.status !== 503) {
        throw new Error(`API error: ${response.status}`)
      }

      setBot(result.bot)
      setApiError(false)
    } catch {
      setApiError(true)
    }
  }, [])

  useEffect(() => {
    void refresh()
    void refreshStats()

    const timer = window.setInterval(() => {
      void refresh()
      void refreshStats()
    }, 30_000)

    return () => window.clearInterval(timer)
  }, [refresh, refreshStats])

  const online = bot?.connected === true && bot.stale === false
  const badgeStatus = apiError && bot === null
    ? 'error'
    : online ? 'online' : 'offline'

  const botName = bot?.bot_user ?? demoBotInfo.name
  const latency = bot?.latency_ms
  const lastUpdated = formatDate(bot?.updated_at)

  const statValues: Array<string | number> = stats
    ? [
        stats.total.toLocaleString('ja-JP'),
        stats.today_success.toLocaleString('ja-JP'),
        `${stats.success_rate}%`,
        stats.failed.toLocaleString('ja-JP'),
      ]
    : ['—', '—', '—', '—']

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCardStyles.map((stat, index) => {
          const Icon = stat.icon

          return (
            <article key={stat.label} className="panel p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <p className="mt-3 text-3xl font-bold text-white">
                    {statValues[index]}
                  </p>
                </div>
                <div className={`rounded-xl p-3 ${stat.background}`}>
                  <Icon size={21} className={stat.color} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
                <TrendingUp size={14} />
                <span>{statsError ? '統計APIに接続できません' : stats ? 'CSV実データ' : '統計を取得中…'}</span>
              </div>
            </article>
          )
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article className="panel p-5 sm:p-6 xl:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-white">Botの状態</h2>
              <p className="mt-1 text-sm text-slate-400">APIから取得した接続状況</p>
            </div>
            <StatusBadge
              status={badgeStatus}
              label={apiError && bot === null
                ? 'APIエラー'
                : online ? 'オンライン' : 'オフライン'}
            />
          </div>

          <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15">
                <Bot size={30} className="text-blue-300" />
              </div>
              <div>
                <h3 className="break-all text-lg font-bold text-white">{botName}</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Discord 探究部サポートAI
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-slate-500">最終オンライン時の応答遅延</p>
                <p className="mt-1 font-semibold text-slate-200">
                  {latency == null ? '未計測' : `${latency.toFixed(1)} ms`}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">稼働時間</p>
                <p className="mt-1 font-semibold text-slate-200">
                  {online ? '稼働中（時間計測は未実装）' : '停止中／未確認'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">最終状態更新</p>
                <p className="mt-1 break-words font-semibold text-slate-200">
                  {lastUpdated}
                </p>
              </div>
            </div>
            {apiError && (
              <p role="status" className="mt-4 text-sm text-rose-300">
                APIに接続できません。APIサーバーを確認してください。
              </p>
            )}
          </div>
        </article>

        <article className="panel p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Clock3 size={18} className="text-blue-300" />
            <h2 className="font-semibold text-white">最近の活動</h2>
          </div>

          <div className="flex min-h-48 flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800">
              <Activity size={22} className="text-slate-400" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-300">まだ活動ログがないよ</p>
            <p className="mt-2 max-w-56 text-xs leading-5 text-slate-500">
              活動ログAPIはこれから接続するで。
            </p>
          </div>
        </article>
      </section>

      <section className="panel p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10">
            <Activity size={20} className="text-amber-300" />
          </div>
          <div>
            <h2 className="font-semibold text-white">開発モード</h2>
            <p className="mt-1 text-sm text-slate-400">
              Bot状態とAI利用統計はAPIの実データです。検索履歴・サーバー数・活動ログは接続準備中です。
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
