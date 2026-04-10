'use client'

import { motion } from 'framer-motion'
import {
    Zap, Droplets, Wifi, Smartphone,
    Clock, ArrowUpRight, Gift, CreditCard, History, User,
} from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { ActivityFeed, FeedItem } from '@/components/shared/ActivityFeed'
import { PageHeader } from '@/components/shared/PageHeader'

// ─── bill quick pay services ──────────────────────────────────
const services = [
    { label: 'Electricity', provider: 'NEA Bill', icon: <Zap size={20} />, href: '/user/payments/electricity', accent: '#854F0B', bg: '#FAEEDA' },
    { label: 'Water', provider: 'KUKL / Local', icon: <Droplets size={20} />, href: '/user/payments/water', accent: '#185FA5', bg: '#E6F1FB' },
    { label: 'Internet', provider: 'WorldLink, Vianet…', icon: <Wifi size={20} />, href: '/user/payments/internet', accent: '#533AB7', bg: '#EEEDFE' },
    { label: 'Mobile', provider: 'NTC, Ncell, Smart', icon: <Smartphone size={20} />, href: '/user/payments/mobile', accent: '#0F6E56', bg: '#EAF3DE' },
]

const stats = [
    { label: 'Wallet Balance', value: '₹2,840', delta: 'Available', trend: 'neutral' as const, icon: <CreditCard size={18} />, accent: '#185FA5' },
    { label: 'Paid This Month', value: '₹6,200', delta: '4 bills settled', trend: 'up' as const, icon: <CreditCard size={18} />, accent: '#0F6E56' },
    { label: 'Cashback Earned', value: '₹120', delta: 'This month', trend: 'up' as const, icon: <Gift size={18} />, accent: '#854F0B' },
    { label: 'Upcoming Bills', value: '2', delta: 'Due this week', trend: 'neutral' as const, icon: <Clock size={18} />, accent: '#A32D2D' },
]

const feed: FeedItem[] = [
    { id: '1', text: 'Electricity bill (NEA) paid successfully — ₹1,200', time: '2 days ago', type: 'success' },
    { id: '2', text: 'Cashback ₹24 credited for April payments', time: '3 days ago', type: 'success' },
    { id: '3', text: 'NTC mobile recharge ₹500 — auto-renewed', time: '5 days ago', type: 'info' },
    { id: '4', text: 'Water bill due in 3 days — ₹350 (KUKL)', time: '6 days ago', type: 'warning' },
    { id: '5', text: 'WorldLink internet bill ₹1,500 paid', time: '12 days ago', type: 'success' },
]

type BillRow = { service: string; amount: string; date: string; method: string; status: string }
const historyRows: BillRow[] = [
    { service: 'NEA Electricity', amount: '₹1,200', date: 'Apr 08, 2026', method: 'Wallet', status: 'Paid' },
    { service: 'NTC Mobile', amount: '₹500', date: 'Apr 05, 2026', method: 'Wallet', status: 'Paid' },
    { service: 'Water (KUKL)', amount: '₹350', date: 'Apr 03, 2026', method: 'Wallet', status: 'Paid' },
    { service: 'WorldLink Internet', amount: '₹1,500', date: 'Mar 28, 2026', method: 'Wallet', status: 'Paid' },
    { service: 'Ncell Recharge', amount: '₹200', date: 'Mar 24, 2026', method: 'Wallet', status: 'Paid' },
]

// upcoming bills
const upcoming = [
    { service: 'Water Bill (KUKL)', due: '3 days', amount: '₹350', accent: '#185FA5' },
    { service: 'NEA Electricity', due: '12 days', amount: '~₹1,100', accent: '#854F0B' },
]

export default function UserDashboard() {
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

    return (
        <div className="min-h-screen bg-neutral-50 p-6 space-y-6">
            <PageHeader
                title={`${greeting}! 👋`}
                subtitle="Pay bills, top-up mobile and track your payments"
                badge="User"
                badgeColor="#533AB7"
            >
                <motion.a
                    href="/user/history"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700"
                >
                    <History size={14} /> History
                </motion.a>
                <motion.a
                    href="/user/profile"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
                >
                    <User size={14} /> Profile
                </motion.a>
            </PageHeader>

            {/* wallet card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="relative overflow-hidden rounded-2xl bg-neutral-900 px-6 py-5 text-white"
            >
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs text-neutral-400 mb-1">Saathi Wallet Balance</p>
                        <p className="text-4xl font-semibold">₹2,840</p>
                        <p className="mt-1 text-xs text-neutral-400">Last updated: just now</p>
                    </div>
                    <div className="text-right">
                        <div className="mb-3">
                            <p className="text-xs text-neutral-400">Cashback this month</p>
                            <p className="text-lg font-medium text-emerald-400">₹120</p>
                        </div>
                        <motion.a
                            href="/user/wallet"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-block rounded-xl bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 text-sm font-medium"
                        >
                            Add Money →
                        </motion.a>
                    </div>
                </div>
            </motion.div>

            {/* stat row */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.08} />)}
            </div>

            {/* pay bills — main CTA */}
            <div>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                    Pay Bills
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {services.map((svc, i) => (
                        <motion.a
                            key={svc.label}
                            href={svc.href}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.07 + 0.2 }}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-100 bg-white py-6 px-4 text-center shadow-sm shadow-neutral-100 transition-shadow hover:shadow-md"
                        >
                            <div
                                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                                style={{ background: svc.bg, color: svc.accent }}
                            >
                                {svc.icon}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-neutral-800">{svc.label}</p>
                                <p className="text-xs text-neutral-400">{svc.provider}</p>
                            </div>
                            <span
                                className="flex items-center gap-1 text-xs font-medium"
                                style={{ color: svc.accent }}
                            >
                                Pay Now <ArrowUpRight size={11} />
                            </span>
                        </motion.a>
                    ))}
                </div>
            </div>

            {/* upcoming bills */}
            {upcoming.length > 0 && (
                <div>
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                        Upcoming Bills
                    </h2>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {upcoming.map((bill, i) => (
                            <motion.div
                                key={bill.service}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 + 0.3 }}
                                className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-white px-5 py-4"
                            >
                                <div>
                                    <p className="text-sm font-medium text-neutral-800">{bill.service}</p>
                                    <p className="text-xs text-neutral-400">Due in {bill.due}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-neutral-900">{bill.amount}</span>
                                    <motion.a
                                        href="/user/payments"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="rounded-xl px-3 py-1.5 text-xs font-medium text-white"
                                        style={{ background: bill.accent }}
                                    >
                                        Pay
                                    </motion.a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* history & activity */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* payment history table */}
                <div className="rounded-2xl border border-neutral-100 bg-white p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                            Payment History
                        </h3>
                        <a href="/user/history" className="text-xs font-medium text-blue-600 hover:text-blue-700">
                            View all →
                        </a>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-neutral-50">
                                {['Service', 'Amount', 'Date', 'Status'].map((h) => (
                                    <th key={h} className="pb-2 text-left text-xs font-medium text-neutral-400">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {historyRows.map((row, i) => (
                                <motion.tr
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 + 0.3 }}
                                    className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors"
                                >
                                    <td className="py-2.5 text-sm text-neutral-700">{row.service}</td>
                                    <td className="py-2.5 text-sm font-medium text-neutral-900">{row.amount}</td>
                                    <td className="py-2.5 text-xs text-neutral-400">{row.date}</td>
                                    <td className="py-2.5">
                                        <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                                            {row.status}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <ActivityFeed items={feed} title="Account Activity" />
            </div>
        </div>
    )
}