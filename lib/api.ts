import { DEMO_USER_ID } from './constants';
import type { Lead } from '@/types';

const USER_ID = DEMO_USER_ID;

export const api = {
  leads: {
    list: async (): Promise<Lead[]> => {
      const res = await fetch(
        `/api/leads?user_id=${USER_ID}`
      );
      if (!res.ok) throw new Error(
        'Failed to fetch leads'
      );
      const { leads } = await res.json();
      return leads;
    },

    create: async (
      lead: Omit<Lead, 'id' | 'created_at'>
    ): Promise<Lead> => {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...lead,
          user_id: USER_ID
        }),
      });
      if (!res.ok) throw new Error(
        'Failed to create lead'
      );
      const { lead: created } = await res.json();
      return created;
    },

    updateStage: async (
      id: string,
      stage: string
    ): Promise<void> => {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          stage,
          user_id: USER_ID
        }),
      });
      if (!res.ok) throw new Error(
        'Failed to update stage'
      );
    },

    delete: async (id: string): Promise<void> => {
      const res = await fetch(
        `/api/leads?id=${id}&user_id=${USER_ID}`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error(
        'Failed to delete lead'
      );
    },
  },

  icp: {
    get: async () => {
      const res = await fetch(
        `/api/icp?user_id=${USER_ID}`
      );
      if (!res.ok) return null;
      const { icps } = await res.json();
      return icps?.[0] ?? null;
    },

    upsert: async (
      data: Record<string, any>
    ) => {
      const res = await fetch('/api/icp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          user_id: USER_ID
        }),
      });
      if (!res.ok) throw new Error(
        'Failed to save ICP'
      );
      const { icp } = await res.json();
      return icp;
    },
  },

  analyze: async (linkedin_url: string) => {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        linkedin_url,
        user_id: USER_ID
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(
        err.error || 'Analysis failed'
      );
    }
    return res.json();
  },

  activities: {
    create: async (
      data: Record<string, any>
    ) => {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          user_id: USER_ID
        }),
      });
      if (!res.ok) throw new Error(
        'Failed to log activity'
      );
      const { activity } = await res.json();
      return activity;
    },
  },

  transcripts: {
    analyze: async (data: {
      lead_id: string;
      title: string;
      raw_text: string;
    }) => {
      const res = await fetch(
        '/api/transcripts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          user_id: USER_ID
        }),
      });
      if (!res.ok) throw new Error(
        'Failed to analyze transcript'
      );
      return res.json();
    },
  },
};
