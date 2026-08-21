// src/types/index.ts
// Shared TypeScript types aligned with backend schemas

export type Role = "super_admin" | "gym_admin" | "staff" | "owner";

export interface AuthUser {
  id: string;
  auth_user_id: string;
  email: string | null;
  role: Role;
  gym_id: string | null;
  first_name?: string | null;
  last_name?: string | null;
}

export interface Gym {
  id: string;
  name: string;
  owner_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface Member {
  id: string;
  gym_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string;
  date_of_birth: string | null;
  gender: string | null;
  height: number | null;
  weight: number | null;
  status: string;
  joined_at: string;
  last_visit_at: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Plan {
  id: string;
  gym_id: string;
  name: string;
  description?: string;
  price: number;
  duration_months: number;
  status: string;
}

export interface Subscription {
  id: string;
  member_id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  amount: number;
  status: string;
  auto_renew?: boolean;
  created_at?: string;
}

export interface Payment {
  id: string;
  subscription_id: string;
  member_id: string;
  amount: number;
  payment_method: string;
  status: string;
  payment_date: string;
  created_at?: string;
}

export interface AttendanceRecord {
  id: string;
  member_id: string;
  gym_id: string;
  check_in_time: string;
  check_out_time: string | null;
  created_at?: string;
}

export interface BodyMeasurement {
  id: string;
  member_id: string;
  measured_at: string;
  weight: number | null;
  body_fat_percentage: number | null;
  bmi: number | null;
  notes: string | null;
}

export interface StaffMember {
  id: string;
  gym_id: string;
  user_profile_id: string;
  email: string;
  first_name: string;
  last_name: string | null;
  position: string;
  status: string;
  created_at: string;
}

export interface DashboardStats {
  gym_id: string;
  total_members: number;
  total_plans: number;
  active_subscriptions: number;
  total_payments: number;
  monthly_revenue: number;
  members_inside_gym: number;
}

// Helper to get display name from AuthUser
export function getUserDisplayName(user: AuthUser): string {
  if (user.first_name || user.last_name) {
    return [user.first_name, user.last_name].filter(Boolean).join(' ');
  }
  return user.email || 'User';
}

// Helper to get initials from AuthUser
export function getUserInitials(user: AuthUser): string {
  if (user.first_name && user.last_name) {
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  }
  if (user.first_name) {
    return user.first_name.slice(0, 2).toUpperCase();
  }
  if (user.email) {
    return user.email.slice(0, 2).toUpperCase();
  }
  return 'U';
}

// Role display labels
export const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  gym_admin: "Gym Admin",
  staff: "Staff",
  owner: "Owner",
};
