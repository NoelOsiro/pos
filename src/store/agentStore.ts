import type { IAgentItem, IAgentFormData } from '@/types/agent';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import axios, { endpoints } from '@/lib/axios';

import { JWT_STORAGE_KEY } from '@/auth/context/jwt';

type AgentState = {
  agents: IAgentItem[];
  invitations: any[];
  loading: boolean;
  error: Error | null;
  setAgents: (agents: IAgentItem[]) => void;
  setInvitations: (invitations: any[]) => void;
  fetchAgents: (params?: { status?: string; branch?: string; search?: string; limit?: number; offset?: number }) => Promise<void>;
  fetchInvitations: (params?: { status?: string }) => Promise<void>;
  inviteAgent: (data: IAgentFormData) => Promise<any>;
  updateAgent: (id: string, data: Partial<IAgentFormData>) => Promise<IAgentItem>;
  setAgentStatus: (id: string, status: string, reason?: string) => Promise<IAgentItem>;
  revokeInvitation: (id: string) => Promise<void>;
  resendInvitation: (id: string) => Promise<void>;
};

function getAuthHeaders() {
  const accessToken = sessionStorage.getItem(JWT_STORAGE_KEY);
  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set, get) => ({
      agents: [],
      invitations: [],
      loading: false,
      error: null,
      setAgents: (agents) => set({ agents }),
      setInvitations: (invitations) => set({ invitations }),
      fetchAgents: async (params) => {
        try {
          set({ loading: true, error: null });
          const searchParams = new URLSearchParams();
          if (params?.status) searchParams.append('status', params.status);
          if (params?.branch) searchParams.append('branch', params.branch);
          if (params?.search) searchParams.append('search', params.search);
          if (params?.limit) searchParams.append('limit', params.limit.toString());
          if (params?.offset) searchParams.append('offset', params.offset.toString());

          const url = `${endpoints.agent.list}?${searchParams.toString()}`;
          const response = await axios.get<{ results: IAgentItem[]; count: number }>(url, {
            headers: getAuthHeaders(),
          });
          set({ agents: response.data.results, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error : new Error('Failed to fetch agents');
          set({ error: errorMessage, loading: false });
          throw errorMessage;
        }
      },
      fetchInvitations: async (params) => {
        try {
          set({ loading: true, error: null });
          const searchParams = new URLSearchParams();
          if (params?.status) searchParams.append('status', params.status);

          const url = `${endpoints.agent.invitations}?${searchParams.toString()}`;
          const response = await axios.get<{ results: any[] }>(url, {
            headers: getAuthHeaders(),
          });
          set({ invitations: response.data.results, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error : new Error('Failed to fetch invitations');
          set({ error: errorMessage, loading: false });
          throw errorMessage;
        }
      },
      inviteAgent: async (data) => {
        try {
          set({ loading: true, error: null });
          const response = await axios.post<any>(endpoints.agent.invite, data, {
            headers: getAuthHeaders(),
          });
          set((state) => ({
            invitations: [response.data, ...state.invitations],
            loading: false,
          }));
          return response.data;
        } catch (error) {
          const errorMessage = error instanceof Error ? error : new Error('Failed to invite agent');
          set({ error: errorMessage, loading: false });
          throw errorMessage;
        }
      },
      updateAgent: async (id, data) => {
        if (!id) throw new Error('Agent ID is required for update');
        try {
          set({ loading: true, error: null });
          const response = await axios.patch<IAgentItem>(`${endpoints.agent.update}${id}/`, data, {
            headers: getAuthHeaders(),
          });
          set((state) => ({
            agents: state.agents.map((a) => (a.id === id ? { ...a, ...response.data } : a)),
            loading: false,
          }));
          return response.data;
        } catch (error) {
          const errorMessage = error instanceof Error ? error : new Error('Failed to update agent');
          set({ error: errorMessage, loading: false });
          throw errorMessage;
        }
      },
      setAgentStatus: async (id, status, reason) => {
        try {
          set({ loading: true, error: null });
          const url = endpoints.agent.status.replace('{id}', id);
          const response = await axios.post<IAgentItem>(url, { status, reason: reason || '' }, {
            headers: getAuthHeaders(),
          });
          set((state) => ({
            agents: state.agents.map((a) => (a.id === id ? { ...a, ...response.data } : a)),
            loading: false,
          }));
          return response.data;
        } catch (error) {
          const errorMessage = error instanceof Error ? error : new Error('Failed to update agent status');
          set({ error: errorMessage, loading: false });
          throw errorMessage;
        }
      },
      revokeInvitation: async (id) => {
        try {
          set({ loading: true, error: null });
          const url = endpoints.agent.revoke_invitation.replace('{id}', id);
          await axios.post(url, {}, { headers: getAuthHeaders() });
          set((state) => ({
            invitations: state.invitations.filter((inv) => inv.id !== id),
            loading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error : new Error('Failed to revoke invitation');
          set({ error: errorMessage, loading: false });
          throw errorMessage;
        }
      },
      resendInvitation: async (id) => {
        try {
          set({ loading: true, error: null });
          const url = endpoints.agent.resend_invitation.replace('{id}', id);
          await axios.post(url, {}, { headers: getAuthHeaders() });
          set({ loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error : new Error('Failed to resend invitation');
          set({ error: errorMessage, loading: false });
          throw errorMessage;
        }
      },
    }),
    {
      name: 'agent-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ agents: state.agents, invitations: state.invitations }),
    }
  )
);
