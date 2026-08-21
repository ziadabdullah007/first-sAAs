// src/api/gyms.ts
import apiClient from './axiosClient';

interface GymCreate {
    name: string;
    owner_name: string;
    owner_email: string;
    owner_password: string;
    phone?: string;
    address?: string;
    status?: string;
}

interface GymUpdate {
    name?: string;
    owner_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    status?: string;
}

interface AssignAdminRequest {
    user_profile_id: string;
}

interface GymResponse {
    id: string;
    name: string;
    owner_name: string;
    email: string;
    phone: string | null;
    address: string | null;
    status: string;
    created_at?: string;
}

class GymsApi {
    private client = apiClient;

    async getGyms() {
        try {
            const response = await this.client.get('/gyms');
            return response.data as GymResponse[];
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Failed to fetch gyms');
        }
    }

    async getGym(id: string) {
        try {
            const response = await this.client.get(`/gyms/${id}`);
            return response.data as GymResponse;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Gym not found');
            }
            if (error.response?.status === 403) {
                throw new Error('Permission denied');
            }
            throw new Error('Failed to get gym');
        }
    }

    async createGym(data: GymCreate) {
        try {
            const response = await this.client.post('/gyms', data);
            return response.data as GymResponse;
        } catch (error: any) {
            if (error.response?.status === 400) {
                throw new Error('Validation failed: ' + (error.response?.data?.detail || ''));
            }
            if (error.response?.status === 403) {
                throw new Error('Permission denied');
            }
            throw new Error('Failed to create gym');
        }
    }

    async updateGym(id: string, data: GymUpdate) {
        try {
            const response = await this.client.put(`/gyms/${id}`, data);
            return response.data as GymResponse;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Gym not found');
            }
            if (error.response?.status === 403) {
                throw new Error('Permission denied');
            }
            throw new Error('Failed to update gym');
        }
    }

    async deleteGym(id: string) {
        try {
            await this.client.delete(`/gyms/${id}`);
            return { message: 'Gym deleted successfully' };
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Gym not found');
            }
            if (error.response?.status === 403) {
                throw new Error('Permission denied');
            }
            throw new Error('Failed to delete gym');
        }
    }

    async assignAdmin(id: string, data: AssignAdminRequest) {
        try {
            const response = await this.client.post(`/gyms/${id}/assign-admin`, data);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Gym or user not found');
            }
            if (error.response?.status === 403) {
                throw new Error('Permission denied');
            }
            throw new Error('Failed to assign admin');
        }
    }
}

export const gyms = new GymsApi();