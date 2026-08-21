// src/api/plans.ts
import apiClient from './axiosClient';

interface PlanCreate {
    name: string;
    description?: string;
    price: number;
    duration_months: number;
    status?: string;
}

interface PlanUpdate {
    name?: string;
    description?: string;
    price?: number;
    duration_months?: number;
    status?: string;
}

interface PlanResponse {
    id: string;
    gym_id: string;
    name: string;
    description?: string;
    price: number;
    duration_months: number;
    status: string;
}

class PlansApi {
    private client = apiClient;

    async getPlans() {
        try {
            const response = await this.client.get('/plans');
            return response.data as PlanResponse[];
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Failed to fetch plans');
        }
    }

    async getPlan(id: string) {
        try {
            const response = await this.client.get(`/plans/${id}`);
            return response.data as PlanResponse;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Plan not found');
            }
            throw new Error('Failed to get plan');
        }
    }

    async createPlan(data: PlanCreate) {
        try {
            const response = await this.client.post('/plans', data);
            return response.data as PlanResponse;
        } catch (error: any) {
            if (error.response?.status === 403) {
                throw new Error('Permission denied');
            }
            throw new Error(error.response?.data?.detail || 'Failed to create plan');
        }
    }

    async updatePlan(id: string, data: PlanUpdate) {
        try {
            const response = await this.client.put(`/plans/${id}`, data);
            return response.data as PlanResponse;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Plan not found');
            }
            if (error.response?.status === 403) {
                throw new Error('Permission denied');
            }
            throw new Error('Failed to update plan');
        }
    }

    async deletePlan(id: string) {
        try {
            await this.client.delete(`/plans/${id}`);
            return { message: 'Plan deleted successfully' };
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Plan not found');
            }
            throw new Error('Failed to delete plan');
        }
    }
}

export const plans = new PlansApi();