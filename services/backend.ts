
export interface ActivityRecord {
  date: string;
  amount: number;
  factor_id?: number;
  source: string;
  memo?: string;
}

const API_BASE = 'https://api.nocodebackend.com';
const INSTANCE = '54686_esgss';

export const BackendService = {
  /**
   * Logs activity data to the central NoCodeBackend database.
   */
  async logActivity(record: ActivityRecord) {
    try {
      const response = await fetch(`${API_BASE}/create/activity_data?Instance=${INSTANCE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(record)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn("Backend Sync Warning: Could not reach NoCodeBackend. Check network or API Token.", error);
      return null;
    }
  },

  /**
   * Retrieves carbon factors from the database.
   */
  async fetchFactors() {
    try {
      const response = await fetch(`${API_BASE}/read/carbon_factors?Instance=${INSTANCE}`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.warn("Backend Fetch Warning", error);
      return [];
    }
  }
};
