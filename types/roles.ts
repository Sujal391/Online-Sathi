export type Role =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'SUB_ADMIN'
  | 'COUNTRY_HEAD'
  | 'STATE_HEAD'
  | 'STATE_PARTNER'
  | 'DISTRICT_PARTNER'
  | 'AGENT'
  | 'USER'

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  SUB_ADMIN: 'Sub Admin',
  COUNTRY_HEAD: 'Country Head',
  STATE_HEAD: 'State Head',
  STATE_PARTNER: 'State Partner',
  DISTRICT_PARTNER: 'District Partner',
  AGENT: 'Agent',
  USER: 'User',
}

export const ROLE_DASHBOARD_PATH: Record<Role, string> = {
  SUPER_ADMIN: '/super-admin',
  ADMIN: '/admin',
  SUB_ADMIN: '/sub-admin',
  COUNTRY_HEAD: '/country-head',
  STATE_HEAD: '/state-head',
  STATE_PARTNER: '/state-partner',
  DISTRICT_PARTNER: '/district-partner',
  AGENT: '/agent',
  USER: '/user',
}