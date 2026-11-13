import type { IFarmItem, IFarmFormData } from '@/types/farmer';

import { create } from 'zustand';
import axios, { endpoints } from '@/lib/axios';
import { JWT_STORAGE_KEY } from '@/auth/context/jwt';
import { persist, createJSONStorage } from 'zustand/middleware';

type FarmState = {
  farms: IFarmItem[];
  loading: boolean;
  error: Error | null;
  setFarms: (farms: IFarmItem[]) => void;
  fetchFarms: (params?: { farmer?: string }) => Promise<void>;
  addFarm: (data: IFarmFormData) => Promise<IFarmItem>;
  editFarm: (data: IFarmFormData & { id: string }) => Promise<IFarmItem>;
  deleteFarm: (id: string) => Promise<void>;
};

function getAuthHeaders() {
  const accessToken = sessionStorage.getItem(JWT_STORAGE_KEY);
  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
}

export const useFarmStore = create<FarmState>()(
  persist(
    (set, get) => ({
      farms: [],
      loading: false,
      error: null,
      setFarms: (farms) => set({ farms }),
      fetchFarms: async (params) => {
        try {
          set({ loading: true, error: null });
          const searchParams = new URLSearchParams();
          if (params?.farmer) searchParams.append('farmer', params.farmer);

          const url = `${endpoints.farm.list}?${searchParams.toString()}`;
          const response = await axios.get<{ results: IFarmItem[]; count: number }>(url, {
            headers: getAuthHeaders(),
          });
          set({ farms: response.data.results, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error : new Error('Failed to fetch farms');
          set({ error: errorMessage, loading: false });
          throw errorMessage;
        }
      },
      addFarm: async (data) => {
        try {
          set({ loading: true, error: null });
          const response = await axios.post<IFarmItem>(endpoints.farm.create, data, {
            headers: getAuthHeaders(),
          });
          set((state) => ({
            farms: [response.data, ...state.farms],
            loading: false,
          }));
          return response.data;
        } catch (error) {
          const errorMessage = error instanceof Error ? error : new Error('Failed to create farm');
          set({ error: errorMessage, loading: false });
          throw errorMessage;
        }
      },
      editFarm: async (data) => {
        if (!data.id) throw new Error('Farm ID is required for update');
        try {
          set({ loading: true, error: null });
          const { id, ...updateData } = data;
          const response = await axios.patch<IFarmItem>(`${endpoints.farm.update}${id}/`, updateData, {
            headers: getAuthHeaders(),
          });
          set((state) => ({
            farms: state.farms.map((f) => (f.id === id ? { ...f, ...response.data } : f)),
            loading: false,
          }));
          return response.data;
        } catch (error) {
          const errorMessage = error instanceof Error ? error : new Error('Failed to update farm');
          set({ error: errorMessage, loading: false });
          throw errorMessage;
        }
      },
      deleteFarm: async (id) => {
        try {
          set({ loading: true, error: null });
          await axios.delete(`${endpoints.farm.delete}${id}/`, {
            headers: getAuthHeaders(),
          });
          set((state) => ({
            farms: state.farms.filter((f) => f.id !== id),
            loading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error : new Error('Failed to delete farm');
          set({ error: errorMessage, loading: false });
          throw errorMessage;
        }
      },
    }),
    {
      name: 'farm-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ farms: state.farms }),
    }
  )
);