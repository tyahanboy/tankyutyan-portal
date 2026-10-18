import { useState } from 'react'
import { Clock3, ExternalLink, Search, SlidersHorizontal } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { demoSearchHistory } from '../data'

export default function SearchHistoryView() {
  const [keyword, setKeyword] = useState('')
  const [filter, setFilter] = useState('all')

  const filteredHistory = demoSearchHistory.filter((item) => {
    const matchesKeyword = [item.query, item.source]
      .some((value) => value.toLowerCase().includes(keyword.toLowerCase()))

    const matchesFilter =
      filter === 'all' ||
      (filter === 'success' && item.status === 'success') ||
      (filter === 'error' && item.status === 'error')

    return matchesKeyword && matchesFilter
  })

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <article className="panel p-5">
          <Search size={22} className="text-blue-300" />
          <p className="mt-4 text-sm text-slate-400">検索回数</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {demoSearchHistory.length}
          </p>
        </article>

        <article className="panel p-5">
          <Clock3 size={22} className="text-emerald-300" />
          <p className="mt-4 text-sm text-slate-400">検索成功</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {demoSearchHistory.filter((item) => item.status === 'success').length}
          </p>
        </article>

        <article className="panel p-5">
          <SlidersHorizontal size={22} className="text-violet-300" />
          <p className="mt-4 text-sm text-slate-400">取得した検索結果</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {demoSearchHistory.reduce((total, item) => total + item.resultCount, 0)}
          </p>
        </article>
      </section>

      <section className="panel overflow-hidden">
        <div className="border-b border-white/10 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-semibold text-white">Web検索履歴</h2>
              <p className="mt-1 text-sm text-slate-400">
                検索語句・検索元・取得件数を確認
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
                  placeholder="検索履歴を探す..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 sm:w-56"
                />
              </div>

              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                aria-label="検索結果で絞り込む"
                className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-200"
              >
                <option value="all">すべて</option>
                <option value="success">成功のみ</option>
                <option value="error">エラーのみ</option>
              </select>
            </div>
          </div>
        </div>

        {filteredHistory.length > 0 ? (
          <div className="divide-y divide-white/5">
            {filteredHistory.map((item) => (
              <article key={item.id} className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-blue-500/10 p-2.5">
                      <Search size={19} className="text-blue-300" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.query}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        検索元：{item.source}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        {item.createdAt}
                      </p>
                    </div>
                  </div>

                  <StatusBadge
                    status={item.status}
                    label={item.status === 'success' ? '成功' : 'エラー'}
                  />
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/[0.03] px-4 py-3">
                  <span className="text-sm text-slate-400">
                    取得件数：
                    <span className="ml-1 font-semibold text-slate-200">
                      {item.resultCount} 件
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                    <ExternalLink size={13} />
                    検索詳細は未実装
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center px-5 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800">
              <Search size={26} className="text-slate-400" />
            </div>
            <p className="mt-4 font-medium text-slate-200">
              {keyword || filter !== 'all'
                ? '条件に一致する履歴がないで'
                : '検索履歴はまだありません'}
            </p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              現在はデモモードです。検索履歴の取得にはBot APIとの連携が必要やで。
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
