import { api } from './api';

export const updateOnlineStatus = async (is_online: boolean) => {
  try {
    const response = await api.patch('/api/workers/me/online', {
      is_online,
    });

    return response.data;
  } catch (error: any) {
    console.log(
      'Update Online Error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};