import { useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'
import {
  Check,
  RotateCcw,
  Save,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react'
import { defaultSettings } from '../data'

export default function SettingsView() {
  const [settings, setSettings] = useState({ ...defaultSettings })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadSettings() {
      try {
        const response = await apiFetch('/api/settings')
        const data = await response.json()
        if (!response.ok || !data.ok || !data.settings) {
          throw new Error(data.message || '設定を読み込めへんかったよ')
        }
        if (active) {
          setSettings(data.settings)
          setSaved(false)
          setError('')
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : '設定の読み込みに失敗したよ')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadSettings()
    return () => { active = false }
  }, [])

  async function saveSettings() {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const response = await apiFetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      const data = await response.json()
      if (!response.ok || !data.ok || !data.settings) {
        throw new Error(data.message || '設定を保存できへんかったよ')
      }
      setSettings(data.settings)
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '設定の保存に失敗したよ')
    } finally {
      setSaving(false)
    }
  }

  function updateSetting<K extends keyof typeof defaultSettings>(
    key: K,
    value: (typeof defaultSettings)[K],
  ) {
    setSettings((current) => ({ ...current, [key]: value }))
    setSaved(false)
  }

  function resetSettings() {
    setSettings({ ...defaultSettings })
    setSaved(false)
  }

  return (
    <div className="space-y-6">
      <section className="panel p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-500/10 p-3">
            <Settings size={22} className="text-blue-300" />
          </div>
          <div>
            <h2 className="font-semibold text-white">基本設定</h2>
            <p className="mt-1 text-sm text-slate-400">
              管理画面に表示するBotの設定
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="bot-name"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Botの表示名
            </label>
            <input
              id="bot-name"
              value={settings.botDisplayName}
              onChange={(event) =>
                updateSetting('botDisplayName', event.target.value)
              }
              maxLength={50}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-blue-400 sm:max-w-md"
              placeholder="たんきゅーちゃん"
            />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-start gap-3">
              <Search size={19} className="mt-0.5 text-blue-300" />
              <div>
                <p className="text-sm font-medium text-white">Web検索機能</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  AIが回答を作るときのWeb検索設定
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.searchEnabled}
              onClick={() =>
                updateSetting('searchEnabled', !settings.searchEnabled)
              }
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                settings.searchEnabled ? 'bg-blue-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  settings.searchEnabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      <section className="panel p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-500/10 p-3">
            <SlidersHorizontal size={22} className="text-violet-300" />
          </div>
          <div>
            <h2 className="font-semibold text-white">AI応答設定</h2>
            <p className="mt-1 text-sm text-slate-400">
              回答の長さやメンテナンス状態
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <label
                htmlFor="max-tokens"
                className="text-sm font-medium text-slate-300"
              >
                回答トークン上限
              </label>
              <span className="rounded-lg bg-white/5 px-3 py-1.5 text-sm font-semibold text-white">
                {settings.maxAnswerTokens}
              </span>
            </div>
            <input
              id="max-tokens"
              type="range"
              min={100}
              max={2000}
              step={100}
              value={settings.maxAnswerTokens}
              onChange={(event) =>
                updateSetting('maxAnswerTokens', Number(event.target.value))
              }
              className="w-full accent-blue-500"
            />
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>100</span>
              <span>2,000</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck size={19} className="mt-0.5 text-amber-300" />
              <div>
                <p className="text-sm font-medium text-white">
                  メンテナンスモード
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Botをメンテナンス中として扱う設定
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.maintenanceMode}
              onClick={() =>
                updateSetting('maintenanceMode', !settings.maintenanceMode)
              }
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                settings.maintenanceMode ? 'bg-amber-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  settings.maintenanceMode ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      <section className="panel p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-white">設定の変更</p>
            <p className="mt-1 text-sm text-slate-400">
              {loading ? '保存済みの設定を読み込み中…' : '変更内容は保存ボタンを押すと設定データベースに反映されるで。'}
            </p>
            {error && (
              <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>
            )}
            {saved && (
              <p role="status" className="mt-3 flex items-center gap-2 text-sm text-emerald-300">
                <Check size={16} />
                設定を保存したで！
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resetSettings}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/5"
            >
              <RotateCcw size={16} />
              初期値に戻す
            </button>
            <button
              type="button"
              onClick={() => void saveSettings()}
              disabled={loading || saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? '保存中…' : '設定を保存'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
