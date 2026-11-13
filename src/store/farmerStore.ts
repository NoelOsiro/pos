import type { IFarmerItem, IFarmerFormData, IFarmItem, ICountyOption } from '@/types/farmer';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import axios, { endpoints } from '@/lib/axios';

import { JWT_STORAGE_KEY } from '@/auth/context/jwt';

type FarmerState = {
  farmers: IFarmerItem[];
  farms: IFarmItem[];
  loading: boolean;
  error: Error | null;
  counties: ICountyOption[];
  fetchCounties: () => Promise<void>;
  setFarmers: (farmers: IFarmerItem[]) => void;
  setFarms: (farms: IFarmItem[]) => void;
  fetchFarmers: (params?: { status?: string; county?: string; search?: string; limit?: number; offset?: number }) => Promise<void>;
  fetchFarmer: (id: string) => Promise<IFarmerItem>;
  fetchFarms: (params?: { farmer?: string }) => Promise<void>;
  addFarmer: (data: IFarmerFormData) => Promise<IFarmerItem>;
  editFarmer: (data: IFarmerFormData) => Promise<IFarmerItem>;
  approveFarmer: (id: string, status: string, reason?: string) => Promise<IFarmerItem>;
};

function getAuthHeaders() {
  const accessToken = sessionStorage.getItem(JWT_STORAGE_KEY);
  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
}

export const useFarmerStore = create<FarmerState>()(
  persist(
    (set, get) => ({
      farmers: [],
      farms: [],
      loading: false,
      error: null,
      counties: [],
      setFarmers: (farmers) => set({ farmers }),
      setFarms: (farms) => set({ farms }),
      fetchCounties: async () => {
        try {
          const response = await axios.get<{ results?: ICountyOption[] } | ICountyOption[]>(endpoints.organization.counties, {
            headers: getAuthHeaders(),
          });
          const counties = Array.isArray(response.data) ? response.data : response.data.results ?? [];
          set({ counties });
        } catch (error) {
          set({ error: error instanceof Error ? error : new Error('Failed to fetch counties') });
        }
      },
      fetchFarmer: async (id) => {
        try {
          set({ loading: true, error: null });
          const response = await axios.get<IFarmerItem>(`${endpoints.farmer.details}${id}/`, {
            headers: getAuthHeaders(),
          });
          set((state) => ({
            farmers: state.farmers.some((farmer) => farmer.id === id)
              ? state.farmers.map((farmer) => farmer.id === id ? response.data : farmer)
              : [response.data, ...state.farmers],
            loading: false,
          }));
          return response.data;
        } catch (error) {
          const errorMessage = error instanceof Error ? error : new Error('Failed to fetch farmer');
          set({ error: errorMessage, loading: false });
          throw errorMessage;
        }
      },
      fetchFarmers: async (params) => {
        try {
          set({ loading: true, error: null });
          const searchParams = new URLSearchParams();
          if (params?.status) searchParams.append('status', params.status);
          if (params?.county) searchParams.append('county', params.county);
          if (params?.search) searchParams.append('search', params.search);
          if (params?.limit) searchParams.append('limit', params.limit.toString());
          if (params?.offset) searchParams.append('offset', params.offset.toString());

          const url = `${endpoints.farmer.list}?${searchParams.toString()}`;
          const response = await axios.get<{ results: IFarmerItem[]; count: number }>(url, {
            headers: getAuthHeaders(),
          });
          set({ farmers: response.data.results, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error : new Error('Failed to fetch farmers');
          set({ error: errorMessage, loading: false });
          throw errorMessage;
        }
      },
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
      addFarmer: async (data) => {
        try {
          set({ loading: true, error: null });
          const response = await axios.post<IFarmerItem>(endpoints.farmer.create, data, {
            headers: getAuthHeaders(),
          });
          set((state) => ({
            farmers: [response.data, ...state.farmers],
            loading: false,
          }));
          return response.data;
        } catch (error) {
          const errorMessage = error instanceof Error ? error : new Error('Failed to create farmer');
          set({ error: errorMessage, loading: false });
          throw errorMessage;
        }
      },
      editFarmer: async (data) => {
        if (!data.id) throw new Error('Farmer ID is required for update');
        try {
          set({ loading: true, error: null });
          const { id, national_id, ...updateData } = data;
          const safeNationalId = national_id?.trim();
          const hasReplacementNationalId = safeNationalId && /^\d{7,8}$/.test(safeNationalId);
          if (!hasReplacementNationalId) {
            delete (updateData as Partial<IFarmerFormData>).national_id;
          }
          const payload = hasReplacementNationalId ? { ...updateData, national_id: safeNationalId } : updateData;
          const response = await axios.patch<IFarmerItem>(`${endpoints.farmer.update}${id}/`, payload, {
            headers: getAuthHeaders(),
          });
          set((state) => ({
            farmers: state.farmers.map((f) => (f.id === id ? { ...f, ...response.data } : f)),
            loading: false,
          }));
          return response.data;
        } catch (error) {
          const errorMessage = error instanceof Error ? error : new Error('Failed to update farmer');
          set({ error: errorMessage, loading: false });
          throw errorMessage;
        }
      },
      approveFarmer: async (id, status, reason) => {
        try {
          set({ loading: true, error: null });
          const url = endpoints.farmer.status.replace('{id}', id);
          const response = await axios.post<IFarmerItem>(url, { status, reason: reason || '' }, {
            headers: getAuthHeaders(),
          });
          set((state) => ({
            farmers: state.farmers.map((f) => (f.id === id ? { ...f, ...response.data } : f)),
            loading: false,
          }));
          return response.data;
        } catch (error) {
          const errorMessage = error instanceof Error ? error : new Error('Failed to update farmer status');
          set({ error: errorMessage, loading: false });
          throw errorMessage;
        }
      },
    }),
    {
      name: 'farmer-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ farmers: state.farmers, farms: state.farms }),
    }
  )
);