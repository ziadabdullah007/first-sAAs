// src/api/subscriptions.ts
import apiClient from './axiosClient';

interface SubscriptionCreate {
    member_id: string;
    plan_id: string;
    start_date: string;
    end_date: string;
    amount: number;
    auto_renew?: boolean;
}

interface SubscriptionUpdate {
    status?: string;
    auto_renew?: boolean;
}

interface SubscriptionResponse {
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

class SubscriptionsApi {
    private client = apiClient;

    async getSubscriptions() {
        try {
            const response = await this.client.get('/subscriptions');
            return response.data as SubscriptionResponse[];
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Failed to fetch subscriptions');
        }
    }

    async getSubscription(id: string) {
        try {
            const response = await this.client.get(`/subscriptions/${id}`);
            return response.data as SubscriptionResponse;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Subscription not found');
            }
            throw new Error('Failed to get subscription');
        }
    }

    async createSubscription(data: SubscriptionCreate) {
        try {
            const response = await this.client.post('/subscriptions', data);
            return response.data as SubscriptionResponse;
        } catch (error: any) {
            if (error.response?.status === 400) {
                throw new Error('Validation failed: ' + (error.response?.data?.detail || ''));
            }
            if (error.response?.status === 403) {
                throw new Error('Permission denied');
            }
            throw new Error('Failed to create subscription');
        }
    }

    async updateSubscription(id: string, data: SubscriptionUpdate) {
        try {
            const response = await this.client.put(`/subscriptions/${id}`, data);
            return response.data as SubscriptionResponse;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Subscription not found');
            }
            if (error.response?.status === 403) {
                throw new Error('Permission denied');
            }
            throw new Error('Failed to update subscription');
        }
    }

    async cancelSubscription(id: string) {
        try {
            await this.client.delete(`/subscriptions/${id}`);
            return { message: 'Subscription cancelled successfully' };
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Subscription not found');
            }
            throw new Error('Failed to cancel subscription');
        }
    }
}

export const subscriptions = new SubscriptionsApi();