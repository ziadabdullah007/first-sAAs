// src/api/members.ts
import apiClient from './axiosClient';
import { getStoredUser } from './auth';

interface MemberCreate {
    gym_id: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone: string;
    date_of_birth?: string;
    gender?: string;
}

interface MemberUpdate {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    date_of_birth?: string;
    gender?: string;
}

interface MemberResponse {
    id: string;
    gym_id: string;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string;
    date_of_birth: string | null;
    gender: string | null;
    status: string;
    joined_at: string;
}

class MembersApi {
    constructor(private client = apiClient) {}

    // GET /members
    async getMembers() {
        try {
            const response = await this.client.get('/members');
            return response.data as MemberResponse[];
        } catch (error: any) {
            if (error.response?.status === 401) {
                // Token handling is centralized in axiosClient
            }
            throw new Error(error.response?.data?.detail || 'Failed to fetch members');
        }
    }

    // GET /members/{member_id}
    async getMember(memberId: string) {
        try {
            const response = await this.client.get(`/members/${memberId}`);
            return response.data as MemberResponse;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Member not found');
            }
            if (error.response?.status === 403) {
                throw new Error('Permission denied');
            }
            throw new Error(error.response?.data?.detail || 'Failed to get member');
        }
    }

    // POST /members
    async createMember(data: MemberCreate) {
        try {
            const user = getStoredUser();
            if (!user?.gym_id) {
                throw new Error('User gym context not found');
            }
            
            // Add gym_id from authenticated user context
            const memberData = {
                ...data,
                gym_id: user.gym_id
            };
            
            const response = await this.client.post('/members', memberData);
            return response.data as MemberResponse;
        } catch (error: any) {
            if (error.response?.status === 400) {
                throw new Error('Validation failed: ' + (error.response?.data?.detail || ''));
            }
            if (error.response?.status === 403) {
                throw new Error('Permission denied');
            }
            throw new Error(error.response?.data?.detail || 'Failed to create member');
        }
    }

    // PUT /members/{member_id}
    async updateMember(memberId: string, data: MemberUpdate) {
        try {
            const response = await this.client.put(`/members/${memberId}`, data);
            return response.data as MemberResponse;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Member not found');
            }
            if (error.response?.status === 403) {
                throw new Error('Permission denied');
            }
            throw new Error(error.response?.data?.detail || 'Failed to update member');
        }
    }

    // DELETE /members/{member_id}
    async deleteMember(memberId: string) {
        try {
            await this.client.delete(`/members/${memberId}`);
            return { message: 'Member deleted successfully' };
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Member not found');
            }
            if (error.response?.status === 403) {
                throw new Error('Permission denied');
            }
            throw new Error(error.response?.data?.detail || 'Failed to delete member');
        }
    }
}

export const members = new MembersApi();