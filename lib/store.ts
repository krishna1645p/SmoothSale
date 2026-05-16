import { create } from "zustand";
import { Lead, DealStage } from "@/types";

interface PipelineStore {
  leads: Lead[];
  setLeads: (leads: Lead[]) => void;
  addLead: (lead: Lead) => void;
  updateLeadStage: (leadId: string, stage: DealStage) => void;
  removeLead: (leadId: string) => void;
}

export const usePipelineStore = create<PipelineStore>((set) => ({
  leads: [],
  setLeads: (leads) => set({ leads }),
  addLead: (lead) => set((state) => ({ leads: [...state.leads, lead] })),
  updateLeadStage: (leadId, stage) =>
    set((state) => ({
      leads: state.leads.map((l) =>
        l.id === leadId
          ? { ...l, stage, updated_at: new Date().toISOString(), last_activity: "Just now" }
          : l
      ),
    })),
  removeLead: (leadId) =>
    set((state) => ({ leads: state.leads.filter((l) => l.id !== leadId) })),
}));
