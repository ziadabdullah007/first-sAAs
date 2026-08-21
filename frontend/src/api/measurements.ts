// src/api/measurements.ts
import apiClient from './axiosClient';

interface BodyMeasurementCreate {
    member_id: string;
    weight?: number;
    body_fat_percentage?: number;
    bmi?: number;
    notes?: string;
}

interface BodyMeasurementUpdate {
    weight?: number;
    body_fat_percentage?: number;
    bmi?: number;
    notes?: string;
}

interface BodyMeasurementResponse {
    id: string;
    member_id: string;
    measured_at: string;
    weight: number | null;
    body_fat_percentage: number | null;
    bmi: number | null;
    notes: string | null;
}

class MeasurementsApi {
    private client = apiClient;

    async getMeasurements() {
        try {
            const response = await this.client.get('/body-measurements');
            return response.data as BodyMeasurementResponse[];
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Failed to fetch measurements');
        }
    }

    async getMemberMeasurements(memberId: string) {
        try {
            const response = await this.client.get(`/body-measurements/member/${memberId}`);
            return response.data as BodyMeasurementResponse[];
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Failed to fetch member measurements');
        }
    }

    async getMeasurement(id: string) {
        try {
            const response = await this.client.get('/body-measurements/' + id);
            return response.data as BodyMeasurementResponse;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Measurement not found');
            }
            throw new Error('Failed to fetch measurement');
        }
    }

    async createMeasurement(data: BodyMeasurementCreate) {
        try {
            const response = await this.client.post('/body-measurements', data);
            return response.data as BodyMeasurementResponse;
        } catch (error: any) {
            if (error.response?.status === 400) {
                throw new Error('Validation failed: ' + (error.response?.data?.detail || ''));
            }
            if (error.response?.status === 403) {
                throw new Error('Permission denied');
            }
            throw new Error('Failed to create measurement');
        }
    }

    async updateMeasurement(id: string, data: BodyMeasurementUpdate) {
        try {
            const response = await this.client.put('/body-measurements/' + id, data);
            return response.data as BodyMeasurementResponse;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Measurement not found');
            }
            if (error.response?.status === 403) {
                throw new Error('Permission denied');
            }
            throw new Error('Failed to update measurement');
        }
    }

    async deleteMeasurement(id: string) {
        try {
            await this.client.delete('/body-measurements/' + id);
            return { message: 'Measurement deleted successfully' };
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Measurement not found');
            }
            throw new Error('Failed to delete measurement');
        }
    }
}

export const measurements = new MeasurementsApi();