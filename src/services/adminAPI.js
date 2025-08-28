import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class AdminAPI {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/api/admin`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.log('🔍 Response interceptor caught error:', error.response?.status, error.response?.data);
        if (error.response?.status === 401) {
          console.log('🔍 401 error detected, but not redirecting during login');
          // Don't redirect during login attempts
          if (!error.config.url.includes('/login')) {
            localStorage.removeItem('admin_token');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token) {
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common['Authorization'];
    }
  }

  // Authentication
  async login(email, password) {
    console.log('🔍 AdminAPI.login called with:', { email, password });
    console.log('🔍 API URL:', `${this.api.defaults.baseURL}/login`);
    
    try {
      const response = await this.api.post('/login', { email, password });
      console.log('✅ AdminAPI.login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ AdminAPI.login error:', error);
      console.error('❌ Error response:', error.response);
      throw error;
    }
  }

  async getProfile() {
    const response = await this.api.get('/profile');
    return response.data;
  }

  // Dashboard
  async getDashboardOverview() {
    const response = await this.api.get('/dashboard/overview');
    return response.data;
  }

  async getDashboardAnalytics(days = 30) {
    const response = await this.api.get('/dashboard/analytics', { params: { days } });
    return response.data;
  }

  async getRecentActivity(limit = 10) {
    const response = await this.api.get('/dashboard/recent-activity', { params: { limit } });
    return response.data;
  }

  // Users
  async getUsers(params = {}) {
    const response = await this.api.get('/users', { params });
    return response.data;
  }

  async getUser(userId) {
    const response = await this.api.get(`/users/${userId}`);
    return response.data;
  }

  async updateUser(userId, userData) {
    const response = await this.api.put(`/users/${userId}`, userData);
    return response.data;
  }

  async deleteUser(userId) {
    const response = await this.api.delete(`/users/${userId}`);
    return response.data;
  }

  async suspendUser(userId) {
    const response = await this.api.post(`/users/${userId}/suspend`);
    return response.data;
  }

  async activateUser(userId) {
    const response = await this.api.post(`/users/${userId}/activate`);
    return response.data;
  }

  // Projects
  async getProjects(params = {}) {
    const response = await this.api.get('/projects', { params });
    return response.data;
  }

  async getProject(projectId) {
    const response = await this.api.get(`/projects/${projectId}`);
    return response.data;
  }

  async deleteProject(projectId) {
    const response = await this.api.delete(`/projects/${projectId}`);
    return response.data;
  }

  async getProjectAnalytics(projectId) {
    const response = await this.api.get(`/projects/${projectId}/analytics`);
    return response.data;
  }

  // Deployments
  async getDeployments(params = {}) {
    const response = await this.api.get('/deployments', { params });
    return response.data;
  }

  async getDeployment(deploymentId) {
    const response = await this.api.get(`/deployments/${deploymentId}`);
    return response.data;
  }

  async deleteDeployment(deploymentId) {
    const response = await this.api.delete(`/deployments/${deploymentId}`);
    return response.data;
  }

  async redeployDeployment(deploymentId) {
    const response = await this.api.post(`/deployments/${deploymentId}/redeploy`);
    return response.data;
  }

  async getDeploymentStatistics() {
    const response = await this.api.get('/deployments/statistics');
    return response.data;
  }

  // Knowledge Base
  async getKnowledgeBase() {
    const response = await this.api.get('/knowledge-base');
    return response.data;
  }

  async uploadKnowledgeBaseContent(formData) {
    const response = await this.api.post('/knowledge-base/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteKnowledgeBaseContent(collection, filename) {
    const response = await this.api.delete(`/knowledge-base/${collection}/${filename}`);
    return response.data;
  }

  async regenerateEmbeddings() {
    const response = await this.api.post('/knowledge-base/regenerate-embeddings');
    return response.data;
  }

  // System
  async getSystemHealth() {
    const response = await this.api.get('/system/health');
    return response.data;
  }

  async getSystemLogs(params = {}) {
    const response = await this.api.get('/system/logs', { params });
    return response.data;
  }

  async getSystemPerformance() {
    const response = await this.api.get('/system/performance');
    return response.data;
  }

  // Reports
  async generateReport(reportType, params = {}) {
    const response = await this.api.post('/reports/generate', { type: reportType, params });
    return response.data;
  }

  async getReportTemplates() {
    const response = await this.api.get('/reports/templates');
    return response.data;
  }
}

export const adminAPI = new AdminAPI();
