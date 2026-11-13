import type { PosDashboardData } from '@/types/dashboard';

import { create } from 'zustand';

type DashState = {
    leave_requests: never[];
    posDashboard: PosDashboardData | null;
    setPosDashboard: (data: PosDashboardData) => void;
};

export const useDashStore = create<DashState>()((set) => ({
    leave_requests: [],
    posDashboard: null,
    setPosDashboard: (posDashboard) => set({ posDashboard }),
}));
