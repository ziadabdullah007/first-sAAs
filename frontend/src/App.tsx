import { useState } from "react";
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
import { type AuthUser } from "./data/fixtures";

function NotFound() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="text-4xl font-bold text-[#e4e2df] mb-2">404</div>
        <div className="text-sm font-medium text-[#111110]">Page not found</div>
        <div className="text-xs text-[#9b9895] mt-1">This page does not exist or you lack permission to view it.</div>
      </div>
    </div>
  );
}

function Unauthorized() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="text-4xl font-bold text-[#e4e2df] mb-2">403</div>
        <div className="text-sm font-medium text-[#111110]">Access Restricted</div>
        <div className="text-xs text-[#9b9895] mt-1">You do not have permission to access this section.</div>
      </div>
    </div>
  );
}

function ProtectedRoute({ user, allowed, children }: { user: AuthUser; allowed: AuthUser["role"][]; children: React.ReactNode }) {
  if (!allowed.includes(user.role)) return <Unauthorized />;
  return <>{children}</>;
}

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);

  const handleLogin = (u: AuthUser) => setUser(u);
  const handleLogout = () => setUser(null);

  if (!user) {
    return (
      <ToastProvider>
        <LoginPage onLogin={handleLogin} />
      </ToastProvider>
    );
  }

  const defaultRoute = user.role === "super_admin" ? "/gyms" : "/dashboard";

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout user={user} onLogout={handleLogout} />}>
            <Route index element={<Navigate to={defaultRoute} replace />} />
            <Route path="/dashboard" element={
              <ProtectedRoute user={user} allowed={["gym_admin", "staff"]}>
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
              <ProtectedRoute user={user} allowed={["gym_admin", "staff"]}>
                <MembersPage />
              </ProtectedRoute>
            } />
            <Route path="/members/:id" element={
              <ProtectedRoute user={user} allowed={["gym_admin", "staff"]}>
                <MemberDetailPage />
              </ProtectedRoute>
            } />

            {/* Operational */}
            <Route path="/attendance" element={
              <ProtectedRoute user={user} allowed={["gym_admin", "staff"]}>
                <AttendancePage />
              </ProtectedRoute>
            } />
            <Route path="/subscriptions" element={
              <ProtectedRoute user={user} allowed={["gym_admin", "staff"]}>
                <SubscriptionsPage />
              </ProtectedRoute>
            } />
            <Route path="/plans" element={
              <ProtectedRoute user={user} allowed={["gym_admin"]}>
                <PlansPage />
              </ProtectedRoute>
            } />
            <Route path="/payments" element={
              <ProtectedRoute user={user} allowed={["gym_admin", "staff"]}>
                <PaymentsPage />
              </ProtectedRoute>
            } />
            <Route path="/measurements" element={
              <ProtectedRoute user={user} allowed={["gym_admin", "staff"]}>
                <MeasurementsPage />
              </ProtectedRoute>
            } />

            {/* Gym */}
            <Route path="/gym-profile" element={
              <ProtectedRoute user={user} allowed={["gym_admin"]}>
                <GymProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/staff" element={
              <ProtectedRoute user={user} allowed={["gym_admin"]}>
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
              <ProtectedRoute user={user} allowed={["gym_admin", "super_admin"]}>
                <SettingsPage />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
