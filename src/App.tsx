import { useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar, { type PageId } from './components/Sidebar'
import TopBar from './components/TopBar'
import DashboardView from './views/DashboardView'
import BotStatusView from './views/BotStatusView'
import DiscordView from './views/DiscordView'
import AiLogsView from './views/AiLogsView'
import SearchHistoryView from './views/SearchHistoryView'
import SettingsView from './views/SettingsView'

const pageInfo: Record<PageId, { title: string; description: string }> = {
  dashboard: {
    title: 'ダッシュボード',
    description: 'たんきゅーちゃんの稼働状況と利用状況を確認',
  },
  bot: {
    title: 'Bot状態',
    description: 'Botの接続状態や稼働情報を確認',
  },
  discord: {
    title: 'Discordサーバー',
    description: 'Botが参加しているサーバーの情報を確認',
  },
  logs: {
    title: 'AI利用ログ',
    description: 'AIの質問・回答・処理結果を確認',
  },
  search: {
    title: '検索履歴',
    description: 'Web検索の履歴や取得件数を確認',
  },
  settings: {
    title: '管理設定',
    description: '管理画面とAI応答の設定',
  },
}

function renderPage(page: PageId) {
  switch (page) {
    case 'dashboard':
      return <DashboardView />
    case 'bot':
      return <BotStatusView />
    case 'discord':
      return <DiscordView />
    case 'logs':
      return <AiLogsView />
    case 'search':
      return <SearchHistoryView />
    case 'settings':
      return <SettingsView />
  }
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)

  function navigateTo(page: PageId) {
    setActivePage(page)
    setMenuOpen(false)
  }

  const currentPage = pageInfo[activePage]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Sidebar
        activePage={activePage}
        onNavigate={navigateTo}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/10 bg-slate-950/90 px-4 py-3 backdrop-blur sm:px-6 lg:hidden">
          <button
            type="button"
            aria-label="メニューを開く"
            onClick={() => setMenuOpen(true)}
            className="rounded-xl border border-white/10 p-2 text-slate-300 hover:bg-white/5"
          >
            <Menu size={20} />
          </button>
          <div>
            <p className="font-semibold text-white">たんきゅーちゃん</p>
            <p className="text-xs text-slate-400">管理ダッシュボード</p>
          </div>
        </header>

        <div className="hidden lg:block">
          <TopBar
            title={currentPage.title}
            description={currentPage.description}
          />
        </div>

        <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="lg:hidden">
            <h1 className="text-2xl font-bold text-white">
              {currentPage.title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {currentPage.description}
            </p>
          </div>

          {renderPage(activePage)}
        </main>

        <footer className="px-6 pb-6 text-center text-xs text-slate-600">
          たんきゅーちゃん 管理ダッシュボード · 開発モード
        </footer>
      </div>
    </div>
  )
}
