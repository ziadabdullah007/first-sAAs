// src/api/dashboard.ts
import apiClient from './axiosClient';

interface DashboardStatsResponse {
    gym_id: string;
    total_members: number;
    total_plans: number;
    active_subscriptions: number;
    total_payments: number;
    monthly_revenue: number;
    members_inside_gym: number;
}

class DashboardApi {
    private client = apiClient;

    async getDashboardStats(gymId: string) {
        try {
            const response = await this.client.get(`/dashboard/stats/${gymId}`);
            return response.data as DashboardStatsResponse;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Dashboard data not found');
            }
            throw new Error(error.response?.data?.detail || 'Failed to fetch dashboard stats');
        }
    }
}

export const dashboard = new DashboardApi();