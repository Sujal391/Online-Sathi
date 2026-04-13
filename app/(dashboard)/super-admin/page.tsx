'use client'

import { motion } from 'framer-motion'
import {
  Users, Shield, Globe, BarChart3, AlertTriangle,
  ArrowUpRight, Settings, FileText, CreditCard, TrendingUp,
} from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { ActivityFeed, FeedItem } from '@/components/shared/ActivityFeed'
import { QuickActions, QuickAction } from '@/components/shared/QuickActions'
import { MiniTable, StatusPill } from '@/components/shared/MiniTable'
import { PageHeader } from '@/components/shared/PageHeader'

// ─── mock data ───────────────────────────────────────────────
const stats = [
  { label: 'Total Platform Revenue', value: '₹4.82 Cr', delta: '+18.4% this month', trend: 'up' as const, icon: <TrendingUp size={18} />, accent: '#185FA5' },
  { label: 'Active Admins', value: '24', delta: '+3 onboarded', trend: 'up' as const, icon: <Shield size={18} />, accent: '#0F6E56' },
  { label: 'Countries Active', value: '12', delta: 'Across 3 regions', trend: 'neutral' as const, icon: <Globe size={18} />, accent: '#854F0B' },
  { label: 'Total Transactions', value: '2.1 L', delta: '+22% MoM', trend: 'up' as const, icon: <CreditCard size={18} />, accent: '#533AB7' },
  { label: 'Pending KYC', value: '138', delta: 'Needs review', trend: 'down' as const, icon: <AlertTriangle size={18} />, accent: '#A32D2D' },
  { label: 'Platform Uptime', value: '99.98%', delta: 'Last 30 days', trend: 'up' as const, icon: <BarChart3 size={18} />, accent: '#0F6E56' },
]

const quickActions: QuickAction[] = [
  { label: 'Add Admin', description: 'Onboard a new admin', icon: <Users size={16} />, href: '/super-admin/admins/new', accent: '#185FA5' },
  { label: 'Manage Countries', description: 'Regions & territories', icon: <Globe size={16} />, href: '/super-admin/countries', accent: '#0F6E56' },
  { label: 'Global Analytics', description: 'Full platform report', icon: <BarChart3 size={16} />, href: '/super-admin/analytics', accent: '#854F0B' },
  { label: 'Review KYC', description: '138 pending', icon: <AlertTriangle size={16} />, href: '/super-admin/kyc', accent: '#A32D2D' },
  { label: 'System Config', description: 'Roles & settings', icon: <Settings size={16} />, href: '/super-admin/system', accent: '#533AB7' },
  { label: 'Generate Report', description: 'Export platform data', icon: <FileText size={16} />, href: '/super-admin/reports', accent: '#3B6D11' },
]

const feed: FeedItem[] = [
  { id: '1', text: 'New admin "Rajesh Kumar" activated for South Asia region', time: '2 min ago', type: 'success' },
  { id: '2', text: 'System backup completed — all data secured', time: '1 hr ago', type: 'info' },
  { id: '3', text: '3 KYC applications flagged for manual review', time: '3 hr ago', type: 'warning' },
  { id: '4', text: 'Unusual transaction volume detected in Region 4', time: '5 hr ago', type: 'error' },
  { id: '5', text: 'Monthly commission payout processed — ₹18.4L distributed', time: '8 hr ago', type: 'success' },
  { id: '6', text: 'New country "Bhutan" onboarded successfully', time: 'Yesterday', type: 'info' },
]

type AdminRow = { name: string; region: string; admins: string; volume: string; status: string }
const adminRows: AdminRow[] = [
  { name: 'Rajesh Kumar', region: 'South Asia', admins: '6', volume: '₹38 L', status: 'Active' },
  { name: 'Priya Sharma', region: 'East Asia', admins: '4', volume: '₹29 L', status: 'Active' },
  { name: 'Amit Verma', region: 'West Asia', admins: '3', volume: '₹21 L', status: 'Review' },
  { name: 'Sunita Rao', region: 'Central', admins: '5', volume: '₹17 L', status: 'Active' },
]

type TxRow = { id: string; type: string; amount: string; role: string; status: string }
const txRows: TxRow[] = [
  { id: 'TXN-9812', type: 'Mobile Recharge', amount: '₹500', role: 'Agent', status: 'Done' },
  { id: 'TXN-9811', type: 'Utility Bill', amount: '₹1,200', role: 'Agent', status: 'Done' },
  { id: 'TXN-9810', type: 'Remittance', amount: '₹8,000', role: 'Agent', status: 'Pending' },
  { id: 'TXN-9809', type: 'EMI Apply', amount: '₹25,000', role: 'User', status: 'Review' },
]

// ─── service bar data ─────────────────────────────────────────
const serviceMix = [
  { label: 'Mobile Recharge', pct: 82, color: '#185FA5' },
  { label: 'Utility Bills', pct: 71, color: '#0F6E56' },
  { label: 'Remittance', pct: 54, color: '#854F0B' },
  { label: 'EMI Services', pct: 38, color: '#533AB7' },
  { label: 'Insurance', pct: 22, color: '#993556' },
]

// ─── component ────────────────────────────────────────────────
export default function SuperAdminDashboard() {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="space-y-6">
      {/* header */}
      <PageHeader
        title="Platform Overview"
        subtitle={today}
        badge="Super Admin"
        badgeColor="#A32D2D"
      >
        <motion.a
          href="/super-admin/analytics"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1.5 rounded-xl bg-zinc-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 shadow-lg shadow-zinc-200 dark:shadow-none transition-all"
        >
          Full Analytics <ArrowUpRight size={14} />
        </motion.a>
      </PageHeader>

      {/* stat grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.06} />
        ))}
      </div>

      {/* main grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* quick actions */}
        <QuickActions actions={quickActions} />

        {/* service mix bar chart */}
        <div className="rounded-2xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 p-5 backdrop-blur-sm">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Service Mix
          </h3>
          <div className="space-y-3">
            {serviceMix.map((s, i) => (
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
                    transition={{ delay: i * 0.07 + 0.4, duration: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: s.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* activity feed */}
        <ActivityFeed items={feed} />
      </div>

      {/* tables row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <MiniTable<AdminRow>
          title="Admin Performance"
          columns={[
            { key: 'name', label: 'Admin' },
            { key: 'region', label: 'Region' },
            { key: 'volume', label: 'Volume' },
            { key: 'status', label: 'Status', render: (v) => <StatusPill status={String(v)} /> },
          ]}
          rows={adminRows}
          viewAllHref="/super-admin/admins"
        />
        <MiniTable<TxRow>
          title="Recent Transactions"
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'type', label: 'Service' },
            { key: 'amount', label: 'Amount' },
            { key: 'status', label: 'Status', render: (v) => <StatusPill status={String(v)} /> },
          ]}
          rows={txRows}
          viewAllHref="/super-admin/transactions"
        />
      </div>
    </div>
  )
}