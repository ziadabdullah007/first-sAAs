// src/api/attendance.ts
import apiClient from './axiosClient';

interface CheckInRequest {
    member_id: string;
}

interface CheckOutRequest {
    attendance_id: string;
}

interface AttendanceResponse {
    id: string;
    member_id: string;
    gym_id: string;
    check_in_time: string;
    check_out_time: string | null;
    created_at?: string;
}

class AttendanceApi {
    private client = apiClient;

    async getAttendance() {
        try {
            const response = await this.client.get('/attendance');
            return response.data as AttendanceResponse[];
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Failed to fetch attendance records');
        }
    }

    async checkIn(data: CheckInRequest) {
        try {
            const response = await this.client.post('/attendance/check-in', data);
            return response.data as AttendanceResponse;
        } catch (error: any) {
            if (error.response?.status === 400) {
                throw new Error('Validation failed: ' + (error.response?.data?.detail || ''));
            }
            if (error.response?.status === 404) {
                throw new Error('Member not found');
            }
            throw new Error(error.response?.data?.detail || 'Check-in failed');
        }
    }

    async checkOut(data: CheckOutRequest) {
        try {
            const response = await this.client.post('/attendance/check-out', data);
            return response.data as AttendanceResponse;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Attendance record not found');
            }
            throw new Error(error.response?.data?.detail || 'Check-out failed');
        }
    }

    async getMemberAttendance(memberId: string) {
        try {
            const response = await this.client.get(`/attendance/member/${memberId}`);
            return response.data as AttendanceResponse[];
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Failed to fetch member attendance');
        }
    }
}

export const attendance = new AttendanceApi();
