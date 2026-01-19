/**
 * Railway Auth Client
 * 
 * Handles authentication with Railway backend
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class RailwayAuthClient {
  constructor() {
    this.token = localStorage.getItem('railway_auth_token');
  }

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    
    return response.json();
  }

  // Login
  async login(email, password) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (data.token) {
      this.token = data.token;
      localStorage.setItem('railway_auth_token', data.token);
    }
    
    return data;
  }

  // Get current user
  async me() {
    try {
      return await this.request('/api/auth/me');
    } catch (error) {
      // Token invalid, clear it
      this.logout();
      throw error;
    }
  }

  // Update current user
  async updateMe(data) {
    return this.request('/api/auth/me', {
      method: 'PATCH',
      body: JSON.stringify({ data })
    });
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    return this.request('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }

  // Register new user (admin only)
  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  // List users (admin only)
  async listUsers() {
    return this.request('/api/auth/users');
  }

  // Update user (admin only)
  async updateUser(userId, data) {
    return this.request(`/api/auth/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ data })
    });
  }

  // Delete user (admin only)
  async deleteUser(userId) {
    return this.request(`/api/auth/users/${userId}`, {
      method: 'DELETE'
    });
  }

  // Verify token
  async verify() {
    try {
      const result = await this.request('/api/auth/verify');
      return result.valid;
    } catch {
      return false;
    }
  }

  // Logout
  logout() {
    this.token = null;
    localStorage.removeItem('railway_auth_token');
  }
}

export const railwayAuth = new RailwayAuthClient();
