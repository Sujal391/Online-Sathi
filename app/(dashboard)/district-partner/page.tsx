'use client'

import { motion } from 'framer-motion'
import {
  Users, TrendingUp, CreditCard, Wallet,
  UserPlus, DollarSign, ArrowUpRight, AlertCircle,
} from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { ActivityFeed, FeedItem } from '@/components/shared/ActivityFeed'
import { QuickActions, QuickAction } from '@/components/shared/QuickActions'
import { MiniTable, StatusPill } from '@/components/shared/MiniTable'
import { PageHeader } from '@/components/shared/PageHeader'

const stats = [
  { label: 'District Volume MTD', value: '₹28 K', delta: '+6% this month', trend: 'up' as const, icon: <TrendingUp size={18} />, accent: '#185FA5' },
  { label: 'My Agents', value: '9', delta: '8 active', trend: 'neutral' as const, icon: <Users size={18} />, accent: '#0F6E56' },
  { label: 'Services This Week', value: '342', delta: '+28 vs last week', trend: 'up' as const, icon: <CreditCard size={18} />, accent: '#854F0B' },
  { label: 'Wallet Balance', value: '₹18,400', delta: 'Available funds', trend: 'neutral' as const, icon: <Wallet size={18} />, accent: '#533AB7' },
  { label: 'My Payout', value: '₹3,200', delta: 'Pending this Friday', trend: 'up' as const, icon: <DollarSign size={18} />, accent: '#0F6E56' },
  { label: 'Inactive Agents', value: '1', delta: 'Gita Rai — 2 days', trend: 'down' as const, icon: <AlertCircle size={18} />, accent: '#A32D2D' },
]

const quickActions: QuickAction[] = [
  { label: 'Add Agent', description: 'Onboard a new agent', icon: <UserPlus size={16} />, href: '/district-partner/agents/new', accent: '#185FA5' },
  { label: 'Request Payout', description: 'Withdraw earnings', icon: <DollarSign size={16} />, href: '/district-partner/payouts', accent: '#0F6E56' },
  { label: 'Agent Report', description: 'Performance summary', icon: <TrendingUp size={16} />, href: '/district-partner/reports', accent: '#854F0B' },
  { label: 'Commissions', description: 'Earnings detail', icon: <CreditCard size={16} />, href: '/district-partner/commissions', accent: '#533AB7' },
]

const feed: FeedItem[] = [
  { id: '1', text: 'Krishna Oli completed 18 transactions today — ₹4.8K volume', time: '30 min ago', type: 'success' },
  { id: '2', text: 'Payout request submitted — expect credit by Friday', time: '2 hr ago', type: 'info' },
  { id: '3', text: 'Gita Rai has been inactive for 2 days — follow up needed', time: '3 hr ago', type: 'warning' },
  { id: '4', text: 'Wallet topped up — ₹5,000 credited from state partner', time: 'Yesterday', type: 'success' },
]

type AgentRow = { name: string; area: string; txnToday: string; volume: string; status: string }
const agentRows: AgentRow[] = [
  { name: 'Krishna Oli', area: 'Ward 4', txnToday: '18', volume: '₹4.8 K', status: 'Active' },
  { name: 'Mina Thapa', area: 'Ward 7', txnToday: '14', volume: '₹3.6 K', status: 'Active' },
  { name: 'Suresh BK', area: 'Ward 2', txnToday: '11', volume: '₹2.9 K', status: 'Active' },
  { name: 'Puja Shrestha', area: 'Ward 5', txnToday: '9', volume: '₹2.2 K', status: 'Active' },
  { name: 'Gita Rai', area: 'Ward 9', txnToday: '0', volume: '₹0', status: 'Inactive' },
]

export default function DistrictPartnerDashboard() {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Agent Network"
        subtitle={today}
        badge="District Partner"
        badgeColor="#3B6D11"
      >
        <motion.a
          href="/district-partner/payouts"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1.5 rounded-xl bg-zinc-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 shadow-lg shadow-zinc-200 dark:shadow-none transition-all"
        >
          Request Payout <ArrowUpRight size={14} />
        </motion.a>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.06} />)}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <QuickActions actions={quickActions} />

        {/* agent performance */}
        <div className="rounded-2xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 p-5 backdrop-blur-sm">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Agent Performance Today
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Krishna Oli', txn: 18, max: 20, color: '#185FA5' },
              { label: 'Mina Thapa', txn: 14, max: 20, color: '#0F6E56' },
              { label: 'Suresh BK', txn: 11, max: 20, color: '#854F0B' },
              { label: 'Puja Shrestha', txn: 9, max: 20, color: '#533AB7' },
              { label: 'Gita Rai', txn: 0, max: 20, color: '#A32D2D' },
            ].map((a, i) => (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 + 0.3 }}
                className="space-y-1"
              >
                <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{a.label}</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{a.txn} txns</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(a.txn / a.max) * 100}%` }}
                    transition={{ delay: i * 0.07 + 0.4, duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ background: a.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <ActivityFeed items={feed} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <MiniTable<AgentRow>
          title="Agent List"
          columns={[
            { key: 'name', label: 'Agent' },
            { key: 'area', label: 'Area' },
            { key: 'txnToday', label: "Today's Txn" },
            { key: 'volume', label: 'Volume' },
            { key: 'status', label: 'Status', render: (v) => <StatusPill status={String(v)} /> },
          ]}
          rows={agentRows}
          viewAllHref="/district-partner/agents"
        />

        {/* wallet & payout */}
        <div className="rounded-2xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 p-5 backdrop-blur-sm">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Wallet & Payout
          </h3>
          <div className="mb-4 rounded-xl bg-zinc-900 dark:bg-white/10 p-4 text-white">
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-1">Available Balance</p>
            <p className="text-3xl font-semibold">₹18,400</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Last topped up: Yesterday, ₹5,000</p>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Earned This Month', value: '₹3,200', color: '#0F6E56' },
              { label: 'Last Payout', value: '₹2,800', color: '#185FA5' },
              { label: 'Next Payout Date', value: 'This Friday', color: '#854F0B' },
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