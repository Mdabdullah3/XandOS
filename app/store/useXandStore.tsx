/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';

export const useXandStore = create<any>((set) => ({
    pnodes: [],
    isLoading: true,
    stats: { totalNodes: 0, online: 0, totalStorage: 0 },

    fetchPNodes: async () => {
        try {
            const res = await fetch('/api/pnodes');
            const data = await res.json();

            if (data.success) {
                const nodes = data.pnodes;
                const totalStorage = nodes.reduce((sum: number, n: any) => sum + n.storageCapacity, 0);
                const totalUsed = nodes.reduce((sum: number, n: any) => sum + n.storageUsed, 0);

                set({
                    pnodes: nodes,
                    stats: {
                        totalNodes: nodes.length,
                        online: nodes.filter((n: any) => n.status === 'online').length,
                        totalStorage,
                        totalUsed
                    },
                    isLoading: false
                });
            }
        } catch (err) {
            console.error("Store Error:", err);
            set({ isLoading: false });
        }
    }
}));