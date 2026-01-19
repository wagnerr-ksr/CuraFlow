/**
 * Railway API Adapter
 * 
 * This adapter provides the same interface as Base44Adapter but uses Railway backend
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class RailwayAdapter {
  constructor(entityName) {
    this.entityName = entityName;
    this.token = localStorage.getItem('railway_auth_token');
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    
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

  async list(sort, limit) {
    return this.request('/api/db', {
      method: 'POST',
      body: JSON.stringify({
        action: 'list',
        entity: this.entityName,
        sort,
        limit
      })
    });
  }

  async filter(query, sort, limit) {
    return this.request('/api/db', {
      method: 'POST',
      body: JSON.stringify({
        action: 'filter',
        entity: this.entityName,
        query,
        sort,
        limit
      })
    });
  }

  async get(id) {
    return this.request('/api/db', {
      method: 'POST',
      body: JSON.stringify({
        action: 'get',
        entity: this.entityName,
        id
      })
    });
  }

  async create(data) {
    return this.request('/api/db', {
      method: 'POST',
      body: JSON.stringify({
        action: 'create',
        entity: this.entityName,
        data
      })
    });
  }

  async update(id, data) {
    return this.request('/api/db', {
      method: 'POST',
      body: JSON.stringify({
        action: 'update',
        entity: this.entityName,
        id,
        data
      })
    });
  }

  async delete(id) {
    return this.request('/api/db', {
      method: 'POST',
      body: JSON.stringify({
        action: 'delete',
        entity: this.entityName,
        id
      })
    });
  }

  async bulkCreate(data) {
    return this.request('/api/db', {
      method: 'POST',
      body: JSON.stringify({
        action: 'bulkCreate',
        entity: this.entityName,
        data
      })
    });
  }
}

export { RailwayAdapter };
