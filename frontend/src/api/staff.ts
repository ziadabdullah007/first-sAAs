// src/api/staff.ts
import apiClient from './axiosClient';
import { getStoredUser } from './auth';

interface StaffCreate {
    first_name: string;
    last_name?: string;
    email: string;
    password: string;
    position: string;
}

interface StaffResponse {
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

class StaffApi {
    private client = apiClient;

    async getStaff() {
        try {
            const response = await this.client.get('/staff');
            return response.data as StaffResponse[];
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Failed to fetch staff');
        }
    }

    async createStaff(data: StaffCreate) {
        try {
            const user = getStoredUser();
            if (!user?.gym_id) {
                throw new Error('Gym context missing');
            }

            const staffData = {
                ...data,
                gym_id: user.gym_id
            };

            const response = await this.client.post('/staff/' + user.gym_id, staffData);
            return response.data as StaffResponse;
        } catch (error: any) {
            if (error.response?.status === 400) {
                throw new Error('Validation failed: ' + (error.response?.data?.detail || ''));
            }
            if (error.response?.status === 403) {
                throw new Error('Permission denied');
            }
            throw new Error(error.message || 'Failed to create staff member');
        }
    }
}

export const staff = new StaffApi();