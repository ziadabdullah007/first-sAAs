// src/api/payments.ts
import apiClient from './axiosClient';
import { getStoredUser } from './auth';

interface PaymentCreate {
    subscription_id: string;
    amount: number;
    payment_method: string;
}

interface PaymentUpdate {
    payment_method?: string;
    status?: string;
}

interface PaymentResponse {
    id: string;
    subscription_id: string;
    member_id: string;
    amount: number;
    payment_method: string;
    status: string;
    payment_date: string;
    created_at?: string;
}

class PaymentsApi {
    private client = apiClient;

    async getPayments() {
        try {
            const response = await this.client.get('/payments');
            return response.data as PaymentResponse[];
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Failed to fetch payments');
        }
    }

    async getPayment(id: string) {
        try {
            const response = await this.client.get(`/payments/${id}`);
            return response.data as PaymentResponse;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Payment not found');
            }
            throw new Error('Failed to get payment');
        }
    }

    async createPayment(data: PaymentCreate) {
        try {
            const user = getStoredUser();
            if (!user?.gym_id) {
                throw new Error('Gym context missing');
            }

            const paymentData = {
                ...data,
                gym_id: user.gym_id
            };

            const response = await this.client.post('/payments', paymentData);
            return response.data as PaymentResponse;
        } catch (error: any) {
            if (error.response?.status === 400) {
                throw new Error('Validation failed: ' + (error.response?.data?.detail || ''));
            }
            if (error.response?.status === 403) {
                throw new Error('Permission denied');
            }
            throw new Error(error.message || 'Payment processing failed');
        }
    }

    async updatePayment(id: string, data: PaymentUpdate) {
        try {
            const response = await this.client.put(`/payments/${id}`, data);
            return response.data as PaymentResponse;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Payment not found');
            }
            if (error.response?.status === 403) {
                throw new Error('Permission denied');
            }
            throw new Error('Payment update failed');
        }
    }

    async deletePayment(id: string) {
        try {
            await this.client.delete(`/payments/${id}`);
            return { message: 'Payment deleted successfully' };
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Payment not found');
            }
            throw new Error('Payment deletion failed');
        }
    }
}

export const payments = new PaymentsApi();