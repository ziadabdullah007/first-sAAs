export type Role = "super_admin" | "gym_admin" | "staff";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  gym?: string;
  avatarInitials: string;
}

export const DEMO_USERS: AuthUser[] = [
  {
    id: "u1",
    name: "Karim Mansour",
    email: "karim@elitefit.eg",
    role: "gym_admin",
    gym: "Elite Fitness Center",
    avatarInitials: "KM",
  },
  {
    id: "u2",
    name: "Nadia Ibrahim",
    email: "nadia@system.eg",
    role: "super_admin",
    avatarInitials: "NI",
  },
  {
    id: "u3",
    name: "Youssef Salem",
    email: "youssef@elitefit.eg",
    role: "staff",
    gym: "Elite Fitness Center",
    avatarInitials: "YS",
  },
];

export interface Gym {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  status: "active" | "suspended" | "trial";
  memberCount: number;
  createdAt: string;
  subscription: string;
  adminName: string;
}

export const GYMS: Gym[] = [
  { id: "g1", name: "Elite Fitness Center", owner: "Karim Mansour", email: "info@elitefit.eg", phone: "+20 100 234 5678", address: "24 Corniche El-Nil", city: "Cairo", status: "active", memberCount: 312, createdAt: "2023-03-15", subscription: "Professional", adminName: "Karim Mansour" },
  { id: "g2", name: "Fitness Club Cairo", owner: "Dina Shafik", email: "admin@fitnessclub.eg", phone: "+20 112 345 6789", address: "17 Tahrir Square", city: "Cairo", status: "active", memberCount: 218, createdAt: "2023-07-02", subscription: "Starter", adminName: "Dina Shafik" },
  { id: "g3", name: "Iron Temple Gym", owner: "Tamer El-Badry", email: "tamer@irontemple.eg", phone: "+20 101 456 7890", address: "9 El-Horeya St", city: "Alexandria", status: "active", memberCount: 187, createdAt: "2024-01-18", subscription: "Professional", adminName: "Tamer El-Badry" },
  { id: "g4", name: "Pharaoh Power Club", owner: "Sara Khalil", email: "sara@pharaohpower.eg", phone: "+20 115 567 8901", address: "55 Stadium Rd", city: "Giza", status: "trial", memberCount: 34, createdAt: "2024-11-01", subscription: "Trial", adminName: "Sara Khalil" },
  { id: "g5", name: "Zone Fitness Studio", owner: "Mohamed Rashad", email: "m.rashad@zonefitness.eg", phone: "+20 102 678 9012", address: "3 Al-Azhar Ave", city: "Cairo", status: "suspended", memberCount: 0, createdAt: "2023-09-10", subscription: "Suspended", adminName: "Mohamed Rashad" },
  { id: "g6", name: "Maximus Sports Club", owner: "Hana Mostafa", email: "hana@maximus.eg", phone: "+20 111 789 0123", address: "12 Victory Blvd", city: "Mansoura", status: "active", memberCount: 145, createdAt: "2023-12-05", subscription: "Starter", adminName: "Hana Mostafa" },
];

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  status: "active" | "inactive";
}

export const PLANS: Plan[] = [
  { id: "p1", name: "Monthly", description: "Full access, 30-day pass", price: 450, durationDays: 30, status: "active" },
  { id: "p2", name: "Quarterly", description: "3-month package, 5% discount", price: 1280, durationDays: 90, status: "active" },
  { id: "p3", name: "Semi-Annual", description: "6-month package, 10% discount", price: 2400, durationDays: 180, status: "active" },
  { id: "p4", name: "Annual", description: "Full year, best value", price: 4200, durationDays: 365, status: "active" },
  { id: "p5", name: "Student Monthly", description: "Student ID required", price: 320, durationDays: 30, status: "active" },
  { id: "p6", name: "Day Pass", description: "Single-day access", price: 60, durationDays: 1, status: "active" },
  { id: "p7", name: "Corporate Plan", description: "For corporate partners", price: 380, durationDays: 30, status: "inactive" },
];

export type MemberStatus = "active" | "expired" | "suspended";

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: "male" | "female";
  height: number;
  weight: number;
  status: MemberStatus;
  joinedAt: string;
  lastVisit: string | null;
  planId: string | null;
  avatarInitials: string;
}

export const MEMBERS: Member[] = [
  { id: "m1", firstName: "Ahmed", lastName: "Hassan", email: "ahmed.hassan@gmail.com", phone: "+20 100 111 2233", dob: "1992-04-15", gender: "male", height: 178, weight: 82, status: "active", joinedAt: "2024-01-10", lastVisit: "2025-08-14", planId: "p2", avatarInitials: "AH" },
  { id: "m2", firstName: "Sarah", lastName: "Mohamed", email: "sarah.m@hotmail.com", phone: "+20 112 222 3344", dob: "1997-09-22", gender: "female", height: 165, weight: 58, status: "active", joinedAt: "2024-03-05", lastVisit: "2025-08-15", planId: "p1", avatarInitials: "SM" },
  { id: "m3", firstName: "Omar", lastName: "Ali", email: "omar.ali@gmail.com", phone: "+20 101 333 4455", dob: "1988-12-01", gender: "male", height: 182, weight: 95, status: "active", joinedAt: "2023-11-20", lastVisit: "2025-08-13", planId: "p3", avatarInitials: "OA" },
  { id: "m4", firstName: "Layla", lastName: "Nasser", email: "layla.n@yahoo.com", phone: "+20 115 444 5566", dob: "2001-06-30", gender: "female", height: 162, weight: 55, status: "expired", joinedAt: "2024-06-01", lastVisit: "2025-07-30", planId: null, avatarInitials: "LN" },
  { id: "m5", firstName: "Mostafa", lastName: "Kamal", email: "mostafa.k@gmail.com", phone: "+20 102 555 6677", dob: "1985-02-14", gender: "male", height: 175, weight: 88, status: "active", joinedAt: "2024-02-18", lastVisit: "2025-08-15", planId: "p4", avatarInitials: "MK" },
  { id: "m6", firstName: "Nour", lastName: "El-Din", email: "nour.eldin@gmail.com", phone: "+20 111 666 7788", dob: "1999-08-05", gender: "female", height: 168, weight: 61, status: "active", joinedAt: "2025-01-03", lastVisit: "2025-08-12", planId: "p1", avatarInitials: "NE" },
  { id: "m7", firstName: "Tarek", lastName: "Samir", email: "tarek.s@outlook.com", phone: "+20 100 777 8899", dob: "1990-11-17", gender: "male", height: 180, weight: 91, status: "suspended", joinedAt: "2023-08-14", lastVisit: "2025-06-01", planId: null, avatarInitials: "TS" },
  { id: "m8", firstName: "Rana", lastName: "Farouk", email: "rana.f@gmail.com", phone: "+20 115 888 9900", dob: "2003-03-25", gender: "female", height: 160, weight: 52, status: "active", joinedAt: "2025-03-10", lastVisit: "2025-08-14", planId: "p5", avatarInitials: "RF" },
  { id: "m9", firstName: "Hassan", lastName: "Ramadan", email: "h.ramadan@gmail.com", phone: "+20 112 990 0011", dob: "1979-07-08", gender: "male", height: 170, weight: 77, status: "expired", joinedAt: "2023-12-01", lastVisit: "2025-07-15", planId: null, avatarInitials: "HR" },
  { id: "m10", firstName: "Dalia", lastName: "Waheed", email: "dalia.w@gmail.com", phone: "+20 101 001 1122", dob: "1994-05-19", gender: "female", height: 166, weight: 63, status: "active", joinedAt: "2024-09-22", lastVisit: "2025-08-15", planId: "p2", avatarInitials: "DW" },
  { id: "m11", firstName: "Khaled", lastName: "Ibrahim", email: "k.ibrahim@gmail.com", phone: "+20 102 112 2233", dob: "1987-01-30", gender: "male", height: 183, weight: 100, status: "active", joinedAt: "2024-04-11", lastVisit: "2025-08-10", planId: "p3", avatarInitials: "KI" },
  { id: "m12", firstName: "Mariam", lastName: "Tawfik", email: "mariam.t@yahoo.com", phone: "+20 111 223 3344", dob: "2000-10-12", gender: "female", height: 164, weight: 57, status: "active", joinedAt: "2025-02-28", lastVisit: "2025-08-13", planId: "p1", avatarInitials: "MT" },
];

export type SubscriptionStatus = "active" | "expired" | "suspended" | "pending";

export interface Subscription {
  id: string;
  memberId: string;
  memberName: string;
  planId: string;
  planName: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: SubscriptionStatus;
  autoRenew: boolean;
}

export const SUBSCRIPTIONS: Subscription[] = [
  { id: "s1", memberId: "m1", memberName: "Ahmed Hassan", planId: "p2", planName: "Quarterly", startDate: "2025-07-01", endDate: "2025-09-29", amount: 1280, status: "active", autoRenew: true },
  { id: "s2", memberId: "m2", memberName: "Sarah Mohamed", planId: "p1", planName: "Monthly", startDate: "2025-08-01", endDate: "2025-08-31", amount: 450, status: "active", autoRenew: false },
  { id: "s3", memberId: "m3", memberName: "Omar Ali", planId: "p3", planName: "Semi-Annual", startDate: "2025-05-01", endDate: "2025-10-29", amount: 2400, status: "active", autoRenew: true },
  { id: "s4", memberId: "m4", memberName: "Layla Nasser", planId: "p1", planName: "Monthly", startDate: "2025-07-01", endDate: "2025-07-31", amount: 450, status: "expired", autoRenew: false },
  { id: "s5", memberId: "m5", memberName: "Mostafa Kamal", planId: "p4", planName: "Annual", startDate: "2025-01-01", endDate: "2025-12-31", amount: 4200, status: "active", autoRenew: true },
  { id: "s6", memberId: "m6", memberName: "Nour El-Din", planId: "p1", planName: "Monthly", startDate: "2025-08-01", endDate: "2025-08-31", amount: 450, status: "active", autoRenew: true },
  { id: "s7", memberId: "m7", memberName: "Tarek Samir", planId: "p2", planName: "Quarterly", startDate: "2025-03-01", endDate: "2025-05-30", amount: 1280, status: "suspended", autoRenew: false },
  { id: "s8", memberId: "m8", memberName: "Rana Farouk", planId: "p5", planName: "Student Monthly", startDate: "2025-08-01", endDate: "2025-08-31", amount: 320, status: "active", autoRenew: true },
  { id: "s9", memberId: "m10", memberName: "Dalia Waheed", planId: "p2", planName: "Quarterly", startDate: "2025-07-15", endDate: "2025-10-13", amount: 1280, status: "active", autoRenew: true },
  { id: "s10", memberId: "m11", memberName: "Khaled Ibrahim", planId: "p3", planName: "Semi-Annual", startDate: "2025-04-01", endDate: "2025-09-28", amount: 2400, status: "active", autoRenew: false },
  { id: "s11", memberId: "m12", memberName: "Mariam Tawfik", planId: "p1", planName: "Monthly", startDate: "2025-08-01", endDate: "2025-08-31", amount: 450, status: "active", autoRenew: false },
  { id: "s12", memberId: "m9", memberName: "Hassan Ramadan", planId: "p1", planName: "Monthly", startDate: "2025-07-01", endDate: "2025-07-31", amount: 450, status: "expired", autoRenew: false },
];

export type PaymentStatus = "paid" | "pending" | "failed";
export type PaymentMethod = "cash" | "card" | "bank_transfer";

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  subscriptionId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
  notes?: string;
}

export const PAYMENTS: Payment[] = [
  { id: "pay1", memberId: "m1", memberName: "Ahmed Hassan", subscriptionId: "s1", amount: 1280, method: "card", status: "paid", date: "2025-07-01" },
  { id: "pay2", memberId: "m2", memberName: "Sarah Mohamed", subscriptionId: "s2", amount: 450, method: "cash", status: "paid", date: "2025-08-01" },
  { id: "pay3", memberId: "m3", memberName: "Omar Ali", subscriptionId: "s3", amount: 2400, method: "bank_transfer", status: "paid", date: "2025-05-01" },
  { id: "pay4", memberId: "m4", memberName: "Layla Nasser", subscriptionId: "s4", amount: 450, method: "cash", status: "paid", date: "2025-07-01" },
  { id: "pay5", memberId: "m5", memberName: "Mostafa Kamal", subscriptionId: "s5", amount: 4200, method: "bank_transfer", status: "paid", date: "2025-01-01" },
  { id: "pay6", memberId: "m6", memberName: "Nour El-Din", subscriptionId: "s6", amount: 450, method: "cash", status: "paid", date: "2025-08-01" },
  { id: "pay7", memberId: "m8", memberName: "Rana Farouk", subscriptionId: "s8", amount: 320, method: "card", status: "paid", date: "2025-08-01" },
  { id: "pay8", memberId: "m9", memberName: "Hassan Ramadan", subscriptionId: "s12", amount: 450, method: "cash", status: "paid", date: "2025-07-01" },
  { id: "pay9", memberId: "m10", memberName: "Dalia Waheed", subscriptionId: "s9", amount: 1280, method: "card", status: "paid", date: "2025-07-15" },
  { id: "pay10", memberId: "m11", memberName: "Khaled Ibrahim", subscriptionId: "s10", amount: 2400, method: "bank_transfer", status: "paid", date: "2025-04-01" },
  { id: "pay11", memberId: "m12", memberName: "Mariam Tawfik", subscriptionId: "s11", amount: 450, method: "cash", status: "pending", date: "2025-08-01" },
  { id: "pay12", memberId: "m7", memberName: "Tarek Samir", subscriptionId: "s7", amount: 1280, method: "card", status: "failed", date: "2025-03-01" },
];

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  checkIn: string;
  checkOut: string | null;
  date: string;
}

export const ATTENDANCE: AttendanceRecord[] = [
  { id: "a1", memberId: "m2", memberName: "Sarah Mohamed", checkIn: "07:12", checkOut: "08:45", date: "2025-08-15" },
  { id: "a2", memberId: "m5", memberName: "Mostafa Kamal", checkIn: "07:30", checkOut: "09:00", date: "2025-08-15" },
  { id: "a3", memberId: "m10", memberName: "Dalia Waheed", checkIn: "09:05", checkOut: "10:30", date: "2025-08-15" },
  { id: "a4", memberId: "m12", memberName: "Mariam Tawfik", checkIn: "10:00", checkOut: "11:15", date: "2025-08-15" },
  { id: "a5", memberId: "m1", memberName: "Ahmed Hassan", checkIn: "11:30", checkOut: null, date: "2025-08-15" },
  { id: "a6", memberId: "m8", memberName: "Rana Farouk", checkIn: "12:00", checkOut: null, date: "2025-08-15" },
  { id: "a7", memberId: "m3", memberName: "Omar Ali", checkIn: "06:45", checkOut: "08:30", date: "2025-08-14" },
  { id: "a8", memberId: "m1", memberName: "Ahmed Hassan", checkIn: "07:00", checkOut: "09:15", date: "2025-08-14" },
  { id: "a9", memberId: "m6", memberName: "Nour El-Din", checkIn: "09:30", checkOut: "11:00", date: "2025-08-14" },
  { id: "a10", memberId: "m2", memberName: "Sarah Mohamed", checkIn: "07:15", checkOut: "08:50", date: "2025-08-13" },
  { id: "a11", memberId: "m11", memberName: "Khaled Ibrahim", checkIn: "06:30", checkOut: "08:10", date: "2025-08-13" },
  { id: "a12", memberId: "m5", memberName: "Mostafa Kamal", checkIn: "18:00", checkOut: "20:00", date: "2025-08-12" },
];

export interface BodyMeasurement {
  id: string;
  memberId: string;
  date: string;
  weight: number;
  bodyFat: number | null;
  bmi: number | null;
  notes?: string;
}

export const BODY_MEASUREMENTS: BodyMeasurement[] = [
  { id: "bm1", memberId: "m1", date: "2025-08-01", weight: 82, bodyFat: 18.2, bmi: 25.9, notes: "Starting new program" },
  { id: "bm2", memberId: "m1", date: "2025-07-01", weight: 84, bodyFat: 19.5, bmi: 26.5 },
  { id: "bm3", memberId: "m1", date: "2025-06-01", weight: 86, bodyFat: 21.0, bmi: 27.1 },
  { id: "bm4", memberId: "m1", date: "2025-05-01", weight: 89, bodyFat: 23.1, bmi: 28.1 },
  { id: "bm5", memberId: "m2", date: "2025-08-01", weight: 58, bodyFat: 22.5, bmi: 21.3 },
  { id: "bm6", memberId: "m2", date: "2025-07-01", weight: 59, bodyFat: 23.0, bmi: 21.7 },
  { id: "bm7", memberId: "m2", date: "2025-06-01", weight: 60, bodyFat: 23.8, bmi: 22.0 },
];

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  gymId: string;
  gymName: string;
  status: "active" | "inactive";
  joinedAt: string;
  avatarInitials: string;
}

export const STAFF: StaffMember[] = [
  { id: "st1", name: "Youssef Salem", email: "y.salem@elitefit.eg", phone: "+20 100 123 4567", position: "Receptionist", gymId: "g1", gymName: "Elite Fitness Center", status: "active", joinedAt: "2024-01-15", avatarInitials: "YS" },
  { id: "st2", name: "Amira Soliman", email: "a.soliman@elitefit.eg", phone: "+20 112 234 5678", position: "Trainer", gymId: "g1", gymName: "Elite Fitness Center", status: "active", joinedAt: "2024-03-01", avatarInitials: "AS" },
  { id: "st3", name: "Sherif Adly", email: "s.adly@elitefit.eg", phone: "+20 101 345 6789", position: "Trainer", gymId: "g1", gymName: "Elite Fitness Center", status: "active", joinedAt: "2023-11-10", avatarInitials: "SA" },
  { id: "st4", name: "Farah Zaki", email: "f.zaki@elitefit.eg", phone: "+20 115 456 7890", position: "Nutritionist", gymId: "g1", gymName: "Elite Fitness Center", status: "inactive", joinedAt: "2023-06-20", avatarInitials: "FZ" },
  { id: "st5", name: "Mona Gamal", email: "m.gamal@fitnessclub.eg", phone: "+20 102 567 8901", position: "Receptionist", gymId: "g2", gymName: "Fitness Club Cairo", status: "active", joinedAt: "2023-08-01", avatarInitials: "MG" },
  { id: "st6", name: "Adel Rashid", email: "a.rashid@irontemple.eg", phone: "+20 111 678 9012", position: "Manager", gymId: "g3", gymName: "Iron Temple Gym", status: "active", joinedAt: "2024-02-28", avatarInitials: "AR" },
];

export const ATTENDANCE_TREND = [
  { day: "Mon", count: 48 },
  { day: "Tue", count: 55 },
  { day: "Wed", count: 62 },
  { day: "Thu", count: 51 },
  { day: "Fri", count: 43 },
  { day: "Sat", count: 79 },
  { day: "Sun", count: 34 },
];

export const REVENUE_TREND = [
  { month: "Mar", revenue: 21400 },
  { month: "Apr", revenue: 18900 },
  { month: "May", revenue: 24100 },
  { month: "Jun", revenue: 22600 },
  { month: "Jul", revenue: 27800 },
  { month: "Aug", revenue: 12450 },
];
