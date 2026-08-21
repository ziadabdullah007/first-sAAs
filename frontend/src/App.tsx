import { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/ui/Toast";
import AppLayout from "./components/layout/AppLayout";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SuperDashboardPage from "./pages/SuperDashboardPage";
import MembersPage from "./pages/members/MembersPage";
import MemberDetailPage from "./pages/members/MemberDetailPage";
import AttendancePage from "./pages/AttendancePage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import PlansPage from "./pages/PlansPage";
import PaymentsPage from "./pages/PaymentsPage";
import StaffPage from "./pages/StaffPage";
import MeasurementsPage from "./pages/MeasurementsPage";
import GymsPage from "./pages/GymsPage";
import GymProfilePage from "./pages/GymProfilePage";
import SettingsPage from "./pages/SettingsPage";
import SaasSubscriptionsPage from "./pages/SaasSubscriptionsPage";
import UsersPage from "./pages/UsersPage";
import { type AuthUser, type Role } from "./types";
import { getStoredUser, getCurrentUser, logout as apiLogout, isAuthenticated } from "./api/auth";

// ─── Auth Context ───────────────────────────────────────────────────────────
interface AuthContextType {
  user: AuthUser;
  setUser: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// ─── Error Pages ────────────────────────────────────────────────────────────
function NotFound() {
  return (
    <div className="flex items-center justify-center h-full animate-fade-in">
      <div className="text-center">
        <div className="text-6xl font-bold text-[#e4e2df] mb-3">404</div>
        <div className="text-sm font-semibold text-[#111110]">Page not found</div>
        <div className="text-xs text-[#9b9895] mt-1.5 max-w-[280px]">
          This page does not exist or you lack permission to view it.
        </div>
      </div>
    </div>
  );
}

function Unauthorized() {
  return (
    <div className="flex items-center justify-center h-full animate-fade-in">
      <div className="text-center">
        <div className="text-6xl font-bold text-[#e4e2df] mb-3">403</div>
        <div className="text-sm font-semibold text-[#111110]">Access Restricted</div>
        <div className="text-xs text-[#9b9895] mt-1.5 max-w-[280px]">
          You do not have permission to access this section.
        </div>
      </div>
    </div>
  );
}

// ─── Route Guard ────────────────────────────────────────────────────────────
function ProtectedRoute({ user, allowed, children }: { user: AuthUser; allowed: Role[]; children: React.ReactNode }) {
  if (!allowed.includes(user.role)) return <Unauthorized />;
  return <>{children}</>;
}

// ─── Loading Screen ─────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#f7f6f5" }}>
      <div className="text-center animate-fade-in">
        <div className="w-10 h-10 bg-[#1d4ed8] rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <path d="M2 8h12M4.5 4.5L2 8l2.5 3.5M11.5 4.5L14 8l-2.5 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="text-sm font-semibold text-[#111110]">GymOS</div>
        <div className="text-xs text-[#9b9895] mt-1">Loading...</div>
      </div>
    </div>
  );
}

// ─── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);

  // On mount, check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        setChecking(false);
        return;
      }

      // Try to get user from localStorage first
      const stored = getStoredUser();
      if (stored) {
        setUser(stored as AuthUser);
      }

      // Validate token with backend
      try {
        const { data, error } = await getCurrentUser();
        if (data) {
          setUser(data as AuthUser);
        } else if (error) {
          // Token invalid — clear and show login
          apiLogout();
          setUser(null);
        }
      } catch {
        // Network error — keep stored user if available
        if (!stored) {
          apiLogout();
          setUser(null);
        }
      }

      setChecking(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (u: AuthUser) => {
    setUser(u);
  };

  const handleLogout = () => {
    apiLogout();
    setUser(null);
  };

  if (checking) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <ToastProvider>
        <LoginPage onLogin={handleLogin} />
      </ToastProvider>
    );
  }

  const defaultRoute = user.role === "super_admin" ? "/gyms" : "/dashboard";

  return (
    <AuthContext.Provider value={{ user, setUser, logout: handleLogout }}>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout user={user} onLogout={handleLogout} />}>
              <Route index element={<Navigate to={defaultRoute} replace />} />
              <Route path="/dashboard" element={
                <ProtectedRoute user={user} allowed={["gym_admin", "staff", "owner"]}>
                  <DashboardPage user={user} />
                </ProtectedRoute>
              } />
              <Route path="/super-dashboard" element={
                <ProtectedRoute user={user} allowed={["super_admin"]}>
                  <SuperDashboardPage />
                </ProtectedRoute>
              } />

              {/* Member management */}
              <Route path="/members" element={
                <ProtectedRoute user={user} allowed={["gym_admin", "staff", "owner"]}>
                  <MembersPage />
                </ProtectedRoute>
              } />
              <Route path="/members/:id" element={
                <ProtectedRoute user={user} allowed={["gym_admin", "staff", "owner"]}>
                  <MemberDetailPage />
                </ProtectedRoute>
              } />

              {/* Operational */}
              <Route path="/attendance" element={
                <ProtectedRoute user={user} allowed={["gym_admin", "staff", "owner"]}>
                  <AttendancePage />
                </ProtectedRoute>
              } />
              <Route path="/subscriptions" element={
                <ProtectedRoute user={user} allowed={["gym_admin", "staff", "owner"]}>
                  <SubscriptionsPage />
                </ProtectedRoute>
              } />
              <Route path="/plans" element={
                <ProtectedRoute user={user} allowed={["gym_admin", "owner"]}>
                  <PlansPage />
                </ProtectedRoute>
              } />
              <Route path="/payments" element={
                <ProtectedRoute user={user} allowed={["gym_admin", "staff", "owner"]}>
                  <PaymentsPage />
                </ProtectedRoute>
              } />
              <Route path="/measurements" element={
                <ProtectedRoute user={user} allowed={["gym_admin", "staff", "owner"]}>
                  <MeasurementsPage />
                </ProtectedRoute>
              } />

              {/* Gym */}
              <Route path="/gym-profile" element={
                <ProtectedRoute user={user} allowed={["gym_admin", "owner"]}>
                  <GymProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/staff" element={
                <ProtectedRoute user={user} allowed={["gym_admin", "owner"]}>
                  <StaffPage />
                </ProtectedRoute>
              } />

              {/* Super admin */}
              <Route path="/gyms" element={
                <ProtectedRoute user={user} allowed={["super_admin"]}>
                  <GymsPage />
                </ProtectedRoute>
              } />
              <Route path="/users" element={
                <ProtectedRoute user={user} allowed={["super_admin"]}>
                  <UsersPage />
                </ProtectedRoute>
              } />
              <Route path="/saas-subscriptions" element={
                <ProtectedRoute user={user} allowed={["super_admin"]}>
                  <SaasSubscriptionsPage />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute user={user} allowed={["gym_admin", "super_admin", "owner"]}>
                  <SettingsPage />
                </ProtectedRoute>
              } />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthContext.Provider>
  );
}
