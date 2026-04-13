'use client'

import { motion } from 'framer-motion'
import {
    Smartphone, Zap, Send, FileText,
    Wallet, Users, TrendingUp, CreditCard, ArrowUpRight,
} from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { ActivityFeed, FeedItem } from '@/components/shared/ActivityFeed'
import { QuickActions, QuickAction } from '@/components/shared/QuickActions'
import { MiniTable, StatusPill } from '@/components/shared/MiniTable'
import { PageHeader } from '@/components/shared/PageHeader'

const stats = [
    { label: "Today's Revenue", value: '₹4,820', delta: '+₹680 vs yesterday', trend: 'up' as const, icon: <TrendingUp size={18} />, accent: '#185FA5' },
    { label: "Today's Transactions", value: '34', delta: '6 pending', trend: 'up' as const, icon: <CreditCard size={18} />, accent: '#0F6E56' },
    { label: 'Wallet Balance', value: '₹12,400', delta: 'Top up when low', trend: 'neutral' as const, icon: <Wallet size={18} />, accent: '#854F0B' },
    { label: 'Total Customers', value: '180', delta: '+8 this week', trend: 'up' as const, icon: <Users size={18} />, accent: '#533AB7' },
    { label: 'Commission (MTD)', value: '₹6,400', delta: 'Credited today 9AM', trend: 'up' as const, icon: <TrendingUp size={18} />, accent: '#0F6E56' },
    { label: 'Success Rate', value: '97.1%', delta: '+0.8% this week', trend: 'up' as const, icon: <CreditCard size={18} />, accent: '#185FA5' },
]

const quickActions: QuickAction[] = [
    { label: 'Mobile Recharge', description: 'NTC, Ncell, Smart', icon: <Smartphone size={16} />, href: '/agent/services/recharge', accent: '#185FA5' },
    { label: 'Utility Payment', description: 'NEA, KUKL, Internet', icon: <Zap size={16} />, href: '/agent/services/utility', accent: '#0F6E56' },
    { label: 'Remittance', description: 'Send money fast', icon: <Send size={16} />, href: '/agent/services/remittance', accent: '#854F0B' },
    { label: 'EMI Apply', description: 'Apply for EMI loan', icon: <FileText size={16} />, href: '/agent/services/emi', accent: '#533AB7' },
    { label: 'My Wallet', description: 'Balance & top-up', icon: <Wallet size={16} />, href: '/agent/wallet', accent: '#3B6D11' },
    { label: 'My Customers', description: 'Customer records', icon: <Users size={16} />, href: '/agent/customers', accent: '#993556' },
]

const feed: FeedItem[] = [
    { id: '1', text: 'NEA electricity bill paid for Sunita BK — ₹1,200', time: '10 min ago', type: 'success' },
    { id: '2', text: 'NTC recharge successful — ₹500 for Ramesh KC', time: '25 min ago', type: 'success' },
    { id: '3', text: 'Wallet balance low — top up to continue services', time: '1 hr ago', type: 'warning' },
    { id: '4', text: 'Monthly commission ₹6,400 credited to your wallet', time: 'Today 9 AM', type: 'success' },
    { id: '5', text: 'Remittance request pending for Anita Thapa — ₹5,000', time: 'Yesterday', type: 'warning' },
]

type TxRow = { customer: string; service: string; amount: string; time: string; status: string }
const txRows: TxRow[] = [
    { customer: 'Ramesh KC', service: 'NTC Recharge', amount: '₹500', time: '11:24 AM', status: 'Done' },
    { customer: 'Sunita BK', service: 'NEA Bill', amount: '₹1,200', time: '11:05 AM', status: 'Done' },
    { customer: 'Bikash Rai', service: 'Ncell Recharge', amount: '₹300', time: '10:42 AM', status: 'Done' },
    { customer: 'Anita Thapa', service: 'Water Bill', amount: '₹450', time: '10:20 AM', status: 'Pending' },
    { customer: 'Dev Lama', service: 'Remittance', amount: '₹5,000', time: '9:55 AM', status: 'Review' },
]

const serviceMix = [
    { label: 'Mobile Recharge', pct: 88, color: '#185FA5' },
    { label: 'Utility Bills', pct: 74, color: '#0F6E56' },
    { label: 'Remittance', pct: 40, color: '#854F0B' },
    { label: 'EMI Apply', pct: 22, color: '#533AB7' },
]

export default function AgentDashboard() {
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    const dateStr = now.toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long',
    })

    return (
        <div className="space-y-6">
            <PageHeader
                title={`Good morning! 👋`}
                subtitle={`${dateStr} · ${timeStr} · Ready to serve customers`}
                badge="Agent"
                badgeColor="#0F6E56"
            >
                <motion.a
                    href="/agent/services"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-1.5 rounded-xl bg-zinc-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 shadow-lg shadow-zinc-200 dark:shadow-none transition-all"
                >
                    New Transaction <ArrowUpRight size={14} />
                </motion.a>
            </PageHeader>

            {/* wallet highlight banner */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex items-center justify-between rounded-2xl bg-neutral-900 px-6 py-4 text-white"
            >
                <div>
                    <p className="text-xs text-neutral-400 mb-0.5">Wallet Balance</p>
                    <p className="text-3xl font-semibold">₹12,400</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-neutral-400 mb-0.5">Commission this month</p>
                    <p className="text-xl font-semibold text-emerald-400">₹6,400</p>
                </div>
                <motion.a
                    href="/agent/wallet"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-xl bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 text-sm font-medium"
                >
                    Top Up →
                </motion.a>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
                {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.06} />)}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <QuickActions actions={quickActions} />

                <div className="rounded-2xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 p-5 backdrop-blur-sm">
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                        Service Mix Today
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
                <MiniTable<TxRow>
                    title="Today's Transactions"
                    columns={[
                        { key: 'customer', label: 'Customer' },
                        { key: 'service', label: 'Service' },
                        { key: 'amount', label: 'Amount' },
                        { key: 'time', label: 'Time' },
                        { key: 'status', label: 'Status', render: (v) => <StatusPill status={String(v)} /> },
                    ]}
                    rows={txRows}
                    viewAllHref="/agent/transactions"
                />

                {/* earning tracker */}
                <div className="rounded-2xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 p-5 backdrop-blur-sm">
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                        Today's Earnings Tracker
                    </h3>
                    <div className="space-y-4">
                        {[
                            { service: 'Mobile Recharge', count: 14, earn: '₹280', color: '#185FA5' },
                            { service: 'Utility Bills', count: 12, earn: '₹360', color: '#0F6E56' },
                            { service: 'Remittance', count: 6, earn: '₹180', color: '#854F0B' },
                            { service: 'EMI Apply', count: 2, earn: '₹400', color: '#533AB7' },
                        ].map((item, i) => (
                            <motion.div
                                key={item.service}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 + 0.3 }}
                                className="flex items-center justify-between rounded-xl px-4 py-3 border border-zinc-50 dark:border-white/5"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="h-2 w-2 rounded-full flex-shrink-0"
                                        style={{ background: item.color }}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{item.service}</p>
                                        <p className="text-xs text-zinc-400 dark:text-zinc-500">{item.count} transactions</p>
                                    </div>
                                </div>
                                <span className="text-sm font-semibold" style={{ color: item.color }}>
                                    {item.earn}
                                </span>
                            </motion.div>
                        ))}
                        <div className="flex items-center justify-between rounded-xl bg-zinc-900 dark:bg-white px-4 py-3">
                            <span className="text-sm font-medium text-zinc-300 dark:text-zinc-700">Total Earned Today</span>
                            <span className="text-sm font-bold text-white dark:text-zinc-900">₹1,220</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}