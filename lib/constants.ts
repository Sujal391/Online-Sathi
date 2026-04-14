export const ROLE_ROUTES: Record<string, string> = {
  SUPER_ADMIN: "/super-admin",
  ADMIN: "/admin",
  SUB_ADMIN: "/sub-admin",
  COUNTRY_HEAD: "/country-head",
  STATE_HEAD: "/state-head",
  STATE_PARTNER: "/state-partner",
  DISTRICT_PARTNER: "/district-partner",
  AGENT: "/agent",
  USER: "/user",
};

export interface SidebarItem {
  title: string;
  href: string;
  icon: string; // Lucide icon name
  activeMatcher?: string; // Regex or prefix to match for active state
}

export const SIDEBAR_ITEMS: Record<string, SidebarItem[]> = {
  SUPER_ADMIN: [
    { title: "Dashboard", href: "/super-admin", icon: "LayoutDashboard" },
    // { title: "Trustees", href: "/super-admin/trustees", icon: "Users" },
    // { title: "System Settings", href: "/super-admin/settings", icon: "Settings" },
    // { title: "User Logs", href: "/super-admin/logs", icon: "History" },
  ],
  ADMIN: [
    { title: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
    // { title: "Staff Management", href: "/admin/staff", icon: "UserCog" },
    // { title: "Department", href: "/admin/departments", icon: "Building2" },
    { title: "Jobs", href: "/admin/jobs", icon: "Briefcase" },
    // { title: "Reports", href: "/admin/reports", icon: "BarChart3" },
  ],
  SUB_ADMIN: [
    { title: "Dashboard", href: "/sub-admin", icon: "LayoutDashboard" },
    // { title: "User Support", href: "/sub-admin/support", icon: "LifeBuoy" },
    // { title: "Verification", href: "/sub-admin/verification", icon: "CheckCircle2" },
  ],
  COUNTRY_HEAD: [
    { title: "Dashboard", href: "/country-head", icon: "LayoutDashboard" },
    // { title: "Regions", href: "/country-head/regions", icon: "Globe" },
    // { title: "Partner Network", href: "/country-head/partners", icon: "Network" },
    // { title: "National Stats", href: "/country-head/stats", icon: "TrendingUp" },
  ],
  STATE_HEAD: [
    { title: "Dashboard", href: "/state-head", icon: "LayoutDashboard" },
    // { title: "State Partners", href: "/state-head/partners", icon: "Handshake" },
    // { title: "Target Analysis", href: "/state-head/targets", icon: "Target" },
  ],
  STATE_PARTNER: [
    { title: "Dashboard", href: "/state-partner", icon: "LayoutDashboard" },
    // { title: "District Partners", href: "/state-partner/districts", icon: "Map" },
    // { title: "Revenue", href: "/state-partner/revenue", icon: "IndianRupee" },
  ],
  DISTRICT_PARTNER: [
    { title: "Dashboard", href: "/district-partner", icon: "LayoutDashboard" },
    // { title: "Agents", href: "/district-partner/agents", icon: "Users" },
    // { title: "Activity", href: "/district-partner/activity", icon: "Activity" },
  ],
  AGENT: [
    { title: "Dashboard", href: "/agent", icon: "LayoutDashboard" },
    // { title: "New Enrollment", href: "/agent/enroll", icon: "UserPlus" },
    // { title: "Wallet", href: "/agent/wallet", icon: "Wallet" },
    // { title: "Customers", href: "/agent/customers", icon: "Users2" },
  ],
  USER: [
    { title: "Dashboard", href: "/user", icon: "LayoutDashboard" },
    // { title: "Pay Bills", href: "/user/payments", icon: "CreditCard" },
    { title: "Jobs", href: "/user/jobs", icon: "Briefcase" },
    // { title: "Wallet", href: "/user/wallet", icon: "Wallet" },
    // { title: "History", href: "/user/history", icon: "History" },
    { title: "Applications", href: "/user/job-applications", icon: "History" },
    { title: "Profile", href: "/user/profile", icon: "User" },
  ],
};
