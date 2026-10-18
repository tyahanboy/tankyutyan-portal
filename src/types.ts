export type BotStatus = 'online' | 'offline' | 'starting' | 'error'

export interface BotInfo {
  name: string
  status: BotStatus
  latency: number | null
  uptime: string
  lastStartedAt: string | null
}

export interface DashboardStats {
  totalQuestions: number
  todayQuestions: number
  totalSearches: number
  activeServers: number
}

export interface DiscordServer {
  id: string
  name: string
  memberCount: number
  botPresent: boolean
}

export interface AiLog {
  id: string
  question: string
  answer: string
  userName: string
  serverName: string
  createdAt: string
  searchedWeb: boolean
  status: 'success' | 'error'
}

export interface SearchHistoryItem {
  id: string
  query: string
  source: string
  resultCount: number
  createdAt: string
  status: 'success' | 'error'
}

export interface AdminSettings {
  botDisplayName: string
  searchEnabled: boolean
  maxAnswerTokens: number
  maintenanceMode: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
