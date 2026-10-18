import { apiFetch } from '../lib/api'
import { useCallback, useEffect, useState } from 'react'
import {
  Activity,
  Bot,
  Clock3,
  Cpu,
  RefreshCw,
  Wifi,
} from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { demoBotInfo } from '../data'

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

export default function BotStatusView() {
  const [data, setData] = useState<BotApiResponse['bot']>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastChecked, setLastChecked] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const response = await apiFetch('/api/bot/status', {
        cache: 'no-store',
      })
      const result = await response.json() as BotApiResponse

      // 503はAPIが応答したうえで、状態ファイルが読めない場合もある
      if (!response.ok && response.status !== 503) {
        throw new Error(`APIエラー (${response.status})`)
      }

      setData(result.bot)
      setApiError(response.status === 503
        ? (result.message ?? 'Bot状態を取得できません')
        : null)
      setLastChecked(new Date().toISOString())
    } catch {
      setApiError('APIに接続できません。APIサーバーを確認してください。')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
    const timer = window.setInterval(() => {
      void refresh()
    }, 30_000)

    return () => window.clearInterval(timer)
  }, [refresh])

  const online = data?.connected === true && data.stale === false
  const status = apiError && data === null
    ? 'error'
    : online ? 'online' : 'offline'
  const statusLabel = status === 'error'
    ? 'API接続エラー'
    : online ? 'オンライン' : 'オフライン'

  const formatDate = (value: string | null | undefined) => {
    if (!value) return '未取得'
    const date = new Date(value)
    return Number.isNaN(date.getTime())
      ? '不明'
      : date.toLocaleString('ja-JP')
  }

  const metrics = [
    {
      label: 'Discord接続',
      value: online ? '接続中' : '未接続',
      description: data?.stale
        ? '状態データが古くなっています'
        : online ? 'Botの接続を確認済み' : 'Botはオフラインです',
      icon: Wifi,
    },
    {
      label: '応答遅延',
      value: data?.latency_ms == null ? '未計測' : `${data.latency_ms.toFixed(1)} ms`,
      description: 'Bot状態ファイルの計測値',
      icon: Activity,
    },
    {
      label: '最終状態更新',
      value: formatDate(data?.updated_at),
      description: 'Bot状態ファイルの更新日時',
      icon: Clock3,
    },
  ]

  return (
    <div className="space-y-6">
      <section className="panel p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/15">
              <Bot size={34} className="text-blue-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {data?.bot_user ?? demoBotInfo.name}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Discord Bot 接続ステータス
              </p>
              <div className="mt-3">
                <StatusBadge status={status} label={statusLabel} />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            {loading ? '更新中…' : '状態を更新'}
          </button>
        </div>
        {apiError && (
          <p role="status" className="mt-4 text-sm text-amber-300">
            {apiError}
          </p>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <article key={metric.label} className="panel p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">{metric.label}</p>
                <Icon size={20} className="text-blue-300" />
              </div>
              <p className="mt-4 break-words text-xl font-bold text-white">
                {metric.value}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {metric.description}
              </p>
            </article>
          )
        })}
      </section>

      <section className="panel p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-500/10 p-3">
            <Cpu size={22} className="text-violet-300" />
          </div>
          <div>
            <h2 className="font-semibold text-white">接続情報</h2>
            <p className="mt-1 text-sm text-slate-400">
              APIとBotの状態
            </p>
          </div>
        </div>

        <div className="mt-5 divide-y divide-white/5">
          <div className="flex items-center justify-between gap-4 py-4">
            <span className="text-sm text-slate-400">Bot表示名</span>
            <span className="break-all text-right text-sm font-medium text-slate-200">
              {data?.bot_user ?? demoBotInfo.name}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 py-4">
            <span className="text-sm text-slate-400">API接続</span>
            <span className={`text-sm ${apiError && data === null ? 'text-rose-300' : 'text-emerald-300'}`}>
              {apiError && data === null ? '接続エラー' : '応答あり'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 py-4">
            <span className="text-sm text-slate-400">自動更新</span>
            <span className="text-sm text-slate-200">30秒ごと</span>
          </div>
          <div className="flex items-center justify-between gap-4 py-4">
            <span className="text-sm text-slate-400">最終確認</span>
            <span className="text-right text-sm text-slate-200">
              {formatDate(lastChecked)}
            </span>
          </div>
        </div>
      </section>

      <p className="text-xs leading-5 text-slate-500">
        ※ Bot状態はAPIから取得しています。状態データが古い場合はオフラインとして表示します。
      </p>
    </div>
  )
}
