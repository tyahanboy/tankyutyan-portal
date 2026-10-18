import { useCallback, useEffect, useState } from 'react'
import {
  Menu,
  ShieldCheck,
  LogIn,
  LogOut,
  LoaderCircle,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import Sidebar, { type PageId } from './components/Sidebar'
import TopBar from './components/TopBar'
import DashboardView from './views/DashboardView'
import BotStatusView from './views/BotStatusView'
import DiscordView from './views/DiscordView'
import AiLogsView from './views/AiLogsView'
import SearchHistoryView from './views/SearchHistoryView'
import SettingsView from './views/SettingsView'
import { API_BASE_URL, apiFetch } from './lib/api'

type AuthUser = {
  id?: string
  username?: string
  global_name?: string | null
  avatar?: string | null
}

type AuthState = 'checking' | 'signedIn' | 'signedOut' | 'error'

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

function LoginScreen({
  onLogin,
  message,
}: {
  onLogin: () => void
  message?: string
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-7 shadow-2xl shadow-black/30 sm:p-9">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10">
          <ShieldCheck size={34} className="text-indigo-300" />
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-300">
            Secure Admin Portal
          </p>
          <h1 className="mt-3 text-2xl font-bold text-white">
            たんきゅーちゃん
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            管理ダッシュボード
          </p>
        </div>

        <div className="mt-7 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-emerald-400" />
            <div>
              <p className="text-sm font-semibold text-slate-200">
                Discord認証が必要です
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                許可されたアカウントでログインすると、管理機能を利用できます。
              </p>
            </div>
          </div>
        </div>

        {message && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200"
          >
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={onLogin}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-indigo-500 px-4 py-3.5 font-semibold text-white transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          <LogIn size={20} />
          Discordでログイン
        </button>

        <p className="mt-5 text-center text-xs leading-5 text-slate-500">
          ログイン後も、サーバー側で利用権限が確認されます。
        </p>
      </section>
    </main>
  )
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [authState, setAuthState] = useState<AuthState>('checking')
  const [user, setUser] = useState<AuthUser | null>(null)
  const [authMessage, setAuthMessage] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)

  const checkAuth = useCallback(async () => {
    setAuthState('checking')
    setAuthMessage('')

    try {
      const response = await apiFetch('/api/auth/me', {
        cache: 'no-store',
      })

      if (response.status === 401 || response.status === 403) {
        setUser(null)
        setAuthState('signedOut')
        return
      }

      if (!response.ok) {
        throw new Error(`認証確認に失敗しました (${response.status})`)
      }

      const data = await response.json()

      if (!data?.user) {
        setUser(null)
        setAuthState('signedOut')
        return
      }

      setUser(data.user)
      setAuthState('signedIn')
    } catch {
      setUser(null)
      setAuthState('error')
      setAuthMessage(
        'APIに接続できません。APIサーバーの稼働状況や接続設定を確認してください。',
      )
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const loginError = params.get('login')

    if (loginError === 'failed' || loginError === 'denied') {
      setAuthMessage(
        'Discord認証が完了しませんでした。もう一度ログインしてください。',
      )
      window.history.replaceState({}, '', window.location.pathname)
    }

    void checkAuth()
  }, [checkAuth])

  function navigateTo(page: PageId) {
    setActivePage(page)
    setMenuOpen(false)
  }

  function startLogin() {
    if (!API_BASE_URL) {
      setAuthState('error')
      setAuthMessage('APIのURLが設定されていません。')
      return
    }

    window.location.assign(`${API_BASE_URL}/api/auth/discord`)
  }

  async function logout() {
    setLoggingOut(true)

    try {
      const response = await apiFetch('/api/auth/logout', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error(`ログアウトに失敗しました (${response.status})`)
      }

      setUser(null)
      setAuthState('signedOut')
      setAuthMessage('')
    } catch {
      setAuthMessage(
        'ログアウトできませんでした。通信状態を確認して再試行してください。',
      )
    } finally {
      setLoggingOut(false)
    }
  }

  if (authState === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
        <div className="text-center">
          <LoaderCircle size={36} className="mx-auto animate-spin text-indigo-400" />
          <p className="mt-4 font-medium">ログイン状態を確認中...</p>
          <p className="mt-2 text-sm text-slate-500">
            安全に管理画面を開く準備をしています
          </p>
        </div>
      </main>
    )
  }

  if (authState === 'error') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
        <section className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-7 text-center">
          <AlertCircle size={36} className="mx-auto text-amber-400" />
          <h1 className="mt-4 text-xl font-bold">接続を確認できません</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            {authMessage}
          </p>
          <button
            type="button"
            onClick={() => void checkAuth()}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white hover:bg-indigo-400"
          >
            <RefreshCw size={18} />
            もう一度確認
          </button>
        </section>
      </main>
    )
  }

  if (authState === 'signedOut') {
    return (
      <LoginScreen
        onLogin={startLogin}
        message={authMessage || undefined}
      />
    )
  }

  const currentPage = pageInfo[activePage]
  const displayName = user?.global_name || user?.username || '管理者'

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
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white">たんきゅーちゃん</p>
            <p className="truncate text-xs text-slate-400">
              ログイン中: {displayName}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            disabled={loggingOut}
            aria-label="ログアウト"
            className="rounded-xl border border-white/10 p-2 text-slate-300 hover:bg-white/5 disabled:opacity-50"
          >
            <LogOut size={18} />
          </button>
        </header>

        <div className="hidden lg:block">
          <TopBar
            title={currentPage.title}
            description={currentPage.description}
          />
        </div>

        <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
            <div className="min-w-0">
              <p className="text-xs text-slate-500">ログイン中</p>
              <p className="truncate text-sm font-medium text-slate-200">
                {displayName}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void logout()}
              disabled={loggingOut}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 disabled:opacity-50"
            >
              <LogOut size={16} />
              {loggingOut ? 'ログアウト中...' : 'ログアウト'}
            </button>
          </div>

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
          たんきゅーちゃん 管理ダッシュボード
        </footer>
      </div>
    </div>
  )
}
