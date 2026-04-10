'use client'

import { motion } from 'framer-motion'
import {
  Users, TrendingUp, CreditCard, Layers,
  FileText, ArrowUpRight, DollarSign, Bell,
} from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { ActivityFeed, FeedItem } from '@/components/shared/ActivityFeed'
import { QuickActions, QuickAction } from '@/components/shared/QuickActions'
import { MiniTable, StatusPill } from '@/components/shared/MiniTable'
import { PageHeader } from '@/components/shared/PageHeader'

const stats = [
  { label: 'State Volume MTD', value: '₹4.2 L', delta: '+8% this month', trend: 'up' as const, icon: <TrendingUp size={18} />, accent: '#185FA5' },
  { label: 'State Partners', value: '12', delta: 'All active', trend: 'up' as const, icon: <Layers size={18} />, accent: '#0F6E56' },
  { label: 'District Partners', value: '38', delta: '+4 this month', trend: 'up' as const, icon: <Users size={18} />, accent: '#854F0B' },
  { label: 'Total Transactions', value: '8,420', delta: 'This month', trend: 'up' as const, icon: <CreditCard size={18} />, accent: '#533AB7' },
  { label: 'My Commission', value: '₹21 K', delta: 'Credited this month', trend: 'up' as const, icon: <DollarSign size={18} />, accent: '#0F6E56' },
  { label: 'Pending Notices', value: '3', delta: 'From country head', trend: 'neutral' as const, icon: <Bell size={18} />, accent: '#854F0B' },
]

const quickActions: QuickAction[] = [
  { label: 'Add State Partner', description: 'Grow your network', icon: <Layers size={16} />, href: '/state-head/state-partners/new', accent: '#185FA5' },
  { label: 'Collections Log', description: 'View all collections', icon: <CreditCard size={16} />, href: '/state-head/collections', accent: '#0F6E56' },
  { label: 'Commission Report', description: 'Your earnings detail', icon: <DollarSign size={16} />, href: '/state-head/commissions', accent: '#854F0B' },
  { label: 'State Report', description: 'Send to country head', icon: <FileText size={16} />, href: '/state-head/reports', accent: '#533AB7' },
  { label: 'Send Notice', description: 'Alert state partners', icon: <Bell size={16} />, href: '/state-head/state-partners', accent: '#3B6D11' },
]

const feed: FeedItem[] = [
  { id: '1', text: 'Bikash Gurung added 2 new district partners in Kathmandu', time: '1 hr ago', type: 'success' },
  { id: '2', text: 'Commission payout for state partners processed — ₹8.8 L', time: '4 hr ago', type: 'info' },
  { id: '3', text: 'Monthly collection target 84% achieved so far', time: '6 hr ago', type: 'warning' },
  { id: '4', text: 'New notice received from country head regarding EMI targets', time: 'Yesterday', type: 'info' },
]

type StatePartnerRow = { name: string; district: string; dPartners: string; volume: string; status: string }
const spRows: StatePartnerRow[] = [
  { name: 'Bikash Gurung', district: 'Kathmandu', dPartners: '8', volume: '₹1.1 L', status: 'Active' },
  { name: 'Anita Tamang', district: 'Lalitpur', dPartners: '6', volume: '₹88 K', status: 'Active' },
  { name: 'Dev Rana', district: 'Bhaktapur', dPartners: '5', volume: '₹72 K', status: 'Active' },
  { name: 'Mina Thapa', district: 'Makwanpur', dPartners: '4', volume: '₹54 K', status: 'Pending' },
]

export default function StateHeadDashboard() {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-neutral-50 p-6 space-y-6">
      <PageHeader
        title="State Overview"
        subtitle={today}
        badge="State Head"
        badgeColor="#185FA5"
      >
        <motion.a
          href="/state-head/reports"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
        >
          State Report <ArrowUpRight size={14} />
        </motion.a>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.06} />)}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <QuickActions actions={quickActions} />

        {/* district collections */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400">
            District Collection Share
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Kathmandu', pct: 84, color: '#185FA5' },
              { label: 'Lalitpur', pct: 69, color: '#0F6E56' },
              { label: 'Bhaktapur', pct: 62, color: '#854F0B' },
              { label: 'Makwanpur', pct: 48, color: '#533AB7' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 + 0.3 }}
                className="space-y-1"
              >
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>{s.label}</span>
                  <span className="font-medium">{s.pct}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
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
        <MiniTable<StatePartnerRow>
          title="State Partner Network"
          columns={[
            { key: 'name', label: 'State Partner' },
            { key: 'district', label: 'District' },
            { key: 'dPartners', label: 'D.Partners' },
            { key: 'volume', label: 'Volume' },
            { key: 'status', label: 'Status', render: (v) => <StatusPill status={String(v)} /> },
          ]}
          rows={spRows}
          viewAllHref="/state-head/state-partners"
        />

        {/* collection summary */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Collection Summary
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Gross State Collections', value: '₹4,20,000', color: '#185FA5' },
              { label: 'Distributed to Partners', value: '₹3,36,000', color: '#0F6E56' },
              { label: 'Platform Levy (5%)', value: '₹21,000', color: '#854F0B' },
              { label: 'My Net Commission', value: '₹21,000', color: '#533AB7' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 + 0.3 }}
                className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{ background: `${item.color}08` }}
              >
                <span className="text-sm text-neutral-600">{item.label}</span>
                <span className="text-sm font-semibold" style={{ color: item.color }}>{item.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}