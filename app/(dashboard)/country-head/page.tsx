'use client'

import { motion } from 'framer-motion'
import {
  Map, Users, TrendingUp, CreditCard,
  Target, FileText, ArrowUpRight, Bell,
} from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { ActivityFeed, FeedItem } from '@/components/shared/ActivityFeed'
import { QuickActions, QuickAction } from '@/components/shared/QuickActions'
import { MiniTable, StatusPill } from '@/components/shared/MiniTable'
import { PageHeader } from '@/components/shared/PageHeader'

const stats = [
  { label: 'Country Volume', value: '₹18 L', delta: '+12% this month', trend: 'up' as const, icon: <TrendingUp size={18} />, accent: '#185FA5' },
  { label: 'State Heads', value: '9', delta: 'All managed', trend: 'neutral' as const, icon: <Users size={18} />, accent: '#0F6E56' },
  { label: 'Total Agents', value: '210', delta: '+15 this month', trend: 'up' as const, icon: <Users size={18} />, accent: '#854F0B' },
  { label: 'Collection Rate', value: '94%', delta: '+2% this week', trend: 'up' as const, icon: <CreditCard size={18} />, accent: '#533AB7' },
  { label: 'My Commission', value: '₹42 K', delta: 'This month', trend: 'up' as const, icon: <Target size={18} />, accent: '#0F6E56' },
  { label: 'Broadcasts Sent', value: '8', delta: 'This week', trend: 'neutral' as const, icon: <Bell size={18} />, accent: '#854F0B' },
]

const quickActions: QuickAction[] = [
  { label: 'Add State Head', description: 'New state operation', icon: <Map size={16} />, href: '/country-head/state-heads/new', accent: '#185FA5' },
  { label: 'Set Targets', description: 'Monthly goals for states', icon: <Target size={16} />, href: '/country-head/targets', accent: '#0F6E56' },
  { label: 'State Reports', description: 'Performance overview', icon: <FileText size={16} />, href: '/country-head/reports', accent: '#854F0B' },
  { label: 'Broadcast Notice', description: 'Message all state heads', icon: <Bell size={16} />, href: '/country-head/states', accent: '#533AB7' },
  { label: 'Commissions', description: 'Earnings & payouts', icon: <TrendingUp size={16} />, href: '/country-head/commissions', accent: '#3B6D11' },
]

const feed: FeedItem[] = [
  { id: '1', text: 'Bagmati state exceeded monthly collection target by 12%', time: '45 min ago', type: 'success' },
  { id: '2', text: 'New state head onboarded for Province 1', time: '2 hr ago', type: 'info' },
  { id: '3', text: 'Karnali region underperforming — 49% target reached', time: '5 hr ago', type: 'warning' },
  { id: '4', text: 'Q3 country report submitted to sub-admin successfully', time: 'Yesterday', type: 'success' },
  { id: '5', text: 'Agent onboarding surge in Gandaki province this week', time: '2 days ago', type: 'info' },
]

type StateRow = { name: string; state: string; agents: string; collections: string; status: string }
const stateRows: StateRow[] = [
  { name: 'Pawan Rijal', state: 'Bagmati', agents: '28', collections: '₹4.2 L', status: 'Active' },
  { name: 'Kamala Shrestha', state: 'Gandaki', agents: '22', collections: '₹3.1 L', status: 'Active' },
  { name: 'Binod BK', state: 'Lumbini', agents: '18', collections: '₹2.8 L', status: 'Active' },
  { name: 'Sita Oli', state: 'Karnali', agents: '14', collections: '₹1.9 L', status: 'Review' },
  { name: 'Ram Basyal', state: 'Sudurpashchim', agents: '11', collections: '₹1.4 L', status: 'Pending' },
]

const statePerf = [
  { label: 'Bagmati', pct: 112, color: '#185FA5' },
  { label: 'Gandaki', pct: 88, color: '#0F6E56' },
  { label: 'Lumbini', pct: 72, color: '#854F0B' },
  { label: 'Karnali', pct: 49, color: '#A32D2D' },
  { label: 'Sudurpashchim', pct: 61, color: '#533AB7' },
]

export default function CountryHeadDashboard() {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Country Overview"
        subtitle={today}
        badge="Country Head"
        badgeColor="#185FA5"
      >
        <motion.a
          href="/country-head/reports"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1.5 rounded-xl bg-zinc-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 shadow-lg shadow-zinc-200 dark:shadow-none transition-all"
        >
          Country Report <ArrowUpRight size={14} />
        </motion.a>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.06} />)}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <QuickActions actions={quickActions} />

        {/* state performance bars */}
        <div className="rounded-2xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 p-5 backdrop-blur-sm">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            State Target Achievement
          </h3>
          <div className="space-y-3">
            {statePerf.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 + 0.3 }}
                className="space-y-1"
              >
                <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{s.label}</span>
                  <span className="font-medium" style={{ color: s.pct >= 100 ? '#0F6E56' : s.pct < 60 ? '#A32D2D' : '#854F0B' }}>
                    {s.pct}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(s.pct, 100)}%` }}
                    transition={{ delay: i * 0.07 + 0.4, duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ background: s.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <ActivityFeed items={feed} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <MiniTable<StateRow>
          title="State Head Network"
          columns={[
            { key: 'name', label: 'State Head' },
            { key: 'state', label: 'State' },
            { key: 'agents', label: 'Agents' },
            { key: 'collections', label: 'Collections' },
            { key: 'status', label: 'Status', render: (v) => <StatusPill status={String(v)} /> },
          ]}
          rows={stateRows}
          viewAllHref="/country-head/state-heads"
        />

        {/* country overview card */}
        <div className="rounded-2xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 p-5 backdrop-blur-sm">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Country Summary
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Total State Heads', value: '9 active', color: '#185FA5' },
              { label: 'District Partners', value: '64 active', color: '#0F6E56' },
              { label: 'Total Agents in Country', value: '210', color: '#854F0B' },
              { label: 'Services Delivered Today', value: '1,840', color: '#533AB7' },
              { label: 'Gross Country Volume MTD', value: '₹18 L', color: '#3B6D11' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 + 0.3 }}
                className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{ background: `${item.color}08` }}
              >
                <span className="text-sm text-zinc-600 dark:text-zinc-400">{item.label}</span>
                <span className="text-sm font-semibold" style={{ color: item.color }}>{item.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}