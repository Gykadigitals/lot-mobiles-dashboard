import { apiClient } from '../lib/axios';

export interface CreateRoleDto {
  name: string;
  permissions: string[];
}

export const RoleService = {
  async getRoles() {
    const response = await apiClient.get('/roles');
    return response.data;
  },
  
  async createRole(data: CreateRoleDto) {
    const response = await apiClient.post('/roles', data);
    return response.data;
  }
};
