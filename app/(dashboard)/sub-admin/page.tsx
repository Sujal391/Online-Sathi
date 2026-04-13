'use client'

import { motion } from 'framer-motion'
import {
    Globe, TrendingUp, CreditCard, Users,
    FileText, Target, ArrowUpRight, CheckCircle,
} from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { ActivityFeed, FeedItem } from '@/components/shared/ActivityFeed'
import { QuickActions, QuickAction } from '@/components/shared/QuickActions'
import { MiniTable, StatusPill } from '@/components/shared/MiniTable'
import { PageHeader } from '@/components/shared/PageHeader'

const stats = [
    { label: 'My Managed Volume', value: '₹31 L', delta: '+9.2% this month', trend: 'up' as const, icon: <TrendingUp size={18} />, accent: '#185FA5' },
    { label: 'Country Heads', value: '6', delta: 'All active', trend: 'up' as const, icon: <Globe size={18} />, accent: '#0F6E56' },
    { label: 'Commission Earned', value: '₹88 K', delta: '+₹11K from last month', trend: 'up' as const, icon: <CreditCard size={18} />, accent: '#854F0B' },
    { label: 'Total Agents Under Me', value: '480', delta: '+34 this month', trend: 'up' as const, icon: <Users size={18} />, accent: '#533AB7' },
    { label: 'Target Achievement', value: '78%', delta: '₹31L of ₹40L', trend: 'neutral' as const, icon: <Target size={18} />, accent: '#854F0B' },
    { label: 'Pending Tasks', value: '5', delta: 'Needs attention', trend: 'down' as const, icon: <CheckCircle size={18} />, accent: '#A32D2D' },
]

const quickActions: QuickAction[] = [
    { label: 'Add Country Head', description: 'Expand to new region', icon: <Globe size={16} />, href: '/sub-admin/country-heads/new', accent: '#185FA5' },
    { label: 'Commission Report', description: 'View earnings breakdown', icon: <TrendingUp size={16} />, href: '/sub-admin/commissions', accent: '#854F0B' },
    { label: 'All Transactions', description: 'Regional payment log', icon: <CreditCard size={16} />, href: '/sub-admin/transactions', accent: '#0F6E56' },
    { label: 'Monthly Review', description: 'Target vs achievement', icon: <Target size={16} />, href: '/sub-admin/reports', accent: '#533AB7' },
    { label: 'Export Data', description: 'Download CSV/PDF', icon: <FileText size={16} />, href: '/sub-admin/reports', accent: '#3B6D11' },
]

const feed: FeedItem[] = [
    { id: '1', text: 'Arjun Mehta (Nepal) hit 80% of monthly target — ₹6.4L', time: '1 hr ago', type: 'success' },
    { id: '2', text: 'Commission calculated for November cycle — ₹88K total', time: '3 hr ago', type: 'info' },
    { id: '3', text: 'New country head application received from Bhutan ops', time: '6 hr ago', type: 'info' },
    { id: '4', text: 'Sri Lanka region 22% below target — review recommended', time: 'Yesterday', type: 'warning' },
]

type CountryHeadRow = { name: string; country: string; target: string; achieved: string; status: string }
const chRows: CountryHeadRow[] = [
    { name: 'Arjun Mehta', country: 'Nepal', target: '₹8 L', achieved: '₹6.4 L', status: 'Active' },
    { name: 'Sita Thapa', country: 'Bhutan', target: '₹5 L', achieved: '₹5.1 L', status: 'Active' },
    { name: 'Raj Tamang', country: 'Sri Lanka', target: '₹6 L', achieved: '₹4.8 L', status: 'Review' },
    { name: 'Pradeep Lama', country: 'Myanmar', target: '₹4 L', achieved: '₹2.9 L', status: 'Pending' },
]

export default function SubAdminDashboard() {
    const today = new Date().toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })

    const targetPct = 78

    return (
    <div className="space-y-6">
            <PageHeader
                title="Sub Admin Dashboard"
                subtitle={today}
                badge="Sub Admin"
                badgeColor="#854F0B"
            >
                <motion.a
                    href="/sub-admin/reports"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-1.5 rounded-xl bg-zinc-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 shadow-lg shadow-zinc-200 dark:shadow-none transition-all"
                >
                    View Reports <ArrowUpRight size={14} />
                </motion.a>
            </PageHeader>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
                {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.06} />)}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <QuickActions actions={quickActions} />

                {/* monthly target card */}
                <div className="rounded-2xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 p-5 backdrop-blur-sm">
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                        Monthly Target
                    </h3>
                    <div className="space-y-5">
                        <div>
                            <div className="mb-2 flex justify-between text-sm">
                                <span className="text-zinc-600 dark:text-zinc-400">Volume Target</span>
                                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{targetPct}%</span>
                            </div>
                            <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${targetPct}%` }}
                                    transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                                    className="h-full rounded-full bg-amber-500"
                                />
                            </div>
                            <div className="mt-1.5 flex justify-between text-xs text-zinc-400 dark:text-zinc-500">
                                <span>₹31 L achieved</span>
                                <span>₹40 L target</span>
                            </div>
                        </div>

                        {[
                            { label: 'Nepal', pct: 80, color: '#185FA5' },
                            { label: 'Bhutan', pct: 102, color: '#0F6E56' },
                            { label: 'Sri Lanka', pct: 60, color: '#854F0B' },
                            { label: 'Myanmar', pct: 42, color: '#A32D2D' },
                        ].map((r, i) => (
                            <motion.div
                                key={r.label}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.07 + 0.5 }}
                                className="space-y-1"
                            >
                                <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                                    <span>{r.label}</span>
                                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{Math.min(r.pct, 100)}%</span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(r.pct, 100)}%` }}
                                        transition={{ delay: i * 0.07 + 0.6, duration: 0.5 }}
                                        className="h-full rounded-full"
                                        style={{ background: r.color }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <ActivityFeed items={feed} />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <MiniTable<CountryHeadRow>
                    title="Country Head Summary"
                    columns={[
                        { key: 'name', label: 'Country Head' },
                        { key: 'country', label: 'Country' },
                        { key: 'target', label: 'Target' },
                        { key: 'achieved', label: 'Achieved' },
                        { key: 'status', label: 'Status', render: (v) => <StatusPill status={String(v)} /> },
                    ]}
                    rows={chRows}
                    viewAllHref="/sub-admin/country-heads"
                />

                {/* commission breakdown */}
                <div className="rounded-2xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 p-5 backdrop-blur-sm">
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                        Commission Breakdown
                    </h3>
                    <div className="space-y-3">
                        {[
                            { label: 'Gross Commission Earned', value: '₹88,000', color: '#185FA5' },
                            { label: 'Passed to Country Heads', value: '₹52,000', color: '#0F6E56' },
                            { label: 'Platform Deduction (5%)', value: '₹4,400', color: '#854F0B' },
                            { label: 'Net Commission (Mine)', value: '₹31,600', color: '#533AB7' },
                        ].map((item, i) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 + 0.3 }}
                                className="flex items-center justify-between rounded-xl px-4 py-3"
                                style={{ background: `${item.color}08` }}
                            >
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">{item.label}</span>
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