import { Activity, Eye, Filter, MessageSquare, Search } from 'lucide-react'
import { useState } from 'react'
import StatusBadge from '../components/StatusBadge'
import { demoAiLogs } from '../data'

export default function AiLogsView() {
  const [keyword, setKeyword] = useState('')
  const [filter, setFilter] = useState('all')

  const filteredLogs = demoAiLogs.filter((log) => {
    const matchesKeyword = [
      log.question,
      log.answer,
      log.userName,
      log.serverName,
    ].some((value) => value.toLowerCase().includes(keyword.toLowerCase()))

    const matchesFilter =
      filter === 'all' ||
      (filter === 'success' && log.status === 'success') ||
      (filter === 'error' && log.status === 'error')

    return matchesKeyword && matchesFilter
  })

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <article className="panel p-5">
          <MessageSquare size={22} className="text-blue-300" />
          <p className="mt-4 text-sm text-slate-400">記録された質問</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {demoAiLogs.length}
          </p>
        </article>

        <article className="panel p-5">
          <Activity size={22} className="text-emerald-300" />
          <p className="mt-4 text-sm text-slate-400">成功</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {demoAiLogs.filter((log) => log.status === 'success').length}
          </p>
        </article>

        <article className="panel p-5">
          <Search size={22} className="text-violet-300" />
          <p className="mt-4 text-sm text-slate-400">Web検索あり</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {demoAiLogs.filter((log) => log.searchedWeb).length}
          </p>
        </article>
      </section>

      <section className="panel overflow-hidden">
        <div className="border-b border-white/10 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-semibold text-white">AI利用ログ</h2>
              <p className="mt-1 text-sm text-slate-400">
                質問・回答・処理結果の記録
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="search"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="ログを検索..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 sm:w-52"
                />
              </div>

              <div className="relative">
                <Filter
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <select
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900 py-2 pl-9 pr-4 text-sm text-slate-200 sm:w-36"
                >
                  <option value="all">すべて</option>
                  <option value="success">成功のみ</option>
                  <option value="error">エラーのみ</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {filteredLogs.length > 0 ? (
          <div className="divide-y divide-white/5">
            {filteredLogs.map((log) => (
              <article key={log.id} className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-medium text-white">{log.question}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      {log.userName} ・ {log.serverName} ・ {log.createdAt}
                    </p>
                  </div>
                  <StatusBadge
                    status={log.status}
                    label={log.status === 'success' ? '成功' : 'エラー'}
                  />
                </div>

                <div className="mt-4 rounded-xl bg-white/[0.03] p-4">
                  <p className="mb-2 text-xs font-semibold text-slate-400">
                    AIの回答
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
                    {log.answer}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <Search size={13} />
                  {log.searchedWeb ? 'Web検索あり' : 'Web検索なし'}
                  <Eye size={13} className="ml-2" />
                  ログ詳細
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center px-5 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800">
              <MessageSquare size={26} className="text-slate-400" />
            </div>
            <p className="mt-4 font-medium text-slate-200">
              {keyword || filter !== 'all'
                ? '条件に一致するログがないで'
                : 'AI利用ログはまだありません'}
            </p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Bot APIとの接続後にログを取得できるようにする予定やで。
              現時点では実際の会話内容は保存・表示していません。
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
