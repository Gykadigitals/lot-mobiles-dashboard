
import { apiClient } from '../lib/axios';

export interface CreateRoleDto {
  name: string;
  permissions: string[];
}

export interface UpdateRoleDto {
  name?: string;
  permissions?: string[];
}

export const RoleService = {
  async getRoles() {
    const response = await apiClient.get('/roles');
    return response.data;
  },

  async getRoleById(id: string) {
    const response = await apiClient.get(`/roles/${id}`);
    return response.data;
  },

  async createRole(data: CreateRoleDto) {
    const response = await apiClient.post('/roles', data);
    return response.data;
  },

  async updateRole(id: string, data: UpdateRoleDto) {
    const response = await apiClient.put(`/roles/${id}`, data);
    return response.data;
  },

  async deleteRole(id: string) {
    const response = await apiClient.delete(`/roles/${id}`);
    return response.data;
  }
};
