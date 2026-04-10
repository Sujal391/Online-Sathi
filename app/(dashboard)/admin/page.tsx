'use client'

import { motion } from 'framer-motion'
import {
  Users, BarChart3, CreditCard, TrendingUp,
  UserCheck, FileText, ArrowUpRight, AlertCircle,
} from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { ActivityFeed, FeedItem } from '@/components/shared/ActivityFeed'
import { QuickActions, QuickAction } from '@/components/shared/QuickActions'
import { MiniTable, StatusPill } from '@/components/shared/MiniTable'
import { PageHeader } from '@/components/shared/PageHeader'

const stats = [
  { label: 'Managed Volume', value: '₹92 L', delta: '+14% this month', trend: 'up' as const, icon: <TrendingUp size={18} />, accent: '#185FA5' },
  { label: 'Sub-Admins', value: '8', delta: '2 pending onboard', trend: 'neutral' as const, icon: <Users size={18} />, accent: '#854F0B' },
  { label: 'Active Agents', value: '340', delta: '+28 this week', trend: 'up' as const, icon: <UserCheck size={18} />, accent: '#0F6E56' },
  { label: 'Transactions Today', value: '1,842', delta: '+6.2% vs yesterday', trend: 'up' as const, icon: <CreditCard size={18} />, accent: '#533AB7' },
  { label: 'Success Rate', value: '98.2%', delta: '+0.3% this week', trend: 'up' as const, icon: <BarChart3 size={18} />, accent: '#0F6E56' },
  { label: 'Pending KYC', value: '22', delta: 'Action needed', trend: 'down' as const, icon: <AlertCircle size={18} />, accent: '#A32D2D' },
]

const quickActions: QuickAction[] = [
  { label: 'Add Sub-Admin', description: 'Expand your team', icon: <Users size={16} />, href: '/admin/sub-admins/new', accent: '#185FA5' },
  { label: 'View Transactions', description: 'All payment records', icon: <CreditCard size={16} />, href: '/admin/transactions', accent: '#0F6E56' },
  { label: 'KYC Reviews', description: '22 awaiting approval', icon: <AlertCircle size={16} />, href: '/admin/kyc', accent: '#A32D2D' },
  { label: 'Commission Report', description: 'This month earnings', icon: <TrendingUp size={16} />, href: '/admin/commissions', accent: '#854F0B' },
  { label: 'Analytics', description: 'Regional performance', icon: <BarChart3 size={16} />, href: '/admin/reports', accent: '#533AB7' },
  { label: 'Export Data', description: 'Download reports', icon: <FileText size={16} />, href: '/admin/reports', accent: '#3B6D11' },
]

const feed: FeedItem[] = [
  { id: '1', text: 'Sub-admin Deepak Kumar completed monthly target', time: '30 min ago', type: 'success' },
  { id: '2', text: 'Commission payout processed for 8 sub-admins — ₹4.2 L', time: '2 hr ago', type: 'info' },
  { id: '3', text: 'KYC document rejected — missing address proof for ID #4421', time: '4 hr ago', type: 'warning' },
  { id: '4', text: 'New service module (Insurance) enabled for your region', time: '6 hr ago', type: 'info' },
  { id: '5', text: 'Weekly report generated and dispatched to Super Admin', time: 'Yesterday', type: 'success' },
]

type SubAdminRow = { name: string; region: string; agents: string; volume: string; status: string }
const subAdminRows: SubAdminRow[] = [
  { name: 'Deepak Singh', region: 'Karnataka', agents: '42', volume: '₹12 L', status: 'Active' },
  { name: 'Meena Patel', region: 'Gujarat', agents: '38', volume: '₹10 L', status: 'Active' },
  { name: 'Ravi Nair', region: 'Kerala', agents: '31', volume: '₹9.2 L', status: 'Active' },
  { name: 'Anjali Gupta', region: 'MP', agents: '27', volume: '₹7.8 L', status: 'Pending' },
]

const regionMix = [
  { label: 'Karnataka', pct: 76, color: '#185FA5' },
  { label: 'Gujarat', pct: 62, color: '#0F6E56' },
  { label: 'Kerala', pct: 58, color: '#854F0B' },
  { label: 'Madhya Pradesh', pct: 44, color: '#533AB7' },
]

export default function AdminDashboard() {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-neutral-50 p-6 space-y-6">
      <PageHeader
        title="Admin Dashboard"
        subtitle={today}
        badge="Admin"
        badgeColor="#854F0B"
      >
        <motion.a
          href="/admin/reports"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
        >
          Monthly Report <ArrowUpRight size={14} />
        </motion.a>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.06} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <QuickActions actions={quickActions} />

        <div className="rounded-2xl border border-neutral-100 bg-white p-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Region Performance
          </h3>
          <div className="space-y-3">
            {regionMix.map((s, i) => (
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
                    transition={{ delay: i * 0.07 + 0.4, duration: 0.6, ease: 'easeOut' }}
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
        <MiniTable<SubAdminRow>
          title="Sub-Admin Overview"
          columns={[
            { key: 'name', label: 'Sub-Admin' },
            { key: 'region', label: 'Region' },
            { key: 'agents', label: 'Agents' },
            { key: 'volume', label: 'Volume' },
            { key: 'status', label: 'Status', render: (v) => <StatusPill status={String(v)} /> },
          ]}
          rows={subAdminRows}
          viewAllHref="/admin/sub-admins"
        />

        {/* commission summary card */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Commission Summary
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Total Earned This Month', value: '₹1,24,000', color: '#185FA5' },
              { label: 'Distributed to Sub-Admins', value: '₹88,000', color: '#0F6E56' },
              { label: 'Platform Fee Deducted', value: '₹12,400', color: '#854F0B' },
              { label: 'Net in Your Account', value: '₹23,600', color: '#533AB7' },
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
                <span className="text-sm font-semibold" style={{ color: item.color }}>
                  {item.value}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}