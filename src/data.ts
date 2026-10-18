import type {
  AdminSettings,
  AiLog,
  BotInfo,
  DashboardStats,
  DiscordServer,
  SearchHistoryItem,
} from './types'

export const demoBotInfo: BotInfo = {
  name: 'たんきゅーちゃん',
  status: 'offline',
  latency: null,
  uptime: '未接続',
  lastStartedAt: null,
}

export const demoDashboardStats: DashboardStats = {
  totalQuestions: 0,
  todayQuestions: 0,
  totalSearches: 0,
  activeServers: 0,
}

export const demoServers: DiscordServer[] = []

export const demoAiLogs: AiLog[] = []

export const demoSearchHistory: SearchHistoryItem[] = []

export const defaultSettings: AdminSettings = {
  botDisplayName: 'たんきゅーちゃん',
  searchEnabled: true,
  maxAnswerTokens: 800,
  maintenanceMode: false,
}
