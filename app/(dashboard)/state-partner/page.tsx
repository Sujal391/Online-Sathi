'use client'

import { motion } from 'framer-motion'
import {
  MapPin, Users, TrendingUp, CreditCard,
  DollarSign, FileText, ArrowUpRight, Phone,
} from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { ActivityFeed, FeedItem } from '@/components/shared/ActivityFeed'
import { QuickActions, QuickAction } from '@/components/shared/QuickActions'
import { MiniTable, StatusPill } from '@/components/shared/MiniTable'
import { PageHeader } from '@/components/shared/PageHeader'

const stats = [
  { label: 'My Volume MTD', value: '₹1.1 L', delta: '+11% this month', trend: 'up' as const, icon: <TrendingUp size={18} />, accent: '#185FA5' },
  { label: 'District Partners', value: '8', delta: 'Under me', trend: 'neutral' as const, icon: <MapPin size={18} />, accent: '#0F6E56' },
  { label: 'Total Agents', value: '64', delta: 'Active agents', trend: 'up' as const, icon: <Users size={18} />, accent: '#854F0B' },
  { label: 'Transactions This Month', value: '2,840', delta: '+18% vs last month', trend: 'up' as const, icon: <CreditCard size={18} />, accent: '#533AB7' },
  { label: 'My Earnings', value: '₹8,400', delta: 'Credited this month', trend: 'up' as const, icon: <DollarSign size={18} />, accent: '#0F6E56' },
  { label: 'Support Tickets', value: '2', delta: 'Open tickets', trend: 'down' as const, icon: <Phone size={18} />, accent: '#A32D2D' },
]

const quickActions: QuickAction[] = [
  { label: 'Add District Partner', description: 'Expand to new district', icon: <MapPin size={16} />, href: '/state-partner/district-partners/new', accent: '#185FA5' },
  { label: 'My Earnings', description: 'Commission breakdown', icon: <DollarSign size={16} />, href: '/state-partner/earnings', accent: '#0F6E56' },
  { label: 'Commissions', description: 'Partner payouts', icon: <TrendingUp size={16} />, href: '/state-partner/commissions', accent: '#854F0B' },
  { label: 'District Report', description: 'Performance view', icon: <FileText size={16} />, href: '/state-partner/reports', accent: '#533AB7' },
  { label: 'Contact Support', description: 'Raise a ticket', icon: <Phone size={16} />, href: '/state-partner/district-partners', accent: '#3B6D11' },
]

const feed: FeedItem[] = [
  { id: '1', text: 'Ram Basnet completed ₹28K in transactions today', time: '2 hr ago', type: 'success' },
  { id: '2', text: 'District partner payout scheduled for this Friday', time: '5 hr ago', type: 'info' },
  { id: '3', text: 'New agent onboarded under Hari Lama in Patan', time: 'Yesterday', type: 'success' },
  { id: '4', text: 'Sita KC requested additional ₹10K wallet top-up', time: '2 days ago', type: 'warning' },
]

type DistrictPartnerRow = { name: string; area: string; agents: string; volume: string; status: string }
const dpRows: DistrictPartnerRow[] = [
  { name: 'Ram Basnet', area: 'Thamel', agents: '9', volume: '₹28 K', status: 'Active' },
  { name: 'Sita KC', area: 'Baneshwor', agents: '7', volume: '₹22 K', status: 'Active' },
  { name: 'Hari Lama', area: 'Patan', agents: '8', volume: '₹19 K', status: 'Active' },
  { name: 'Gita Rai', area: 'Kirtipur', agents: '5', volume: '₹12 K', status: 'Pending' },
]

export default function StatePartnerDashboard() {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="My District Network"
        subtitle={today}
        badge="State Partner"
        badgeColor="#3B6D11"
      >
        <motion.a
          href="/state-partner/reports"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1.5 rounded-xl bg-zinc-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 shadow-lg shadow-zinc-200 dark:shadow-none transition-all"
        >
          View Report <ArrowUpRight size={14} />
        </motion.a>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.06} />)}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <QuickActions actions={quickActions} />

        {/* district breakdown */}
        <div className="rounded-2xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 p-5 backdrop-blur-sm">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            District Volume Share
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Thamel', pct: 78, color: '#185FA5' },
              { label: 'Baneshwor', pct: 66, color: '#0F6E56' },
              { label: 'Patan', pct: 58, color: '#854F0B' },
              { label: 'Kirtipur', pct: 40, color: '#533AB7' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 + 0.3 }}
                className="space-y-1"
              >
                <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{s.label}</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{s.pct}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
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
        <MiniTable<DistrictPartnerRow>
          title="My District Partners"
          columns={[
            { key: 'name', label: 'District Partner' },
            { key: 'area', label: 'Area' },
            { key: 'agents', label: 'Agents' },
            { key: 'volume', label: 'Volume' },
            { key: 'status', label: 'Status', render: (v) => <StatusPill status={String(v)} /> },
          ]}
          rows={dpRows}
          viewAllHref="/state-partner/district-partners"
        />

        <div className="rounded-2xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 p-5 backdrop-blur-sm">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Earnings Breakdown
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Gross Volume Processed', value: '₹1,10,000', color: '#185FA5' },
              { label: 'Commission Rate', value: '7.6%', color: '#0F6E56' },
              { label: 'Gross Commission', value: '₹8,400', color: '#854F0B' },
              { label: 'Passed to D.Partners', value: '₹5,200', color: '#533AB7' },
              { label: 'Net Earnings (Mine)', value: '₹3,200', color: '#3B6D11' },
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