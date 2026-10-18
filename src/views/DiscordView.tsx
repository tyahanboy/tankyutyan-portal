import { apiFetch } from '../lib/api'
import { Hash, MessageSquare, Server, Users, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import StatusBadge from '../components/StatusBadge'

type BotStatus = {
  connected: boolean
  stale: boolean
  latency_ms: number | null
  bot_user: string | null
  guild_count: number | null
  updated_at: string | null
}

type StatusResponse = {
  ok: boolean
  bot: BotStatus | null
  message?: string
}

export default function DiscordView() {
  const [data, setData] = useState<StatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadStatus() {
    try {
      const response = await apiFetch('/api/bot/status', { cache: 'no-store' })
      const result = await response.json() as StatusResponse
      if (!response.ok || !result.bot) {
        throw new Error(result.message || 'Bot情報を取得できませんでした')
      }
      setData(result)
      setError('')
    } catch {
      setError('APIに接続できません。APIサーバーを確認してください。')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadStatus()
    const timer = window.setInterval(() => void loadStatus(), 30000)
    return () => window.clearInterval(timer)
  }, [])

  const bot = data?.bot
  const online = bot?.connected === true && bot.stale === false
  const updatedAt = bot?.updated_at
    ? new Date(bot.updated_at).toLocaleString('ja-JP')
    : '記録なし'

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <article className="panel p-5">
          <Server size={22} className="text-blue-300" />
          <p className="mt-4 text-sm text-slate-400">登録サーバー数</p>
          <p className="mt-2 text-3xl font-bold text-white">{bot?.guild_count ?? "未取得"}</p>
          <p className="mt-2 text-xs text-slate-500">Botの接続記録から取得</p>
        </article>

        <article className="panel p-5">
          <Users size={22} className="text-violet-300" />
          <p className="mt-4 text-sm text-slate-400">合計メンバー数</p>
          <p className="mt-2 text-3xl font-bold text-white">未取得</p>
          <p className="mt-2 text-xs text-slate-500">メンバー情報API未接続</p>
        </article>

        <article className="panel p-5">
          <MessageSquare size={22} className="text-emerald-300" />
          <p className="mt-4 text-sm text-slate-400">Bot接続状態</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {loading ? '確認中' : online ? '接続中' : 'オフライン'}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {bot?.latency_ms != null ? `最終記録 ${Math.round(bot.latency_ms)} ms` : '遅延データなし'}
          </p>
        </article>
      </section>

      <section className="panel overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-5">
          <div>
            <h2 className="font-semibold text-white">Discord接続情報</h2>
            <p className="mt-1 text-sm text-slate-400">
              APIから取得したBotの接続記録
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadStatus()}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
          >
            <RefreshCw size={16} />
            更新
          </button>
        </div>

        <div className="space-y-4 p-5">
          {error ? (
            <p className="text-sm text-rose-300">{error}</p>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-400">Botアカウント</p>
                  <p className="mt-1 font-medium text-white">
                    {bot?.bot_user || '未取得'}
                  </p>
                </div>
                <StatusBadge
                  status={online ? 'online' : 'offline'}
                  label={loading ? '確認中' : online ? 'オンライン' : 'オフライン／記録が古い'}
                />
              </div>

              <div>
                <p className="text-sm text-slate-400">最終更新時刻</p>
                <p className="mt-1 text-sm text-slate-200">{updatedAt}</p>
              </div>

              <p className="text-sm leading-6 text-slate-400">
                {online
                  ? 'Botの接続記録は新しく、接続中と判断されています。'
                  : 'まだ眠いよぉ…もう少し寝かせて…？ 現在の接続状態は確認できていません。'}
              </p>
            </>
          )}
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="border-b border-white/10 p-5">
          <h2 className="font-semibold text-white">Discordサーバー一覧</h2>
          <p className="mt-1 text-sm text-slate-400">
            サーバー一覧APIの接続後に実データを表示します
          </p>
        </div>
        <div className="flex flex-col items-center px-5 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800">
            <Hash size={26} className="text-slate-400" />
          </div>
          <p className="mt-4 font-medium text-slate-200">
            サーバー情報はまだ取得できません
          </p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            デモデータは表示していません。実際のサーバー名やメンバー数を表示するには、Botから安全に情報を取得する仕組みが必要です。
          </p>
        </div>
      </section>

      <p className="text-xs leading-5 text-slate-500">
        ※ この画面は接続情報の表示専用です。Discordサーバーの設定やメンバー情報は変更しません。
      </p>
    </div>
  )
}
