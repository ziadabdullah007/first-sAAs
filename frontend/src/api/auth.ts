// src/api/auth.ts
import apiClient from './axiosClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role?: string;
  password: string;
  gym_id?: string;
}

export interface UserResponse {
  id: string;
  auth_user_id: string;
  email: string | null;
  role: string;
  gym_id: string | null;
  first_name?: string | null;
  last_name?: string | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: UserResponse;
}

// Login — calls backend /auth/login and stores token + user
export const login = async (credentials: LoginRequest): Promise<{ data?: LoginResponse; error?: string }> => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    const loginData = response.data as LoginResponse;

    if (loginData.access_token) {
      localStorage.setItem('authToken', loginData.access_token);
    }

    if (loginData.user) {
      localStorage.setItem('user', JSON.stringify(loginData.user));
    }

    return { data: loginData };
  } catch (error: unknown) {
    const err = error as { response?: { status: number; data: { detail: string } } };
    return { error: err.response?.data?.detail || 'Invalid email or password' };
  }
};

// Register
export const register = async (data: RegisterRequest): Promise<{ data?: unknown; error?: string }> => {
  try {
    const response = await apiClient.post('/auth/register', data);
    return { data: response.data };
  } catch (error: unknown) {
    const err = error as { response?: { status: number; data: { detail: string } } };
    return { error: err.response?.data?.detail || 'Registration failed' };
  }
};

// Get current user — validates token and refreshes user data
export const getCurrentUser = async (): Promise<{ data?: UserResponse; error?: string }> => {
  try {
    const response = await apiClient.get('/auth/me');
    const userData = response.data as UserResponse;
    localStorage.setItem('user', JSON.stringify(userData));
    return { data: userData };
  } catch (error: unknown) {
    const err = error as { response?: { status: number; data: { detail: string } } };
    if (err.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
    return { error: err.response?.data?.detail || 'Failed to get user' };
  }
};

// Logout
export const logout = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

// Check auth status
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

// Get current user from localStorage
export const getStoredUser = (): UserResponse | null => {
  const user = localStorage.getItem('user');
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};